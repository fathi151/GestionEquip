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

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int idModel;
    String nomModel;
    String specification;
    String typeAssociee;

@ManyToOne
@OnDelete(action = OnDeleteAction.CASCADE)
@JsonIgnoreProperties({"models", "types","equipements"})
Marque marque;


@OneToMany(mappedBy = "model", cascade = CascadeType.ALL)
@OnDelete(action = OnDeleteAction.CASCADE)
List<Equipement> equipements;


}
