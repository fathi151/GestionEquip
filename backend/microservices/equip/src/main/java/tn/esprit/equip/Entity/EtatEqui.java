package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EtatEqui {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    private String responsable;

    @OneToOne
    @JoinColumn(name = "precedent_id")
    @JsonIgnoreProperties({"precedent", "pannes"})
    private EtatEqui precedent;


    @OneToMany(mappedBy = "etatActuel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"etatActuel", "equipement"})
    List<Panne> pannes;

}