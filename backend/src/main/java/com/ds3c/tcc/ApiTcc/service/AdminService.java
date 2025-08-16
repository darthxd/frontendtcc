package com.ds3c.tcc.ApiTcc.service;

import com.ds3c.tcc.ApiTcc.dto.Admin.AdminRequestDTO;
import com.ds3c.tcc.ApiTcc.enums.RolesEnum;
import com.ds3c.tcc.ApiTcc.exception.AdminNotFoundException;
import com.ds3c.tcc.ApiTcc.mapper.AdminMapper;
import com.ds3c.tcc.ApiTcc.model.Admin;
import com.ds3c.tcc.ApiTcc.model.User;
import com.ds3c.tcc.ApiTcc.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final UserService userService;
    private final AdminMapper adminMapper;
    private final AdminRepository adminRepository;

    @Autowired
    @Lazy
    public AdminService(UserService userService,
                        AdminMapper adminMapper,
                        AdminRepository adminRepository) {
        this.userService = userService;
        this.adminMapper = adminMapper;
        this.adminRepository = adminRepository;
    }

    public Admin createAdmin(AdminRequestDTO adminRequestDTO) {
        User user = userService.createUser(adminRequestDTO, RolesEnum.ROLE_ADMIN);
        Admin admin = adminMapper.toModel(adminRequestDTO, user.getId());
        return adminRepository.save(admin);
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new AdminNotFoundException(id));
    }

    public List<Admin> listAdmin() {
        return adminRepository.findAll();
    }

    public Admin updateAdmin(AdminRequestDTO dto,
                             Long id) {
        return adminRepository.save(
                adminMapper.updateModelFromDTO(dto, id)
        );
    }

    public void deleteAdmin(Long id) {
        Admin admin = getAdminById(id);
        userService.deleteUser(admin.getUserId());
        adminRepository.delete(admin);
    }
}
