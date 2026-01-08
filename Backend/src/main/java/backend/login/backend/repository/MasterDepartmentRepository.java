package backend.login.backend.repository;

import backend.login.backend.model.MasterDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterDepartmentRepository extends JpaRepository<MasterDepartment, Long> {
    List<MasterDepartment> findByActiveTrue();
}
