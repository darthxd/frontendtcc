package com.ds3c.tcc.ApiTcc.controller;

import com.ds3c.tcc.ApiTcc.dto.User.UserResponseDTO;
import com.ds3c.tcc.ApiTcc.mapper.UserMapper;
import com.ds3c.tcc.ApiTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @Autowired
    public UserController(UserService userService,
                          UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<UserResponseDTO> listUser() {
        return userMapper.toListDTO(userService.listUser());
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable("id") Long id) {
        return userMapper.toDTO(
                userService.getUserById(id)
        );
    }
}
