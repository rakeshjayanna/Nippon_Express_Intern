package backend.login.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.login.backend.model.MasterBranch;
import backend.login.backend.model.MasterCompanyCode;
import backend.login.backend.model.MasterCostCenter;
import backend.login.backend.model.MasterDepartment;
import backend.login.backend.model.MasterReportingOfficer;
import backend.login.backend.model.User;
import backend.login.backend.repository.MasterBranchRepository;
import backend.login.backend.repository.MasterCompanyCodeRepository;
import backend.login.backend.repository.MasterCostCenterRepository;
import backend.login.backend.repository.MasterDepartmentRepository;
import backend.login.backend.repository.MasterReportingOfficerRepository;
import backend.login.backend.repository.UserRepository;

@SuppressWarnings("null")
@RestController
@RequestMapping("/api/master-data")
public class MasterDataController {

    @Autowired
    private MasterBranchRepository masterBranchRepository;

    @Autowired
    private MasterDepartmentRepository masterDepartmentRepository;

    @Autowired
    private MasterReportingOfficerRepository masterReportingOfficerRepository;

    @Autowired
    private MasterCompanyCodeRepository masterCompanyCodeRepository;

    @Autowired
    private MasterCostCenterRepository masterCostCenterRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all master data in one call
    @GetMapping("/all")
    public ResponseEntity<?> getAllMasterData(@RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }

            Map<String, Object> masterData = new HashMap<>();
            masterData.put("branches", masterBranchRepository.findByActiveTrue());
            masterData.put("departments", masterDepartmentRepository.findByActiveTrue());
            masterData.put("reportingOfficers", masterReportingOfficerRepository.findByActiveTrue());
            masterData.put("companyCodes", masterCompanyCodeRepository.findByActiveTrue());
            masterData.put("costCenters", masterCostCenterRepository.findByActiveTrue());

            return ResponseEntity.ok(masterData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch master data: " + e.getMessage()));
        }
    }

    // Branch endpoints
    @GetMapping("/branches")
    public ResponseEntity<?> getBranches() {
        return ResponseEntity.ok(masterBranchRepository.findByActiveTrue());
    }

    @PostMapping("/branches")
    public ResponseEntity<?> addBranch(@RequestBody MasterBranch branch, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }
            MasterBranch saved = masterBranchRepository.save(Objects.requireNonNull(branch));
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Department endpoints
    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        return ResponseEntity.ok(masterDepartmentRepository.findByActiveTrue());
    }

    @PostMapping("/departments")
    public ResponseEntity<?> addDepartment(@RequestBody MasterDepartment department, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }
            MasterDepartment saved = masterDepartmentRepository.save(Objects.requireNonNull(department));
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Reporting Officer endpoints
    @GetMapping("/reporting-officers")
    public ResponseEntity<?> getReportingOfficers() {
        return ResponseEntity.ok(masterReportingOfficerRepository.findByActiveTrue());
    }

    @PostMapping("/reporting-officers")
    public ResponseEntity<?> addReportingOfficer(@RequestBody MasterReportingOfficer officer, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }
            MasterReportingOfficer saved = masterReportingOfficerRepository.save(Objects.requireNonNull(officer));
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Company Code endpoints
    @GetMapping("/company-codes")
    public ResponseEntity<?> getCompanyCodes() {
        return ResponseEntity.ok(masterCompanyCodeRepository.findByActiveTrue());
    }

    @PostMapping("/company-codes")
    public ResponseEntity<?> addCompanyCode(@RequestBody MasterCompanyCode companyCode, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }
            MasterCompanyCode saved = masterCompanyCodeRepository.save(Objects.requireNonNull(companyCode));
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Cost Center endpoints
    @GetMapping("/cost-centers")
    public ResponseEntity<?> getCostCenters() {
        return ResponseEntity.ok(masterCostCenterRepository.findByActiveTrue());
    }

    @PostMapping("/cost-centers")
    public ResponseEntity<?> addCostCenter(@RequestBody MasterCostCenter costCenter, @RequestHeader("X-User-Email") String userEmail) {
        try {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || !user.getRole().equals("HR")) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied. HR role required."));
            }
            MasterCostCenter saved = masterCostCenterRepository.save(Objects.requireNonNull(costCenter));
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
