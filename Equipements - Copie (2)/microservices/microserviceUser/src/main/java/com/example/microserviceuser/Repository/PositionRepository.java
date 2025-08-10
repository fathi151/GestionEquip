package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.Position;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PositionRepository extends JpaRepository<Position, String> {
    Position findByTitle(String title);
}
