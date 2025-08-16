package com.ds3c.tcc.ApiTcc.dto.Admin;

import com.ds3c.tcc.ApiTcc.dto.User.UserRequestDTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminRequestDTO implements UserRequestDTO {
    private Long id;
    private String username;
    private String password;
    @NotBlank
    private String name;
    @Email
    private String email;
    private String cpf;
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
