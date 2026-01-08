-- Database Setup Script for Nippon Express Application
-- Run this after the application creates the tables

-- Insert HR user
INSERT INTO users (email, password, role) VALUES
('hr@nipponexpress.com', 'hr123', 'HR')
ON DUPLICATE KEY UPDATE role = 'HR';

-- Insert sample branches
INSERT INTO master_branch (branch_code, branch_name, active) VALUES
('BR001', 'Mumbai Branch', true),
('BR002', 'Delhi Branch', true),
('BR003', 'Bangalore Branch', true),
('BR004', 'Chennai Branch', true),
('BR005', 'Kolkata Branch', true)
ON DUPLICATE KEY UPDATE active = true;

-- Insert sample departments
INSERT INTO master_department (department_code, department_name, active) VALUES
('DEPT001', 'IT Department', true),
('DEPT002', 'HR Department', true),
('DEPT003', 'Finance Department', true),
('DEPT004', 'Operations', true),
('DEPT005', 'Sales & Marketing', true)
ON DUPLICATE KEY UPDATE active = true;

-- Insert sample reporting officers
INSERT INTO master_reporting_officer (officer_code, officer_name, designation, active) VALUES
('RO001', 'John Smith', 'Senior Manager', true),
('RO002', 'Sarah Johnson', 'Department Head', true),
('RO003', 'Michael Brown', 'Team Lead', true),
('RO004', 'Emily Davis', 'Operations Manager', true)
ON DUPLICATE KEY UPDATE active = true;

-- Insert sample company codes
INSERT INTO master_company_code (company_code, company_name, active) VALUES
('CC001', 'Nippon Express India', true),
('CC002', 'Nippon Express Global', true),
('CC003', 'NEX Logistics', true)
ON DUPLICATE KEY UPDATE active = true;

-- Insert sample cost centers
INSERT INTO master_cost_center (cost_center_code, cost_center_name, active) VALUES
('CST001', 'IT Infrastructure', true),
('CST002', 'HR Operations', true),
('CST003', 'Finance & Accounting', true),
('CST004', 'Warehouse Operations', true),
('CST005', 'Transportation', true)
ON DUPLICATE KEY UPDATE active = true;
