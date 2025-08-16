package com.ds3c.tcc.ApiTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SchoolSubjectNotFoundException extends RuntimeException{
    public SchoolSubjectNotFoundException(Long id) {
        super("The subject with id "+id+" was not found.");
    }
    public SchoolSubjectNotFoundException() {
        super("The requested subject was not found.");
    }
}
