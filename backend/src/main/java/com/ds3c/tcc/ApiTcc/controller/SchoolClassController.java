package com.ds3c.tcc.ApiTcc.controller;

import com.ds3c.tcc.ApiTcc.dto.SchoolClass.SchoolClassRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.SchoolClass.SchoolClassResponseDTO;
import com.ds3c.tcc.ApiTcc.mapper.SchoolClassMapper;
import com.ds3c.tcc.ApiTcc.service.SchoolClassService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schoolclass")
public class SchoolClassController {

    private final SchoolClassMapper schoolClassMapper;
    private final SchoolClassService schoolClassService;

    @Autowired
    @Lazy
    public SchoolClassController(
            SchoolClassMapper schoolClassMapper,
            SchoolClassService schoolClassService) {
        this.schoolClassMapper = schoolClassMapper;
        this.schoolClassService = schoolClassService;
    }

    @GetMapping
    public List<SchoolClassResponseDTO> listSchoolClasses() {
        return schoolClassMapper.toListDTO(
                schoolClassService.listSchoolClass()
        );
    }

    @PostMapping
    public SchoolClassResponseDTO createSchoolClass(
            @RequestBody @Valid SchoolClassRequestDTO dto) {
        return schoolClassMapper.toDTO(
                schoolClassService.createSchoolClass(dto)
        );
    }

    @GetMapping("/{id}")
    public SchoolClassResponseDTO getSchoolClass(@PathVariable Long id) {
        return schoolClassMapper.toDTO(
                schoolClassService.getSchoolClassById(id)
        );
    }

    @PutMapping("/{id}")
    public SchoolClassResponseDTO updateSchoolClass(
            @RequestBody @Valid SchoolClassRequestDTO dto,
            @PathVariable("id") Long id) {
        return schoolClassMapper.toDTO(
                schoolClassService.updateSchoolClass(dto, id)
        );
    }

    @DeleteMapping("/{id}")
    public void deleteSchoolClass(@PathVariable("id") Long id) {
        schoolClassService.deleteSchoolClass(id);
    }
}
