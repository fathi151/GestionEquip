package tn.esprit.equip.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.equip.Entity.Historique;

public interface HstoriqueRepo extends JpaRepository<Historique, Integer> {

    @Override
    Page<Historique> findAll(Pageable pageable);

    @Query("select h from Historique h where h.commentaire LIKE %:commentaire% ")
    Page<Historique> findByCommentairet(@Param("commentaire") String commentaire, Pageable pageable);
}