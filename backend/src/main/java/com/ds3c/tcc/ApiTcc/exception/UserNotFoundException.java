package com.ds3c.tcc.ApiTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException(String username) {
        super("The user with username "+username+" was not found");
    }

    public UserNotFoundException(Long id) {
        super("The user with id "+id+" was not found");
    }
}
