package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Panne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String description;
    private Date date;
    @ManyToOne
    @JoinColumn(name = "equipement_id")

    @JsonIgnore
    private Equipement equipement;






    @ManyToOne(fetch = FetchType.EAGER)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties({"pannes", "precedent"})
    private EtatEqui etatActuel;

    int end=0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dossier_id")
    @JsonIgnoreProperties({"pannes"})
    private Dossier dossier;
    
    @com.fasterxml.jackson.annotation.JsonBackReference
    public Dossier getDossier() { return this.dossier; }
    public void setDossier(Dossier d) { this.dossier = d; }


}