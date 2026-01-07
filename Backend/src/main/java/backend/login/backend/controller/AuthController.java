package backend.login.backend.controller;

import backend.login.backend.model.User;
import backend.login.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

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
    public String login(@RequestBody LoginRequest request) {

        Optional<User> user = userRepository.findByEmailAndPassword(
                request.getEmail(),
                request.getPassword()
        );

        if (user.isPresent()) {
            return user.get().getRole(); // return role
        }

        return "INVALID";
    }
}
