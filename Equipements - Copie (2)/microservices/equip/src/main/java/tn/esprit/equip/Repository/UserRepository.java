package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUsername(String username);
    User findByRegistrationNumber(String registrationNumber);
    Optional<User> findByEmail(String email);
    List<User> findByRegistrationNumberContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String registrationNumber,String firstName, String lastName, String email);

}
