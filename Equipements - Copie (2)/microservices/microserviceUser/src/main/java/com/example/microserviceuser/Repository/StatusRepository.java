package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Status findByTitle(String title);
}
