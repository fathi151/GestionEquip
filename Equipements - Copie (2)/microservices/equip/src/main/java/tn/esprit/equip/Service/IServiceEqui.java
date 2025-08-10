package tn.esprit.equip.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.equip.Entity.*;

import java.util.List;

public interface IServiceEqui {
    public TypeEqui AddTypeEqui(TypeEqui typeEqui);
    public Marque AddMarque(Marque marque);
    public List<TypeEqui> getAllTypeEqui();
    public List<Marque> getAllMarque();
    public List<TypeEqui> getAllTypes();
    public void delete(int id);
    public TypeEqui  updateTypee(TypeEqui typeEqui);
    public void deleteM(int id);
    public Marque  updateMarque(Marque marque);
    public Model AddModal(Model model);
    public List<Model> getAllModel();
    public void deleteMod(int id);
    public Model  updateModel(Model model);
    public Equipement AddEquipement(Equipement equipement);
public Page<Equipement> findAll(Pageable pageable);

    public void deleteEqu(int id);
    public Equipement  updateEqu(Equipement equipement);
    public void deleteFournisseur(int id);

    public Fournisseur updateFournisseur(Fournisseur fournisseur) ;
    public Fournisseur AddFournisseur(Fournisseur fournisseur);

    public List<Fournisseur> getAllFournisseur();
    public AffectationEquipement AddAffectation(AffectationEquipement affectationEquipement);
    public List<AffectationEquipement> getAllAffectation();
    public void deleteAffectationEqui(Long id);
    public AffectationEquipement updateAffectation(AffectationEquipement affectationEquipement);
    public void chnageEtat(String commentaire,Long id);
    Page<Equipement> findEquipByMultiple(String search,String username,Pageable page);
    List<User>findUsers(String Search);
    public Affectation AddAffectation(Affectation affectation);
    Equipement findEquiById(Integer idEqui);

    // EtatEqui methods
    void deleteEtatWithSuccessors(Long etatId);
    List<EtatEqui> getSuccessors(Long etatId);
}
