package com.ds3c.tcc.ApiTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class AdminNotFoundException extends RuntimeException{

    public AdminNotFoundException(String username) {
        super("The admin with username "+username+" was not found");
    }

    public AdminNotFoundException(Long id) {
        super("The admin with id "+id+" was not found");
    }
}
