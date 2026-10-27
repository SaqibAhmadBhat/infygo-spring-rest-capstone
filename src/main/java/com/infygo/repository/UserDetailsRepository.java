package com.infygo.repository;

import com.infygo.entity.UserDetails;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, String> {

    boolean existsByEmail(String email);
}
