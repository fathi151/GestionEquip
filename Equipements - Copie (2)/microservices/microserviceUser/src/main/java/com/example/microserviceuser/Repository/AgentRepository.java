package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Agent findByUsername(String username);
   Optional< Agent> findByEmail(String email);
    Agent findByUser_RegistrationNumber(String registrationNumber);
}
