package backend.login.backend.controller;

import backend.login.backend.model.*;
import backend.login.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/application-form")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApplicationFormController {

    @Autowired
    private ApplicationFormRepository applicationFormRepository;

    @Autowired
    private MasterBranchRepository masterBranchRepository;

    @Autowired
    private MasterReportingOfficerRepository masterReportingOfficerRepository;

    @Autowired
    private MasterCompanyCodeRepository masterCompanyCodeRepository;

    @Autowired
    private MasterCostCenterRepository masterCostCenterRepository;

    @Autowired
    private UserRepository userRepository;

    // Submit application form
    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(@RequestBody ApplicationForm form, @RequestHeader("X-User-Email") String userEmail) {
        try {
            // Verify user exists
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // Set submission timestamp
            form.setSubmittedAt(LocalDateTime.now());
            form.setStatus("PENDING");

            ApplicationForm savedForm = applicationFormRepository.save(form);
            
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
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }

            List<ApplicationForm> forms = applicationFormRepository.findByOrderBySubmittedAtDesc();
            return ResponseEntity.ok(forms);
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

            // Assuming employee code is stored in user table or can be derived
            List<ApplicationForm> forms = applicationFormRepository.findByOrderBySubmittedAtDesc();
            return ResponseEntity.ok(forms);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch forms: " + e.getMessage()));
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
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }

            ApplicationForm form = applicationFormRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            form.setStatus(statusUpdate.get("status"));
            form.setProcessedAt(LocalDateTime.now());
            form.setProcessedBy(userEmail);
            form.setProcessingNotes(statusUpdate.get("notes"));

            applicationFormRepository.save(form);

            return ResponseEntity.ok(Map.of("message", "Form status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update status: " + e.getMessage()));
        }
    }

    // Get form by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFormById(@PathVariable Long id, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            ApplicationForm form = applicationFormRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Form not found"));

            return ResponseEntity.ok(form);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch form: " + e.getMessage()));
        }
    }

    // Get latest submitted form for an employee code (used for autofill)
    @GetMapping("/employee/{employeeCode}/latest")
    public ResponseEntity<?> getLatestByEmployeeCode(@PathVariable String employeeCode, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            ApplicationForm latest = applicationFormRepository.findTopByEmployeeCodeOrderBySubmittedAtDesc(employeeCode);
            if (latest == null) {
                return ResponseEntity.status(404).body(Map.of("message", "No records found"));
            }

            Map<String, Object> result = new HashMap<>();
            result.put("employeeCode", latest.getEmployeeCode());
            result.put("fullName", latest.getFullName());
            result.put("designation", latest.getDesignation());
            result.put("branchId", latest.getBranch() != null ? latest.getBranch().getId() : null);
            result.put("departmentId", latest.getDepartment() != null ? latest.getDepartment().getId() : null);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch employee data: " + e.getMessage()));
        }
    }
}
