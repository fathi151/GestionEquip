package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.equip.Entity.EtatEqui;

import java.util.List;

public interface EtatRepo extends JpaRepository<EtatEqui,Integer> {

    @Query("SELECT e FROM EtatEqui e WHERE e.precedent.id = :precedentId AND e.responsable = 'DAG'")
    List<EtatEqui> findByPrecedentId(@Param("precedentId") Long precedentId);

    @Query("SELECT e FROM EtatEqui e WHERE e.precedent.id = :precedentId AND e.responsable = 'DSI'")
    List<EtatEqui> findByPrecedentIdDSI(@Param("precedentId") Long precedentId);

    // Find successors for DSI with inter-department transitions
    @Query("SELECT e FROM EtatEqui e WHERE e.precedent.id = :precedentId AND " +
           "(e.responsable = 'DSI' OR " +
           "(e.responsable != 'DSI' AND NOT EXISTS " +
           "(SELECT e2 FROM EtatEqui e2 WHERE e2.precedent.id = :precedentId AND e2.responsable = 'DSI')))")
    List<EtatEqui> findByPrecedentIdDSIWithTransitions(@Param("precedentId") Long precedentId);

    // Find successors for DAG with inter-department transitions
    @Query("SELECT e FROM EtatEqui e WHERE e.precedent.id = :precedentId AND " +
           "(e.responsable = 'DAG' OR " +
           "(e.responsable != 'DAG' AND NOT EXISTS " +
           "(SELECT e2 FROM EtatEqui e2 WHERE e2.precedent.id = :precedentId AND e2.responsable = 'DAG')))")
    List<EtatEqui> findByPrecedentIdDAGWithTransitions(@Param("precedentId") Long precedentId);

    // Find successors for Juridique with inter-department transitions
    @Query("SELECT e FROM EtatEqui e WHERE e.precedent.id = :precedentId AND " +
           "(e.responsable = 'JURIDIQUE' OR " +
           "(e.responsable != 'JURIDIQUE' AND NOT EXISTS " +
           "(SELECT e2 FROM EtatEqui e2 WHERE e2.precedent.id = :precedentId AND e2.responsable = 'JURIDIQUE')))")
    List<EtatEqui> findByPrecedentIdJuridiqueWithTransitions(@Param("precedentId") Long precedentId);

    List<EtatEqui> findByPrecedent(EtatEqui precedent);

    // Find states that have no precedent (default states)
    @Query("SELECT e FROM EtatEqui e WHERE e.precedent IS NULL")
    List<EtatEqui> findDefaultStates();

}
