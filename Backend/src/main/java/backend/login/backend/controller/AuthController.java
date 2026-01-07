package backend.login.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        // TEMPORARY hardcoded check (to test connection)
        if ("x".equals(request.getEmployeeId()) && "cvb".equals(request.getPassword())) {
            return "Login successful";
        }

        return "Invalid credentials";
    }
}
