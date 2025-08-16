package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public String login(User user) {
        UsernamePasswordAuthenticationToken usernamePassword = new
                UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());
        Authentication auth = authenticationManager.authenticate(usernamePassword);
        return jwtService.generateToken((User) auth.getPrincipal());
    }
}
