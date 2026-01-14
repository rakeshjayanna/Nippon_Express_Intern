-- MySQL schema for Nippon Express Intern project
-- Generated from JPA entities in Backend/src/main/java/backend/login/backend/model

-- If you already have the database, you can skip CREATE DATABASE.
CREATE DATABASE IF NOT EXISTS nippon_express CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nippon_express;

-- -----------------------
-- Login
-- -----------------------
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

-- -----------------------
-- Master data
-- -----------------------
CREATE TABLE IF NOT EXISTS master_branch (
  id BIGINT NOT NULL AUTO_INCREMENT,
  branch_code VARCHAR(255) NOT NULL,
  branch_name VARCHAR(255) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_master_branch_branch_code (branch_code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_department (
  id BIGINT NOT NULL AUTO_INCREMENT,
  department_code VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_master_department_department_code (department_code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_reporting_officer (
  id BIGINT NOT NULL AUTO_INCREMENT,
  officer_code VARCHAR(255) NOT NULL,
  officer_name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) DEFAULT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_master_reporting_officer_officer_code (officer_code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_company_code (
  id BIGINT NOT NULL AUTO_INCREMENT,
  company_code VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_master_company_code_company_code (company_code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS master_cost_center (
  id BIGINT NOT NULL AUTO_INCREMENT,
  cost_center_code VARCHAR(255) NOT NULL,
  cost_center_name VARCHAR(255) NOT NULL,
  active TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uk_master_cost_center_cost_center_code (cost_center_code)
) ENGINE=InnoDB;

-- -----------------------
-- Application Form
-- -----------------------
-- NOTE: Column names follow Spring/Hibernate default naming (camelCase -> snake_case)
-- and explicit JoinColumn names from the entity.
CREATE TABLE IF NOT EXISTS application_forms (
  id BIGINT NOT NULL AUTO_INCREMENT,

  employee_code VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,

  branch_id BIGINT DEFAULT NULL,
  designation VARCHAR(255) DEFAULT NULL,
  scope_of_work VARCHAR(255) DEFAULT NULL,
  reporting_officer_id BIGINT DEFAULT NULL,
  sub_branch_id BIGINT DEFAULT NULL,
  department_id BIGINT DEFAULT NULL,
  employee_type VARCHAR(255) DEFAULT NULL,

  request_action VARCHAR(255) DEFAULT NULL,
  contact_no VARCHAR(255) DEFAULT NULL,
  requested_by VARCHAR(255) DEFAULT NULL,

  request_email_id TINYINT(1) DEFAULT 0,
  request_domain_account TINYINT(1) DEFAULT 0,
  request_bluetooth_access_card TINYINT(1) DEFAULT 0,
  request_shared_folder TINYINT(1) DEFAULT 0,
  request_internet_access TINYINT(1) DEFAULT 0,
  request_newins TINYINT(1) DEFAULT 0,
  request_nexas TINYINT(1) DEFAULT 0,
  request_gsnet TINYINT(1) DEFAULT 0,
  request_vpn_access TINYINT(1) DEFAULT 0,
  request_hard_disk_pen_drive TINYINT(1) DEFAULT 0,
  request_new_glow TINYINT(1) DEFAULT 0,
  request_internal_application TINYINT(1) DEFAULT 0,
  request_usb_access TINYINT(1) DEFAULT 0,
  request_any_other_asset TINYINT(1) DEFAULT 0,

  -- Email section
  email_domain TEXT,
  employee_type2 VARCHAR(255) DEFAULT NULL,
  requested_email_id VARCHAR(255) DEFAULT NULL,
  company_provided_mobile TINYINT(1) DEFAULT NULL,
  mobile_number VARCHAR(255) DEFAULT NULL,
  company_provided_sim TINYINT(1) DEFAULT NULL,
  mobile_access_intune TINYINT(1) DEFAULT NULL,
  mobile_no VARCHAR(255) DEFAULT NULL,
  imei1 VARCHAR(255) DEFAULT NULL,
  imei2 VARCHAR(255) DEFAULT NULL,
  imei3 VARCHAR(255) DEFAULT NULL,
  email_remarks VARCHAR(255) DEFAULT NULL,

  -- Domain account / Access / Shared / Internet
  domain_remarks VARCHAR(255) DEFAULT NULL,
  biometric_remarks VARCHAR(255) DEFAULT NULL,
  shared_folder_remarks VARCHAR(255) DEFAULT NULL,
  request_type VARCHAR(255) DEFAULT NULL,
  internet_remarks VARCHAR(255) DEFAULT NULL,

  -- NEWINS
  requested_branch_code TEXT,
  requested_newins_id VARCHAR(255) DEFAULT NULL,
  operator_code VARCHAR(255) DEFAULT NULL,
  newins_request VARCHAR(255) DEFAULT NULL,

  -- NExAS
  company_code_id BIGINT DEFAULT NULL,
  cost_center_id BIGINT DEFAULT NULL,
  cost_center_code VARCHAR(255) DEFAULT NULL,
  operation_range VARCHAR(255) DEFAULT NULL,

  ho_accounting_user TINYINT(1) DEFAULT 0,
  branch_accounting_user TINYINT(1) DEFAULT 0,
  it_user TINYINT(1) DEFAULT 0,
  report_display_only TINYINT(1) DEFAULT 0,
  payment_proposal TINYINT(1) DEFAULT 0,
  void_cheque TINYINT(1) DEFAULT 0,
  exchange_rate_maintenance TINYINT(1) DEFAULT 0,
  issue_checque TINYINT(1) DEFAULT 0,
  offset_account TINYINT(1) DEFAULT 0,
  payment_approval TINYINT(1) DEFAULT 0,
  open_close_schedule TINYINT(1) DEFAULT 0,
  tax_report TINYINT(1) DEFAULT 0,
  add_delete_master_maintenance TINYINT(1) DEFAULT 0,

  -- GS-NET
  requested_gsnet_branch TEXT,
  requested_division_name VARCHAR(255) DEFAULT NULL,
  requested_primary_division VARCHAR(255) DEFAULT NULL,
  requested_user_role VARCHAR(255) DEFAULT NULL,
  gsnet_remarks VARCHAR(255) DEFAULT NULL,

  -- Payment ops
  payment_operation_branch TINYINT(1) DEFAULT 0,
  batch_input TINYINT(1) DEFAULT 0,
  sepa_ibacs_data_download TINYINT(1) DEFAULT 0,
  payment_remarks VARCHAR(255) DEFAULT NULL,

  -- NEx-GLOW / Internal app / USB / VPN / Assets
  new_glow_remarks VARCHAR(255) DEFAULT NULL,
  internal_application VARCHAR(255) DEFAULT NULL,
  internal_app_remarks VARCHAR(255) DEFAULT NULL,
  usb_access_for VARCHAR(255) DEFAULT NULL,
  usb_details VARCHAR(255) DEFAULT NULL,
  usb_remarks VARCHAR(255) DEFAULT NULL,
  domain_id VARCHAR(255) DEFAULT NULL,
  email_id VARCHAR(255) DEFAULT NULL,
  mpls_non_mpls VARCHAR(255) DEFAULT NULL,
  vpn_remarks VARCHAR(255) DEFAULT NULL,
  hard_disk_remarks VARCHAR(255) DEFAULT NULL,
  other_asset_remarks VARCHAR(255) DEFAULT NULL,

  -- General / Status
  general_remarks TEXT,
  remarks_reason TEXT,
  send_to_ro VARCHAR(255) DEFAULT NULL,

  status VARCHAR(50) DEFAULT 'PENDING',
  submitted_at DATETIME(6) NOT NULL,
  processed_at DATETIME(6) DEFAULT NULL,
  processed_by VARCHAR(255) DEFAULT NULL,
  processing_notes TEXT,

  PRIMARY KEY (id),

  KEY idx_application_forms_employee_code_submitted_at (employee_code, submitted_at),
  KEY idx_application_forms_status_submitted_at (status, submitted_at),

  KEY idx_application_forms_branch_id (branch_id),
  KEY idx_application_forms_sub_branch_id (sub_branch_id),
  KEY idx_application_forms_department_id (department_id),
  KEY idx_application_forms_reporting_officer_id (reporting_officer_id),
  KEY idx_application_forms_company_code_id (company_code_id),
  KEY idx_application_forms_cost_center_id (cost_center_id),

  CONSTRAINT fk_application_forms_branch
    FOREIGN KEY (branch_id) REFERENCES master_branch(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_application_forms_sub_branch
    FOREIGN KEY (sub_branch_id) REFERENCES master_branch(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_application_forms_department
    FOREIGN KEY (department_id) REFERENCES master_department(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_application_forms_reporting_officer
    FOREIGN KEY (reporting_officer_id) REFERENCES master_reporting_officer(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_application_forms_company_code
    FOREIGN KEY (company_code_id) REFERENCES master_company_code(id)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT fk_application_forms_cost_center
    FOREIGN KEY (cost_center_id) REFERENCES master_cost_center(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------
-- Application Form Submissions (separate table for submitted forms)
-- -----------------------
CREATE TABLE IF NOT EXISTS application_form_submissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  employee_code VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  submitted_at DATETIME(6) NOT NULL,
  processed_at DATETIME(6) DEFAULT NULL,
  processed_by VARCHAR(255) DEFAULT NULL,
  processing_notes TEXT,
  form_json LONGTEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_app_form_sub_emp_submitted_at (employee_code, submitted_at),
  KEY idx_app_form_sub_status_submitted_at (status, submitted_at)
) ENGINE=InnoDB;

-- -----------------------
-- Optional: minimal starter data (uncomment if you want)
-- -----------------------

-- -----------------------
-- Starter seed data (recommended for demo/testing)
-- Creates:
-- - 20+ rows in each master table
-- - 20 HR + 20 EMPLOYEE + 20 ADMIN users (+ 3 defaults)
-- - 20 application_forms (EMP001..EMP020) so employee-code autofetch works for every Employee Information field
-- -----------------------

-- Master Branches (1..20)
INSERT INTO master_branch (id, branch_code, branch_name, active) VALUES
  (1,'BR001','Mumbai Branch',1),(2,'BR002','Delhi Branch',1),(3,'BR003','Bangalore Branch',1),(4,'BR004','Chennai Branch',1),(5,'BR005','Kolkata Branch',1),
  (6,'BR006','Branch 06',1),(7,'BR007','Branch 07',1),(8,'BR008','Branch 08',1),(9,'BR009','Branch 09',1),(10,'BR010','Branch 10',1),
  (11,'BR011','Branch 11',1),(12,'BR012','Branch 12',1),(13,'BR013','Branch 13',1),(14,'BR014','Branch 14',1),(15,'BR015','Branch 15',1),
  (16,'BR016','Branch 16',1),(17,'BR017','Branch 17',1),(18,'BR018','Branch 18',1),(19,'BR019','Branch 19',1),(20,'BR020','Branch 20',1)
ON DUPLICATE KEY UPDATE branch_name=VALUES(branch_name), active=VALUES(active);

-- Master Departments (1..20)
INSERT INTO master_department (id, department_code, department_name, active) VALUES
  (1,'DEPT001','IT Department',1),(2,'DEPT002','HR Department',1),(3,'DEPT003','Finance Department',1),(4,'DEPT004','Operations',1),(5,'DEPT005','Sales & Marketing',1),
  (6,'DEPT006','Department 06',1),(7,'DEPT007','Department 07',1),(8,'DEPT008','Department 08',1),(9,'DEPT009','Department 09',1),(10,'DEPT010','Department 10',1),
  (11,'DEPT011','Department 11',1),(12,'DEPT012','Department 12',1),(13,'DEPT013','Department 13',1),(14,'DEPT014','Department 14',1),(15,'DEPT015','Department 15',1),
  (16,'DEPT016','Department 16',1),(17,'DEPT017','Department 17',1),(18,'DEPT018','Department 18',1),(19,'DEPT019','Department 19',1),(20,'DEPT020','Department 20',1)
ON DUPLICATE KEY UPDATE department_name=VALUES(department_name), active=VALUES(active);

-- Master Reporting Officers (1..20)
INSERT INTO master_reporting_officer (id, officer_code, officer_name, designation, active) VALUES
  (1,'RO001','John Smith','Senior Manager',1),(2,'RO002','Sarah Johnson','Department Head',1),(3,'RO003','Michael Brown','Team Lead',1),(4,'RO004','Emily Davis','Operations Manager',1),
  (5,'RO005','Reporting Officer 05','Manager L1',1),(6,'RO006','Reporting Officer 06','Manager L2',1),(7,'RO007','Reporting Officer 07','Manager L3',1),(8,'RO008','Reporting Officer 08','Manager L4',1),(9,'RO009','Reporting Officer 09','Manager L5',1),
  (10,'RO010','Reporting Officer 10','Manager L1',1),(11,'RO011','Reporting Officer 11','Manager L2',1),(12,'RO012','Reporting Officer 12','Manager L3',1),(13,'RO013','Reporting Officer 13','Manager L4',1),(14,'RO014','Reporting Officer 14','Manager L5',1),
  (15,'RO015','Reporting Officer 15','Manager L1',1),(16,'RO016','Reporting Officer 16','Manager L2',1),(17,'RO017','Reporting Officer 17','Manager L3',1),(18,'RO018','Reporting Officer 18','Manager L4',1),(19,'RO019','Reporting Officer 19','Manager L5',1),(20,'RO020','Reporting Officer 20','Manager L1',1)
ON DUPLICATE KEY UPDATE officer_name=VALUES(officer_name), designation=VALUES(designation), active=VALUES(active);

-- Master Company Codes (1..20)
INSERT INTO master_company_code (id, company_code, company_name, active) VALUES
  (1,'CC001','Nippon Express India',1),(2,'CC002','Nippon Express Global',1),(3,'CC003','NEX Logistics',1),
  (4,'CC004','Company 04',1),(5,'CC005','Company 05',1),(6,'CC006','Company 06',1),(7,'CC007','Company 07',1),(8,'CC008','Company 08',1),(9,'CC009','Company 09',1),(10,'CC010','Company 10',1),
  (11,'CC011','Company 11',1),(12,'CC012','Company 12',1),(13,'CC013','Company 13',1),(14,'CC014','Company 14',1),(15,'CC015','Company 15',1),(16,'CC016','Company 16',1),(17,'CC017','Company 17',1),(18,'CC018','Company 18',1),(19,'CC019','Company 19',1),(20,'CC020','Company 20',1)
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name), active=VALUES(active);

-- Master Cost Centers (1..20)
INSERT INTO master_cost_center (id, cost_center_code, cost_center_name, active) VALUES
  (1,'CST001','IT Infrastructure',1),(2,'CST002','HR Operations',1),(3,'CST003','Finance & Accounting',1),(4,'CST004','Warehouse Operations',1),(5,'CST005','Transportation',1),
  (6,'CST006','Cost Center 06',1),(7,'CST007','Cost Center 07',1),(8,'CST008','Cost Center 08',1),(9,'CST009','Cost Center 09',1),(10,'CST010','Cost Center 10',1),
  (11,'CST011','Cost Center 11',1),(12,'CST012','Cost Center 12',1),(13,'CST013','Cost Center 13',1),(14,'CST014','Cost Center 14',1),(15,'CST015','Cost Center 15',1),
  (16,'CST016','Cost Center 16',1),(17,'CST017','Cost Center 17',1),(18,'CST018','Cost Center 18',1),(19,'CST019','Cost Center 19',1),(20,'CST020','Cost Center 20',1)
ON DUPLICATE KEY UPDATE cost_center_name=VALUES(cost_center_name), active=VALUES(active);

-- Users
INSERT INTO users (email, password, role) VALUES
  ('hr@nipponexpress.com','hr123','HR'),
  ('employee@nipponexpress.com','employee123','EMPLOYEE'),
  ('admin@nipponexpress.com','admin123','ADMIN')
ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role);

-- 20 per role (HR/EMPLOYEE/ADMIN)
INSERT INTO users (email, password, role) VALUES
  ('hr01@nipponexpress.com','hr123','HR'),('hr02@nipponexpress.com','hr123','HR'),('hr03@nipponexpress.com','hr123','HR'),('hr04@nipponexpress.com','hr123','HR'),('hr05@nipponexpress.com','hr123','HR'),
  ('hr06@nipponexpress.com','hr123','HR'),('hr07@nipponexpress.com','hr123','HR'),('hr08@nipponexpress.com','hr123','HR'),('hr09@nipponexpress.com','hr123','HR'),('hr10@nipponexpress.com','hr123','HR'),
  ('hr11@nipponexpress.com','hr123','HR'),('hr12@nipponexpress.com','hr123','HR'),('hr13@nipponexpress.com','hr123','HR'),('hr14@nipponexpress.com','hr123','HR'),('hr15@nipponexpress.com','hr123','HR'),
  ('hr16@nipponexpress.com','hr123','HR'),('hr17@nipponexpress.com','hr123','HR'),('hr18@nipponexpress.com','hr123','HR'),('hr19@nipponexpress.com','hr123','HR'),('hr20@nipponexpress.com','hr123','HR'),

  ('employee01@nipponexpress.com','employee123','EMPLOYEE'),('employee02@nipponexpress.com','employee123','EMPLOYEE'),('employee03@nipponexpress.com','employee123','EMPLOYEE'),('employee04@nipponexpress.com','employee123','EMPLOYEE'),('employee05@nipponexpress.com','employee123','EMPLOYEE'),
  ('employee06@nipponexpress.com','employee123','EMPLOYEE'),('employee07@nipponexpress.com','employee123','EMPLOYEE'),('employee08@nipponexpress.com','employee123','EMPLOYEE'),('employee09@nipponexpress.com','employee123','EMPLOYEE'),('employee10@nipponexpress.com','employee123','EMPLOYEE'),
  ('employee11@nipponexpress.com','employee123','EMPLOYEE'),('employee12@nipponexpress.com','employee123','EMPLOYEE'),('employee13@nipponexpress.com','employee123','EMPLOYEE'),('employee14@nipponexpress.com','employee123','EMPLOYEE'),('employee15@nipponexpress.com','employee123','EMPLOYEE'),
  ('employee16@nipponexpress.com','employee123','EMPLOYEE'),('employee17@nipponexpress.com','employee123','EMPLOYEE'),('employee18@nipponexpress.com','employee123','EMPLOYEE'),('employee19@nipponexpress.com','employee123','EMPLOYEE'),('employee20@nipponexpress.com','employee123','EMPLOYEE'),

  ('admin01@nipponexpress.com','admin123','ADMIN'),('admin02@nipponexpress.com','admin123','ADMIN'),('admin03@nipponexpress.com','admin123','ADMIN'),('admin04@nipponexpress.com','admin123','ADMIN'),('admin05@nipponexpress.com','admin123','ADMIN'),
  ('admin06@nipponexpress.com','admin123','ADMIN'),('admin07@nipponexpress.com','admin123','ADMIN'),('admin08@nipponexpress.com','admin123','ADMIN'),('admin09@nipponexpress.com','admin123','ADMIN'),('admin10@nipponexpress.com','admin123','ADMIN'),
  ('admin11@nipponexpress.com','admin123','ADMIN'),('admin12@nipponexpress.com','admin123','ADMIN'),('admin13@nipponexpress.com','admin123','ADMIN'),('admin14@nipponexpress.com','admin123','ADMIN'),('admin15@nipponexpress.com','admin123','ADMIN'),
  ('admin16@nipponexpress.com','admin123','ADMIN'),('admin17@nipponexpress.com','admin123','ADMIN'),('admin18@nipponexpress.com','admin123','ADMIN'),('admin19@nipponexpress.com','admin123','ADMIN'),('admin20@nipponexpress.com','admin123','ADMIN')
ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role);

-- Application forms (EMP001..EMP020) with ALL Employee Information fields populated.
-- NOTE: submitted_at is required (NOT NULL).
INSERT INTO application_forms (
  employee_code, full_name, branch_id, department_id, reporting_officer_id, sub_branch_id,
  designation, scope_of_work, employee_type,
  request_action, contact_no, requested_by,
  request_email_id, request_domain_account, request_bluetooth_access_card, request_shared_folder, request_internet_access,
  request_newins, request_nexas, request_gsnet,
  submitted_at, status
) VALUES
  ('EMP001','Employee 001',1,1,1,14,'Sr. Executive','Both','Permanent','New','9800000001','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 1 DAY,'PENDING'),
  ('EMP002','Employee 002',2,2,2,13,'Executive','IT','Probation','Change','9800000002','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 2 DAY,'APPROVED'),
  ('EMP003','Employee 003',3,3,3,12,'Assistant Manager','Both','Permanent','New','9800000003','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 3 DAY,'REJECTED'),
  ('EMP004','Employee 004',4,4,4,11,'Sr. Executive','IT','Probation','Change','9800000004','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 4 DAY,'PENDING'),
  ('EMP005','Employee 005',5,5,5,10,'Executive','Both','Permanent','New','9800000005','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 5 DAY,'APPROVED'),
  ('EMP006','Employee 006',6,6,6,9,'Assistant Manager','IT','Probation','Change','9800000006','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 6 DAY,'REJECTED'),
  ('EMP007','Employee 007',7,7,7,8,'Sr. Executive','Both','Permanent','New','9800000007','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 7 DAY,'PENDING'),
  ('EMP008','Employee 008',8,8,8,7,'Executive','IT','Probation','Change','9800000008','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 8 DAY,'APPROVED'),
  ('EMP009','Employee 009',9,9,9,6,'Assistant Manager','Both','Permanent','New','9800000009','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 9 DAY,'REJECTED'),
  ('EMP010','Employee 010',10,10,10,5,'Sr. Executive','IT','Probation','Change','9800000010','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 10 DAY,'PENDING'),
  ('EMP011','Employee 011',11,11,11,4,'Executive','Both','Permanent','New','9800000011','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 11 DAY,'APPROVED'),
  ('EMP012','Employee 012',12,12,12,3,'Assistant Manager','IT','Probation','Change','9800000012','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 12 DAY,'REJECTED'),
  ('EMP013','Employee 013',13,13,13,2,'Sr. Executive','Both','Permanent','New','9800000013','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 13 DAY,'PENDING'),
  ('EMP014','Employee 014',14,14,14,1,'Executive','IT','Probation','Change','9800000014','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 14 DAY,'APPROVED'),
  ('EMP015','Employee 015',15,15,15,20,'Assistant Manager','Both','Permanent','New','9800000015','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 15 DAY,'REJECTED'),
  ('EMP016','Employee 016',16,16,16,19,'Sr. Executive','IT','Probation','Change','9800000016','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 16 DAY,'PENDING'),
  ('EMP017','Employee 017',17,17,17,18,'Executive','Both','Permanent','New','9800000017','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 17 DAY,'APPROVED'),
  ('EMP018','Employee 018',18,18,18,17,'Assistant Manager','IT','Probation','Change','9800000018','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 18 DAY,'REJECTED'),
  ('EMP019','Employee 019',19,19,19,16,'Sr. Executive','Both','Permanent','New','9800000019','HR',1,1,0,1,1,1,1,1, NOW(6) - INTERVAL 19 DAY,'PENDING'),
  ('EMP020','Employee 020',20,20,20,15,'Executive','IT','Probation','Change','9800000020','ADMIN',1,1,1,1,1,1,1,1, NOW(6) - INTERVAL 20 DAY,'APPROVED')
ON DUPLICATE KEY UPDATE
  full_name=VALUES(full_name),
  branch_id=VALUES(branch_id),
  department_id=VALUES(department_id),
  reporting_officer_id=VALUES(reporting_officer_id),
  sub_branch_id=VALUES(sub_branch_id),
  designation=VALUES(designation),
  scope_of_work=VALUES(scope_of_work),
  employee_type=VALUES(employee_type),
  request_action=VALUES(request_action),
  contact_no=VALUES(contact_no),
  requested_by=VALUES(requested_by),
  request_email_id=VALUES(request_email_id),
  request_domain_account=VALUES(request_domain_account),
  request_bluetooth_access_card=VALUES(request_bluetooth_access_card),
  request_shared_folder=VALUES(request_shared_folder),
  request_internet_access=VALUES(request_internet_access),
  request_newins=VALUES(request_newins),
  request_nexas=VALUES(request_nexas),
  request_gsnet=VALUES(request_gsnet),
  status=VALUES(status);
