package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.dto.Student.StudentRequestDTO;
import com.ds3c.tcc.ApiTcc.enums.RolesEnum;
import com.ds3c.tcc.ApiTcc.exception.StudentNotFoundException;
import com.ds3c.tcc.ApiTcc.mapper.StudentMapper;
import com.ds3c.tcc.ApiTcc.model.SchoolClass;
import com.ds3c.tcc.ApiTcc.model.Student;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final UserService userService;
    private final SchoolClassService schoolClassService;

    @Autowired
    @Lazy
    public StudentService(StudentRepository studentRepository, StudentMapper studentMapper, UserService userService, SchoolClassService schoolClassService) {
        this.studentRepository = studentRepository;
        this.studentMapper = studentMapper;
        this.userService = userService;
        this.schoolClassService = schoolClassService;
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    public List<Student> listStudent() {
        return studentRepository.findAll();
    }

    public Student createStudent(StudentRequestDTO dto) {
        schoolClassService.getSchoolClassById(dto.getSchoolClassId());
        User user = userService.createUser(dto, RolesEnum.ROLE_STUDENT);
        Student student = studentMapper.toModel(dto, user.getId());
        return studentRepository.save(student);
    }

    public Student updateStudent(StudentRequestDTO dto,
                                 Long id) {
        return studentRepository.save(
                studentMapper.updateModelFromDTO(dto, id)
        );
    }

    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        userService.deleteUser(student.getUserId());
        studentRepository.delete(student);
    }
}
