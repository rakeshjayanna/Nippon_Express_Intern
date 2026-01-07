-- Setup script for Nippon Express users
-- Run this in MySQL to create test users

USE nippon_express;

-- Clear existing users (optional)
-- DELETE FROM users;

-- Insert test users with different roles
INSERT INTO users (email, password, role) VALUES 
('admin@nippon.com', 'admin123', 'SUPERADMIN'),
('employee@nippon.com', 'emp123', 'EMPLOYEE'),
('john.doe@nippon.com', 'john123', 'EMPLOYEE'),
('jane.admin@nippon.com', 'jane123', 'SUPERADMIN');

-- Verify the users
SELECT id, email, role FROM users;
