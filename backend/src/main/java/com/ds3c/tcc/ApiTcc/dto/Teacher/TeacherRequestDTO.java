package com.ds3c.tcc.ApiTcc.dto.Teacher;

import com.ds3c.tcc.ApiTcc.dto.User.UserRequestDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeacherRequestDTO implements UserRequestDTO {
    private String username;
    private String password;
    @NotBlank
    private String name;
    private String cpf;
    @Email
    private String email;
    private String phone;

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public void setPassword(String password) {
        this.password = password;
    }
}
