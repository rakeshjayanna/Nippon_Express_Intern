package backend.login.backend.repository;

import backend.login.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmailAndPassword(String email, String password);
    
    Optional<User> findByEmail(String email);

    Optional<User> findByEmployeeCode(String employeeCode);
}
