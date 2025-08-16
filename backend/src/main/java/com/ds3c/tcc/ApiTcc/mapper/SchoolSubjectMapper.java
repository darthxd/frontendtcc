package com.ds3c.tcc.ApiTcc.mapper;

import com.ds3c.tcc.ApiTcc.dto.SchoolClass.SchoolClassResponseDTO;
import com.ds3c.tcc.ApiTcc.dto.SchoolSubject.SchoolSubjectRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.SchoolSubject.SchoolSubjectResponseDTO;
import com.ds3c.tcc.ApiTcc.model.SchoolSubject;
import com.ds3c.tcc.ApiTcc.model.Teacher;
import com.ds3c.tcc.ApiTcc.service.SchoolSubjectService;
import com.ds3c.tcc.ApiTcc.service.TeacherService;
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
public class SchoolSubjectMapper {
    private final TeacherService teacherService;
    private final SchoolSubjectService schoolSubjectService;

    @Autowired
    @Lazy
    public SchoolSubjectMapper(TeacherService teacherService, SchoolSubjectService schoolSubjectService) {
        this.teacherService = teacherService;
        this.schoolSubjectService = schoolSubjectService;
    }

    public SchoolSubject toModel(SchoolSubjectRequestDTO schoolSubjectRequestDTO) {
        SchoolSubject schoolSubject = new SchoolSubject();
        schoolSubject.setName(schoolSubjectRequestDTO.getName());
        schoolSubject.setTeacherIds(schoolSubjectRequestDTO.getTeacherIds());
        return schoolSubject;
    }

    public SchoolSubjectResponseDTO toDTO(SchoolSubject schoolSubject) {
        SchoolSubjectResponseDTO schoolSubjectResponseDTO = new SchoolSubjectResponseDTO();
        schoolSubjectResponseDTO.setId(schoolSubject.getId());
        schoolSubjectResponseDTO.setName(schoolSubject.getName());
        if (schoolSubject.getTeacherIds() != null) {
            List<String> teacherNames = teacherService
                    .listTeacherById(schoolSubject.getTeacherIds())
                    .stream().map(Teacher::getName)
                    .toList();
            schoolSubjectResponseDTO.setTeacherNames(teacherNames);
        }
        return schoolSubjectResponseDTO;
    }

    public List<SchoolSubjectResponseDTO> toListDTO(List<SchoolSubject> schoolSubjectList) {
        List<SchoolSubjectResponseDTO> schoolSubjectResponseDTOList = new ArrayList<>();
        for (SchoolSubject schoolSubject : schoolSubjectList) {
            schoolSubjectResponseDTOList.add(toDTO(schoolSubject));
        }
        return schoolSubjectResponseDTOList;
    }

    public SchoolSubject updateModelFromDTO(SchoolSubjectRequestDTO schoolSubjectRequestDTO, Long id) {
        SchoolSubject schoolSubject = schoolSubjectService.getSchoolSubjectById(id);
        if (StringUtils.hasText(schoolSubjectRequestDTO.getName())) {
            schoolSubject.setName(schoolSubjectRequestDTO.getName());
        }
        if (schoolSubjectRequestDTO.getTeacherIds() != null) {
            schoolSubject.setTeacherIds(
                    schoolSubjectRequestDTO.getTeacherIds()
            );
        }
        return schoolSubject;
    }
}
