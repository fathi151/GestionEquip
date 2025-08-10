package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Equipement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

     Integer idEqui;
    String numSerie;
    Date dateAffectation;
    @Enumerated(EnumType.STRING)
    private Statut statut;
    String image;
    String description;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"models", "types", "equipements"})
    Model model;


    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    Fournisseur fournisseur;


    @OneToMany(cascade = CascadeType.ALL, mappedBy = "equipement")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Affectation> affectations;

    @OneToOne
    @JsonIgnoreProperties({"equipement"})
    Panne panne;



}
