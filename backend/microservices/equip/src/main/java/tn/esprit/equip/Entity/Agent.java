package tn.esprit.equip.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    private String gender;
    private String phoneNumber;
    
    @OneToOne
    private User user;
    
    // Account info
    @Column(name = "user_username", unique = true)
    private String username;
    
    @Column(name = "user_pwd")
    private String password;
    
    @Column(name = "user_role")
    private String role;
}
