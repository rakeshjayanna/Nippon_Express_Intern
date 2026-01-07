package backend.login.backend.controller;

import backend.login.backend.model.User;
import backend.login.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        Optional<User> user = userRepository.findByEmailAndPassword(
                request.getEmail(),
                request.getPassword()
        );

        Map<String, Object> response = new HashMap<>();

        if (user.isPresent()) {
            User foundUser = user.get();
            response.put("success", true);
            response.put("employeeId", foundUser.getId());
            response.put("email", foundUser.getEmail());
            response.put("role", foundUser.getRole());
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(401).body(response);
    }
}
