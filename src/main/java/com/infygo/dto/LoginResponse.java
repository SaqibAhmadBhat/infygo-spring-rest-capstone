package com.infygo.dto;

/**
 * Login result. No token is issued: the PS only requires credential verification against the database,
 * and returning a token the API never validates would be misleading (see README, "Security scope").
 */
public record LoginResponse(String message, String userId, String name, String email) {
}
