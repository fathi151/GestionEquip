package com.example.microserviceuser.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Position {
    @Id
    private String id;
    private String title;
}
