package backend.login.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * LEGACY MODEL ONLY (no longer a JPA entity).
 *
 * The project now persists submitted forms in application_form_submissions (JSON payload) to avoid
 * MySQL/InnoDB row-size limits for the old wide table.
 */
@MappedSuperclass
public class ApplicationForm {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Employee Information
    @Column(nullable = false)
    private String employeeCode;
    
    private String fullName;
    
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private MasterBranch branch;
    
    private String designation;

    // As per paper form (top section)
    private String scopeOfWork;
    
    @ManyToOne
    @JoinColumn(name = "reporting_officer_id")
    private MasterReportingOfficer reportingOfficer;

    @ManyToOne
    @JoinColumn(name = "sub_branch_id")
    private MasterBranch subBranch;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private MasterDepartment department;
    
    private String employeeType; // Permanent / Probation / New / Change

    // Request type (top section): New / Change
    private String requestAction;
    
    private String contactNo;
    
    private String requestedBy;
    
    // Request For (Boolean fields for checkboxes)
    private Boolean requestEmailId = false;
    private Boolean requestDomainAccount = false;
    private Boolean requestBluetoothAccessCard = false;
    private Boolean requestSharedFolder = false;
    private Boolean requestInternetAccess = false;
    private Boolean requestNewins = false;
    private Boolean requestNexas = false;
    private Boolean requestGsnet = false;
    private Boolean requestVpnAccess = false;
    private Boolean requestHardDiskPenDrive = false;
    private Boolean requestNewGlow = false;
    private Boolean requestInternalApplication = false;
    private Boolean requestUsbAccess = false;
    private Boolean requestAnyOtherAsset = false;
    
    // Email ID Section
    @Lob
    @Column(columnDefinition = "TEXT")
    private String emailDomain;
    
    private String employeeType2;
    
    private String requestedEmailId;
    
    private Boolean companyProvidedMobile;
    private String mobileNumber;
    
    private Boolean companyProvidedSim;
    
    private Boolean mobileAccessIntune;
    private String mobileNo;
    
    private String imei1;
    private String imei2;
    private String imei3;
    
    private String emailRemarks;
    
    // Domain Account
    private String domainRemarks;
    
    // Biometric / Access Card
    private String biometricRemarks;
    
    // Shared Folder Access
    private String sharedFolderRemarks;
    
    // Internet Access / FTP Access
    private String requestType; // Privilege Access / Normal Access / Limited Access / No Internet Access
    private String internetRemarks;
    
    // NEWINS Section
    @Lob
    @Column(columnDefinition = "TEXT")
    private String requestedBranchCode;
    
    private String requestedNewinsId;
    private String operatorCode;
    private String newinsRequest; // New / Change
    
    // NExAS Section
    @ManyToOne
    @JoinColumn(name = "company_code_id")
    private MasterCompanyCode companyCode;
    
    @ManyToOne
    @JoinColumn(name = "cost_center_id")
    private MasterCostCenter costCenter;
    
    private String costCenterCode;
    private String operationRange;
    
    private Boolean hoAccountingUser = false;
    private Boolean branchAccountingUser = false;
    private Boolean itUser = false;
    private Boolean reportDisplayOnly = false;
    private Boolean paymentProposal = false;
    private Boolean voidCheque = false;
    private Boolean exchangeRateMaintenance = false;
    private Boolean issueChecque = false;
    private Boolean offsetAccount = false;
    private Boolean paymentApproval = false;
    private Boolean openCloseSchedule = false;
    private Boolean taxReport = false;
    private Boolean addDeleteMasterMaintenance = false;
    
    // GS-NET Section
    @Lob
    @Column(columnDefinition = "TEXT")
    private String requestedGsnetBranch;
    
    private String requestedDivisionName; // BOTH (OCN IMPORT & EXPORT) / OCN EXPORT / OCN IMPORT
    private String requestedPrimaryDivision;
    private String requestedUserRole; // USER / MANAGER
    
    private String gsnetRemarks;
    
    // Payment Operations
    private Boolean paymentOperationBranch = false;
    private Boolean batchInput = false;
    private Boolean sepaIbacsDataDownload = false;
    
    private String paymentRemarks;

    // NEx-GLOW
    private String newGlowRemarks;
    
    // Internal Application
    private String internalApplication;
    private String internalAppRemarks;
    
    // USB Access
    private String usbAccessFor;
    private String usbDetails;
    private String usbRemarks;
    
    // VPN Access
    private String domainId;
    private String emailId;
    private String mplsNonMpls;
    private String vpnRemarks;
    
    // HardDisk / PenDrive
    private String hardDiskRemarks;
    
    // Any Other Asset
    private String otherAssetRemarks;
    
    // General Remarks
    @Lob
    @Column(columnDefinition = "TEXT")
    private String generalRemarks;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String remarksReason;
    
    private String sendToRo;
    
    // Status and Timestamps
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    
    @Column(nullable = false)
    private LocalDateTime submittedAt;
    
    private LocalDateTime processedAt;
    
    private String processedBy;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String processingNotes;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public MasterBranch getBranch() {
        return branch;
    }

    public void setBranch(MasterBranch branch) {
        this.branch = branch;
    }

    public MasterDepartment getDepartment() {
        return department;
    }

    public void setDepartment(MasterDepartment department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getScopeOfWork() {
        return scopeOfWork;
    }

    public void setScopeOfWork(String scopeOfWork) {
        this.scopeOfWork = scopeOfWork;
    }

    public MasterReportingOfficer getReportingOfficer() {
        return reportingOfficer;
    }

    public void setReportingOfficer(MasterReportingOfficer reportingOfficer) {
        this.reportingOfficer = reportingOfficer;
    }

    public MasterBranch getSubBranch() {
        return subBranch;
    }

    public void setSubBranch(MasterBranch subBranch) {
        this.subBranch = subBranch;
    }

    public String getEmployeeType() {
        return employeeType;
    }

    public void setEmployeeType(String employeeType) {
        this.employeeType = employeeType;
    }

    public String getRequestAction() {
        return requestAction;
    }

    public void setRequestAction(String requestAction) {
        this.requestAction = requestAction;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public Boolean getRequestEmailId() {
        return requestEmailId;
    }

    public void setRequestEmailId(Boolean requestEmailId) {
        this.requestEmailId = requestEmailId;
    }

    public Boolean getRequestDomainAccount() {
        return requestDomainAccount;
    }

    public void setRequestDomainAccount(Boolean requestDomainAccount) {
        this.requestDomainAccount = requestDomainAccount;
    }

    public Boolean getRequestBluetoothAccessCard() {
        return requestBluetoothAccessCard;
    }

    public void setRequestBluetoothAccessCard(Boolean requestBluetoothAccessCard) {
        this.requestBluetoothAccessCard = requestBluetoothAccessCard;
    }

    public Boolean getRequestSharedFolder() {
        return requestSharedFolder;
    }

    public void setRequestSharedFolder(Boolean requestSharedFolder) {
        this.requestSharedFolder = requestSharedFolder;
    }

    public Boolean getRequestInternetAccess() {
        return requestInternetAccess;
    }

    public void setRequestInternetAccess(Boolean requestInternetAccess) {
        this.requestInternetAccess = requestInternetAccess;
    }

    public Boolean getRequestNewins() {
        return requestNewins;
    }

    public void setRequestNewins(Boolean requestNewins) {
        this.requestNewins = requestNewins;
    }

    public Boolean getRequestNexas() {
        return requestNexas;
    }

    public void setRequestNexas(Boolean requestNexas) {
        this.requestNexas = requestNexas;
    }

    public Boolean getRequestGsnet() {
        return requestGsnet;
    }

    public void setRequestGsnet(Boolean requestGsnet) {
        this.requestGsnet = requestGsnet;
    }

    public Boolean getRequestVpnAccess() {
        return requestVpnAccess;
    }

    public void setRequestVpnAccess(Boolean requestVpnAccess) {
        this.requestVpnAccess = requestVpnAccess;
    }

    public Boolean getRequestHardDiskPenDrive() {
        return requestHardDiskPenDrive;
    }

    public void setRequestHardDiskPenDrive(Boolean requestHardDiskPenDrive) {
        this.requestHardDiskPenDrive = requestHardDiskPenDrive;
    }

    public Boolean getRequestNewGlow() {
        return requestNewGlow;
    }

    public void setRequestNewGlow(Boolean requestNewGlow) {
        this.requestNewGlow = requestNewGlow;
    }

    public Boolean getRequestInternalApplication() {
        return requestInternalApplication;
    }

    public void setRequestInternalApplication(Boolean requestInternalApplication) {
        this.requestInternalApplication = requestInternalApplication;
    }

    public Boolean getRequestUsbAccess() {
        return requestUsbAccess;
    }

    public void setRequestUsbAccess(Boolean requestUsbAccess) {
        this.requestUsbAccess = requestUsbAccess;
    }

    public Boolean getRequestAnyOtherAsset() {
        return requestAnyOtherAsset;
    }

    public void setRequestAnyOtherAsset(Boolean requestAnyOtherAsset) {
        this.requestAnyOtherAsset = requestAnyOtherAsset;
    }

    public String getEmailDomain() {
        return emailDomain;
    }

    public void setEmailDomain(String emailDomain) {
        this.emailDomain = emailDomain;
    }

    public String getEmployeeType2() {
        return employeeType2;
    }

    public void setEmployeeType2(String employeeType2) {
        this.employeeType2 = employeeType2;
    }

    public String getRequestedEmailId() {
        return requestedEmailId;
    }

    public void setRequestedEmailId(String requestedEmailId) {
        this.requestedEmailId = requestedEmailId;
    }

    public Boolean getCompanyProvidedMobile() {
        return companyProvidedMobile;
    }

    public void setCompanyProvidedMobile(Boolean companyProvidedMobile) {
        this.companyProvidedMobile = companyProvidedMobile;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public Boolean getCompanyProvidedSim() {
        return companyProvidedSim;
    }

    public void setCompanyProvidedSim(Boolean companyProvidedSim) {
        this.companyProvidedSim = companyProvidedSim;
    }

    public Boolean getMobileAccessIntune() {
        return mobileAccessIntune;
    }

    public void setMobileAccessIntune(Boolean mobileAccessIntune) {
        this.mobileAccessIntune = mobileAccessIntune;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getImei1() {
        return imei1;
    }

    public void setImei1(String imei1) {
        this.imei1 = imei1;
    }

    public String getImei2() {
        return imei2;
    }

    public void setImei2(String imei2) {
        this.imei2 = imei2;
    }

    public String getImei3() {
        return imei3;
    }

    public void setImei3(String imei3) {
        this.imei3 = imei3;
    }

    public String getEmailRemarks() {
        return emailRemarks;
    }

    public void setEmailRemarks(String emailRemarks) {
        this.emailRemarks = emailRemarks;
    }

    public String getDomainRemarks() {
        return domainRemarks;
    }

    public void setDomainRemarks(String domainRemarks) {
        this.domainRemarks = domainRemarks;
    }

    public String getBiometricRemarks() {
        return biometricRemarks;
    }

    public void setBiometricRemarks(String biometricRemarks) {
        this.biometricRemarks = biometricRemarks;
    }

    public String getSharedFolderRemarks() {
        return sharedFolderRemarks;
    }

    public void setSharedFolderRemarks(String sharedFolderRemarks) {
        this.sharedFolderRemarks = sharedFolderRemarks;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getInternetRemarks() {
        return internetRemarks;
    }

    public void setInternetRemarks(String internetRemarks) {
        this.internetRemarks = internetRemarks;
    }

    public String getRequestedBranchCode() {
        return requestedBranchCode;
    }

    public void setRequestedBranchCode(String requestedBranchCode) {
        this.requestedBranchCode = requestedBranchCode;
    }

    public String getRequestedNewinsId() {
        return requestedNewinsId;
    }

    public void setRequestedNewinsId(String requestedNewinsId) {
        this.requestedNewinsId = requestedNewinsId;
    }

    public String getOperatorCode() {
        return operatorCode;
    }

    public void setOperatorCode(String operatorCode) {
        this.operatorCode = operatorCode;
    }

    public String getNewinsRequest() {
        return newinsRequest;
    }

    public void setNewinsRequest(String newinsRequest) {
        this.newinsRequest = newinsRequest;
    }

    public MasterCompanyCode getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(MasterCompanyCode companyCode) {
        this.companyCode = companyCode;
    }

    public MasterCostCenter getCostCenter() {
        return costCenter;
    }

    public void setCostCenter(MasterCostCenter costCenter) {
        this.costCenter = costCenter;
    }

    public String getCostCenterCode() {
        return costCenterCode;
    }

    public void setCostCenterCode(String costCenterCode) {
        this.costCenterCode = costCenterCode;
    }

    public String getOperationRange() {
        return operationRange;
    }

    public void setOperationRange(String operationRange) {
        this.operationRange = operationRange;
    }

    public Boolean getHoAccountingUser() {
        return hoAccountingUser;
    }

    public void setHoAccountingUser(Boolean hoAccountingUser) {
        this.hoAccountingUser = hoAccountingUser;
    }

    public Boolean getBranchAccountingUser() {
        return branchAccountingUser;
    }

    public void setBranchAccountingUser(Boolean branchAccountingUser) {
        this.branchAccountingUser = branchAccountingUser;
    }

    public Boolean getItUser() {
        return itUser;
    }

    public void setItUser(Boolean itUser) {
        this.itUser = itUser;
    }

    public Boolean getReportDisplayOnly() {
        return reportDisplayOnly;
    }

    public void setReportDisplayOnly(Boolean reportDisplayOnly) {
        this.reportDisplayOnly = reportDisplayOnly;
    }

    public Boolean getPaymentProposal() {
        return paymentProposal;
    }

    public void setPaymentProposal(Boolean paymentProposal) {
        this.paymentProposal = paymentProposal;
    }

    public Boolean getVoidCheque() {
        return voidCheque;
    }

    public void setVoidCheque(Boolean voidCheque) {
        this.voidCheque = voidCheque;
    }

    public Boolean getExchangeRateMaintenance() {
        return exchangeRateMaintenance;
    }

    public void setExchangeRateMaintenance(Boolean exchangeRateMaintenance) {
        this.exchangeRateMaintenance = exchangeRateMaintenance;
    }

    public Boolean getIssueChecque() {
        return issueChecque;
    }

    public void setIssueChecque(Boolean issueChecque) {
        this.issueChecque = issueChecque;
    }

    public Boolean getOffsetAccount() {
        return offsetAccount;
    }

    public void setOffsetAccount(Boolean offsetAccount) {
        this.offsetAccount = offsetAccount;
    }

    public Boolean getPaymentApproval() {
        return paymentApproval;
    }

    public void setPaymentApproval(Boolean paymentApproval) {
        this.paymentApproval = paymentApproval;
    }

    public Boolean getOpenCloseSchedule() {
        return openCloseSchedule;
    }

    public void setOpenCloseSchedule(Boolean openCloseSchedule) {
        this.openCloseSchedule = openCloseSchedule;
    }

    public Boolean getTaxReport() {
        return taxReport;
    }

    public void setTaxReport(Boolean taxReport) {
        this.taxReport = taxReport;
    }

    public Boolean getAddDeleteMasterMaintenance() {
        return addDeleteMasterMaintenance;
    }

    public void setAddDeleteMasterMaintenance(Boolean addDeleteMasterMaintenance) {
        this.addDeleteMasterMaintenance = addDeleteMasterMaintenance;
    }

    public String getRequestedGsnetBranch() {
        return requestedGsnetBranch;
    }

    public void setRequestedGsnetBranch(String requestedGsnetBranch) {
        this.requestedGsnetBranch = requestedGsnetBranch;
    }

    public String getRequestedDivisionName() {
        return requestedDivisionName;
    }

    public void setRequestedDivisionName(String requestedDivisionName) {
        this.requestedDivisionName = requestedDivisionName;
    }

    public String getRequestedPrimaryDivision() {
        return requestedPrimaryDivision;
    }

    public void setRequestedPrimaryDivision(String requestedPrimaryDivision) {
        this.requestedPrimaryDivision = requestedPrimaryDivision;
    }

    public String getRequestedUserRole() {
        return requestedUserRole;
    }

    public void setRequestedUserRole(String requestedUserRole) {
        this.requestedUserRole = requestedUserRole;
    }

    public String getGsnetRemarks() {
        return gsnetRemarks;
    }

    public void setGsnetRemarks(String gsnetRemarks) {
        this.gsnetRemarks = gsnetRemarks;
    }

    public Boolean getPaymentOperationBranch() {
        return paymentOperationBranch;
    }

    public void setPaymentOperationBranch(Boolean paymentOperationBranch) {
        this.paymentOperationBranch = paymentOperationBranch;
    }

    public Boolean getBatchInput() {
        return batchInput;
    }

    public void setBatchInput(Boolean batchInput) {
        this.batchInput = batchInput;
    }

    public Boolean getSepaIbacsDataDownload() {
        return sepaIbacsDataDownload;
    }

    public void setSepaIbacsDataDownload(Boolean sepaIbacsDataDownload) {
        this.sepaIbacsDataDownload = sepaIbacsDataDownload;
    }

    public String getPaymentRemarks() {
        return paymentRemarks;
    }

    public void setPaymentRemarks(String paymentRemarks) {
        this.paymentRemarks = paymentRemarks;
    }

    public String getNewGlowRemarks() {
        return newGlowRemarks;
    }

    public void setNewGlowRemarks(String newGlowRemarks) {
        this.newGlowRemarks = newGlowRemarks;
    }

    public String getInternalApplication() {
        return internalApplication;
    }

    public void setInternalApplication(String internalApplication) {
        this.internalApplication = internalApplication;
    }

    public String getInternalAppRemarks() {
        return internalAppRemarks;
    }

    public void setInternalAppRemarks(String internalAppRemarks) {
        this.internalAppRemarks = internalAppRemarks;
    }

    public String getUsbAccessFor() {
        return usbAccessFor;
    }

    public void setUsbAccessFor(String usbAccessFor) {
        this.usbAccessFor = usbAccessFor;
    }

    public String getUsbDetails() {
        return usbDetails;
    }

    public void setUsbDetails(String usbDetails) {
        this.usbDetails = usbDetails;
    }

    public String getUsbRemarks() {
        return usbRemarks;
    }

    public void setUsbRemarks(String usbRemarks) {
        this.usbRemarks = usbRemarks;
    }

    public String getDomainId() {
        return domainId;
    }

    public void setDomainId(String domainId) {
        this.domainId = domainId;
    }

    public String getEmailId() {
        return emailId;
    }

    public void setEmailId(String emailId) {
        this.emailId = emailId;
    }

    public String getMplsNonMpls() {
        return mplsNonMpls;
    }

    public void setMplsNonMpls(String mplsNonMpls) {
        this.mplsNonMpls = mplsNonMpls;
    }

    public String getVpnRemarks() {
        return vpnRemarks;
    }

    public void setVpnRemarks(String vpnRemarks) {
        this.vpnRemarks = vpnRemarks;
    }

    public String getHardDiskRemarks() {
        return hardDiskRemarks;
    }

    public void setHardDiskRemarks(String hardDiskRemarks) {
        this.hardDiskRemarks = hardDiskRemarks;
    }

    public String getOtherAssetRemarks() {
        return otherAssetRemarks;
    }

    public void setOtherAssetRemarks(String otherAssetRemarks) {
        this.otherAssetRemarks = otherAssetRemarks;
    }

    public String getGeneralRemarks() {
        return generalRemarks;
    }

    public void setGeneralRemarks(String generalRemarks) {
        this.generalRemarks = generalRemarks;
    }

    public String getRemarksReason() {
        return remarksReason;
    }

    public void setRemarksReason(String remarksReason) {
        this.remarksReason = remarksReason;
    }

    public String getSendToRo() {
        return sendToRo;
    }

    public void setSendToRo(String sendToRo) {
        this.sendToRo = sendToRo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(String processedBy) {
        this.processedBy = processedBy;
    }

    public String getProcessingNotes() {
        return processingNotes;
    }

    public void setProcessingNotes(String processingNotes) {
        this.processingNotes = processingNotes;
    }
}
