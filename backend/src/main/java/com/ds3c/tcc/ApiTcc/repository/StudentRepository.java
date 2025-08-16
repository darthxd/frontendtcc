package com.ds3c.tcc.ApiTcc.repository;

import com.ds3c.tcc.ApiTcc.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
}
