package backend.login.backend.controller;

import backend.login.backend.model.ApplicationFormSubmission;
import backend.login.backend.model.User;
import backend.login.backend.repository.ApplicationFormSubmissionRepository;
import backend.login.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("null")
@RestController
@RequestMapping("/api/application-form")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApplicationFormController {

    @Autowired
    private ApplicationFormSubmissionRepository applicationFormSubmissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private static String employeeCodeForUser(User user) {
        if (user == null) return "";

        if (user.getEmployeeCode() != null && !user.getEmployeeCode().trim().isEmpty()) {
            return user.getEmployeeCode().trim().toUpperCase();
        }

        // If the system stores the employee code directly in the user's email field
        // (common in demo setups), honor it.
        String raw = user.getEmail() == null ? "" : user.getEmail().trim();
        if (!raw.isEmpty()) {
            // EMP6 -> EMP006, emp006 -> EMP006
            if (raw.matches("(?i)^EMP\\d+$")) {
                String digits = raw.replaceAll("(?i)^EMP", "");
                if (digits.length() <= 3) {
                    return "EMP" + String.format("%03d", Integer.parseInt(digits));
                }
                return "EMP" + digits;
            }

            // employee6@... -> EMP006, employee06@... -> EMP006
            String local = raw;
            int at = local.indexOf('@');
            if (at > 0) local = local.substring(0, at);
            if (local.matches("(?i)^employee\\d+$")) {
                String digits = local.replaceAll("(?i)^employee", "");
                if (!digits.isEmpty()) {
                    return "EMP" + String.format("%03d", Integer.parseInt(digits));
                }
            }
        }

        // Default: derive from numeric user.id.
        return String.format("EMP%03d", user.getId());
    }

    private static String normalizeRole(String role) {
        if (role == null) return "";
        return role.replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
    }

    private static boolean isSuperAdmin(User user) {
        String r = normalizeRole(user != null ? user.getRole() : null);
        // DataSeeder uses ADMIN; frontend expects SUPERADMIN.
        return r.equals("SUPERADMIN") || r.equals("ADMIN");
    }

    private static String asTrimmedString(Object v) {
        if (v == null) return "";
        return String.valueOf(v).trim();
    }

    private static Long extractNestedId(Object maybeObj) {
        if (!(maybeObj instanceof Map<?, ?> m)) return null;
        Object id = m.get("id");
        if (id instanceof Number n) return n.longValue();
        try {
            String s = id == null ? null : String.valueOf(id).trim();
            if (s == null || s.isEmpty()) return null;
            return Long.parseLong(s);
        } catch (Exception ignored) {
            return null;
        }
    }

    private Map<String, Object> parseFormJson(String json) {
        if (json == null || json.isBlank()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ignored) {
            return new HashMap<>();
        }
    }

    private Map<String, Object> submissionToPayload(ApplicationFormSubmission sub, boolean includeFormJson) {
        Map<String, Object> out = new HashMap<>();
        out.put("id", sub.getId());
        out.put("employeeCode", sub.getEmployeeCode());
        out.put("fullName", sub.getFullName());
        out.put("status", sub.getStatus());
        out.put("submittedAt", sub.getSubmittedAt());
        out.put("processedAt", sub.getProcessedAt());
        out.put("processedBy", sub.getProcessedBy());
        out.put("processingNotes", sub.getProcessingNotes());

        if (!includeFormJson) {
            return out;
        }

        Map<String, Object> form = parseFormJson(sub.getFormJson());
        // Merge form fields into output.
        out.putAll(form);

        // Provide id-style fields expected by the frontend autofill logic.
        Long branchId = extractNestedId(form.get("branch"));
        Long subBranchId = extractNestedId(form.get("subBranch"));
        Long departmentId = extractNestedId(form.get("department"));
        Long reportingOfficerId = extractNestedId(form.get("reportingOfficer"));
        Long companyCodeId = extractNestedId(form.get("companyCode"));
        Long costCenterId = extractNestedId(form.get("costCenter"));

        if (branchId != null) out.put("branchId", branchId);
        if (subBranchId != null) out.put("subBranchId", subBranchId);
        if (departmentId != null) out.put("departmentId", departmentId);
        if (reportingOfficerId != null) out.put("reportingOfficerId", reportingOfficerId);
        if (companyCodeId != null) out.put("companyCodeId", companyCodeId);
        if (costCenterId != null) out.put("costCenterId", costCenterId);

        return out;
    }

    // Submit application form
    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(@RequestBody Map<String, Object> formData, @RequestHeader("X-User-Email") String userEmail) {
        try {
            // Verify user exists
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // Requirement: HR submits the application; employee can only view.
            if (!"HR".equalsIgnoreCase(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }

            Map<String, Object> payload = new HashMap<>(formData == null ? Collections.emptyMap() : formData);

            // HR must submit for an employee code
            String employeeCodeRaw = asTrimmedString(payload.get("employeeCode"));
            if (employeeCodeRaw.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Employee Code is required"));
            }

            String employeeCode = normalizeEmployeeCode(employeeCodeRaw);
            if (employeeCode.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid Employee Code. Use 1-999 or EMP001 format."));
            }

            // Ensure payload stores the canonical employeeCode (EMP###)
            payload.put("employeeCode", employeeCode);

            String fullName = asTrimmedString(payload.get("fullName"));

            ApplicationFormSubmission sub = new ApplicationFormSubmission();
            sub.setEmployeeCode(employeeCode);
            sub.setFullName(fullName.isEmpty() ? null : fullName);
            sub.setStatus("PENDING");
            sub.setSubmittedAt(LocalDateTime.now());
            sub.setFormJson(objectMapper.writeValueAsString(payload));

            ApplicationFormSubmission savedForm = applicationFormSubmissionRepository.save(sub);
            
            return ResponseEntity.ok(Map.of(
                "message", "Application submitted successfully",
                "formId", savedForm.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to submit form: " + e.getMessage()));
        }
    }

    // Get all forms (HR only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllForms(@RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !isSuperAdmin(user)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Super Admin role required."));
            }

            List<ApplicationFormSubmission> forms = applicationFormSubmissionRepository.findByOrderBySubmittedAtDesc();
            List<Map<String, Object>> result = forms.stream()
                    .map(f -> submissionToPayload(f, false))
                    .toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch forms: " + e.getMessage()));
        }
    }

    // Get forms by employee code
    @GetMapping("/my-forms")
    public ResponseEntity<?> getMyForms(@RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            String employeeCode = employeeCodeForUser(user);
            List<ApplicationFormSubmission> forms = applicationFormSubmissionRepository.findByEmployeeCodeOrderBySubmittedAtDesc(employeeCode);
            List<Map<String, Object>> result = forms.stream()
                    .map(f -> submissionToPayload(f, false))
                    .toList();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch forms: " + e.getMessage()));
        }
    }

    // Get latest form for current user (employee dashboard view)
    @GetMapping("/my-latest")
    public ResponseEntity<?> getMyLatestForm(@RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            String employeeCode = employeeCodeForUser(user);
            ApplicationFormSubmission latest = applicationFormSubmissionRepository.findTopByEmployeeCodeOrderBySubmittedAtDesc(employeeCode);
            if (latest == null) {
                return ResponseEntity.status(404).body(Map.of("message", "No records found"));
            }

            return ResponseEntity.ok(submissionToPayload(latest, true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch form: " + e.getMessage()));
        }
    }

    // Update form status (HR only)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateFormStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !isSuperAdmin(user)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. Super Admin role required."));
            }

            String nextStatus = statusUpdate.get("status");
            String normalizedStatus = (nextStatus == null) ? "" : nextStatus.trim().toUpperCase();
            if (!(normalizedStatus.equals("APPROVED") || normalizedStatus.equals("REJECTED") || normalizedStatus.equals("PENDING"))) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Allowed: PENDING, APPROVED, REJECTED"));
            }

            @SuppressWarnings("null")
            ApplicationFormSubmission form = applicationFormSubmissionRepository.findById(Long.valueOf(id))
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            form.setStatus(normalizedStatus);
            form.setProcessedAt(LocalDateTime.now());
            form.setProcessedBy(userEmail);
            form.setProcessingNotes(statusUpdate.get("notes"));

            applicationFormSubmissionRepository.save(form);

            if (normalizedStatus.equals("REJECTED")) {
                return ResponseEntity.ok(Map.of("message", "Form rejected successfully"));
            }

            return ResponseEntity.ok(Map.of("message", "Form status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update status: " + e.getMessage()));
        }
    }

    // Get latest submitted form for an employee code (used for autofill) - MUST BE BEFORE /{id}
    @GetMapping("/employee/{employeeCode}/latest")
    public ResponseEntity<?> getLatestByEmployeeCode(@PathVariable String employeeCode, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // Used for autofill during HR submission; do not allow employees to browse others.
            if (!"HR".equalsIgnoreCase(user.getRole()) && !isSuperAdmin(user)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }

            String normalizedEmployeeCode = normalizeEmployeeCode(employeeCode);
            if (normalizedEmployeeCode.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid employee code"));
            }

            ApplicationFormSubmission latest = applicationFormSubmissionRepository.findTopByEmployeeCodeOrderBySubmittedAtDesc(normalizedEmployeeCode);
            if (latest != null) {
                Map<String, Object> result = submissionToPayload(latest, true);
                return ResponseEntity.ok(result);
            }

            // No submissions yet for this employeeCode - still return user info for autofill.
            User target = userRepository.findByEmployeeCode(normalizedEmployeeCode).orElse(null);
            if (target == null) {
                // Keep old behavior only when the employee itself doesn't exist.
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("employeeCode", normalizedEmployeeCode);
            payload.put("fullName", target.getFullName());
            payload.put("designation", target.getDesignation());
            // leave other fields absent; frontend keeps existing values
            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch employee data: " + e.getMessage()));
        }
    }

    private static String normalizeEmployeeCode(String value) {
        String v = (value == null) ? "" : value.trim();
        if (v.isEmpty()) return "";

        if (v.matches("^\\d{1,3}$")) {
            int n = Integer.parseInt(v);
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        java.util.regex.Matcher m = java.util.regex.Pattern
                .compile("^emp(\\d{1,3})$", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(v);
        if (m.matches()) {
            int n = Integer.parseInt(m.group(1));
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        java.util.regex.Matcher m2 = java.util.regex.Pattern
                .compile("^EMP(\\d{1,3})$", java.util.regex.Pattern.CASE_INSENSITIVE)
                .matcher(v);
        if (m2.matches()) {
            int n = Integer.parseInt(m2.group(1));
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        if (v.matches("^EMP\\d{3}$")) {
            return v.toUpperCase();
        }

        return "";
    }

    // Get form by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFormById(@PathVariable Long id, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            @SuppressWarnings("null")
            ApplicationFormSubmission form = applicationFormSubmissionRepository.findById(Long.valueOf(id))
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            // Employee can only view own submission; Super Admin can view any.
            if (!isSuperAdmin(user)) {
                String employeeCode = employeeCodeForUser(user);
                if (!employeeCode.equalsIgnoreCase(form.getEmployeeCode())) {
                    return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
                }
            }

            return ResponseEntity.ok(submissionToPayload(form, true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch form: " + e.getMessage()));
        }
    }
}
