package com.ds3c.tcc.ApiTcc.mapper;

import com.ds3c.tcc.ApiTcc.dto.User.UserRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.User.UserResponseDTO;
import com.ds3c.tcc.ApiTcc.enums.RolesEnum;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Component
public class UserMapper {
    private final UserService userService;

    @Autowired
    @Lazy
    public UserMapper(UserService userService) {
        this.userService = userService;
    }

    public UserResponseDTO toDTO(User user) {
        UserResponseDTO userDTO = new UserResponseDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword());
        userDTO.setRole(user.getRole().name());
        return userDTO;
    }

    public List<UserResponseDTO> toListDTO(List<User> userList) {
        List<UserResponseDTO> userDTOList = new ArrayList<>();
        for(User user : userList) {
            userDTOList.add(toDTO(user));
        }
        return userDTOList;
    }

    public User fromDTOToModel(UserRequestDTO userRequestDTO, RolesEnum role) {
        User user = new User();
        user.setUsername(userRequestDTO.getUsername());
        user.setPassword(userRequestDTO.getPassword());
        user.setRole(role);
        return user;
    }
    public User updateModelFromDTO(UserRequestDTO userRequestDTO, Long id) {
        User user = userService.getUserById(id);
        if(StringUtils.hasText(userRequestDTO.getUsername())) {
            user.setUsername(userRequestDTO.getUsername());
        }
        if(StringUtils.hasText(userRequestDTO.getPassword())) {
            user.setPassword(userRequestDTO.getPassword());
        }
        return user;
    }
}
