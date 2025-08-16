package com.ds3c.tcc.ApiTcc.model;

import com.ds3c.tcc.ApiTcc.enums.CoursesEnum;
import com.ds3c.tcc.ApiTcc.enums.GradesEnum;
import com.ds3c.tcc.ApiTcc.enums.ShiftsEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SchoolClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GradesEnum grade;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CoursesEnum course;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftsEnum shift;
    private Set<Long> teacherIds;
}
