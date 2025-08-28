package tn.esprit.equip.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PanneRequest {
    private Integer equipement;
    private Integer etatActuel;
    private Date date;
    private String description;
    private Integer idDossier;
    private Boolean forceNewDossier;
}
