package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.dto.SchoolSubject.SchoolSubjectRequestDTO;
import com.ds3c.tcc.ApiTcc.exception.SchoolSubjectNotFoundException;
import com.ds3c.tcc.ApiTcc.mapper.SchoolClassMapper;
import com.ds3c.tcc.ApiTcc.mapper.SchoolSubjectMapper;
import com.ds3c.tcc.ApiTcc.model.SchoolSubject;
import com.ds3c.tcc.ApiTcc.repository.SchoolSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class SchoolSubjectService {
    private final SchoolSubjectRepository schoolSubjectRepository;
    private final SchoolSubjectMapper schoolSubjectMapper;

    @Autowired
    @Lazy
    public SchoolSubjectService(SchoolSubjectRepository schoolSubjectRepository,
                                SchoolSubjectMapper schoolSubjectMapper) {
        this.schoolSubjectRepository = schoolSubjectRepository;
        this.schoolSubjectMapper = schoolSubjectMapper;
    }

    public SchoolSubject createSchoolSubject(SchoolSubjectRequestDTO dto) {
        return schoolSubjectRepository.save(
                schoolSubjectMapper.toModel(dto)
        );
    }

    public SchoolSubject getSchoolSubjectById(Long id) {
        return schoolSubjectRepository.findById(id)
                .orElseThrow(() -> new SchoolSubjectNotFoundException(id));
    }

    public List<SchoolSubject> listSchoolSubject() {
        return schoolSubjectRepository.findAll();
    }

    public SchoolSubject updateSchoolSubject(SchoolSubjectRequestDTO dto,
                                             Long id) {
        return schoolSubjectRepository.save(
                schoolSubjectMapper.updateModelFromDTO(dto, id));
    }

    public void deleteSchoolSubject(Long id) {
        SchoolSubject schoolSubject = getSchoolSubjectById(id);
        schoolSubjectRepository.delete(schoolSubject);
    }

    public List<SchoolSubject> listSchoolSubjectById(Set<Long> idSet) {
        return schoolSubjectRepository.findAllById(idSet);
    }
}
