package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
public class Marque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMarque;

    private String nomMarque;
    private String image;

    @ManyToMany(mappedBy = "marques", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnoreProperties("marques")
    private List<TypeEqui> types;

    @OneToMany(mappedBy = "marque", cascade = CascadeType.ALL)
    private List<Model> models;




}
