package backend.login.backend.repository;

import backend.login.backend.model.MasterBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterBranchRepository extends JpaRepository<MasterBranch, Long> {
    List<MasterBranch> findByActiveTrue();

    boolean existsByBranchCode(String branchCode);
}
