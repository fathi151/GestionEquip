package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.Harbor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HarborRepository extends JpaRepository<Harbor, Long> {
    Harbor findByName(String name);
    Harbor findByLocation(String location);
}
