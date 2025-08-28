package tn.esprit.equip.Service.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.equip.Entity.Agent;
import tn.esprit.equip.Entity.User;
import tn.esprit.equip.Repository.AgentRepository;
import tn.esprit.equip.Repository.User2Repository;
import tn.esprit.equip.Repository.UserRepository;

import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String registrationNumber) throws UsernameNotFoundException {
        User user = userRepository.findByRegistrationNumber(registrationNumber);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with registration number: " + registrationNumber);
        }

        // Handle null or empty role by setting default role
        String userRole = user.getRole();
        if (userRole == null || userRole.trim().isEmpty()) {
            userRole = "USER"; // Default role
        }

        // Validate role against allowed roles
        String[] allowedRoles = {"USER", "ADMIN", "DSI", "DAG", "JURIDIQUE"};
        boolean isValidRole = false;
        for (String allowedRole : allowedRoles) {
            if (allowedRole.equalsIgnoreCase(userRole)) {
                userRole = allowedRole.toUpperCase();
                isValidRole = true;
                break;
            }
        }

        if (!isValidRole) {
            userRole = "USER"; // Default to USER if invalid role
        }

        System.out.println("Loading user: " + registrationNumber + " with role: " + userRole);

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getRegistrationNumber())
                .password(user.getPassword() != null ? user.getPassword() : "")
                .roles(userRole) // Spring Security will add ROLE_ prefix automatically
                .build();
    }

    public String getUserIdByUsername(String email) {
        User user = userRepository.findByRegistrationNumber(email);
        return user != null ? user.getRegistrationNumber() : null;
    }

    public String getUserUsername(String email) {
        User user = userRepository.findByRegistrationNumber(email);
        return user != null ? user.getUsername() : null;
    }

    public String getUserRoleByUsername(String username) {
        User user = userRepository.findByRegistrationNumber(username);
        return user != null ? user.getRole() : null;
    }
}