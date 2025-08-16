package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.dto.Teacher.TeacherRequestDTO;
import com.ds3c.tcc.ApiTcc.enums.RolesEnum;
import com.ds3c.tcc.ApiTcc.exception.TeacherNotFoundException;
import com.ds3c.tcc.ApiTcc.mapper.TeacherMapper;
import com.ds3c.tcc.ApiTcc.model.Teacher;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;
    private final UserService userService;

    @Autowired
    @Lazy
    public TeacherService(TeacherRepository teacherRepository,
                          TeacherMapper teacherMapper,
                          UserService userService) {
        this.teacherRepository = teacherRepository;
        this.teacherMapper = teacherMapper;
        this.userService = userService;
    }

    public Teacher createTeacher(TeacherRequestDTO teacherRequestDTO) {
        User user = userService.createUser(teacherRequestDTO, RolesEnum.ROLE_TEACHER);
        Teacher teacher = teacherMapper.toModel(teacherRequestDTO, user.getId());
        return teacherRepository.save(teacher);
    }

    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new TeacherNotFoundException(id));
    }

    public List<Teacher> listTeacher() {
        return teacherRepository.findAll();
    }

    public Teacher updateTeacher(TeacherRequestDTO dto,
                                 Long id) {
        return teacherRepository.save(
                teacherMapper.updateModelFromDTO(dto, id)
        );
    }

    public void deleteTeacher(Long id) {
        Teacher teacher = getTeacherById(id);
        userService.deleteUser(teacher.getUserId());
        teacherRepository.delete(teacher);

    }

    public List<Teacher> listTeacherById(Set<Long> idSet) {
        return teacherRepository.findAllById(idSet);
    }
}
