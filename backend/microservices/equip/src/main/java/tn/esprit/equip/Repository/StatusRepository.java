package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.Status;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Status findByTitle(String title);
}
