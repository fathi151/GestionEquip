package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.Agent;

import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Agent findByUsername(String username);
   Optional< Agent> findByEmail(String email);
    Agent findByUser_RegistrationNumber(String registrationNumber);
}
