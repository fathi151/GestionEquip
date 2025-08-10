package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.equip.Entity.Fournisseur;

public interface FournisseurRepo extends JpaRepository<Fournisseur,Integer> {
}
