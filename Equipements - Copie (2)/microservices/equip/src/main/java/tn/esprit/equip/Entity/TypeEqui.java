package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TypeEqui {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idType;

    private String nomType;
    private String description;
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "marque_type",  // vérifier le nom exact dans ta BDD
            joinColumns = @JoinColumn(name = "type_id"),
            inverseJoinColumns = @JoinColumn(name = "marque_id")
    )
    @JsonIgnoreProperties("types")
    private List<Marque> marques;


}
