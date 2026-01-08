package backend.login.backend.repository;

import backend.login.backend.model.ApplicationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationFormRepository extends JpaRepository<ApplicationForm, Long> {
    List<ApplicationForm> findByEmployeeCode(String employeeCode);
    ApplicationForm findTopByEmployeeCodeOrderBySubmittedAtDesc(String employeeCode);
    List<ApplicationForm> findByStatus(String status);
    List<ApplicationForm> findByOrderBySubmittedAtDesc();
}
