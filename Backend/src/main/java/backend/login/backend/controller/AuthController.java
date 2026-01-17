package backend.login.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.login.backend.model.User;
import backend.login.backend.repository.UserRepository;
import backend.login.backend.util.JwtUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Verify password using BCrypt
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                // Generate JWT token
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
                
                response.put("success", true);
                response.put("token", token);
                response.put("employeeId", user.getId());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                response.put("employeeCode", user.getEmployeeCode());
                response.put("fullName", user.getFullName());
                response.put("designation", user.getDesignation());
                response.put("branchId", user.getBranch() != null ? user.getBranch().getId() : null);
                response.put("subBranchId", user.getSubBranch() != null ? user.getSubBranch().getId() : null);
                response.put("departmentId", user.getDepartment() != null ? user.getDepartment().getId() : null);
                response.put("reportingOfficerId", user.getReportingOfficer() != null ? user.getReportingOfficer().getId() : null);
                
                logger.info("Login successful for email: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Invalid password for email: {}", request.getEmail());
            }
        } else {
            logger.warn("User not found for email: {}", request.getEmail());
        }

        response.put("success", false);
        response.put("message", "Invalid email or password");
        return ResponseEntity.status(401).body(response);
    }

    @GetMapping("/users/by-code/{code}")
    public ResponseEntity<?> getUserByCode(@PathVariable String code, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User currentUser = userRepository.findByEmail(userEmail).orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            // Used for autofill during HR submission; do not allow employees to browse others.
            String role = (currentUser.getRole() == null) ? "" : currentUser.getRole().trim().toUpperCase();
            if (!(role.equals("HR") || role.equals("ADMIN") || role.equals("SUPERADMIN"))) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR/Admin role required."));
            }

            // Normalize code: 1 -> EMP001, EMP1 -> EMP001
            String normalizedCode = normalizeCode(code);
            if (normalizedCode.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid employee code format"));
            }

            Optional<User> user = userRepository.findByEmployeeCode(normalizedCode);
            if (user.isPresent()) {
                return ResponseEntity.ok(userToMap(user.get()));
            }

            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch user: " + e.getMessage()));
        }
    }

    private String normalizeCode(String code) {
        String v = (code == null) ? "" : code.trim();
        if (v.isEmpty()) return "";

        // Allow: 6 -> EMP006, 14 -> EMP014
        if (v.matches("^\\d{1,3}$")) {
            int n = Integer.parseInt(v);
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        // Allow: emp6 -> EMP006, EMP14 -> EMP014
        java.util.regex.Pattern p = java.util.regex.Pattern.compile("^emp(\\d{1,3})$", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher m = p.matcher(v);
        if (m.matches()) {
            int n = Integer.parseInt(m.group(1));
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        // Allow: EMP1 -> EMP001
        java.util.regex.Pattern p2 = java.util.regex.Pattern.compile("^EMP(\\d{1,3})$", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher m2 = p2.matcher(v);
        if (m2.matches()) {
            int n = Integer.parseInt(m2.group(1));
            return String.format(java.util.Locale.ROOT, "EMP%03d", n);
        }

        // Exact match: EMP001, EMP006, etc.
        if (v.matches("^EMP\\d{3}$")) {
            return v.toUpperCase();
        }

        return "";
    }

    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("email", user.getEmail());
        map.put("employeeCode", user.getEmployeeCode());
        map.put("fullName", user.getFullName());
        map.put("designation", user.getDesignation());
        map.put("branchId", user.getBranch() != null ? user.getBranch().getId() : null);
        map.put("subBranchId", user.getSubBranch() != null ? user.getSubBranch().getId() : null);
        map.put("departmentId", user.getDepartment() != null ? user.getDepartment().getId() : null);
        map.put("reportingOfficerId", user.getReportingOfficer() != null ? user.getReportingOfficer().getId() : null);
        map.put("role", user.getRole());
        return map;
    }
}
