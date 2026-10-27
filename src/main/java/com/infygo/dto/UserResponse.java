package com.infygo.dto;

import com.infygo.entity.UserDetails;

/** Public view of a user. The password hash is deliberately absent. */
public record UserResponse(String message, String userId, String name, String city, String email, String phone) {

    public static UserResponse registered(UserDetails user) {
        return new UserResponse("Registration successful", user.getUserId(), user.getName(), user.getCity(),
                user.getEmail(), user.getPhone());
    }
}
