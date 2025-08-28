package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.equip.Entity.Dossier;

public interface DossierRepo extends JpaRepository<Dossier,Integer> {
}
