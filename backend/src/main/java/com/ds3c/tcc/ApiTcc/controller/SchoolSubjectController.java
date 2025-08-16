package com.ds3c.tcc.ApiTcc.controller;

import com.ds3c.tcc.ApiTcc.dto.SchoolSubject.SchoolSubjectRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.SchoolSubject.SchoolSubjectResponseDTO;
import com.ds3c.tcc.ApiTcc.mapper.SchoolSubjectMapper;
import com.ds3c.tcc.ApiTcc.service.SchoolSubjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schoolsubject")
public class SchoolSubjectController {
    private final SchoolSubjectMapper schoolSubjectMapper;
    private final SchoolSubjectService schoolSubjectService;

    public SchoolSubjectController(
            SchoolSubjectMapper schoolSubjectMapper, SchoolSubjectService schoolSubjectService) {
        this.schoolSubjectMapper = schoolSubjectMapper;
        this.schoolSubjectService = schoolSubjectService;
    }

    @GetMapping
    public List<SchoolSubjectResponseDTO> listSchoolSubjects() {
        return schoolSubjectMapper.toListDTO(
            schoolSubjectService.listSchoolSubject()
        );
    }

    @PostMapping
    public SchoolSubjectResponseDTO createSchoolSubject(
            @RequestBody @Valid SchoolSubjectRequestDTO dto) {
        return schoolSubjectMapper.toDTO(
                schoolSubjectService.createSchoolSubject(dto)
        );
    }

    @GetMapping("/{id}")
    public SchoolSubjectResponseDTO getSchoolSubject(
            @PathVariable("id") Long id) {
        return schoolSubjectMapper.toDTO(
                schoolSubjectService.getSchoolSubjectById(id)
        );
    }

    @PutMapping("/{id}")
    public SchoolSubjectResponseDTO updateSchoolSubject(
            @RequestBody @Valid SchoolSubjectRequestDTO dto,
            @PathVariable("id") Long id) {
        return schoolSubjectMapper.toDTO(
                schoolSubjectService.updateSchoolSubject(dto, id)
        );
    }

    @DeleteMapping("/{id}")
    public void deleteSchoolSubject(@PathVariable("id") Long id) {
        schoolSubjectService.deleteSchoolSubject(id);
    }
}
