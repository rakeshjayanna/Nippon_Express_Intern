import React, { useState, useEffect } from 'react';
import './styles/applicationForm.css';

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

    useEffect(() => {
        fetchMasterData();
    }, []);

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

    const fetchEmployeeDetails = async (code) => {
        const empCode = (code || '').trim();
        if (!empCode) return;
        try {
            const res = await fetch(`http://localhost:8080/api/application-form/employee/${encodeURIComponent(empCode)}/latest`, {
                headers: { 'X-User-Email': userEmail }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({
                    ...prev,
                    fullName: data.fullName || prev.fullName,
                    designation: data.designation || prev.designation,
                    branch: data.branchId ? masterData.branches.find(b => b.id === data.branchId) : prev.branch,
                    department: data.departmentId ? masterData.departments.find(d => d.id === data.departmentId) : prev.department,
                    reportingOfficer: data.reportingOfficerId ? masterData.reportingOfficers.find(o => o.id === data.reportingOfficerId) : prev.reportingOfficer
                }));
            }
        } catch (err) {
            console.error('Failed to fetch employee details:', err);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setMessage({ type: '', text: '' });
    };

    const PaperCheckbox = ({ name, label }) => (
        <label className="paper-check">
            <input type="checkbox" name={name} checked={!!formData[name]} onChange={handleChange} />
            <span>{label}</span>
        </label>
    );

    return (
        <div className="application-form-container">
            <div className="form-wrapper">
                <div className="paper-sheet">
                    <div className="paper-titlebar">
                        <div className="paper-title">APPLICATION FORM</div>
                        {userRole === 'HR' && (
                            <button onClick={onClose} className="paper-close-btn" type="button">×</button>
                        )}
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="paper-form">
                        <table className="paper-table" aria-label="Employee information">
                            <tbody>
                                <tr className="paper-section-row">
                                    <td className="paper-section" colSpan={4}>Employee Information</td>
                                </tr>
                                <tr>
                                    <td className="paper-label">Employee Code<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="text"
                                            name="employeeCode"
                                            value={formData.employeeCode}
                                            onChange={handleChange}
                                            onBlur={(e) => fetchEmployeeDetails(e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td className="paper-label">Full Name<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="paper-label">Branch<span className="required">*</span></td>
                                        <td className="paper-field">
                                            <input
                                                className="paper-input"
                                                type="text"
                                                value={formData.branch?.branchName || ''}
                                                placeholder="Auto-fetched branch"
                                                readOnly
                                            />
                                        </td>
                                    <td className="paper-label">Department<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="text"
                                            value={formData.department?.departmentName || ''}
                                            placeholder="Auto-fetched department"
                                            readOnly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="paper-label">Designation<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                    <td className="paper-label">Reporting Officer<span className="required">*</span></td>
                                        <td className="paper-field">
                                            <input
                                                className="paper-input"
                                                type="text"
                                                value={formData.reportingOfficer?.officerName || ''}
                                                placeholder="Auto-fetched reporting officer"
                                                readOnly
                                            />
                                        </td>
                                </tr>

                                <tr>
                                    <td className="paper-label">Scope of Work<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <select
                                            className="paper-select"
                                            name="scopeOfWork"
                                            value={formData.scopeOfWork}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="Export">Export</option>
                                            <option value="Import">Import</option>
                                            <option value="Both">Both</option>
                                        </select>
                                    </td>
                                    <td className="paper-label">Sub-Branch<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <select
                                            className="paper-select"
                                            value={formData.subBranch?.id || ''}
                                            onChange={(e) => {
                                                const branch = masterData.branches.find(b => b.id === parseInt(e.target.value));
                                                handleSelectChange('subBranch', branch);
                                            }}
                                            required
                                        >
                                            <option value="">Select</option>
                                            {masterData.branches.map(branch => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.branchName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="paper-label">Employee Type<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <div className="paper-radio-row">
                                            {['Permanent', 'Probation'].map(opt => (
                                                <label key={opt} className="paper-radio">
                                                    <input
                                                        type="radio"
                                                        name="employeeType"
                                                        value={opt}
                                                        checked={formData.employeeType === opt}
                                                        onChange={handleChange}
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="paper-label">Request<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <div className="paper-radio-row">
                                            {['New', 'Change'].map(opt => (
                                                <label key={opt} className="paper-radio">
                                                    <input
                                                        type="radio"
                                                        name="requestAction"
                                                        value={opt}
                                                        checked={formData.requestAction === opt}
                                                        onChange={handleChange}
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="paper-label">Contact No</td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="tel"
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td className="paper-label">Requested By<span className="required">*</span></td>
                                    <td className="paper-field">
                                        <input
                                            className="paper-input"
                                            type="text"
                                            name="requestedBy"
                                            value={formData.requestedBy}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="paper-table" aria-label="Request for">
                            <tbody>
                                <tr className="paper-section-row">
                                    <td className="paper-section" colSpan={4}>Request For</td>
                                </tr>
                                <tr>
                                    <td className="paper-field" colSpan={4}>
                                        <div className="paper-check-grid">
                                            <PaperCheckbox name="requestEmailId" label="Email ID" />
                                            <PaperCheckbox name="requestDomainAccount" label="Domain Account" />
                                            <PaperCheckbox name="requestBluetoothAccessCard" label="Biometric / Access Card" />
                                            <PaperCheckbox name="requestSharedFolder" label="Shared Folder" />
                                            <PaperCheckbox name="requestInternetAccess" label="Internet Access / FTP Access" />
                                            <PaperCheckbox name="requestNewins" label="NEWINS" />
                                            <PaperCheckbox name="requestNexas" label="NExAS" />
                                            <PaperCheckbox name="requestGsnet" label="GS-NET" />
                                            <PaperCheckbox name="requestInternalApplication" label="Internal Application" />
                                            <PaperCheckbox name="requestUsbAccess" label="USB Access" />
                                            <PaperCheckbox name="requestVpnAccess" label="VPN Access" />
                                            <PaperCheckbox name="requestHardDiskPenDrive" label="HardDisk / PenDrive" />
                                            <PaperCheckbox name="requestNewGlow" label="NEx-GLOW" />
                                            <PaperCheckbox name="requestAnyOtherAsset" label="Any Other Asset" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {formData.requestEmailId && (
                            <table className="paper-table" aria-label="Email ID">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={6}>Email ID</td>
                                        <td className="paper-label">Email Domain</td>
                                        <td className="paper-field" colSpan={2}>
                                            <select className="paper-select" name="emailDomain" value={formData.emailDomain} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="Domain1">Domain 1</option>
                                                <option value="Domain2">Domain 2</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Employee Type</td>
                                        <td className="paper-field">
                                            <select className="paper-select" name="employeeType2" value={formData.employeeType2} onChange={handleChange}>
                                                <option value="">Select</option>
                                                <option value="Type1">Type 1</option>
                                                <option value="Type2">Type 2</option>
                                            </select>
                                        </td>
                                        <td className="paper-field">
                                            <div className="paper-inline">
                                                <span className="paper-inline-label">Requested E-Mail Id</span>
                                                <input className="paper-input" type="email" name="requestedEmailId" value={formData.requestedEmailId} onChange={handleChange} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Company Provided Mobile</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-inline">
                                                <label className="paper-check">
                                                    <input type="checkbox" name="companyProvidedMobile" checked={formData.companyProvidedMobile} onChange={handleChange} />
                                                    <span>Yes</span>
                                                </label>
                                                <input className="paper-input" type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Make & Model / Number" />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Company Provided SIM Card</td>
                                        <td className="paper-field" colSpan={2}>
                                            <label className="paper-check">
                                                <input type="checkbox" name="companyProvidedSim" checked={formData.companyProvidedSim} onChange={handleChange} />
                                                <span>Yes</span>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Mobile Access (Intune)</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-inline">
                                                <label className="paper-check">
                                                    <input type="checkbox" name="mobileAccessIntune" checked={formData.mobileAccessIntune} onChange={handleChange} />
                                                    <span>Yes</span>
                                                </label>
                                                <input className="paper-input" type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No." />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">IMEI No(s) / Remarks</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-3col">
                                                <input className="paper-input" type="text" name="imei1" value={formData.imei1} onChange={handleChange} placeholder="IMEI No 1" />
                                                <input className="paper-input" type="text" name="imei2" value={formData.imei2} onChange={handleChange} placeholder="IMEI No 2" />
                                                <input className="paper-input" type="text" name="imei3" value={formData.imei3} onChange={handleChange} placeholder="IMEI No 3" />
                                            </div>
                                            <textarea className="paper-textarea" name="emailRemarks" value={formData.emailRemarks} onChange={handleChange} rows={2} placeholder="Remarks" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestDomainAccount && (
                            <table className="paper-table" aria-label="Domain Account">
                                <tbody>
                                    <tr>
                                        <td className="paper-side">Domain Account</td>
                                        <td className="paper-field" colSpan={3}>
                                            <textarea className="paper-textarea" name="domainRemarks" value={formData.domainRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestBluetoothAccessCard && (
                            <table className="paper-table" aria-label="Biometric / Access Card">
                                <tbody>
                                    <tr>
                                        <td className="paper-side">Biometric / Access Card</td>
                                        <td className="paper-field" colSpan={3}>
                                            <textarea className="paper-textarea" name="biometricRemarks" value={formData.biometricRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestSharedFolder && (
                            <table className="paper-table" aria-label="Shared Folder">
                                <tbody>
                                    <tr>
                                        <td className="paper-side">Shared Folder Access</td>
                                        <td className="paper-field" colSpan={3}>
                                            <textarea className="paper-textarea" name="sharedFolderRemarks" value={formData.sharedFolderRemarks} onChange={handleChange} rows={3} placeholder="Remarks" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestInternetAccess && (
                            <table className="paper-table" aria-label="Internet / FTP Access">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={2}>Internet Access / FTP Access</td>
                                        <td className="paper-label">Request Type</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-radio-row">
                                                {['Privilege Access', 'Normal Access', 'Limited Access', 'No Internet Access'].map(opt => (
                                                    <label key={opt} className="paper-radio">
                                                        <input
                                                            type="radio"
                                                            name="requestType"
                                                            value={opt}
                                                            checked={formData.requestType === opt}
                                                            onChange={handleChange}
                                                        />
                                                        <span>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="internetRemarks" value={formData.internetRemarks} onChange={handleChange} rows={3} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestNewins && (
                            <table className="paper-table" aria-label="NEWINS">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={3}>NEWINS</td>
                                        <td className="paper-label">*Requested Branch Code</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                                <select
                                                    className="paper-select"
                                                    style={{flex: 1}}
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
                                                <input className="paper-input" style={{width: '180px'}} type="text" value={''} readOnly />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">*Requested NEWIN's ID / Operator Code</td>
                                        <td className="paper-field" colSpan={2}>
                                            <input className="paper-input" type="text" name="requestedNewinsId" value={formData.requestedNewinsId} onChange={handleChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">*Request</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-radio-row">
                                                {['New', 'Change'].map(opt => (
                                                    <label key={opt} className="paper-radio">
                                                        <input type="radio" name="newinsRequest" value={opt} checked={formData.newinsRequest === opt} onChange={handleChange} />
                                                        <span>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestNexas && (
                            <table className="paper-table" aria-label="NExAS">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={7}>NExAS</td>
                                        <td className="paper-label">Company Code</td>
                                        <td className="paper-field" colSpan={2}>
                                            <select
                                                className="paper-select"
                                                value={formData.companyCode?.id || ''}
                                                onChange={(e) => {
                                                    const code = masterData.companyCodes.find(c => c.id === parseInt(e.target.value));
                                                    handleSelectChange('companyCode', code);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {masterData.companyCodes.map(code => (
                                                    <option key={code.id} value={code.id}>
                                                        {code.companyName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Cost Center Name</td>
                                        <td className="paper-field" colSpan={2}>
                                            <select
                                                className="paper-select"
                                                value={formData.costCenter?.id || ''}
                                                onChange={(e) => {
                                                    const center = masterData.costCenters.find(c => c.id === parseInt(e.target.value));
                                                    handleSelectChange('costCenter', center);
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {masterData.costCenters.map(center => (
                                                    <option key={center.id} value={center.id}>
                                                        {center.costCenterName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Cost Center Code</td>
                                        <td className="paper-field"><input className="paper-input" type="text" name="costCenterCode" value={formData.costCenterCode} onChange={handleChange} /></td>
                                        <td className="paper-field">
                                            <div className="paper-inline">
                                                <span className="paper-inline-label">Operation range</span>
                                                <input className="paper-input" type="text" name="operationRange" value={formData.operationRange} onChange={handleChange} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Request Type (Select first)</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-check-grid">
                                                <label className="paper-check"><input type="checkbox" name="hoAccountingUser" checked={formData.hoAccountingUser} onChange={handleChange} /><span>HO Accounting User</span></label>
                                                <label className="paper-check"><input type="checkbox" name="branchAccountingUser" checked={formData.branchAccountingUser} onChange={handleChange} /><span>Branch Accounting User</span></label>
                                                <label className="paper-check"><input type="checkbox" name="itUser" checked={formData.itUser} onChange={handleChange} /><span>IT User</span></label>
                                                <label className="paper-check"><input type="checkbox" name="reportDisplayOnly" checked={formData.reportDisplayOnly} onChange={handleChange} /><span>Report display only User</span></label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Optional menu</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-check-grid paper-check-grid-3">
                                                <label className="paper-check"><input type="checkbox" name="paymentProposal" checked={formData.paymentProposal} onChange={handleChange} /><span>Payment Proposal</span></label>
                                                <label className="paper-check"><input type="checkbox" name="paymentApproval" checked={formData.paymentApproval} onChange={handleChange} /><span>Payment Approval</span></label>
                                                <label className="paper-check"><input type="checkbox" name="openCloseSchedule" checked={formData.openCloseSchedule} onChange={handleChange} /><span>Open/Close Schedule</span></label>
                                                <label className="paper-check"><input type="checkbox" name="voidCheque" checked={formData.voidCheque} onChange={handleChange} /><span>Void Cheque</span></label>
                                                <label className="paper-check"><input type="checkbox" name="issueChecque" checked={formData.issueChecque} onChange={handleChange} /><span>Issue Cheque</span></label>
                                                <label className="paper-check"><input type="checkbox" name="taxReport" checked={formData.taxReport} onChange={handleChange} /><span>Tax Report</span></label>
                                                <label className="paper-check"><input type="checkbox" name="exchangeRateMaintenance" checked={formData.exchangeRateMaintenance} onChange={handleChange} /><span>Exchange Rate Maintenance</span></label>
                                                <label className="paper-check"><input type="checkbox" name="offsetAccount" checked={formData.offsetAccount} onChange={handleChange} /><span>Offset Account</span></label>
                                                <label className="paper-check"><input type="checkbox" name="addDeleteMasterMaintenance" checked={formData.addDeleteMasterMaintenance} onChange={handleChange} /><span>Add/Delete master Maintenance</span></label>

                                                <label className="paper-check"><input type="checkbox" name="paymentOperationBranch" checked={formData.paymentOperationBranch} onChange={handleChange} /><span>Payment operation of branch</span></label>
                                                <label className="paper-check"><input type="checkbox" name="batchInput" checked={formData.batchInput} onChange={handleChange} /><span>Batch Input</span></label>
                                                <label className="paper-check"><input type="checkbox" name="sepaIbacsDataDownload" checked={formData.sepaIbacsDataDownload} onChange={handleChange} /><span>SEPA-IBACS data Download</span></label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="paymentRemarks" value={formData.paymentRemarks} onChange={handleChange} rows={2} placeholder="Remarks" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Note</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div style={{fontSize: '12px', lineHeight: '1.4', fontWeight: 700}}>
                                                <p>*If the user will use TV menu in NExAS, tell HO Admin to create employee master please.</p>
                                                <p>*If you want to be in charge of other Company or Branch or Region fill in "Operation Range" or "Display Range" please.</p>
                                                <p>*Please apply through H.O Accounting manager.</p>
                                                <p>*If you want to change your status, please submit your applications each user. (e.g. If you want to 3 create user and 5 delete user, please submit 8 user application for each user.)</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestGsnet && (
                            <table className="paper-table" aria-label="GS-NET">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={4}>GS-NET</td>
                                        <td className="paper-label">Requested GSNET Branch Code</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="requestedGsnetBranch" value={formData.requestedGsnetBranch} onChange={handleChange} rows={3} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Requested Division Name</td>
                                        <td className="paper-field">
                                            <select className="paper-select" name="requestedDivisionName" value={formData.requestedDivisionName} onChange={handleChange}>
                                                <option value="BOTH (OCN IMPORT & EXPORT)">BOTH (OCN IMPORT & EXPORT)</option>
                                                <option value="OCN EXPORT">OCN EXPORT</option>
                                                <option value="OCN IMPORT">OCN IMPORT</option>
                                            </select>
                                        </td>
                                        <td className="paper-field">
                                            <div className="paper-inline">
                                                <span className="paper-inline-label">Requested Primary Division</span>
                                                <select className="paper-select" name="requestedPrimaryDivision" value={formData.requestedPrimaryDivision} onChange={handleChange}>
                                                    <option value="N/A">N/A</option>
                                                    <option value="OCN EXPORT">OCN EXPORT</option>
                                                    <option value="OCN IMPORT">OCN IMPORT</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Requested User Role</td>
                                        <td className="paper-field" colSpan={2}>
                                            <div className="paper-radio-row">
                                                {['USER', 'MANAGER'].map(opt => (
                                                    <label key={opt} className="paper-radio">
                                                        <input type="radio" name="requestedUserRole" value={opt} checked={formData.requestedUserRole === opt} onChange={handleChange} />
                                                        <span>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="gsnetRemarks" value={formData.gsnetRemarks} onChange={handleChange} rows={3} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestInternalApplication && (
                            <table className="paper-table" aria-label="Internal Application">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={2}>Internal Application</td>
                                        <td className="paper-label">Application</td>
                                        <td className="paper-field" colSpan={2}>
                                            <input className="paper-input" type="text" name="internalApplication" value={formData.internalApplication} onChange={handleChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="internalAppRemarks" value={formData.internalAppRemarks} onChange={handleChange} rows={3} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestUsbAccess && (
                            <table className="paper-table" aria-label="USB Access">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={3}>USB Access</td>
                                        <td className="paper-label">Access For</td>
                                        <td className="paper-field" colSpan={2}><input className="paper-input" type="text" name="usbAccessFor" value={formData.usbAccessFor} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">USB Details</td>
                                        <td className="paper-field" colSpan={2}><input className="paper-input" type="text" name="usbDetails" value={formData.usbDetails} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks / Reason</td>
                                        <td className="paper-field" colSpan={2}><textarea className="paper-textarea" name="usbRemarks" value={formData.usbRemarks} onChange={handleChange} rows={3} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestVpnAccess && (
                            <table className="paper-table" aria-label="VPN Access">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={4}>VPN Access</td>
                                        <td className="paper-label">Domain ID</td>
                                        <td className="paper-field" colSpan={2}><input className="paper-input" type="text" name="domainId" value={formData.domainId} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Email ID</td>
                                        <td className="paper-field" colSpan={2}><input className="paper-input" type="email" name="emailId" value={formData.emailId} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">MPLS / NON MPLS</td>
                                        <td className="paper-field" colSpan={2}><input className="paper-input" type="text" name="mplsNonMpls" value={formData.mplsNonMpls} onChange={handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">Remarks</td>
                                        <td className="paper-field" colSpan={2}><textarea className="paper-textarea" name="vpnRemarks" value={formData.vpnRemarks} onChange={handleChange} rows={3} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestHardDiskPenDrive && (
                            <table className="paper-table" aria-label="HardDisk / PenDrive">
                                <tbody>
                                    <tr>
                                        <td className="paper-side">HardDisk / PenDrive</td>
                                        <td className="paper-field" colSpan={3}><textarea className="paper-textarea" name="hardDiskRemarks" value={formData.hardDiskRemarks} onChange={handleChange} rows={3} placeholder="Remarks" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestNewGlow && (
                            <table className="paper-table" aria-label="NEx-GLOW">
                                <tbody>
                                    <tr>
                                        <td className="paper-side" rowSpan={3}>NEx-GLOW</td>
                                        <td className="paper-label">*Project :</td>
                                        <td className="paper-field" colSpan={2}>
                                            <input className="paper-input" type="text" name="newGlowProject" value={formData.newGlowProject} onChange={handleChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">*Ware-House :</td>
                                        <td className="paper-field" colSpan={2}>
                                            <input className="paper-input" type="text" name="newGlowWarehouse" value={formData.newGlowWarehouse} onChange={handleChange} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="paper-label">*Remarks :</td>
                                        <td className="paper-field" colSpan={2}>
                                            <textarea className="paper-textarea" name="newGlowRemarks" value={formData.newGlowRemarks} onChange={handleChange} rows={2} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {formData.requestAnyOtherAsset && (
                            <table className="paper-table" aria-label="Any Other Asset">
                                <tbody>
                                    <tr>
                                        <td className="paper-side">Any Other Asset</td>
                                        <td className="paper-field" colSpan={3}><textarea className="paper-textarea" name="otherAssetRemarks" value={formData.otherAssetRemarks} onChange={handleChange} rows={3} placeholder="Remarks" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        <table className="paper-table" aria-label="Final remarks">
                            <tbody>
                               
                                <tr>
                                    <td className="paper-label">*Remarks/Reason</td>
                                    <td className="paper-field" colSpan={3}>
                                        <textarea
                                            className="paper-textarea"
                                            name="remarksReason"
                                            value={formData.remarksReason}
                                            onChange={handleChange}
                                            rows={2}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="paper-label">*Send To RO:</td>
                                    <td className="paper-field" colSpan={3}>
                                        <div className="paper-sendto">
                                            <span className="paper-radio-dot" aria-hidden="true" />
                                            <input
                                                className="paper-input"
                                                type="text"
                                                name="sendToRo"
                                                value={formData.sendToRo}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="paper-actions">
                            <button type="submit" disabled={isLoading} className="paper-btn">
                                {isLoading ? 'SENDING...' : 'SEND'}
                            </button>
                            <button type="button" onClick={handleReset} className="paper-btn">RESET</button>
                            <button type="button" className="paper-btn">HELP</button>
                            {onClose && (
                                <button type="button" onClick={onClose} className="paper-btn">BACK</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ApplicationForm;
