package com.ds3c.tcc.ApiTcc.repository;

import com.ds3c.tcc.ApiTcc.model.SchoolSubject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolSubjectRepository extends JpaRepository<SchoolSubject, Long> {
    Iterable<Long> id(Long id);
}
