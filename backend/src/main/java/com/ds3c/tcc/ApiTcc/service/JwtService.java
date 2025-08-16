package com.ds3c.tcc.ApiTcc.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.ds3c.tcc.ApiTcc.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class JwtService {
    @Value("${api.security.token.secret}")
    private String secretKey;
    private Instant expirationTime = LocalDateTime.now()
            .plusHours(24).toInstant(ZoneOffset.of("-03:00"));
    @Value("${spring.application.name}")
    private String issuer;

    public String generateToken(User user) {
        try {
            return JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getUsername())
                    .withExpiresAt(expirationTime)
                    .sign(Algorithm.HMAC256(secretKey));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error creating the JWT token. "+e);
        }
    }

    public String validateToken(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(secretKey))
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Error while validating the JWT token. "+e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);
        }
    }
}
