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
            result.put("scopeOfWork", latest.getScopeOfWork());
            result.put("employeeType", latest.getEmployeeType());
            result.put("requestAction", latest.getRequestAction());
            result.put("requestedBy", latest.getRequestedBy());
            result.put("contactNo", latest.getContactNo());

            // Request toggles
            result.put("requestEmailId", latest.getRequestEmailId());
            result.put("requestDomainAccount", latest.getRequestDomainAccount());
            result.put("requestBluetoothAccessCard", latest.getRequestBluetoothAccessCard());
            result.put("requestSharedFolder", latest.getRequestSharedFolder());
            result.put("requestInternetAccess", latest.getRequestInternetAccess());
            result.put("requestNewins", latest.getRequestNewins());
            result.put("requestNexas", latest.getRequestNexas());
            result.put("requestGsnet", latest.getRequestGsnet());
            result.put("requestVpnAccess", latest.getRequestVpnAccess());
            result.put("requestHardDiskPenDrive", latest.getRequestHardDiskPenDrive());
            result.put("requestNewGlow", latest.getRequestNewGlow());
            result.put("requestInternalApplication", latest.getRequestInternalApplication());
            result.put("requestUsbAccess", latest.getRequestUsbAccess());
            result.put("requestAnyOtherAsset", latest.getRequestAnyOtherAsset());

            // Email section
            result.put("emailDomain", latest.getEmailDomain());
            result.put("employeeType2", latest.getEmployeeType2());
            result.put("requestedEmailId", latest.getRequestedEmailId());
            result.put("companyProvidedMobile", latest.getCompanyProvidedMobile());
            result.put("mobileNumber", latest.getMobileNumber());
            result.put("companyProvidedSim", latest.getCompanyProvidedSim());
            result.put("mobileAccessIntune", latest.getMobileAccessIntune());
            result.put("mobileNo", latest.getMobileNo());
            result.put("imei1", latest.getImei1());
            result.put("imei2", latest.getImei2());
            result.put("imei3", latest.getImei3());
            result.put("emailRemarks", latest.getEmailRemarks());

            // Other sections
            result.put("domainRemarks", latest.getDomainRemarks());
            result.put("biometricRemarks", latest.getBiometricRemarks());
            result.put("sharedFolderRemarks", latest.getSharedFolderRemarks());
            result.put("requestType", latest.getRequestType());
            result.put("internetRemarks", latest.getInternetRemarks());

            // NEWINS
            result.put("requestedBranchCode", latest.getRequestedBranchCode());
            result.put("requestedNewinsId", latest.getRequestedNewinsId());
            result.put("operatorCode", latest.getOperatorCode());
            result.put("newinsRequest", latest.getNewinsRequest());

            // NExAS
            result.put("costCenterCode", latest.getCostCenterCode());
            result.put("operationRange", latest.getOperationRange());
            result.put("hoAccountingUser", latest.getHoAccountingUser());
            result.put("branchAccountingUser", latest.getBranchAccountingUser());
            result.put("itUser", latest.getItUser());
            result.put("reportDisplayOnly", latest.getReportDisplayOnly());
            result.put("paymentProposal", latest.getPaymentProposal());
            result.put("voidCheque", latest.getVoidCheque());
            result.put("exchangeRateMaintenance", latest.getExchangeRateMaintenance());
            result.put("issueChecque", latest.getIssueChecque());
            result.put("offsetAccount", latest.getOffsetAccount());
            result.put("paymentApproval", latest.getPaymentApproval());
            result.put("openCloseSchedule", latest.getOpenCloseSchedule());
            result.put("taxReport", latest.getTaxReport());
            result.put("addDeleteMasterMaintenance", latest.getAddDeleteMasterMaintenance());

            // GS-NET
            result.put("requestedGsnetBranch", latest.getRequestedGsnetBranch());
            result.put("requestedDivisionName", latest.getRequestedDivisionName());
            result.put("requestedPrimaryDivision", latest.getRequestedPrimaryDivision());
            result.put("requestedUserRole", latest.getRequestedUserRole());
            result.put("gsnetRemarks", latest.getGsnetRemarks());

            // Payment operations
            result.put("paymentOperationBranch", latest.getPaymentOperationBranch());
            result.put("batchInput", latest.getBatchInput());
            result.put("sepaIbacsDataDownload", latest.getSepaIbacsDataDownload());
            result.put("paymentRemarks", latest.getPaymentRemarks());

            // NEx-GLOW / Internal / USB / VPN / Asset
            result.put("newGlowRemarks", latest.getNewGlowRemarks());
            result.put("internalApplication", latest.getInternalApplication());
            result.put("internalAppRemarks", latest.getInternalAppRemarks());
            result.put("usbAccessFor", latest.getUsbAccessFor());
            result.put("usbDetails", latest.getUsbDetails());
            result.put("usbRemarks", latest.getUsbRemarks());
            result.put("domainId", latest.getDomainId());
            result.put("emailId", latest.getEmailId());
            result.put("mplsNonMpls", latest.getMplsNonMpls());
            result.put("vpnRemarks", latest.getVpnRemarks());
            result.put("hardDiskRemarks", latest.getHardDiskRemarks());
            result.put("otherAssetRemarks", latest.getOtherAssetRemarks());

            // General
            result.put("generalRemarks", latest.getGeneralRemarks());
            result.put("remarksReason", latest.getRemarksReason());
            result.put("sendToRo", latest.getSendToRo());
            result.put("branchId", latest.getBranch() != null ? latest.getBranch().getId() : null);
            result.put("subBranchId", latest.getSubBranch() != null ? latest.getSubBranch().getId() : null);
            result.put("departmentId", latest.getDepartment() != null ? latest.getDepartment().getId() : null);
            result.put("reportingOfficerId", latest.getReportingOfficer() != null ? latest.getReportingOfficer().getId() : null);
            result.put("companyCodeId", latest.getCompanyCode() != null ? latest.getCompanyCode().getId() : null);
            result.put("costCenterId", latest.getCostCenter() != null ? latest.getCostCenter().getId() : null);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch employee data: " + e.getMessage()));
        }
    }
}
