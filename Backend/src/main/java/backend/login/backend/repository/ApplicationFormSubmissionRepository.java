package backend.login.backend.repository;

import backend.login.backend.model.ApplicationFormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationFormSubmissionRepository extends JpaRepository<ApplicationFormSubmission, Long> {
    List<ApplicationFormSubmission> findByEmployeeCodeOrderBySubmittedAtDesc(String employeeCode);

    ApplicationFormSubmission findTopByEmployeeCodeOrderBySubmittedAtDesc(String employeeCode);

    List<ApplicationFormSubmission> findByOrderBySubmittedAtDesc();
}
