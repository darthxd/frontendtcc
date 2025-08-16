package com.ds3c.tcc.ApiTcc.dto.SchoolClass;

import com.ds3c.tcc.ApiTcc.enums.CoursesEnum;
import com.ds3c.tcc.ApiTcc.enums.GradesEnum;
import com.ds3c.tcc.ApiTcc.enums.ShiftsEnum;
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
public class SchoolClassRequestDTO {
    private String name;
    private String grade;
    private String course;
    private String shift;
    private Set<Long> teacherIds;
}
