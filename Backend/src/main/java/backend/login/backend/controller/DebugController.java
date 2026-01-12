package backend.login.backend.controller;

import backend.login.backend.repository.ApplicationFormRepository;
import backend.login.backend.repository.MasterBranchRepository;
import backend.login.backend.repository.MasterCompanyCodeRepository;
import backend.login.backend.repository.MasterCostCenterRepository;
import backend.login.backend.repository.MasterDepartmentRepository;
import backend.login.backend.repository.MasterReportingOfficerRepository;
import backend.login.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final UserRepository userRepository;
    private final MasterBranchRepository masterBranchRepository;
    private final MasterDepartmentRepository masterDepartmentRepository;
    private final MasterReportingOfficerRepository masterReportingOfficerRepository;
    private final MasterCompanyCodeRepository masterCompanyCodeRepository;
    private final MasterCostCenterRepository masterCostCenterRepository;
    private final ApplicationFormRepository applicationFormRepository;

    public DebugController(
            UserRepository userRepository,
            MasterBranchRepository masterBranchRepository,
            MasterDepartmentRepository masterDepartmentRepository,
            MasterReportingOfficerRepository masterReportingOfficerRepository,
            MasterCompanyCodeRepository masterCompanyCodeRepository,
            MasterCostCenterRepository masterCostCenterRepository,
            ApplicationFormRepository applicationFormRepository
    ) {
        this.userRepository = userRepository;
        this.masterBranchRepository = masterBranchRepository;
        this.masterDepartmentRepository = masterDepartmentRepository;
        this.masterReportingOfficerRepository = masterReportingOfficerRepository;
        this.masterCompanyCodeRepository = masterCompanyCodeRepository;
        this.masterCostCenterRepository = masterCostCenterRepository;
        this.applicationFormRepository = applicationFormRepository;
    }

    @GetMapping("/users")
    public List<Object> listUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> {
                    return new Object() {
                        public final int id = u.getId();
                        public final String email = u.getEmail();
                        public final String role = u.getRole();
                    };
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/counts")
    public Map<String, Object> getCounts() {
        return Map.of(
                "users", userRepository.count(),
                "branchesActive", masterBranchRepository.findByActiveTrue().size(),
                "departmentsActive", masterDepartmentRepository.findByActiveTrue().size(),
                "reportingOfficersActive", masterReportingOfficerRepository.findByActiveTrue().size(),
                "companyCodesActive", masterCompanyCodeRepository.findByActiveTrue().size(),
                "costCentersActive", masterCostCenterRepository.findByActiveTrue().size(),
                "applicationForms", applicationFormRepository.count()
        );
    }
}
