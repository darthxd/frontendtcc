package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.dto.SchoolClass.SchoolClassRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.SchoolClass.SchoolClassResponseDTO;
import com.ds3c.tcc.ApiTcc.exception.SchoolClassNotFoundException;
import com.ds3c.tcc.ApiTcc.mapper.SchoolClassMapper;
import com.ds3c.tcc.ApiTcc.model.SchoolClass;
import com.ds3c.tcc.ApiTcc.model.SchoolSubject;
import com.ds3c.tcc.ApiTcc.repository.SchoolClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class SchoolClassService {
    private final SchoolClassRepository schoolClassRepository;
    private final SchoolClassMapper schoolClassMapper;

    @Autowired
    @Lazy
    public SchoolClassService(SchoolClassRepository schoolClassRepository,
                              SchoolClassMapper schoolClassMapper) {
        this.schoolClassRepository = schoolClassRepository;
        this.schoolClassMapper = schoolClassMapper;
    }

    public SchoolClass createSchoolClass(SchoolClassRequestDTO dto) {
        return schoolClassRepository.save(
                schoolClassMapper.toModel(dto)
        );
    }

    public SchoolClass getSchoolClassById(Long id) {
        return schoolClassRepository.findById(id)
                .orElseThrow(() -> new SchoolClassNotFoundException(id));
    }

    public List<SchoolClass> listSchoolClass() {
        return schoolClassRepository.findAll();
    }

    public SchoolClass updateSchoolClass(SchoolClassRequestDTO dto,
                                         Long id) {
        return schoolClassRepository.save(
                schoolClassMapper.updateModelFromDTO(dto, id));
    }

    public void deleteSchoolClass(Long id) {
        SchoolClass schoolClass = getSchoolClassById(id);
        schoolClassRepository.delete(schoolClass);
    }

    public List<SchoolClass> listSchoolClassById(Set<Long> idSet) {
        return schoolClassRepository.findAllById(idSet);
    }
}
