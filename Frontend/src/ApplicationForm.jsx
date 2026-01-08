import React, { useState, useEffect } from 'react';
import './styles/applicationForm.css';

function ApplicationForm({ userEmail, userRole, onClose }) {
    const [masterData, setMasterData] = useState({
        branches: [],
        departments: [],
        reportingOfficers: [],
        companyCodes: [],
        costCenters: []
    });

    const [formData, setFormData] = useState({
        employeeCode: '',
        fullName: '',
        branch: null,
        department: null,
        designation: '',
        reportingOfficer: null,
        employeeType: 'Permanent',
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
    });

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

        try {
            const response = await fetch('http://localhost:8080/api/application-form/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': userEmail
                },
                body: JSON.stringify(formData)
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
                    department: data.departmentId ? masterData.departments.find(d => d.id === data.departmentId) : prev.department
                }));
            }
        } catch (err) {
            console.error('Failed to fetch employee details:', err);
        }
    };

    const handleReset = () => {
        setFormData({
            employeeCode: '',
            fullName: '',
            branch: null,
            department: null,
            designation: '',
            reportingOfficer: null,
            employeeType: 'Permanent',
            contactNo: '',
            requestedBy: '',
            requestEmailId: false,
            requestDomainAccount: false,
            requestBluetoothAccessCard: false,
            requestSharedFolder: false,
            requestInternetAccess: false,
            requestNexas: false,
            requestVpnAccess: false,
            requestHardDiskPenDrive: false,
            requestNewGlow: false,
            requestInternalApplication: false,
            requestUsbAccess: false,
            requestAnyOtherAsset: false,
        });
        setMessage({ type: '', text: '' });
    };

    return (
        <div className="application-form-container">
            <div className="form-wrapper">
            <div className="form-header">
                <h2>APPLICATION FORM</h2>
                {userRole === 'HR' && (
                    <button onClick={onClose} className="close-btn">×</button>
                )}
            </div>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="app-form">
                {/* Employee Information Section */}
                <div className="form-section">
                    <h3>Employee Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Employee Code <span className="required">*</span></label>
                            <input
                                type="text"
                                name="employeeCode"
                                value={formData.employeeCode}
                                onChange={handleChange}
                                onBlur={(e) => fetchEmployeeDetails(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Full Name <span className="required">*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Branch <span className="required">*</span></label>
                            <select
                                value={formData.branch?.id || ''}
                                onChange={(e) => {
                                    const branch = masterData.branches.find(b => b.id === parseInt(e.target.value));
                                    handleSelectChange('branch', branch);
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
                        </div>

                        <div className="form-group">
                            <label>Department <span className="required">*</span></label>
                            <select
                                value={formData.department?.id || ''}
                                onChange={(e) => {
                                    const dept = masterData.departments.find(d => d.id === parseInt(e.target.value));
                                    handleSelectChange('department', dept);
                                }}
                                required
                            >
                                <option value="">Select</option>
                                {masterData.departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Designation <span className="required">*</span></label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Reporting Officer <span className="required">*</span></label>
                            <select
                                value={formData.reportingOfficer?.id || ''}
                                onChange={(e) => {
                                    const officer = masterData.reportingOfficers.find(o => o.id === parseInt(e.target.value));
                                    handleSelectChange('reportingOfficer', officer);
                                }}
                                required
                            >
                                <option value="">Select</option>
                                {masterData.reportingOfficers.map(officer => (
                                    <option key={officer.id} value={officer.id}>
                                        {officer.officerName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Employee Type <span className="required">*</span></label>
                            <select name="employeeType" value={formData.employeeType} onChange={handleChange} required>
                                <option value="Permanent">Permanent</option>
                                <option value="Probation">Probation</option>
                                <option value="New">New</option>
                                <option value="Change">Change</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Contact No</label>
                            <input
                                type="tel"
                                name="contactNo"
                                value={formData.contactNo}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Requested By <span className="required">*</span></label>
                            <input
                                type="text"
                                name="requestedBy"
                                value={formData.requestedBy}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Request For Section */}
                <div className="form-section">
                    <h3>Request For</h3>
                    <div className="checkbox-grid">
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestEmailId" checked={formData.requestEmailId} onChange={handleChange} />
                            <span className="label-text">Email ID</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestDomainAccount" checked={formData.requestDomainAccount} onChange={handleChange} />
                            <span className="label-text">Domain Account</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestBluetoothAccessCard" checked={formData.requestBluetoothAccessCard} onChange={handleChange} />
                            <span className="label-text">Biometric / Access Card</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestSharedFolder" checked={formData.requestSharedFolder} onChange={handleChange} />
                            <span className="label-text">Shared Folder</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestInternetAccess" checked={formData.requestInternetAccess} onChange={handleChange} />
                            <span className="label-text">Internet Access / FTP Access</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestNewins" checked={formData.requestNewins} onChange={handleChange} />
                            <span className="label-text">NEWINS</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestNexas" checked={formData.requestNexas} onChange={handleChange} />
                            <span className="label-text">NExAS</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestGsnet" checked={formData.requestGsnet} onChange={handleChange} />
                            <span className="label-text">GS-NET</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestInternalApplication" checked={formData.requestInternalApplication} onChange={handleChange} />
                            <span className="label-text">Internal Application</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestUsbAccess" checked={formData.requestUsbAccess} onChange={handleChange} />
                            <span className="label-text">USB Access</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestVpnAccess" checked={formData.requestVpnAccess} onChange={handleChange} />
                            <span className="label-text">VPN Access</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestHardDiskPenDrive" checked={formData.requestHardDiskPenDrive} onChange={handleChange} />
                            <span className="label-text">HardDisk / PenDrive</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestNewGlow" checked={formData.requestNewGlow} onChange={handleChange} />
                            <span className="label-text">NEx-GLOW</span>
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" name="requestAnyOtherAsset" checked={formData.requestAnyOtherAsset} onChange={handleChange} />
                            <span className="label-text">Any Other Asset</span>
                        </label>
                    </div>
                </div>

                {/* Email ID Section */}
                {formData.requestEmailId && (
                    <div className="form-section">
                        <h3>Email ID</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Email Domain <span className="required">*</span></label>
                                <select name="emailDomain" value={formData.emailDomain} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Domain1">Domain 1</option>
                                    <option value="Domain2">Domain 2</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Employee Type <span className="required">*</span></label>
                                <select name="employeeType2" value={formData.employeeType2} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="Type1">Type 1</option>
                                    <option value="Type2">Type 2</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Requested E-Mail Id</label>
                                <input type="email" name="requestedEmailId" value={formData.requestedEmailId} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="companyProvidedMobile" checked={formData.companyProvidedMobile} onChange={handleChange} />
                                    Company Provided Mobile
                                </label>
                                <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="Mobile Number" />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="companyProvidedSim" checked={formData.companyProvidedSim} onChange={handleChange} />
                                    Company Provided SIM Card
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="mobileAccessIntune" checked={formData.mobileAccessIntune} onChange={handleChange} />
                                    Mobile Access (Intune)
                                </label>
                                <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} placeholder="Mobile No." />
                            </div>

                            <div className="form-group">
                                <label>IMEI No 1</label>
                                <input type="text" name="imei1" value={formData.imei1} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>IMEI No 2</label>
                                <input type="text" name="imei2" value={formData.imei2} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>IMEI No 3</label>
                                <input type="text" name="imei3" value={formData.imei3} onChange={handleChange} />
                            </div>

                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="emailRemarks" value={formData.emailRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Domain Account (only when requested) */}
                {formData.requestDomainAccount && (
                    <div className="form-section">
                        <h3>Domain Account</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="domainRemarks" value={formData.domainRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shared Folder (only when requested) */}
                {formData.requestSharedFolder && (
                    <div className="form-section">
                        <h3>Shared Folder Access</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="sharedFolderRemarks" value={formData.sharedFolderRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Internet Access / FTP (only when requested) */}
                {formData.requestInternetAccess && (
                    <div className="form-section">
                        <h3>Internet / FTP Access</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Request Type</label>
                                <select name="requestType" value={formData.requestType} onChange={handleChange}>
                                    <option value="Privilege Access">Privilege Access</option>
                                    <option value="Normal Access">Normal Access</option>
                                    <option value="Limited Access">Limited Access</option>
                                    <option value="No Internet Access">No Internet Access</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="internetRemarks" value={formData.internetRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* NExAS Section */}
                {formData.requestNexas && (
                    <div className="form-section">
                        <h3>NExAS</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Company Code <span className="required">*</span></label>
                                <select
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
                            </div>

                            <div className="form-group">
                                <label>Cost Center Name <span className="required">*</span></label>
                                <select
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
                            </div>

                            <div className="form-group">
                                <label>Cost Center Code</label>
                                <input type="text" name="costCenterCode" value={formData.costCenterCode} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Operation Range</label>
                                <input type="text" name="operationRange" value={formData.operationRange} onChange={handleChange} />
                            </div>

                            <div className="form-group full-width">
                                <h4>Request Type (Please select first):</h4>
                                <div className="checkbox-grid">
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="hoAccountingUser" checked={formData.hoAccountingUser} onChange={handleChange} />
                                        HO Accounting User
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="branchAccountingUser" checked={formData.branchAccountingUser} onChange={handleChange} />
                                        Branch Accounting User
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="itUser" checked={formData.itUser} onChange={handleChange} />
                                        IT User
                                    </label>
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="reportDisplayOnly" checked={formData.reportDisplayOnly} onChange={handleChange} />
                                        Report display only User
                                    </label>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <div className="optional-menu-box">
                                    <h4>Optional menu:</h4>
                                    <div className="checkbox-grid">
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="paymentProposal" checked={formData.paymentProposal} onChange={handleChange} />
                                            Payment Proposal
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="voidCheque" checked={formData.voidCheque} onChange={handleChange} />
                                            Void Cheque
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="exchangeRateMaintenance" checked={formData.exchangeRateMaintenance} onChange={handleChange} />
                                            Exchange Rate Maintenance
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="issueChecque" checked={formData.issueChecque} onChange={handleChange} />
                                            Issue Cheque
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="offsetAccount" checked={formData.offsetAccount} onChange={handleChange} />
                                            Offset Account
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="paymentApproval" checked={formData.paymentApproval} onChange={handleChange} />
                                            Payment Approval
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="openCloseSchedule" checked={formData.openCloseSchedule} onChange={handleChange} />
                                            Open/Close Schedule
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="taxReport" checked={formData.taxReport} onChange={handleChange} />
                                            Tax Report
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="addDeleteMasterMaintenance" checked={formData.addDeleteMasterMaintenance} onChange={handleChange} />
                                            Add/Delete master Maintenance
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* NExAS Payment operations (compact row above remarks) */}
                            <div className="form-group full-width">
                                <div className="nexas-ops">
                                    <label className="checkbox-label small">
                                        <input type="checkbox" name="paymentOperationBranch" checked={formData.paymentOperationBranch} onChange={handleChange} />
                                        <span className="label-text">Payment operation of branch</span>
                                    </label>
                                    <label className="checkbox-label small">
                                        <input type="checkbox" name="batchInput" checked={formData.batchInput} onChange={handleChange} />
                                        <span className="label-text">Batch Input</span>
                                    </label>
                                    <label className="checkbox-label small">
                                        <input type="checkbox" name="sepaIbacsDataDownload" checked={formData.sepaIbacsDataDownload} onChange={handleChange} />
                                        <span className="label-text">SEPA-IBACS data Download</span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Remarks</label>
                                    <textarea name="paymentRemarks" value={formData.paymentRemarks} onChange={handleChange} rows="2"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* NEWINS Section */}
                {formData.requestNewins && (
                    <div className="form-section">
                        <h3>NEWINS</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Requested Branch Code</label>
                                <input type="text" name="requestedBranchCode" value={formData.requestedBranchCode} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Requested NEWINS ID</label>
                                <input type="text" name="requestedNewinsId" value={formData.requestedNewinsId} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Operator Code</label>
                                <input type="text" name="operatorCode" value={formData.operatorCode} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Request Type</label>
                                <select name="newinsRequest" value={formData.newinsRequest} onChange={handleChange}>
                                    <option value="New">New</option>
                                    <option value="Change">Change</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* GS-NET Section */}
                {formData.requestGsnet && (
                    <div className="form-section">
                        <h3>GS-NET</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Requested GS/NET Branch Code</label>
                                <textarea name="requestedGsnetBranch" value={formData.requestedGsnetBranch} onChange={handleChange} rows="3"></textarea>
                            </div>

                            <div className="form-group">
                                <label>Requested Division Name <span className="required">*</span></label>
                                <select name="requestedDivisionName" value={formData.requestedDivisionName} onChange={handleChange}>
                                    <option value="BOTH (OCN IMPORT & EXPORT)">BOTH (OCN IMPORT & EXPORT)</option>
                                    <option value="OCN EXPORT">OCN EXPORT</option>
                                    <option value="OCN IMPORT">OCN IMPORT</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Requested Primary Division</label>
                                <select name="requestedPrimaryDivision" value={formData.requestedPrimaryDivision} onChange={handleChange}>
                                    <option value="N/A">N/A</option>
                                    <option value="OCN EXPORT">OCN EXPORT</option>
                                    <option value="OCN IMPORT">OCN IMPORT</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Requested User Role <span className="required">*</span></label>
                                <select name="requestedUserRole" value={formData.requestedUserRole} onChange={handleChange}>
                                    <option value="USER">USER</option>
                                    <option value="MANAGER">MANAGER</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="gsnetRemarks" value={formData.gsnetRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Biometric / Access Card Section */}
                {formData.requestBluetoothAccessCard && (
                    <div className="form-section">
                        <h3>Biometric / Access Card</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="biometricRemarks" value={formData.biometricRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Internal Application Section */}
                {formData.requestInternalApplication && (
                    <div className="form-section">
                        <h3>Internal Application</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Application Name</label>
                                <input type="text" name="internalApplication" value={formData.internalApplication} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="internalAppRemarks" value={formData.internalAppRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* USB Access Section */}
                {formData.requestUsbAccess && (
                    <div className="form-section">
                        <h3>USB Access</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Access For</label>
                                <input type="text" name="usbAccessFor" value={formData.usbAccessFor} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Device Details</label>
                                <input type="text" name="usbDetails" value={formData.usbDetails} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="usbRemarks" value={formData.usbRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* VPN Access Section */}
                {formData.requestVpnAccess && (
                    <div className="form-section">
                        <h3>VPN Access</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Domain ID</label>
                                <input type="text" name="domainId" value={formData.domainId} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email ID</label>
                                <input type="email" name="emailId" value={formData.emailId} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>MPLS / Non MPLS</label>
                                <input type="text" name="mplsNonMpls" value={formData.mplsNonMpls} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="vpnRemarks" value={formData.vpnRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* HardDisk / PenDrive Section */}
                {formData.requestHardDiskPenDrive && (
                    <div className="form-section">
                        <h3>HardDisk / PenDrive</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="hardDiskRemarks" value={formData.hardDiskRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* NEx-GLOW Section */}
                {formData.requestNewGlow && (
                    <div className="form-section">
                        <h3>NEx-GLOW</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="newGlowRemarks" value={formData.newGlowRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* Any Other Asset Section */}
                {formData.requestAnyOtherAsset && (
                    <div className="form-section">
                        <h3>Any Other Asset</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Remarks</label>
                                <textarea name="otherAssetRemarks" value={formData.otherAssetRemarks} onChange={handleChange} rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                )}

                

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" onClick={handleReset} className="btn-reset">RESET</button>
                    <button type="submit" disabled={isLoading} className="btn-submit">
                        {isLoading ? 'SENDING...' : 'SEND'}
                    </button>
                    {userRole === 'HR' && (
                        <button type="button" onClick={onClose} className="btn-back">BACK</button>
                    )}
                </div>
            </form>
            </div>
        </div>
    );
}

export default ApplicationForm;
