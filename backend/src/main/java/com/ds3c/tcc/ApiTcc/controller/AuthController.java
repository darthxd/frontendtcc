package com.ds3c.tcc.ApiTcc.controller;

import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public String login(@RequestBody @Valid User user) {
        return authService.login(user);
    }
}
