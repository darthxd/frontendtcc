package com.ds3c.tcc.ApiTcc.mapper;

import com.ds3c.tcc.ApiTcc.dto.Student.StudentRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.Student.StudentResponseDTO;
import com.ds3c.tcc.ApiTcc.model.SchoolClass;
import com.ds3c.tcc.ApiTcc.model.Student;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.service.SchoolClassService;
import com.ds3c.tcc.ApiTcc.service.StudentService;
import com.ds3c.tcc.ApiTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class StudentMapper {
    private final SchoolClassService schoolClassService;
    private final UserService userService;
    private final StudentService studentService;

    @Autowired
    @Lazy
    public StudentMapper(SchoolClassService schoolClassService,
                         UserService userService,
                         StudentService studentService) {
        this.schoolClassService = schoolClassService;
        this.userService = userService;
        this.studentService = studentService;
    }

    public Student toModel(StudentRequestDTO studentRequestDTO, Long userId) {
        SchoolClass schoolClass = schoolClassService
                .getSchoolClassById(studentRequestDTO.getSchoolClassId());
        Student student = new Student();
        student.setName(studentRequestDTO.getName());
        student.setRa(studentRequestDTO.getRa());
        student.setRm(studentRequestDTO.getRm());
        student.setCpf(studentRequestDTO.getCpf());
        student.setPhone(studentRequestDTO.getPhone());
        student.setEmail(studentRequestDTO.getEmail());
        student.setSchoolClass(schoolClass);
        student.setBirthdate(studentRequestDTO.getBirthdate());
        student.setBiometry(studentRequestDTO.getBiometry());
        student.setPhoto(studentRequestDTO.getPhoto());
        student.setUserId(userId);
        return student;
    }

    public StudentResponseDTO toDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        User user = userService.getUserById(student.getUserId());
        dto.setId(student.getId());
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setName(student.getName());
        dto.setRa(student.getRa());
        dto.setRm(student.getRm());
        dto.setCpf(student.getCpf());
        dto.setPhone(student.getPhone());
        dto.setEmail(student.getEmail());
        dto.setSchoolClassId(student.getSchoolClass().getId());
        dto.setBirthdate(student.getBirthdate());
        dto.setBiometry(student.getBiometry());
        dto.setPhoto(student.getPhoto());
        dto.setInschool(student.getInschool());
        return dto;
    }

    public List<StudentResponseDTO> toListDTO(List<Student> studentList) {
        List<StudentResponseDTO> dtoList = new ArrayList<>();
        for (Student student : studentList) {
            dtoList.add(toDTO(student));
        }
        return dtoList;
    }

    public Student updateModelFromDTO(StudentRequestDTO dto, Long id) {
        Student student = studentService.getStudentById(id);
        if (StringUtils.hasText(dto.getUsername())
                || StringUtils.hasText(dto.getPassword())) {
            userService.updateUser(dto, student.getUserId());
        }
        if (StringUtils.hasText(dto.getName())) {
            student.setName(dto.getName());
        }
        if (StringUtils.hasText(dto.getRa())) {
            student.setRa(dto.getRa());
        }
        if (StringUtils.hasText(dto.getRm())) {
            student.setRm(dto.getRm());
        }
        if (StringUtils.hasText(dto.getCpf())) {
            student.setCpf(dto.getCpf());
        }
        if (StringUtils.hasText(dto.getPhone())) {
            student.setPhoto(dto.getPhone());
        }
        if (StringUtils.hasText(dto.getEmail())) {
            student.setEmail(dto.getEmail());
        }
        if (dto.getSchoolClassId() != null) {
            student.setSchoolClass(
                    schoolClassService.getSchoolClassById(dto.getSchoolClassId())
            );
        }
        if (dto.getBirthdate().isBefore(LocalDate.now())
                && dto.getBirthdate() != null) {
            student.setBirthdate(dto.getBirthdate());
        }
        if (dto.getBiometry() != null) {
            student.setBiometry(dto.getBiometry());
        }
        if (StringUtils.hasText(dto.getPhoto())) {
            student.setPhoto(dto.getPhoto());
        }
        return student;
    }
}
