package com.ds3c.tcc.ApiTcc.mapper;

import com.ds3c.tcc.ApiTcc.dto.Teacher.TeacherRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.Teacher.TeacherResponseDTO;
import com.ds3c.tcc.ApiTcc.model.SchoolClass;
import com.ds3c.tcc.ApiTcc.model.SchoolSubject;
import com.ds3c.tcc.ApiTcc.model.Teacher;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.service.SchoolClassService;
import com.ds3c.tcc.ApiTcc.service.SchoolSubjectService;
import com.ds3c.tcc.ApiTcc.service.TeacherService;
import com.ds3c.tcc.ApiTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class TeacherMapper {
    private final UserService userService;
    private final TeacherService teacherService;

    @Autowired
    @Lazy
    public TeacherMapper(
            UserService userService,
            TeacherService teacherService) {
        this.userService = userService;
        this.teacherService = teacherService;
    }

    public Teacher toModel(TeacherRequestDTO teacherRequestDTO, Long userId) {
        Teacher teacher = new Teacher();
        teacher.setName(teacherRequestDTO.getName());
        teacher.setCpf(teacherRequestDTO.getCpf());
        teacher.setEmail(teacherRequestDTO.getEmail());
        teacher.setPhone(teacherRequestDTO.getPhone());
        teacher.setUserId(userId);
        return teacher;
    }

    public TeacherResponseDTO toDTO(Teacher teacher) {
        User user = userService.getUserById(teacher.getUserId());
        TeacherResponseDTO teacherResponseDTO = new TeacherResponseDTO();
        teacherResponseDTO.setId(teacher.getId());
        teacherResponseDTO.setUsername(user.getUsername());
        teacherResponseDTO.setPassword(user.getPassword());
        teacherResponseDTO.setCpf(teacher.getCpf());
        teacherResponseDTO.setName(teacher.getName());
        teacherResponseDTO.setPhone(teacher.getPhone());
        teacherResponseDTO.setEmail(teacher.getEmail());
        return teacherResponseDTO;
    }

    public List<TeacherResponseDTO> toListDTO(List<Teacher> teacherList) {
        List<TeacherResponseDTO> teacherResponseDTOList = new ArrayList<>();
        for(Teacher teacher : teacherList) {
            teacherResponseDTOList.add(toDTO(teacher));
        }
        return teacherResponseDTOList;
    }

    public Teacher updateModelFromDTO(TeacherRequestDTO teacherRequestDTO, Long id) {
        Teacher teacher = teacherService.getTeacherById(id);
        if (StringUtils.hasText(teacherRequestDTO.getUsername())
                || StringUtils.hasText(teacherRequestDTO.getPassword())) {
            userService.updateUser(teacherRequestDTO, teacher.getUserId());
        }
        if (StringUtils.hasText(teacherRequestDTO.getName())) {
            teacher.setName(teacherRequestDTO.getName());
        }
        if (StringUtils.hasText(teacherRequestDTO.getCpf())) {
            teacher.setCpf(teacherRequestDTO.getCpf());
        }
        if (StringUtils.hasText(teacherRequestDTO.getEmail())) {
            teacher.setEmail(teacherRequestDTO.getEmail());
        }
        if (StringUtils.hasText(teacherRequestDTO.getPhone())) {
            teacher.setPhone(teacherRequestDTO.getPhone());
        }
        return teacher;
    }
}