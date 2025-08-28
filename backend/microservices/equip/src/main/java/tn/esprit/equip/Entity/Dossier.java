package tn.esprit.equip.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@AllArgsConstructor
@NoArgsConstructor
public class Dossier {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;
  String dossierNom;


  Date dateCreation;
  @OneToMany(mappedBy = "dossier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @com.fasterxml.jackson.annotation.JsonManagedReference
  List<Panne> pannes;

}
