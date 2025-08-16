package com.ds3c.tcc.ApiTcc.dto.Student;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {
    private Long id;
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
    private Boolean inschool;
}
