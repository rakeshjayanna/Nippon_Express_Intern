package backend.login.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(name = "employee_code", unique = true)
    private String employeeCode;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "designation")
    private String designation;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private MasterBranch branch;

    @ManyToOne
    @JoinColumn(name = "sub_branch_id")
    private MasterBranch subBranch;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private MasterDepartment department;

    @ManyToOne
    @JoinColumn(name = "reporting_officer_id")
    private MasterReportingOfficer reportingOfficer;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public MasterBranch getBranch() {
        return branch;
    }

    public void setBranch(MasterBranch branch) {
        this.branch = branch;
    }

    public MasterBranch getSubBranch() {
        return subBranch;
    }

    public void setSubBranch(MasterBranch subBranch) {
        this.subBranch = subBranch;
    }

    public MasterDepartment getDepartment() {
        return department;
    }

    public void setDepartment(MasterDepartment department) {
        this.department = department;
    }

    public MasterReportingOfficer getReportingOfficer() {
        return reportingOfficer;
    }

    public void setReportingOfficer(MasterReportingOfficer reportingOfficer) {
        this.reportingOfficer = reportingOfficer;
    }
}
