package com.ds3c.tcc.ApiTcc.dto.Student;

import com.ds3c.tcc.ApiTcc.dto.User.UserRequestDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequestDTO implements UserRequestDTO {
    private String username;
    private String password;
    private String name;
    private String ra;
    private String rm;
    private String cpf;
    private String phone;
    private String email;
    private Long schoolClassId;
    private LocalDate birthdate;
    private Long biometry;
    private String photo;

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
