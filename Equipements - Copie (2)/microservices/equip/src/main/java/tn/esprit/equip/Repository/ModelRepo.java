package tn.esprit.equip.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.equip.Entity.Model;

import java.util.List;

public interface ModelRepo extends JpaRepository<Model, Integer> {

    @Query("SELECT m FROM Model m WHERE LOWER(m.nomModel) LIKE LOWER(CONCAT('%', :nomModel, '%'))")
    List<Model> findModelByNomModel(@Param("nomModel") String nomModel);


}
