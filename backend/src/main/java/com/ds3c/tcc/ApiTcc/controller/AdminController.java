package com.ds3c.tcc.ApiTcc.controller;

import com.ds3c.tcc.ApiTcc.dto.Admin.AdminRequestDTO;
import com.ds3c.tcc.ApiTcc.dto.Admin.AdminResponseDTO;
import com.ds3c.tcc.ApiTcc.mapper.AdminMapper;
import com.ds3c.tcc.ApiTcc.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final AdminMapper adminMapper;

    public AdminController(AdminService adminService,
                           AdminMapper adminMapper) {
        this.adminService = adminService;
        this.adminMapper = adminMapper;
    }

    @GetMapping
    public List<AdminResponseDTO> listAdmin() {
        return adminMapper.toListDTO(adminService.listAdmin());
    }

    @PostMapping
    public AdminResponseDTO createAdmin(
            @RequestBody @Valid AdminRequestDTO adminRequestDTO) {
        return adminMapper.toDTO(adminService.createAdmin(adminRequestDTO));
    }

    @GetMapping("/{id}")
    public AdminResponseDTO getAdmin(@PathVariable("id") Long id) {
        return adminMapper.toDTO(adminService.getAdminById(id));
    }

    @PutMapping("/{id}")
    public AdminResponseDTO updateAdmin(@RequestBody @Valid AdminRequestDTO dto,
                                        @PathVariable("id") Long id) {
        return adminMapper.toDTO(adminService.updateAdmin(dto, id));
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
}
