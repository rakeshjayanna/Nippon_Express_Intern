package backend.login.backend.repository;

import backend.login.backend.model.MasterCompanyCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterCompanyCodeRepository extends JpaRepository<MasterCompanyCode, Long> {
    List<MasterCompanyCode> findByActiveTrue();
}
