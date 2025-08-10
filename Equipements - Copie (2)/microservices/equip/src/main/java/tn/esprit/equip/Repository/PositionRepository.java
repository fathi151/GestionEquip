package tn.esprit.equip.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, String> {
    Position findByTitle(String title);
}
