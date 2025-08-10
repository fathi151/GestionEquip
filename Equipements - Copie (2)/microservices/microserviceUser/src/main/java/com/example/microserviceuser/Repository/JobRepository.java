package com.example.microserviceuser.Repository;

import com.example.microserviceuser.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Job findByTitle(String title);
}
