package com.example.microserviceuser.Entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String registrationNumber;

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String cin;
    private String grade;
    private String employment;
    private String college;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date startingDate;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date dob;

    @JsonFormat(pattern="yyyy-MM-dd")
    private Date recruitmentDate;

    @ManyToOne
    private Position position;

    @ManyToOne
    private Job job;

    @ManyToOne
    private Harbor harbor;

    @JsonIgnore
    @ManyToOne
    private Status status;

    // Keep existing authentication fields for backward compatibility
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String role;

    // Helper method to get full name
    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }
}
