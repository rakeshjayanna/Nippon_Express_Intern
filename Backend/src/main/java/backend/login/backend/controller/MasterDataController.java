package backend.login.backend.controller;

import backend.login.backend.model.*;
import backend.login.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/master-data")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
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
            MasterBranch saved = masterBranchRepository.save(branch);
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
            MasterDepartment saved = masterDepartmentRepository.save(department);
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
            MasterReportingOfficer saved = masterReportingOfficerRepository.save(officer);
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
            MasterCompanyCode saved = masterCompanyCodeRepository.save(companyCode);
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
            MasterCostCenter saved = masterCostCenterRepository.save(costCenter);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
