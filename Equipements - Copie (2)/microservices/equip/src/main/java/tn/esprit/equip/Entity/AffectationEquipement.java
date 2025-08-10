package tn.esprit.equip.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AffectationEquipement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userRegistrationNumber;

    private Date dateAffectation;

    private String commentaire;

    @ManyToMany(fetch =
            FetchType.EAGER)

    @JoinTable(
            name = "affectation_equipements",
            joinColumns = @JoinColumn(name = "affectation_id"),
            inverseJoinColumns = @JoinColumn(name = "equipement_id")
    )
    private List<Equipement> equipement;


    @ElementCollection
    @CollectionTable(name = "affectation_commentaires", joinColumns = @JoinColumn(name = "affectation_id"))
    @Column(name = "commentaire")
    private List<String> historiqueCommentaires;


}
