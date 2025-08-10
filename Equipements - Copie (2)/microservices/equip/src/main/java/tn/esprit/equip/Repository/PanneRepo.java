package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.equip.Entity.Panne;

public interface PanneRepo extends JpaRepository<Panne, Integer> {
}
