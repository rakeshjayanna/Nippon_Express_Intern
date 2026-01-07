package backend.login.backend.controller;

import backend.login.backend.model.User;
import backend.login.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final UserRepository userRepository;

    public DebugController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<Object> listUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> {
                    return new Object() {
                        public final int id = u.getId();
                        public final String email = u.getEmail();
                        public final String role = u.getRole();
                    };
                })
                .collect(Collectors.toList());
    }
}
