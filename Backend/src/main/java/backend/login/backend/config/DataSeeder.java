package backend.login.backend.config;

import backend.login.backend.model.*;
import backend.login.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Configuration
public class DataSeeder {

    private static final int MIN_USERS_PER_ROLE = 20;
    private static final int MIN_MASTER_ROWS = 20;
    private static final int MIN_APPLICATION_FORMS = 20;

    @Bean
    @ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
    CommandLineRunner seedInitialData(
            UserRepository userRepository,
            MasterBranchRepository masterBranchRepository,
            MasterDepartmentRepository masterDepartmentRepository,
            MasterReportingOfficerRepository masterReportingOfficerRepository,
            MasterCompanyCodeRepository masterCompanyCodeRepository,
            MasterCostCenterRepository masterCostCenterRepository,
            ApplicationFormRepository applicationFormRepository
    ) {
        return args -> {
            // Users (login)
            ensureUser(userRepository, "hr@nipponexpress.com", "hr123", "HR");
            ensureUser(userRepository, "employee@nipponexpress.com", "employee123", "EMPLOYEE");
            ensureUser(userRepository, "admin@nipponexpress.com", "admin123", "ADMIN");

            // Minimum 20 users each (HR / EMPLOYEE / ADMIN)
            ensureUsersForRole(userRepository, "HR", "hr", "hr123");
            ensureUsersForRole(userRepository, "EMPLOYEE", "employee", "employee123");
            ensureUsersForRole(userRepository, "ADMIN", "admin", "admin123");

            // Master data
            ensureMasterBranches(masterBranchRepository);
            ensureMasterDepartments(masterDepartmentRepository);
            ensureMasterReportingOfficers(masterReportingOfficerRepository);
            ensureMasterCompanyCodes(masterCompanyCodeRepository);
            ensureMasterCostCenters(masterCostCenterRepository);

            // Seed one application record so the UI autofill endpoint has something to return immediately
            ensureApplicationForms(
                    applicationFormRepository,
                    masterBranchRepository,
                    masterDepartmentRepository,
                    masterReportingOfficerRepository,
                    masterCompanyCodeRepository,
                    masterCostCenterRepository
            );
        };
    }

    private static void ensureUser(UserRepository userRepository, String email, String password, String role) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPassword(password);
            u.setRole(role);
            return userRepository.save(u);
        });
    }

    private static void ensureUsersForRole(UserRepository userRepository, String role, String emailPrefix, String password) {
        for (int i = 1; i <= MIN_USERS_PER_ROLE; i++) {
            String email = String.format(Locale.ROOT, "%s%02d@nipponexpress.com", emailPrefix, i);
            ensureUser(userRepository, email, password, role);
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

    private static void ensureApplicationForms(
            ApplicationFormRepository applicationFormRepository,
            MasterBranchRepository masterBranchRepository,
            MasterDepartmentRepository masterDepartmentRepository,
            MasterReportingOfficerRepository masterReportingOfficerRepository,
            MasterCompanyCodeRepository masterCompanyCodeRepository,
            MasterCostCenterRepository masterCostCenterRepository
    ) {
        long existing = applicationFormRepository.count();
        if (existing >= MIN_APPLICATION_FORMS) {
            return;
        }

        List<MasterBranch> branches = masterBranchRepository.findByActiveTrue();
        List<MasterDepartment> departments = masterDepartmentRepository.findByActiveTrue();
        List<MasterReportingOfficer> officers = masterReportingOfficerRepository.findByActiveTrue();
        List<MasterCompanyCode> companyCodes = masterCompanyCodeRepository.findByActiveTrue();
        List<MasterCostCenter> costCenters = masterCostCenterRepository.findByActiveTrue();

        if (branches.isEmpty() || departments.isEmpty() || officers.isEmpty() || companyCodes.isEmpty() || costCenters.isEmpty()) {
            return;
        }

        int created = 0;
        // Use deterministic employee codes to make it easy for the UI to query/autofill.
        for (int i = 1; i <= 200 && (existing + created) < MIN_APPLICATION_FORMS; i++) {
            String employeeCode = String.format(Locale.ROOT, "EMP%03d", i);
            if (applicationFormRepository.findTopByEmployeeCodeOrderBySubmittedAtDesc(employeeCode) != null) {
                continue;
            }

            MasterBranch branch = branches.get((i - 1) % branches.size());
            MasterBranch subBranch = branches.get(i % branches.size());
            MasterDepartment department = departments.get((i - 1) % departments.size());
            MasterReportingOfficer officer = officers.get((i - 1) % officers.size());
            MasterCompanyCode companyCode = companyCodes.get((i - 1) % companyCodes.size());
            MasterCostCenter costCenter = costCenters.get((i - 1) % costCenters.size());

            ApplicationForm f = new ApplicationForm();

            // Employee Information
            f.setEmployeeCode(employeeCode);
            f.setFullName(String.format(Locale.ROOT, "Employee %03d", i));
            f.setBranch(branch);
            f.setDesignation((i % 3 == 0) ? "Executive" : (i % 3 == 1) ? "Sr. Executive" : "Assistant Manager");
            f.setScopeOfWork((i % 2 == 0) ? "Both" : "IT");
            f.setReportingOfficer(officer);
            f.setSubBranch(subBranch);
            f.setDepartment(department);
            f.setEmployeeType((i % 4 == 0) ? "Permanent" : (i % 4 == 1) ? "Probation" : (i % 4 == 2) ? "New" : "Change");

            // Request type
            f.setRequestAction((i % 2 == 0) ? "New" : "Change");
            f.setContactNo(String.format(Locale.ROOT, "98%08d", i));
            f.setRequestedBy((i % 2 == 0) ? "HR" : "ADMIN");

            // Checkboxes
            f.setRequestEmailId(true);
            f.setRequestDomainAccount(true);
            f.setRequestBluetoothAccessCard(i % 2 == 0);
            f.setRequestSharedFolder(true);
            f.setRequestInternetAccess(true);
            f.setRequestNewins(true);
            f.setRequestNexas(true);
            f.setRequestGsnet(true);
            f.setRequestVpnAccess(i % 2 == 1);
            f.setRequestHardDiskPenDrive(i % 3 == 0);
            f.setRequestNewGlow(i % 2 == 0);
            f.setRequestInternalApplication(true);
            f.setRequestUsbAccess(true);
            f.setRequestAnyOtherAsset(i % 4 == 0);

            // Email section
            f.setEmailDomain("@nipponexpress.com");
            f.setEmployeeType2("Office");
            f.setRequestedEmailId(String.format(Locale.ROOT, "employee%03d@nipponexpress.com", i));
            f.setCompanyProvidedMobile(true);
            f.setMobileNumber(String.format(Locale.ROOT, "90000%05d", i));
            f.setCompanyProvidedSim(i % 2 == 0);
            f.setMobileAccessIntune(i % 2 == 0);
            f.setMobileNo(String.format(Locale.ROOT, "80000%05d", i));
            f.setImei1(String.format(Locale.ROOT, "IMEI1-%03d", i));
            f.setImei2(String.format(Locale.ROOT, "IMEI2-%03d", i));
            f.setImei3(String.format(Locale.ROOT, "IMEI3-%03d", i));
            f.setEmailRemarks("Seeded email section data");

            // Domain account
            f.setDomainRemarks("Seeded domain account remarks");

            // Biometric / access card
            f.setBiometricRemarks("Seeded biometric/access card remarks");

            // Shared folder
            f.setSharedFolderRemarks("\\\\server\\share\\dept" + String.format(Locale.ROOT, "%02d", (i % 20) + 1));

            // Internet/FTP
            f.setRequestType((i % 3 == 0) ? "Privilege Access" : (i % 3 == 1) ? "Normal Access" : "Limited Access");
            f.setInternetRemarks("Seeded internet remarks");

            // NEWINS
            f.setRequestedBranchCode("BRANCH-CODE-" + String.format(Locale.ROOT, "%03d", (i % 20) + 1));
            f.setRequestedNewinsId("NEWINS-" + employeeCode);
            f.setOperatorCode("OP" + String.format(Locale.ROOT, "%03d", i));
            f.setNewinsRequest((i % 2 == 0) ? "New" : "Change");

            // NExAS
            f.setCompanyCode(companyCode);
            f.setCostCenter(costCenter);
            f.setCostCenterCode(costCenter.getCostCenterCode());
            f.setOperationRange((i % 2 == 0) ? "Branch" : "HO");

            f.setHoAccountingUser(i % 2 == 0);
            f.setBranchAccountingUser(i % 3 == 0);
            f.setItUser(true);
            f.setReportDisplayOnly(i % 4 == 0);
            f.setPaymentProposal(true);
            f.setVoidCheque(i % 2 == 0);
            f.setExchangeRateMaintenance(i % 3 == 0);
            f.setIssueChecque(i % 4 == 0);
            f.setOffsetAccount(i % 5 == 0);
            f.setPaymentApproval(i % 2 == 1);
            f.setOpenCloseSchedule(i % 3 == 1);
            f.setTaxReport(i % 2 == 0);
            f.setAddDeleteMasterMaintenance(i % 4 == 1);

            // GS-NET
            f.setRequestedGsnetBranch("GSNET-BR-" + String.format(Locale.ROOT, "%03d", (i % 20) + 1));
            f.setRequestedDivisionName((i % 3 == 0) ? "BOTH (OCN IMPORT & EXPORT)" : (i % 3 == 1) ? "OCN EXPORT" : "OCN IMPORT");
            f.setRequestedPrimaryDivision((i % 2 == 0) ? "EXPORT" : "IMPORT");
            f.setRequestedUserRole((i % 2 == 0) ? "USER" : "MANAGER");
            f.setGsnetRemarks("Seeded GS-NET remarks");

            // Payment operations
            f.setPaymentOperationBranch(i % 2 == 0);
            f.setBatchInput(i % 3 == 0);
            f.setSepaIbacsDataDownload(i % 2 == 1);
            f.setPaymentRemarks("Seeded payment remarks");

            // NEx-GLOW
            f.setNewGlowRemarks("Seeded NEx-GLOW remarks");

            // Internal application
            f.setInternalApplication("Internal App " + ((i % 5) + 1));
            f.setInternalAppRemarks("Seeded internal application remarks");

            // USB
            f.setUsbAccessFor("Work Files");
            f.setUsbDetails("USB access for transfer - " + employeeCode);
            f.setUsbRemarks("Seeded USB remarks");

            // VPN
            f.setDomainId("DOMAIN-" + employeeCode);
            f.setEmailId(f.getRequestedEmailId());
            f.setMplsNonMpls((i % 2 == 0) ? "MPLS" : "NON-MPLS");
            f.setVpnRemarks("Seeded VPN remarks");

            // HardDisk/PenDrive
            f.setHardDiskRemarks("Seeded hard disk / pen drive remarks");

            // Other asset
            f.setOtherAssetRemarks("Seeded other asset remarks");

            // General
            f.setGeneralRemarks("Seeded general remarks for all sections - " + employeeCode);
            f.setRemarksReason("Seeded remarks reason");
            f.setSendToRo((i % 2 == 0) ? "YES" : "NO");

            // Status and timestamps
            String status = (i % 3 == 0) ? "APPROVED" : (i % 3 == 1) ? "PENDING" : "REJECTED";
            f.setStatus(status);
            f.setSubmittedAt(LocalDateTime.now().minusDays((i % 10) + 1));
            if (!"PENDING".equals(status)) {
                f.setProcessedAt(LocalDateTime.now().minusDays((i % 5) + 1));
                f.setProcessedBy((i % 2 == 0) ? "admin@nipponexpress.com" : "hr@nipponexpress.com");
                f.setProcessingNotes("Seeded processing notes");
            }

            applicationFormRepository.save(f);
            created++;
        }
    }
}
