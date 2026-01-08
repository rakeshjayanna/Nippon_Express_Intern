package backend.login.backend.repository;

import backend.login.backend.model.MasterCostCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterCostCenterRepository extends JpaRepository<MasterCostCenter, Long> {
    List<MasterCostCenter> findByActiveTrue();
}
