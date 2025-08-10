package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String commentaire;


    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"affectations"})
    User user;


    @ManyToOne
    @JsonIgnoreProperties({"affectations"})

    Equipement equipement;


    Date dateAffectation;

    String verrou;





}
