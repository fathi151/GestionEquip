package tn.esprit.equip.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.equip.Entity.Equipement;

import java.util.List;

public interface EquipRepo extends JpaRepository<Equipement, Integer> {
    @Query("SELECT DISTINCT e FROM Equipement e " +
            "JOIN e.fournisseur f " +
            "LEFT JOIN e.affectations a " +
            "LEFT JOIN a.user u " +
            "WHERE (:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(e.numSerie) LIKE %:keyword% OR " +
            "LOWER(e.model.nomModel) LIKE %:keyword% OR " +
            "LOWER(f.nomFournisseur) LIKE %:keyword%) " +
            "AND (:username IS NULL OR :username = '' OR LOWER(u.username) LIKE %:username%)")
    Page<Equipement> searchEquipements(
            @Param("keyword") String keyword,
            @Param("username") String username,
            Pageable pageable);


    @Query("SELECT DISTINCT e FROM Equipement e JOIN e.fournisseur f " +
            "WHERE (LOWER(e.numSerie) LIKE %:keyword% " +
            "OR LOWER(e.model.nomModel) LIKE %:keyword% " +
            "OR LOWER(f.nomFournisseur) LIKE %:keyword%) " +
            "AND e.statut = :statut")
    Page<Equipement> searchEquipementsWithStatut(@Param("keyword") String keyword,
                                                 @Param("statut") tn.esprit.equip.Entity.Statut statut,
                                                 Pageable pageable);


    List<Equipement> findAllByIdEquiIn(List<Integer> idEqui);







}
