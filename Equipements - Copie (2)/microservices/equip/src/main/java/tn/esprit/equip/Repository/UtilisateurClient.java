package tn.esprit.equip.Repository;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import tn.esprit.equip.Entity.UserDTO;


public interface UtilisateurClient {

    @GetMapping("/auth/{registrationNumber}")
    UserDTO getUtilisateurById(@PathVariable("registrationNumber") String registrationNumber);
}