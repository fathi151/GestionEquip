package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.equip.Entity.User;

import java.util.Optional;

public interface User2Repository extends JpaRepository<User, String> {
    User findByEmail(String email);
   Optional <User> findByRegistrationNumber(String registrationNumber);

}
