package com.ds3c.tcc.ApiTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SchoolClassNotFoundException extends RuntimeException{
    public SchoolClassNotFoundException(Long id) {
        super("The class with id "+id+" was not found.");
    }
    public SchoolClassNotFoundException() {
        super("The requested class was not found.");
    }
}
