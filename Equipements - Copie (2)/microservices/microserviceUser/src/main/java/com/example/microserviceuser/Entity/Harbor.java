package com.example.microserviceuser.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Harbor {
    @Id

    private Long id;
    private String name;
    private String location;
}
