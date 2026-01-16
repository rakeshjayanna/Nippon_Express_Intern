package backend.login.backend.config;

import backend.login.backend.model.*;
import backend.login.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;

@Configuration
public class DataSeeder {

    private static final int MIN_USERS_PER_ROLE = 20;
    private static final int MIN_MASTER_ROWS = 20;

    @Bean
    @ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
    CommandLineRunner seedInitialData(
            UserRepository userRepository,
            MasterBranchRepository masterBranchRepository,
            MasterDepartmentRepository masterDepartmentRepository,
            MasterReportingOfficerRepository masterReportingOfficerRepository,
            MasterCompanyCodeRepository masterCompanyCodeRepository,
            MasterCostCenterRepository masterCostCenterRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Users (login) - passwords will be hashed
            ensureUser(userRepository, passwordEncoder, "hr@nipponexpress.com", "hr123", "HR");
            ensureUser(userRepository, passwordEncoder, "employee@nipponexpress.com", "employee123", "EMPLOYEE");
            ensureUser(userRepository, passwordEncoder, "admin@nipponexpress.com", "admin123", "ADMIN");

            // Minimum 20 users each (HR / EMPLOYEE / ADMIN)
            ensureUsersForRole(userRepository, passwordEncoder, "HR", "hr", "hr123");
            ensureUsersForRole(userRepository, passwordEncoder, "EMPLOYEE", "employee", "employee123");
            ensureUsersForRole(userRepository, passwordEncoder, "ADMIN", "admin", "admin123");

            // Master data
            ensureMasterBranches(masterBranchRepository);
            ensureMasterDepartments(masterDepartmentRepository);
            ensureMasterReportingOfficers(masterReportingOfficerRepository);
            ensureMasterCompanyCodes(masterCompanyCodeRepository);
            ensureMasterCostCenters(masterCostCenterRepository);
        };
    }

    private static void ensureUser(UserRepository userRepository, PasswordEncoder passwordEncoder, String email, String password, String role) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password)); // Hash password
            u.setRole(role);
            return userRepository.save(u);
        });
    }

    private static void ensureEmployeeUser(UserRepository userRepository, PasswordEncoder passwordEncoder, String email, String password, String employeeCode, String fullName, String designation) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password)); // Hash password
            u.setRole("EMPLOYEE");
            return userRepository.save(u);
        });

        boolean changed = false;
        if (user.getEmployeeCode() == null || user.getEmployeeCode().isBlank()) {
            user.setEmployeeCode(employeeCode);
            changed = true;
        }
        if (user.getFullName() == null || user.getFullName().isBlank()) {
            user.setFullName(fullName);
            changed = true;
        }
        if (user.getDesignation() == null || user.getDesignation().isBlank()) {
            user.setDesignation(designation);
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
        }
    }

    private static void ensureUsersForRole(UserRepository userRepository, PasswordEncoder passwordEncoder, String role, String emailPrefix, String password) {
        for (int i = 1; i <= MIN_USERS_PER_ROLE; i++) {
            String email = String.format(Locale.ROOT, "%s%02d@nipponexpress.com", emailPrefix, i);
            if ("EMPLOYEE".equalsIgnoreCase(role)) {
                String employeeCode = String.format(Locale.ROOT, "EMP%03d", i);
                String fullName = String.format(Locale.ROOT, "Employee %02d", i);
                String designation = (i % 2 == 0) ? "Associate" : "Executive";
                ensureEmployeeUser(userRepository, passwordEncoder, email, password, employeeCode, fullName, designation);
            } else {
                ensureUser(userRepository, passwordEncoder, email, password, role);
            }
        }
    }

    private static void ensureMasterBranches(MasterBranchRepository repo) {
        // keep some realistic names for first few
        ensureBranch(repo, "BR001", "Mumbai Branch");
        ensureBranch(repo, "BR002", "Delhi Branch");
        ensureBranch(repo, "BR003", "Bangalore Branch");
        ensureBranch(repo, "BR004", "Chennai Branch");
        ensureBranch(repo, "BR005", "Kolkata Branch");

        for (int i = 6; i <= MIN_MASTER_ROWS; i++) {
            String code = String.format(Locale.ROOT, "BR%03d", i);
            String name = String.format(Locale.ROOT, "Branch %02d", i);
            ensureBranch(repo, code, name);
        }
    }

    private static void ensureBranch(MasterBranchRepository repo, String code, String name) {
        if (repo.existsByBranchCode(code)) {
            return;
        }
        MasterBranch b = new MasterBranch();
        b.setBranchCode(code);
        b.setBranchName(name);
        b.setActive(true);
        repo.save(b);
    }

    private static void ensureMasterDepartments(MasterDepartmentRepository repo) {
        ensureDepartment(repo, "DEPT001", "IT Department");
        ensureDepartment(repo, "DEPT002", "HR Department");
        ensureDepartment(repo, "DEPT003", "Finance Department");
        ensureDepartment(repo, "DEPT004", "Operations");
        ensureDepartment(repo, "DEPT005", "Sales & Marketing");

        for (int i = 6; i <= MIN_MASTER_ROWS; i++) {
            String code = String.format(Locale.ROOT, "DEPT%03d", i);
            String name = String.format(Locale.ROOT, "Department %02d", i);
            ensureDepartment(repo, code, name);
        }
    }

    private static void ensureDepartment(MasterDepartmentRepository repo, String code, String name) {
        if (repo.existsByDepartmentCode(code)) {
            return;
        }
        MasterDepartment d = new MasterDepartment();
        d.setDepartmentCode(code);
        d.setDepartmentName(name);
        d.setActive(true);
        repo.save(d);
    }

    private static void ensureMasterReportingOfficers(MasterReportingOfficerRepository repo) {
        ensureOfficer(repo, "RO001", "John Smith", "Senior Manager");
        ensureOfficer(repo, "RO002", "Sarah Johnson", "Department Head");
        ensureOfficer(repo, "RO003", "Michael Brown", "Team Lead");
        ensureOfficer(repo, "RO004", "Emily Davis", "Operations Manager");

        for (int i = 5; i <= MIN_MASTER_ROWS; i++) {
            String code = String.format(Locale.ROOT, "RO%03d", i);
            String name = String.format(Locale.ROOT, "Reporting Officer %02d", i);
            String designation = String.format(Locale.ROOT, "Manager L%d", (i % 5) + 1);
            ensureOfficer(repo, code, name, designation);
        }
    }

    private static void ensureOfficer(MasterReportingOfficerRepository repo, String code, String name, String designation) {
        if (repo.existsByOfficerCode(code)) {
            return;
        }
        MasterReportingOfficer o = new MasterReportingOfficer();
        o.setOfficerCode(code);
        o.setOfficerName(name);
        o.setDesignation(designation);
        o.setActive(true);
        repo.save(o);
    }

    private static void ensureMasterCompanyCodes(MasterCompanyCodeRepository repo) {
        ensureCompanyCode(repo, "CC001", "Nippon Express India");
        ensureCompanyCode(repo, "CC002", "Nippon Express Global");
        ensureCompanyCode(repo, "CC003", "NEX Logistics");

        for (int i = 4; i <= MIN_MASTER_ROWS; i++) {
            String code = String.format(Locale.ROOT, "CC%03d", i);
            String name = String.format(Locale.ROOT, "Company %02d", i);
            ensureCompanyCode(repo, code, name);
        }
    }

    private static void ensureCompanyCode(MasterCompanyCodeRepository repo, String code, String name) {
        if (repo.existsByCompanyCode(code)) {
            return;
        }
        MasterCompanyCode c = new MasterCompanyCode();
        c.setCompanyCode(code);
        c.setCompanyName(name);
        c.setActive(true);
        repo.save(c);
    }

    private static void ensureMasterCostCenters(MasterCostCenterRepository repo) {
        ensureCostCenter(repo, "CST001", "IT Infrastructure");
        ensureCostCenter(repo, "CST002", "HR Operations");
        ensureCostCenter(repo, "CST003", "Finance & Accounting");
        ensureCostCenter(repo, "CST004", "Warehouse Operations");
        ensureCostCenter(repo, "CST005", "Transportation");

        for (int i = 6; i <= MIN_MASTER_ROWS; i++) {
            String code = String.format(Locale.ROOT, "CST%03d", i);
            String name = String.format(Locale.ROOT, "Cost Center %02d", i);
            ensureCostCenter(repo, code, name);
        }
    }

    private static void ensureCostCenter(MasterCostCenterRepository repo, String code, String name) {
        if (repo.existsByCostCenterCode(code)) {
            return;
        }
        MasterCostCenter cc = new MasterCostCenter();
        cc.setCostCenterCode(code);
        cc.setCostCenterName(name);
        cc.setActive(true);
        repo.save(cc);
    }

}
