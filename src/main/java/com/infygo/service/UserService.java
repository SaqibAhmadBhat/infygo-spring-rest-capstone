package com.infygo.service;

import java.util.Locale;
import java.util.Optional;

import com.infygo.dto.LoginRequest;
import com.infygo.dto.LoginResponse;
import com.infygo.dto.RegisterRequest;
import com.infygo.dto.UserResponse;
import com.infygo.entity.UserDetails;
import com.infygo.exception.DuplicateResourceException;
import com.infygo.exception.InvalidCredentialsException;
import com.infygo.repository.UserDetailsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserDetailsRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    /** Compared against when the user does not exist, so both failure paths take similar time. */
    private final String dummyHash;

    public UserService(UserDetailsRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.dummyHash = passwordEncoder.encode("timing-equaliser-not-a-real-password");
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String userId = normaliseUserId(request.userId());
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsById(userId)) {
            throw new DuplicateResourceException("user.userId.duplicate");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("user.email.duplicate");
        }

        UserDetails user = new UserDetails(userId, request.name().trim(), request.city().trim(), email,
                request.phone().trim(), passwordEncoder.encode(request.password()));
        // saveAndFlush surfaces a concurrent duplicate (unique key violation) inside this method.
        userRepository.saveAndFlush(user);
        log.info("Registered user {}", userId);
        return UserResponse.registered(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Optional<UserDetails> user = userRepository.findById(normaliseUserId(request.userId()));
        String storedHash = user.map(UserDetails::getPassword).orElse(dummyHash);
        boolean passwordMatches = passwordEncoder.matches(request.password(), storedHash);

        if (user.isEmpty() || !passwordMatches) {
            throw new InvalidCredentialsException();
        }
        UserDetails u = user.get();
        return new LoginResponse("Login successful", u.getUserId(), u.getName(), u.getEmail());
    }

    /** User ids are case-insensitive (stored in lower case) so "Asha01" and "asha01" are the same account. */
    static String normaliseUserId(String userId) {
        return userId.trim().toLowerCase(Locale.ROOT);
    }
}
