package com.ds3c.tcc.ApiTcc.repository;

import com.ds3c.tcc.ApiTcc.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
