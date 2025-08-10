package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface User2Repository extends JpaRepository<User, String> {
    User findByEmail(String email);
   Optional <User> findByRegistrationNumber(String registrationNumber);

}
