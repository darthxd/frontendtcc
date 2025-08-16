package com.ds3c.tcc.ApiTcc.dto.SchoolSubject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchoolSubjectRequestDTO {
    private String name;
    private Set<Long> teacherIds;
}
