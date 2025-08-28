package tn.esprit.equip.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import tn.esprit.equip.Entity.Affectation;
import tn.esprit.equip.Entity.Agent;
import tn.esprit.equip.Entity.User;
import tn.esprit.equip.Entity.UserDTO;
import tn.esprit.equip.Repository.AgentRepository;
import tn.esprit.equip.Repository.User2Repository;
import tn.esprit.equip.Repository.UserRepository;
import tn.esprit.equip.Service.auth.CustomUserDetailsService;
import tn.esprit.equip.Service.auth.JwtUtils;
import tn.esprit.equip.Service.auth.MailService;
import tn.esprit.equip.Service.auth.PasswordResetTokenService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userService;

    private AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final User2Repository user2Repository;
    private final AgentRepository agentRepository;

    private final PasswordResetTokenService tokenService;
    private final MailService mailService;

    @Autowired
    public AuthController(PasswordEncoder passwordEncoder, UserRepository userRepository,
                          AuthenticationManager authenticationManager, CustomUserDetailsService userService, User2Repository user2Repository, AgentRepository agentRepository, PasswordResetTokenService tokenService, MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.user2Repository = user2Repository;
        this.agentRepository = agentRepository;
        this.tokenService = tokenService;
        this.mailService = mailService;// Injection correcte
    }
    @GetMapping("/{registrationNumber}")
    public ResponseEntity<User> getUtilisateurById(@PathVariable("registrationNumber") String registrationNumber) {
        return user2Repository.findByRegistrationNumber(registrationNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
  

    @PostMapping("/login")
    public ResponseEntity<UserDTO> authenticate(@RequestBody User utl) {
        System.out.println("Tentative de connexion pour l'utilisateur : " + utl.getRegistrationNumber());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(utl.getRegistrationNumber(), utl.getPassword()));
        } catch (Exception e) {
            System.out.println("Échec de l'authentification : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        String token = JwtUtils.generateToken(utl.getRegistrationNumber());

        // Récupération du rôle utilisateur
        String role = userService.getUserRoleByUsername(utl.getRegistrationNumber());

        // Création des autorités à partir du rôle (avec le préfixe "ROLE_")
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
        System.out.println("Authorities utilisées : " + authorities);
        // Injection dans le contexte Spring Security avec les rôles
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                utl.getRegistrationNumber(),
                token,
                authorities
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String userId = userService.getUserIdByUsername(utl.getRegistrationNumber());

        UserDTO userDTO = new UserDTO();
        userDTO.setToken(token);
        userDTO.setRegistrationNumber(userId);
        userDTO.setRole(role);
        userDTO.setEmail(utl.getEmail());
        return ResponseEntity.ok(userDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetails> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDetails user = userService.loadUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/test")
    public String test() {
        return "message from backend successfully";
    }

    @PostMapping("/test-login")
    public ResponseEntity<String> testLogin(@RequestBody Map<String, String> request) {
        System.out.println("=== TEST LOGIN ENDPOINT CALLED ===");
        System.out.println("Request body: " + request);
        return ResponseEntity.ok("Test login endpoint working");
    }
    // 📌 Endpoint pour demander la réinitialisation du mot de passe
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody UserDTO request) {
        Optional<Agent> agentOpt = agentRepository.findByEmail(request.getEmail());
        if (agentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Email non trouvé");
        }

        Agent agent = agentOpt.get();
        String token = JwtUtils.generateToken(agent.getEmail());
        String resetLink = "http://localhost:4200/reset-password?token=" + token;

        String subject = "Réinitialisation de votre mot de passe";
        String message = "<p>Bonjour,</p>" +
                "<p>Vous avez demandé une réinitialisation de votre mot de passe.</p>" +
                "<p>Cliquez sur le lien ci-dessous pour le réinitialiser :</p>" +
                "<p><a href=\"" + resetLink + "\">Réinitialiser mon mot de passe</a></p>" +
                "<p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>";

        try {
            mailService.sendEmail(agent.getEmail(), subject, message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }

        return ResponseEntity.ok("Email de réinitialisation envoyé !");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody User user) {
        String email = JwtUtils.extractUsername(token);
        if (email == null) {
            return ResponseEntity.badRequest().body("Token invalide ou expiré");
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Utilisateur non trouvé");
        }

        User existingUser = existingUserOpt.get();
        existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(existingUser);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }
    @PostMapping("/ajouterUser")
    public User ajouterUser(@RequestBody User user) {

        User nouvelUtilisateur = userRepository.save(user);

        return nouvelUtilisateur;
    }




    @GetMapping("/AllUsers")
    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }





}