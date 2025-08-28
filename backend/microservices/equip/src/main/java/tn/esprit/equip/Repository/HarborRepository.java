package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.Harbor;

@Repository
public interface HarborRepository extends JpaRepository<Harbor, Long> {
    Harbor findByName(String name);
    Harbor findByLocation(String location);
}
