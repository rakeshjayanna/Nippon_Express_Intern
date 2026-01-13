import React, { useEffect, useMemo, useRef, useState } from 'react';
import './styles/applicationForm.css';

// Keep these components at module scope so they don't get re-created each render.
// If defined inside ApplicationForm, React treats them as a new component type on
// every state update, which can remount inputs and make them lose focus.
const Field = ({ label, required, error, children, hint }) => (
    <div className={`af-field ${error ? 'is-error' : ''}`}>
        <div className="af-label-row">
            <label className="af-label">
                {label}{required ? <span className="af-required">*</span> : null}
            </label>
            {error ? <div className="af-error">{error}</div> : null}
        </div>
        {children}
        {hint ? <div className="af-hint">{hint}</div> : null}
    </div>
);

const Divider = ({ title }) => (
    <div className="af-divider">
        <div className="af-divider-title">{title}</div>
        <div className="af-divider-line" />
    </div>
);

const RequestToggle = ({ name, label, checked, onChange }) => (
    <label className={`af-toggle ${checked ? 'is-on' : ''}`}>
        <input
            type="checkbox"
            name={name}
            checked={!!checked}
            onChange={onChange}
        />
        <span className="af-toggle-label">{label}</span>
    </label>
);

const initialFormData = {
    employeeCode: '',
    fullName: '',
    branch: null,
    department: null,
    designation: '',
    scopeOfWork: '',
    reportingOfficer: null,
    subBranch: null,
    employeeType: 'Permanent',
    requestAction: 'New',
    contactNo: '',
    requestedBy: '',

    // Request For checkboxes
    requestEmailId: false,
    requestDomainAccount: false,
    requestBluetoothAccessCard: false,
    requestSharedFolder: false,
    requestInternetAccess: false,
    requestNexas: false,
    requestNewins: false,
    requestVpnAccess: false,
    requestHardDiskPenDrive: false,
    requestNewGlow: false,
    requestInternalApplication: false,
    requestUsbAccess: false,
    requestAnyOtherAsset: false,
    requestGsnet: false,

    // Email ID fields
    emailDomain: '',
    employeeType2: '',
    requestedEmailId: '',
    companyProvidedMobile: false,
    mobileNumber: '',
    companyProvidedSim: false,
    mobileAccessIntune: false,
    mobileNo: '',
    imei1: '',
    imei2: '',
    imei3: '',
    emailRemarks: '',

    // Other sections
    domainRemarks: '',
    biometricRemarks: '',
    sharedFolderRemarks: '',
    requestType: 'Normal Access',
    internetRemarks: '',

    // NEWINS
    requestedBranchCode: '',
    requestedNewinsId: '',
    operatorCode: '',
    newinsRequest: 'New',

    // NExAS
    companyCode: null,
    costCenter: null,
    costCenterCode: '',
    operationRange: '',
    hoAccountingUser: false,
    branchAccountingUser: false,
    itUser: false,
    reportDisplayOnly: false,
    paymentProposal: false,
    nexasPaymentOperation: false,
    nexasBatchInput: false,
    nexasSepaIbacsDataDownload: false,
    voidCheque: false,
    exchangeRateMaintenance: false,
    issueChecque: false,
    offsetAccount: false,
    paymentApproval: false,
    openCloseSchedule: false,
    taxReport: false,
    addDeleteMasterMaintenance: false,

    // GS-NET
    requestedGsnetBranch: '',
    requestedDivisionName: 'BOTH (OCN IMPORT & EXPORT)',
    requestedPrimaryDivision: 'OCN EXPORT',
    requestedUserRole: 'USER',
    gsnetRemarks: '',

    // Payment Operations
    paymentOperationBranch: false,
    batchInput: false,
    sepaIbacsDataDownload: false,
    paymentRemarks: '',

    // NEx-GLOW
    newGlowProject: '',
    newGlowWarehouse: '',
    newGlowRemarks: '',

    // Internal Application
    internalApplication: '',
    internalAppRemarks: '',

    // USB Access
    usbAccessFor: '',
    usbDetails: '',
    usbRemarks: '',

    // VPN Access
    domainId: '',
    emailId: '',
    mplsNonMpls: '',
    vpnRemarks: '',

    // HardDisk/PenDrive
    hardDiskRemarks: '',

    // Any Other Asset
    otherAssetRemarks: '',

    // General
    generalRemarks: '',
    remarksReason: '',
    sendToRo: ''
};

const REQUEST_CATALOG = [
    { key: 'requestEmailId', label: 'Email ID' },
    { key: 'requestDomainAccount', label: 'Domain Account' },
    { key: 'requestBluetoothAccessCard', label: 'Biometric / Access Card' },
    { key: 'requestSharedFolder', label: 'Shared Folder' },
    { key: 'requestInternetAccess', label: 'Internet Access / FTP Access' },
    { key: 'requestNewins', label: 'NEWINS' },
    { key: 'requestNexas', label: 'NExAS' },
    { key: 'requestGsnet', label: 'GS-NET' },
    { key: 'requestInternalApplication', label: 'Internal Application' },
    { key: 'requestUsbAccess', label: 'USB Access' },
    { key: 'requestVpnAccess', label: 'VPN Access' },
    { key: 'requestHardDiskPenDrive', label: 'HardDisk / PenDrive' },
    { key: 'requestNewGlow', label: 'NEx-GLOW' },
    { key: 'requestAnyOtherAsset', label: 'Any Other Asset' }
];

function getDraftStorageKey(userEmail) {
    const safe = (userEmail || 'anonymous').trim().toLowerCase();
    return `applicationFormDraft:v1:${safe}`;
}

function hasAnyRequestSelected(formData) {
    return REQUEST_CATALOG.some(r => !!formData[r.key]);
}

function validateStep(stepIndex, formData) {
    const errors = {};

    if (stepIndex === 0) {
        if (!String(formData.employeeCode || '').trim()) errors.employeeCode = 'Employee Code is required.';
        if (!String(formData.fullName || '').trim()) errors.fullName = 'Full Name is required.';
        if (!String(formData.designation || '').trim()) errors.designation = 'Designation is required.';
        if (!String(formData.scopeOfWork || '').trim()) errors.scopeOfWork = 'Scope of Work is required.';
        if (!formData.subBranch?.id) errors.subBranch = 'Sub-Branch is required.';
        if (!String(formData.employeeType || '').trim()) errors.employeeType = 'Employee Type is required.';
        if (!String(formData.requestAction || '').trim()) errors.requestAction = 'Request type is required.';
        if (!String(formData.requestedBy || '').trim()) errors.requestedBy = 'Requested By is required.';
    }

    if (stepIndex === 1) {
        if (!hasAnyRequestSelected(formData)) {
            errors._requests = 'Select at least one “Request For” item to continue.';
        }
    }

    if (stepIndex === 2) {
        if (formData.requestNewins) {
            if (!String(formData.requestedBranchCode || '').trim()) errors.requestedBranchCode = 'Requested Branch Code is required.';
            if (!String(formData.requestedNewinsId || '').trim()) errors.requestedNewinsId = "Requested NEWIN's ID / Operator Code is required.";
            if (!String(formData.newinsRequest || '').trim()) errors.newinsRequest = 'Request (New/Change) is required.';
        }
        if (formData.requestNewGlow) {
            if (!String(formData.newGlowProject || '').trim()) errors.newGlowProject = 'Project is required.';
            if (!String(formData.newGlowWarehouse || '').trim()) errors.newGlowWarehouse = 'Ware-House is required.';
            if (!String(formData.newGlowRemarks || '').trim()) errors.newGlowRemarks = 'Remarks are required.';
        }
    }

    if (stepIndex === 3) {
        if (!String(formData.remarksReason || '').trim()) errors.remarksReason = 'Remarks/Reason is required.';
        if (!String(formData.sendToRo || '').trim()) errors.sendToRo = 'Send To RO is required.';
    }

    return errors;
}

function ApplicationForm({ userEmail, userRole, onClose }) {
    const [masterData, setMasterData] = useState({
        branches: [],
        departments: [],
        reportingOfficers: [],
        companyCodes: [],
        costCenters: []
    });

    const [formData, setFormData] = useState(initialFormData);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const steps = useMemo(
        () => [
            { id: 'employee', title: 'Employee' },
            { id: 'requests', title: 'Requests' },
            { id: 'details', title: 'Details' },
            { id: 'review', title: 'Review & Submit' }
        ],
        []
    );

    const [stepIndex, setStepIndex] = useState(0);
    const [stepErrors, setStepErrors] = useState({});
    const [draftInfo, setDraftInfo] = useState({ status: 'idle', savedAt: null });
    const [isLookupLoading, setIsLookupLoading] = useState(false);
    const [employeeLookup, setEmployeeLookup] = useState(null);
    const lastLookupCodeRef = useRef('');
    const topRef = useRef(null);
    const isEmployeeCodeFocusedRef = useRef(false);

    useEffect(() => {
        fetchMasterData();
    }, []);

    useEffect(() => {
        // When master data arrives after an employee lookup, remap IDs -> objects.
        if (!employeeLookup) return;
        setFormData(prev => ({
            ...prev,
            branch: employeeLookup.branchId ? masterData.branches.find(b => b.id === employeeLookup.branchId) : prev.branch,
            subBranch: employeeLookup.subBranchId ? masterData.branches.find(b => b.id === employeeLookup.subBranchId) : prev.subBranch,
            department: employeeLookup.departmentId ? masterData.departments.find(d => d.id === employeeLookup.departmentId) : prev.department,
            reportingOfficer: employeeLookup.reportingOfficerId ? masterData.reportingOfficers.find(o => o.id === employeeLookup.reportingOfficerId) : prev.reportingOfficer
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [masterData.branches, masterData.departments, masterData.reportingOfficers, employeeLookup]);

    // Auto-detect lookup while typing, but only when a complete code is present.
    // Critical: do NOT rewrite the employeeCode field while the input is focused,
    // otherwise React can move the caret / steal focus.
    useEffect(() => {
        const raw = String(formData.employeeCode || '').trim();
        if (!raw) return;

        const normalizeEmployeeCode = (value) => {
            const v = String(value || '').trim();
            if (!v) return '';

            // Allow: 6 -> EMP006, 14 -> EMP014
            if (/^\d{1,3}$/.test(v)) {
                return `EMP${v.padStart(3, '0')}`;
            }

            // Allow: emp6 -> EMP006, EMP14 -> EMP014
            const m = v.match(/^emp(\d{1,3})$/i);
            if (m) {
                return `EMP${m[1].padStart(3, '0')}`;
            }

            // Exact match only
            if (/^EMP\d{3}$/i.test(v)) {
                return v.toUpperCase();
            }

            return '';
        };

        const normalized = normalizeEmployeeCode(raw);
        if (!normalized) return;
        if (normalized === lastLookupCodeRef.current) return;

        const handle = setTimeout(() => {
            fetchEmployeeDetails(normalized, {
                updateEmployeeCode: !isEmployeeCodeFocusedRef.current
            });
        }, 350);

        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.employeeCode]);

    useEffect(() => {
        // Restore a saved draft (if any)
        try {
            const key = getDraftStorageKey(userEmail);
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed?.formData) return;
            setFormData(prev => ({ ...prev, ...parsed.formData }));
            setDraftInfo({ status: 'restored', savedAt: parsed.savedAt || null });
        } catch {
            // Ignore draft parse failures
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userEmail]);

    useEffect(() => {
        // Debounced autosave draft
        const handle = setTimeout(() => {
            try {
                const key = getDraftStorageKey(userEmail);
                const savedAt = new Date().toISOString();
                localStorage.setItem(key, JSON.stringify({ formData, savedAt }));
                setDraftInfo({ status: 'saved', savedAt });
            } catch {
                // Ignore quota or serialization issues
            }
        }, 450);
        return () => clearTimeout(handle);
    }, [formData, userEmail]);

    const fetchMasterData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/master-data/all', {
                headers: {
                    'X-User-Email': userEmail
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMasterData(data);
            }
        } catch (error) {
            console.error('Failed to fetch master data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If the user hits Enter while on steps 0-2, treat it as "Next" (not final submit).
        if (stepIndex < steps.length - 1) {
            goToStep(stepIndex + 1);
            return;
        }

        const finalErrors = validateStep(3, formData);
        if (Object.keys(finalErrors).length > 0) {
            setStepErrors(finalErrors);
            setMessage({ type: 'error', text: 'Please complete the required fields before submitting.' });
            setStepIndex(3);
            topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        const { newGlowProject, newGlowWarehouse, newGlowRemarks, ...rest } = formData;
        const nexGlowCombined = [
            newGlowProject ? `Project: ${newGlowProject}` : '',
            newGlowWarehouse ? `Ware-House: ${newGlowWarehouse}` : '',
            newGlowRemarks ? `Remarks: ${newGlowRemarks}` : ''
        ].filter(Boolean).join('\n');
        const payload = {
            ...rest,
            newGlowRemarks: nexGlowCombined
        };

        try {
            const response = await fetch('http://localhost:8080/api/application-form/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': userEmail
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Application submitted successfully!' });
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to submit application' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEmployeeDetails = async (code, options = {}) => {
        const { updateEmployeeCode = true } = options;

        let empCode = (code || '').trim();
        if (!empCode) return;

        // Allow quick numeric entry: 6 -> EMP006, 14 -> EMP014
        if (/^\d+$/.test(empCode)) {
            empCode = `EMP${empCode.padStart(3, '0')}`;
        }

        if (empCode === lastLookupCodeRef.current) return;
        try {
            setIsLookupLoading(true);
            const res = await fetch(`http://localhost:8080/api/application-form/employee/${encodeURIComponent(empCode)}/latest`, {
                headers: { 'X-User-Email': userEmail }
            });
            if (res.ok) {
                const data = await res.json();
                setEmployeeLookup(data);
                lastLookupCodeRef.current = empCode;

                const isBlank = (v) => v === null || v === undefined || String(v).trim() === '';
                const pickStr = (v, fallback) => (isBlank(v) ? fallback : v);
                const pickBool = (v, fallback) => (v === null || v === undefined ? fallback : !!v);

                setFormData(prev => ({
                    ...prev,
                    employeeCode: updateEmployeeCode ? empCode : prev.employeeCode,
                    fullName: data.fullName || prev.fullName,
                    designation: data.designation || prev.designation,
                    scopeOfWork: pickStr(data.scopeOfWork, prev.scopeOfWork),
                    employeeType: pickStr(data.employeeType, prev.employeeType),
                    requestAction: pickStr(data.requestAction, prev.requestAction),
                    requestedBy: pickStr(data.requestedBy, prev.requestedBy),
                    contactNo: pickStr(data.contactNo, prev.contactNo),

                    // Request toggles
                    requestEmailId: pickBool(data.requestEmailId, prev.requestEmailId),
                    requestDomainAccount: pickBool(data.requestDomainAccount, prev.requestDomainAccount),
                    requestBluetoothAccessCard: pickBool(data.requestBluetoothAccessCard, prev.requestBluetoothAccessCard),
                    requestSharedFolder: pickBool(data.requestSharedFolder, prev.requestSharedFolder),
                    requestInternetAccess: pickBool(data.requestInternetAccess, prev.requestInternetAccess),
                    requestNewins: pickBool(data.requestNewins, prev.requestNewins),
                    requestNexas: pickBool(data.requestNexas, prev.requestNexas),
                    requestGsnet: pickBool(data.requestGsnet, prev.requestGsnet),
                    requestVpnAccess: pickBool(data.requestVpnAccess, prev.requestVpnAccess),
                    requestHardDiskPenDrive: pickBool(data.requestHardDiskPenDrive, prev.requestHardDiskPenDrive),
                    requestNewGlow: pickBool(data.requestNewGlow, prev.requestNewGlow),
                    requestInternalApplication: pickBool(data.requestInternalApplication, prev.requestInternalApplication),
                    requestUsbAccess: pickBool(data.requestUsbAccess, prev.requestUsbAccess),
                    requestAnyOtherAsset: pickBool(data.requestAnyOtherAsset, prev.requestAnyOtherAsset),

                    // Email section
                    emailDomain: pickStr(data.emailDomain, prev.emailDomain),
                    employeeType2: pickStr(data.employeeType2, prev.employeeType2),
                    requestedEmailId: pickStr(data.requestedEmailId, prev.requestedEmailId),
                    companyProvidedMobile: pickBool(data.companyProvidedMobile, prev.companyProvidedMobile),
                    mobileNumber: pickStr(data.mobileNumber, prev.mobileNumber),
                    companyProvidedSim: pickBool(data.companyProvidedSim, prev.companyProvidedSim),
                    mobileAccessIntune: pickBool(data.mobileAccessIntune, prev.mobileAccessIntune),
                    mobileNo: pickStr(data.mobileNo, prev.mobileNo),
                    imei1: pickStr(data.imei1, prev.imei1),
                    imei2: pickStr(data.imei2, prev.imei2),
                    imei3: pickStr(data.imei3, prev.imei3),
                    emailRemarks: pickStr(data.emailRemarks, prev.emailRemarks),

                    // Other sections
                    domainRemarks: pickStr(data.domainRemarks, prev.domainRemarks),
                    biometricRemarks: pickStr(data.biometricRemarks, prev.biometricRemarks),
                    sharedFolderRemarks: pickStr(data.sharedFolderRemarks, prev.sharedFolderRemarks),
                    requestType: pickStr(data.requestType, prev.requestType),
                    internetRemarks: pickStr(data.internetRemarks, prev.internetRemarks),

                    // NEWINS
                    requestedBranchCode: pickStr(data.requestedBranchCode, prev.requestedBranchCode),
                    requestedNewinsId: pickStr(data.requestedNewinsId, prev.requestedNewinsId),
                    operatorCode: pickStr(data.operatorCode, prev.operatorCode),
                    newinsRequest: pickStr(data.newinsRequest, prev.newinsRequest),

                    // NExAS
                    costCenterCode: pickStr(data.costCenterCode, prev.costCenterCode),
                    operationRange: pickStr(data.operationRange, prev.operationRange),
                    hoAccountingUser: pickBool(data.hoAccountingUser, prev.hoAccountingUser),
                    branchAccountingUser: pickBool(data.branchAccountingUser, prev.branchAccountingUser),
                    itUser: pickBool(data.itUser, prev.itUser),
                    reportDisplayOnly: pickBool(data.reportDisplayOnly, prev.reportDisplayOnly),
                    paymentProposal: pickBool(data.paymentProposal, prev.paymentProposal),
                    voidCheque: pickBool(data.voidCheque, prev.voidCheque),
                    exchangeRateMaintenance: pickBool(data.exchangeRateMaintenance, prev.exchangeRateMaintenance),
                    issueChecque: pickBool(data.issueChecque, prev.issueChecque),
                    offsetAccount: pickBool(data.offsetAccount, prev.offsetAccount),
                    paymentApproval: pickBool(data.paymentApproval, prev.paymentApproval),
                    openCloseSchedule: pickBool(data.openCloseSchedule, prev.openCloseSchedule),
                    taxReport: pickBool(data.taxReport, prev.taxReport),
                    addDeleteMasterMaintenance: pickBool(data.addDeleteMasterMaintenance, prev.addDeleteMasterMaintenance),

                    // Keep legacy duplicate fields in sync (if UI still uses them)
                    nexasPaymentOperation: pickBool(data.paymentOperationBranch, prev.nexasPaymentOperation),
                    nexasBatchInput: pickBool(data.batchInput, prev.nexasBatchInput),
                    nexasSepaIbacsDataDownload: pickBool(data.sepaIbacsDataDownload, prev.nexasSepaIbacsDataDownload),

                    // GS-NET
                    requestedGsnetBranch: pickStr(data.requestedGsnetBranch, prev.requestedGsnetBranch),
                    requestedDivisionName: pickStr(data.requestedDivisionName, prev.requestedDivisionName),
                    requestedPrimaryDivision: pickStr(data.requestedPrimaryDivision, prev.requestedPrimaryDivision),
                    requestedUserRole: pickStr(data.requestedUserRole, prev.requestedUserRole),
                    gsnetRemarks: pickStr(data.gsnetRemarks, prev.gsnetRemarks),

                    // Payment operations
                    paymentOperationBranch: pickBool(data.paymentOperationBranch, prev.paymentOperationBranch),
                    batchInput: pickBool(data.batchInput, prev.batchInput),
                    sepaIbacsDataDownload: pickBool(data.sepaIbacsDataDownload, prev.sepaIbacsDataDownload),
                    paymentRemarks: pickStr(data.paymentRemarks, prev.paymentRemarks),

                    // NEx-GLOW / Internal / USB / VPN / Asset
                    newGlowRemarks: pickStr(data.newGlowRemarks, prev.newGlowRemarks),
                    internalApplication: pickStr(data.internalApplication, prev.internalApplication),
                    internalAppRemarks: pickStr(data.internalAppRemarks, prev.internalAppRemarks),
                    usbAccessFor: pickStr(data.usbAccessFor, prev.usbAccessFor),
                    usbDetails: pickStr(data.usbDetails, prev.usbDetails),
                    usbRemarks: pickStr(data.usbRemarks, prev.usbRemarks),
                    domainId: pickStr(data.domainId, prev.domainId),
                    emailId: pickStr(data.emailId, prev.emailId),
                    mplsNonMpls: pickStr(data.mplsNonMpls, prev.mplsNonMpls),
                    vpnRemarks: pickStr(data.vpnRemarks, prev.vpnRemarks),
                    hardDiskRemarks: pickStr(data.hardDiskRemarks, prev.hardDiskRemarks),
                    otherAssetRemarks: pickStr(data.otherAssetRemarks, prev.otherAssetRemarks),

                    // General
                    generalRemarks: pickStr(data.generalRemarks, prev.generalRemarks),
                    remarksReason: pickStr(data.remarksReason, prev.remarksReason),
                    sendToRo: pickStr(data.sendToRo, prev.sendToRo),

                    branch: data.branchId ? masterData.branches.find(b => b.id === data.branchId) : prev.branch,
                    subBranch: data.subBranchId ? masterData.branches.find(b => b.id === data.subBranchId) : prev.subBranch,
                    department: data.departmentId ? masterData.departments.find(d => d.id === data.departmentId) : prev.department,
                    reportingOfficer: data.reportingOfficerId ? masterData.reportingOfficers.find(o => o.id === data.reportingOfficerId) : prev.reportingOfficer,
                    companyCode: data.companyCodeId ? masterData.companyCodes.find(c => c.id === data.companyCodeId) : prev.companyCode,
                    costCenter: data.costCenterId ? masterData.costCenters.find(c => c.id === data.costCenterId) : prev.costCenter
                }));
            } else if (res.status === 404) {
                lastLookupCodeRef.current = empCode;
                if (updateEmployeeCode) {
                    setFormData(prev => ({ ...prev, employeeCode: empCode }));
                }
            }
        } catch (err) {
            console.error('Failed to fetch employee details:', err);
        } finally {
            setIsLookupLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setMessage({ type: '', text: '' });
        setStepErrors({});
        setStepIndex(0);
        try {
            localStorage.removeItem(getDraftStorageKey(userEmail));
            setDraftInfo({ status: 'cleared', savedAt: null });
        } catch {
            // ignore
        }
    };

    const selectedRequests = useMemo(
        () => REQUEST_CATALOG.filter(r => !!formData[r.key]),
        [formData]
    );

    const goToStep = (nextIndex) => {
        const clamped = Math.max(0, Math.min(steps.length - 1, nextIndex));
        if (clamped === stepIndex) return;

        // Allow moving backwards freely. Moving forward requires validation of current step.
        if (clamped > stepIndex) {
            const errors = validateStep(stepIndex, formData);
            setStepErrors(errors);
            if (Object.keys(errors).length > 0) {
                setMessage({ type: 'error', text: 'Please fix the highlighted items to continue.' });
                topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
        }

        setMessage({ type: '', text: '' });
        setStepErrors({});
        setStepIndex(clamped);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const goNext = () => goToStep(stepIndex + 1);
    const goBack = () => goToStep(stepIndex - 1);

    // NOTE: Field/Divider/RequestToggle are module-level components (see top).

    const renderEmployeeStep = () => (
        <div className="af-step">
            <Divider title="Employee Information" />
            <div className="af-grid">
                <Field label="Employee Code" required error={stepErrors.employeeCode}>
                    <div className="af-inline">
                        <input
                            className="af-input"
                            type="text"
                            name="employeeCode"
                            value={formData.employeeCode}
                            onChange={handleChange}
                            onFocus={() => {
                                isEmployeeCodeFocusedRef.current = true;
                            }}
                            onBlur={() => {
                                isEmployeeCodeFocusedRef.current = false;
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                e.preventDefault();
                                e.stopPropagation();
                                fetchEmployeeDetails(e.currentTarget.value, { updateEmployeeCode: true });
                            }}
                            autoComplete="off"
                        />
                        
                    </div>
                </Field>

                <Field label="Full Name" required error={stepErrors.fullName}>
                    <input className="af-input" type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </Field>

                <Field label="Branch" hint="Auto-filled from latest employee record">
                    <input className="af-input" type="text" value={formData.branch?.branchName || ''} placeholder="Auto-fetched" readOnly />
                </Field>

                <Field label="Department" hint="Auto-filled from latest employee record">
                    <input className="af-input" type="text" value={formData.department?.departmentName || ''} placeholder="Auto-fetched" readOnly />
                </Field>

                <Field label="Designation" required error={stepErrors.designation}>
                    <input className="af-input" type="text" name="designation" value={formData.designation} onChange={handleChange} />
                </Field>

                <Field label="Reporting Officer" hint="Auto-filled from latest employee record">
                    <input className="af-input" type="text" value={formData.reportingOfficer?.officerName || ''} placeholder="Auto-fetched" readOnly />
                </Field>

                <Field label="Scope of Work" required error={stepErrors.scopeOfWork}>
                    <select className="af-select" name="scopeOfWork" value={formData.scopeOfWork} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="IT">IT</option>
                        <option value="Export">Export</option>
                        <option value="Import">Import</option>
                        <option value="Both">Both</option>
                    </select>
                </Field>

                <Field label="Sub-Branch" required error={stepErrors.subBranch}>
                    <select
                        className="af-select"
                        value={formData.subBranch?.id || ''}
                        onChange={(e) => {
                            const branch = masterData.branches.find(b => b.id === parseInt(e.target.value));
                            handleSelectChange('subBranch', branch);
                        }}
                    >
                        <option value="">Select</option>
                        {masterData.branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Employee Type" required error={stepErrors.employeeType}>
                    <div className="af-choice-row" role="radiogroup" aria-label="Employee Type">
                        {['Permanent', 'Probation'].map(opt => (
                            <label key={opt} className={`af-choice ${formData.employeeType === opt ? 'is-on' : ''}`}>
                                <input type="radio" name="employeeType" value={opt} checked={formData.employeeType === opt} onChange={handleChange} />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </Field>

                <Field label="Request" required error={stepErrors.requestAction}>
                    <div className="af-choice-row" role="radiogroup" aria-label="Request">
                        {['New', 'Change'].map(opt => (
                            <label key={opt} className={`af-choice ${formData.requestAction === opt ? 'is-on' : ''}`}>
                                <input type="radio" name="requestAction" value={opt} checked={formData.requestAction === opt} onChange={handleChange} />
                                <span>{opt}</span>
                            </label>
                        ))}
                    </div>
                </Field>

                <Field label="Contact No">
                    <input className="af-input" type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} />
                </Field>

                <Field label="Requested By" required error={stepErrors.requestedBy}>
                    <input className="af-input" type="text" name="requestedBy" value={formData.requestedBy} onChange={handleChange} />
                </Field>
            </div>
        </div>
    );

    const renderRequestsStep = () => (
        <div className="af-step">
            <Divider title="Request For" />

            {stepErrors._requests ? (
                <div className="af-callout af-callout-error">{stepErrors._requests}</div>
            ) : null}

            <div className="af-row">
                <div className="af-muted">Selected: <strong>{selectedRequests.length}</strong></div>
                <div className="af-spacer" />
                <button
                    type="button"
                    className="af-btn af-btn-ghost"
                    onClick={() => {
                        const cleared = {};
                        for (const r of REQUEST_CATALOG) cleared[r.key] = false;
                        setFormData(prev => ({ ...prev, ...cleared }));
                    }}
                    disabled={!hasAnyRequestSelected(formData)}
                >
                    Clear all
                </button>
            </div>

            <div className="af-toggle-grid">
                {REQUEST_CATALOG.map(r => (
                    <RequestToggle
                        key={r.key}
                        name={r.key}
                        label={r.label}
                        checked={!!formData[r.key]}
                        onChange={handleChange}
                    />
                ))}
            </div>
        </div>
    );

    const renderDetailsStep = () => (
        <div className="af-step">
            <Divider title="Details" />

            {selectedRequests.length === 0 ? (
                <div className="af-callout">Select items in “Request For” to see details here.</div>
            ) : null}

            <div className="af-panels">
                {formData.requestEmailId ? (
                    <details className="af-panel" open>
                        <summary className="af-panel-summary">Email ID</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Email Domain">
                                    <select className="af-select" name="emailDomain" value={formData.emailDomain} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Domain1">Domain 1</option>
                                        <option value="Domain2">Domain 2</option>
                                    </select>
                                </Field>

                                <Field label="Employee Type">
                                    <select className="af-select" name="employeeType2" value={formData.employeeType2} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Type1">Type 1</option>
                                        <option value="Type2">Type 2</option>
                                    </select>
                                </Field>

                                <Field label="Requested E-Mail Id">
                                    <input className="af-input" type="email" name="requestedEmailId" value={formData.requestedEmailId} onChange={handleChange} />
                                </Field>

                                <Field label="Company Provided Mobile">
                                    <div className="af-inline">
                                        <label className="af-check">
                                            <input type="checkbox" name="companyProvidedMobile" checked={formData.companyProvidedMobile} onChange={handleChange} />
                                            <span>Yes</span>
                                        </label>
                                        <input className="af-input" type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Make & Model / Number" />
                                    </div>
                                </Field>

                                <Field label="Company Provided SIM Card">
                                    <label className="af-check">
                                        <input type="checkbox" name="companyProvidedSim" checked={formData.companyProvidedSim} onChange={handleChange} />
                                        <span>Yes</span>
                                    </label>
                                </Field>

                                <Field label="Mobile Access (Intune)">
                                    <div className="af-inline">
                                        <label className="af-check">
                                            <input type="checkbox" name="mobileAccessIntune" checked={formData.mobileAccessIntune} onChange={handleChange} />
                                            <span>Yes</span>
                                        </label>
                                        <input className="af-input" type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No." />
                                    </div>
                                </Field>

                                <Field label="IMEI No(s)">
                                    <div className="af-3col">
                                        <input className="af-input" type="text" name="imei1" value={formData.imei1} onChange={handleChange} placeholder="IMEI No 1" />
                                        <input className="af-input" type="text" name="imei2" value={formData.imei2} onChange={handleChange} placeholder="IMEI No 2" />
                                        <input className="af-input" type="text" name="imei3" value={formData.imei3} onChange={handleChange} placeholder="IMEI No 3" />
                                    </div>
                                </Field>

                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="emailRemarks" value={formData.emailRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestDomainAccount ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Domain Account</summary>
                        <div className="af-panel-body">
                            <Field label="Remarks">
                                <textarea className="af-textarea" name="domainRemarks" value={formData.domainRemarks} onChange={handleChange} rows={4} placeholder="Remarks" />
                            </Field>
                        </div>
                    </details>
                ) : null}

                {formData.requestBluetoothAccessCard ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Biometric / Access Card</summary>
                        <div className="af-panel-body">
                            <Field label="Remarks">
                                <textarea className="af-textarea" name="biometricRemarks" value={formData.biometricRemarks} onChange={handleChange} rows={4} placeholder="Remarks" />
                            </Field>
                        </div>
                    </details>
                ) : null}

                {formData.requestSharedFolder ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Shared Folder Access</summary>
                        <div className="af-panel-body">
                            <Field label="Remarks">
                                <textarea className="af-textarea" name="sharedFolderRemarks" value={formData.sharedFolderRemarks} onChange={handleChange} rows={4} placeholder="Remarks" />
                            </Field>
                        </div>
                    </details>
                ) : null}

                {formData.requestInternetAccess ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Internet Access / FTP Access</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Request Type">
                                    <div className="af-choice-row" role="radiogroup" aria-label="Internet Request Type">
                                        {['Privilege Access', 'Normal Access', 'Limited Access', 'No Internet Access'].map(opt => (
                                            <label key={opt} className={`af-choice ${formData.requestType === opt ? 'is-on' : ''}`}>
                                                <input type="radio" name="requestType" value={opt} checked={formData.requestType === opt} onChange={handleChange} />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="internetRemarks" value={formData.internetRemarks} onChange={handleChange} rows={4} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestNewins ? (
                    <details className="af-panel" open>
                        <summary className="af-panel-summary">NEWINS</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Requested Branch Code" required error={stepErrors.requestedBranchCode}>
                                    <select
                                        className="af-select"
                                        value={masterData.branches.find(b => b.branchCode === formData.requestedBranchCode)?.id || ''}
                                        onChange={(e) => {
                                            const b = masterData.branches.find(b => b.id === parseInt(e.target.value));
                                            setFormData(prev => ({ ...prev, requestedBranchCode: b ? b.branchCode : '' }));
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {masterData.branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.branchCode} - {branch.branchName}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Requested NEWIN's ID / Operator Code" required error={stepErrors.requestedNewinsId}>
                                    <input className="af-input" type="text" name="requestedNewinsId" value={formData.requestedNewinsId} onChange={handleChange} />
                                </Field>

                                <Field label="Request" required error={stepErrors.newinsRequest}>
                                    <div className="af-choice-row" role="radiogroup" aria-label="NEWINS Request">
                                        {['New', 'Change'].map(opt => (
                                            <label key={opt} className={`af-choice ${formData.newinsRequest === opt ? 'is-on' : ''}`}>
                                                <input type="radio" name="newinsRequest" value={opt} checked={formData.newinsRequest === opt} onChange={handleChange} />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestNexas ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">NExAS</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Company Code">
                                    <select
                                        className="af-select"
                                        value={formData.companyCode?.id || ''}
                                        onChange={(e) => {
                                            const code = masterData.companyCodes.find(c => c.id === parseInt(e.target.value));
                                            handleSelectChange('companyCode', code);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {masterData.companyCodes.map(code => (
                                            <option key={code.id} value={code.id}>{code.companyName}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Cost Center Name">
                                    <select
                                        className="af-select"
                                        value={formData.costCenter?.id || ''}
                                        onChange={(e) => {
                                            const center = masterData.costCenters.find(c => c.id === parseInt(e.target.value));
                                            handleSelectChange('costCenter', center);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {masterData.costCenters.map(center => (
                                            <option key={center.id} value={center.id}>{center.costCenterName}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Cost Center Code">
                                    <input className="af-input" type="text" name="costCenterCode" value={formData.costCenterCode} onChange={handleChange} />
                                </Field>

                                <Field label="Operation range">
                                    <input className="af-input" type="text" name="operationRange" value={formData.operationRange} onChange={handleChange} />
                                </Field>

                                <Field label="Request Type (Select first)">
                                    <div className="af-toggle-grid af-toggle-grid-compact">
                                        <label className="af-check"><input type="checkbox" name="hoAccountingUser" checked={formData.hoAccountingUser} onChange={handleChange} /><span>HO Accounting User</span></label>
                                        <label className="af-check"><input type="checkbox" name="branchAccountingUser" checked={formData.branchAccountingUser} onChange={handleChange} /><span>Branch Accounting User</span></label>
                                        <label className="af-check"><input type="checkbox" name="itUser" checked={formData.itUser} onChange={handleChange} /><span>IT User</span></label>
                                        <label className="af-check"><input type="checkbox" name="reportDisplayOnly" checked={formData.reportDisplayOnly} onChange={handleChange} /><span>Report display only User</span></label>
                                    </div>
                                </Field>

                                <Field label="Optional menu">
                                    <div className="af-toggle-grid af-toggle-grid-compact">
                                        <label className="af-check"><input type="checkbox" name="paymentProposal" checked={formData.paymentProposal} onChange={handleChange} /><span>Payment Proposal</span></label>
                                        <label className="af-check"><input type="checkbox" name="paymentApproval" checked={formData.paymentApproval} onChange={handleChange} /><span>Payment Approval</span></label>
                                        <label className="af-check"><input type="checkbox" name="openCloseSchedule" checked={formData.openCloseSchedule} onChange={handleChange} /><span>Open/Close Schedule</span></label>
                                        <label className="af-check"><input type="checkbox" name="voidCheque" checked={formData.voidCheque} onChange={handleChange} /><span>Void Cheque</span></label>
                                        <label className="af-check"><input type="checkbox" name="issueChecque" checked={formData.issueChecque} onChange={handleChange} /><span>Issue Cheque</span></label>
                                        <label className="af-check"><input type="checkbox" name="taxReport" checked={formData.taxReport} onChange={handleChange} /><span>Tax Report</span></label>
                                        <label className="af-check"><input type="checkbox" name="exchangeRateMaintenance" checked={formData.exchangeRateMaintenance} onChange={handleChange} /><span>Exchange Rate Maintenance</span></label>
                                        <label className="af-check"><input type="checkbox" name="offsetAccount" checked={formData.offsetAccount} onChange={handleChange} /><span>Offset Account</span></label>
                                        <label className="af-check"><input type="checkbox" name="addDeleteMasterMaintenance" checked={formData.addDeleteMasterMaintenance} onChange={handleChange} /><span>Add/Delete master Maintenance</span></label>
                                        <label className="af-check"><input type="checkbox" name="paymentOperationBranch" checked={formData.paymentOperationBranch} onChange={handleChange} /><span>Payment operation of branch</span></label>
                                        <label className="af-check"><input type="checkbox" name="batchInput" checked={formData.batchInput} onChange={handleChange} /><span>Batch Input</span></label>
                                        <label className="af-check"><input type="checkbox" name="sepaIbacsDataDownload" checked={formData.sepaIbacsDataDownload} onChange={handleChange} /><span>SEPA-IBACS data Download</span></label>
                                    </div>
                                </Field>

                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="paymentRemarks" value={formData.paymentRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                                </Field>
                            </div>

                            <div className="af-note">
                                <div><strong>Note</strong></div>
                                <ul>
                                    <li>*If the user will use TV menu in NExAS, tell HO Admin to create employee master please.</li>
                                    <li>*If you want to be in charge of other Company or Branch or Region fill in “Operation Range” or “Display Range”.</li>
                                    <li>*Please apply through H.O Accounting manager.</li>
                                    <li>*If you want to change your status, submit applications for each user.</li>
                                </ul>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestGsnet ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">GS-NET</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Requested GSNET Branch Code">
                                    <textarea className="af-textarea" name="requestedGsnetBranch" value={formData.requestedGsnetBranch} onChange={handleChange} rows={3} />
                                </Field>
                                <Field label="Requested Division Name">
                                    <select className="af-select" name="requestedDivisionName" value={formData.requestedDivisionName} onChange={handleChange}>
                                        <option value="BOTH (OCN IMPORT & EXPORT)">BOTH (OCN IMPORT & EXPORT)</option>
                                        <option value="OCN EXPORT">OCN EXPORT</option>
                                        <option value="OCN IMPORT">OCN IMPORT</option>
                                    </select>
                                </Field>
                                <Field label="Requested Primary Division">
                                    <select className="af-select" name="requestedPrimaryDivision" value={formData.requestedPrimaryDivision} onChange={handleChange}>
                                        <option value="N/A">N/A</option>
                                        <option value="OCN EXPORT">OCN EXPORT</option>
                                        <option value="OCN IMPORT">OCN IMPORT</option>
                                    </select>
                                </Field>
                                <Field label="Requested User Role">
                                    <div className="af-choice-row" role="radiogroup" aria-label="GSNET Role">
                                        {['USER', 'MANAGER'].map(opt => (
                                            <label key={opt} className={`af-choice ${formData.requestedUserRole === opt ? 'is-on' : ''}`}>
                                                <input type="radio" name="requestedUserRole" value={opt} checked={formData.requestedUserRole === opt} onChange={handleChange} />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </Field>
                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="gsnetRemarks" value={formData.gsnetRemarks} onChange={handleChange} rows={3} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestInternalApplication ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Internal Application</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Application">
                                    <input className="af-input" type="text" name="internalApplication" value={formData.internalApplication} onChange={handleChange} />
                                </Field>
                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="internalAppRemarks" value={formData.internalAppRemarks} onChange={handleChange} rows={3} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestUsbAccess ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">USB Access</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Access For">
                                    <input className="af-input" type="text" name="usbAccessFor" value={formData.usbAccessFor} onChange={handleChange} />
                                </Field>
                                <Field label="USB Details">
                                    <input className="af-input" type="text" name="usbDetails" value={formData.usbDetails} onChange={handleChange} />
                                </Field>
                                <Field label="Remarks / Reason">
                                    <textarea className="af-textarea" name="usbRemarks" value={formData.usbRemarks} onChange={handleChange} rows={3} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestVpnAccess ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">VPN Access</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Domain ID">
                                    <input className="af-input" type="text" name="domainId" value={formData.domainId} onChange={handleChange} />
                                </Field>
                                <Field label="Email ID">
                                    <input className="af-input" type="email" name="emailId" value={formData.emailId} onChange={handleChange} />
                                </Field>
                                <Field label="MPLS / NON MPLS">
                                    <input className="af-input" type="text" name="mplsNonMpls" value={formData.mplsNonMpls} onChange={handleChange} />
                                </Field>
                                <Field label="Remarks">
                                    <textarea className="af-textarea" name="vpnRemarks" value={formData.vpnRemarks} onChange={handleChange} rows={3} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestHardDiskPenDrive ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">HardDisk / PenDrive</summary>
                        <div className="af-panel-body">
                            <Field label="Remarks">
                                <textarea className="af-textarea" name="hardDiskRemarks" value={formData.hardDiskRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                            </Field>
                        </div>
                    </details>
                ) : null}

                {formData.requestNewGlow ? (
                    <details className="af-panel" open>
                        <summary className="af-panel-summary">NEx-GLOW</summary>
                        <div className="af-panel-body">
                            <div className="af-grid">
                                <Field label="Project" required error={stepErrors.newGlowProject}>
                                    <input className="af-input" type="text" name="newGlowProject" value={formData.newGlowProject} onChange={handleChange} />
                                </Field>
                                <Field label="Ware-House" required error={stepErrors.newGlowWarehouse}>
                                    <input className="af-input" type="text" name="newGlowWarehouse" value={formData.newGlowWarehouse} onChange={handleChange} />
                                </Field>
                                <Field label="Remarks" required error={stepErrors.newGlowRemarks}>
                                    <textarea className="af-textarea" name="newGlowRemarks" value={formData.newGlowRemarks} onChange={handleChange} rows={3} />
                                </Field>
                            </div>
                        </div>
                    </details>
                ) : null}

                {formData.requestAnyOtherAsset ? (
                    <details className="af-panel">
                        <summary className="af-panel-summary">Any Other Asset</summary>
                        <div className="af-panel-body">
                            <Field label="Remarks">
                                <textarea className="af-textarea" name="otherAssetRemarks" value={formData.otherAssetRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                            </Field>
                        </div>
                    </details>
                ) : null}
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="af-step">
            <Divider title="Final Remarks & Submit" />

            <div className="af-review">
                <div className="af-review-card">
                    <div className="af-review-title">Employee Snapshot</div>
                    <div className="af-review-grid">
                        <div><span>Employee Code</span><strong>{formData.employeeCode || '-'}</strong></div>
                        <div><span>Full Name</span><strong>{formData.fullName || '-'}</strong></div>
                        <div><span>Branch</span><strong>{formData.branch?.branchName || '-'}</strong></div>
                        <div><span>Department</span><strong>{formData.department?.departmentName || '-'}</strong></div>
                        <div><span>Scope</span><strong>{formData.scopeOfWork || '-'}</strong></div>
                        <div><span>Sub-Branch</span><strong>{formData.subBranch?.branchName || '-'}</strong></div>
                    </div>
                    <button type="button" className="af-btn af-btn-ghost" onClick={() => goToStep(0)}>Edit employee</button>
                </div>

                <div className="af-review-card">
                    <div className="af-review-title">Requested Services</div>
                    {selectedRequests.length === 0 ? (
                        <div className="af-muted">No requests selected.</div>
                    ) : (
                        <ul className="af-review-list">
                            {selectedRequests.map(r => (
                                <li key={r.key}>{r.label}</li>
                            ))}
                        </ul>
                    )}
                    <button type="button" className="af-btn af-btn-ghost" onClick={() => goToStep(1)}>Edit requests</button>
                </div>
            </div>

            <div className="af-grid">
                <Field label="Remarks/Reason" required error={stepErrors.remarksReason}>
                    <textarea className="af-textarea" name="remarksReason" value={formData.remarksReason} onChange={handleChange} rows={3} />
                </Field>
                <Field label="Send To RO" required error={stepErrors.sendToRo}>
                    <input className="af-input" type="text" name="sendToRo" value={formData.sendToRo} onChange={handleChange} />
                </Field>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        if (stepIndex === 0) return renderEmployeeStep();
        if (stepIndex === 1) return renderRequestsStep();
        if (stepIndex === 2) return renderDetailsStep();
        return renderReviewStep();
    };

    return (
        <div className="application-form-container">
            <div className="af-wrapper" ref={topRef}>
                <div className="af-header">
                    <div>
                        <div className="af-title">Application Form</div>
                        <div className="af-subtitle">Complete the steps and submit to IT/HR workflow.</div>
                    </div>
                    <div className="af-header-actions">
                        {draftInfo.savedAt ? (
                            <div className="af-draft">Draft: <strong>{draftInfo.status}</strong></div>
                        ) : (
                            <div className="af-draft">Draft: <strong>not saved yet</strong></div>
                        )}
                        <button
                            type="button"
                            className="af-btn af-btn-ghost"
                            onClick={() => {
                                try {
                                    localStorage.removeItem(getDraftStorageKey(userEmail));
                                    setDraftInfo({ status: 'cleared', savedAt: null });
                                } catch {
                                    // ignore
                                }
                            }}
                        >
                            Clear draft
                        </button>
                        {userRole === 'HR' && onClose ? (
                            <button type="button" className="af-btn af-btn-secondary" onClick={onClose}>Close</button>
                        ) : null}
                    </div>
                </div>

                <ol className="af-stepper" aria-label="Form progress">
                    {steps.map((s, i) => (
                        <li key={s.id} className={`af-stepper-item ${i === stepIndex ? 'is-active' : ''} ${i < stepIndex ? 'is-done' : ''}`}>
                            <button type="button" className="af-stepper-btn" onClick={() => goToStep(i)}>
                                <span className="af-stepper-dot" aria-hidden="true" />
                                <span className="af-stepper-title">{s.title}</span>
                            </button>
                        </li>
                    ))}
                </ol>

                {message.text ? (
                    <div className={`af-callout ${message.type === 'success' ? 'af-callout-success' : message.type === 'error' ? 'af-callout-error' : ''}`}>
                        {message.text}
                    </div>
                ) : null}

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        // Avoid accidental submit/jump when pressing Enter in inputs.
                        if (e.key !== 'Enter') return;
                        const tag = (e.target?.tagName || '').toUpperCase();
                        if (tag === 'TEXTAREA') return;
                        if (stepIndex < steps.length - 1) {
                            e.preventDefault();
                        }
                    }}
                    className="af-card"
                >
                    {renderCurrentStep()}

                    <div className="af-actions">
                        <button type="button" className="af-btn af-btn-secondary" onClick={goBack} disabled={stepIndex === 0 || isLoading}>
                            Back
                        </button>

                        <div className="af-spacer" />

                        <button type="button" className="af-btn af-btn-ghost" onClick={handleReset} disabled={isLoading}>
                            Reset
                        </button>

                        {onClose ? (
                            <button type="button" className="af-btn af-btn-ghost" onClick={onClose} disabled={isLoading}>
                                Exit
                            </button>
                        ) : null}

                        {stepIndex < steps.length - 1 ? (
                            <button type="button" className="af-btn af-btn-primary" onClick={goNext} disabled={isLoading}>
                                Next
                            </button>
                        ) : (
                            <button type="submit" className="af-btn af-btn-primary" disabled={isLoading}>
                                {isLoading ? 'Submitting…' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;
