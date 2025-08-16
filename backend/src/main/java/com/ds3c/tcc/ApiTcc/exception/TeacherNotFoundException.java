package com.ds3c.tcc.ApiTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TeacherNotFoundException extends RuntimeException{

    public TeacherNotFoundException(String username) {
        super("The teacher with username "+username+" was not found");
    }

    public TeacherNotFoundException(Long id) {
        super("The teacher with id "+id+" was not found");
    }
}
