package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.equip.Entity.AffectationEquipement;
@Repository
public interface AffectationEquipementRepo extends JpaRepository<AffectationEquipement,Long> {
}
