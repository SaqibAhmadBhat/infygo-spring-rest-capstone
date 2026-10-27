package com.infygo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.springframework.data.domain.Persistable;

/**
 * Maps the prescribed User_Details table. The password column holds a BCrypt hash, never plaintext.
 *
 * Implements Persistable because user_id is assigned by the client: without it Spring Data would call
 * merge() and could silently overwrite an existing row instead of failing on the primary key.
 */
@Entity
@Table(name = "User_Details")
public class UserDetails implements Persistable<String> {

    @Id
    @Column(name = "user_id", length = 30)
    private String userId;

    @Column(name = "name", nullable = false, length = 60)
    private String name;

    @Column(name = "city", nullable = false, length = 50)
    private String city;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Transient
    private boolean newEntity = true;

    protected UserDetails() {
    }

    public UserDetails(String userId, String name, String city, String email, String phone, String passwordHash) {
        this.userId = userId;
        this.name = name;
        this.city = city;
        this.email = email;
        this.phone = phone;
        this.password = passwordHash;
    }

    @Override
    public String getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return newEntity;
    }

    @PostLoad
    @PostPersist
    void markNotNew() {
        this.newEntity = false;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getCity() {
        return city;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }
}
