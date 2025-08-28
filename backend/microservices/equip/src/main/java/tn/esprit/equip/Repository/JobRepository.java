package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Job findByTitle(String title);
}
