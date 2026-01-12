package backend.login.backend.repository;

import backend.login.backend.model.MasterReportingOfficer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterReportingOfficerRepository extends JpaRepository<MasterReportingOfficer, Long> {
    List<MasterReportingOfficer> findByActiveTrue();

    boolean existsByOfficerCode(String officerCode);
}
