package com.example.microserviceuser.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Status {
    @Id
    private Long id;
    private String title;
}
