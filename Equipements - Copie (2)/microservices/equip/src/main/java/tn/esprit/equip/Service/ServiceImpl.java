package tn.esprit.equip.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import tn.esprit.equip.Entity.*;
import tn.esprit.equip.Repository.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class ServiceImpl implements IServiceEqui {

TypeEquiRepo typeEquiRepo;
MarqueRepo marqueRepo;
ModelRepo modelRepo;
EquipRepo equipRepo;
FournisseurRepo fournisseurRepo;
AffectationEquipementRepo affectationEquipementRepo;
UserRepository userRepository;
AffectationRepo affectationRepo;
EtatRepo etatRepo;

    @Override
    public TypeEqui AddTypeEqui(TypeEqui typeEqui) {
        return typeEquiRepo.save(typeEqui);
    }

    @Override
    public Marque AddMarque(Marque marque) {

        List<TypeEqui> attachedTypes = new ArrayList<>();

        for (TypeEqui t : marque.getTypes()) {
            // Charger le TypeEqui depuis la base pour s'assurer qu'il existe
            TypeEqui typeFromDb = typeEquiRepo.findById(t.getIdType()).orElse(null);
            if (typeFromDb != null) {
                // Ajouter la marque à la liste des marques du type
                typeFromDb.getMarques().add(marque);
                attachedTypes.add(typeFromDb);
            }
        }

        marque.setTypes(attachedTypes);

        return marqueRepo.save(marque);
    }
    @Override
    public List<TypeEqui> getAllTypeEqui() {
        return typeEquiRepo.findAll();
    }

    @Override
    public List<Marque> getAllMarque() {
        return marqueRepo.findAll();
    }


    @Override
    public List<TypeEqui> getAllTypes() {
        List<TypeEqui> types = typeEquiRepo.findAll();

        // 🔥 Debug console
        types.forEach(type -> {
            System.out.println("Type: " + type.getNomType() + " → Marques: " + type.getMarques().size());
        });

        // Force le chargement pour JSON
        types.forEach(type -> type.getMarques().size());

        return types;
    }

    @Override
    @Transactional
    public void delete(int idType) {
        Optional<TypeEqui> optionalType = typeEquiRepo.findById(idType);
        if (optionalType.isPresent()) {
            TypeEqui type = optionalType.get();

            // Supprimer tous les liens avec les marques
            for (Marque marque : new ArrayList<>(type.getMarques())) {
                marque.getTypes().remove(type); // côté inverse
            }

            type.getMarques().clear(); // vider la liste de marques côté TypeEqui

            typeEquiRepo.save(type); // synchroniser la suppression de la jointure

            typeEquiRepo.delete(type); // maintenant on peut supprimer le type
        } else {
            throw new RuntimeException("Type introuvable avec ID = " + idType);
        }
    }

    @Override
    public TypeEqui updateTypee(TypeEqui typeEqui) {
        Optional<TypeEqui> existingTypeOpt = typeEquiRepo.findById(typeEqui.getIdType());

        if (existingTypeOpt.isPresent()) {
            TypeEqui existingType = existingTypeOpt.get();

            // Update the existing terrain's fields
            existingType.setNomType(typeEqui.getNomType());
            existingType.setDescription(typeEqui.getDescription());



            return typeEquiRepo.save(existingType);


        }

        return null;

    }
    @Override
    @Transactional
    public void deleteM(int idMarque) {
        Optional<Marque> optionalMarque = marqueRepo.findById(idMarque);
        if (optionalMarque.isPresent()) {
            Marque marque = optionalMarque.get();

            // Supprimer tous les liens avec les types
            for (TypeEqui type : new ArrayList<>(marque.getTypes())) {
                type.getMarques().remove(marque); // côté inverse
            }

            marque.getTypes().clear(); // vider la liste de types côté Marque

            marqueRepo.save(marque); // synchronise la suppression de lien

            // Maintenant on peut supprimer la marque
            marqueRepo.delete(marque);
        } else {
            throw new RuntimeException("Marque introuvable avec ID = " + idMarque);
        }
    }

    @Override
    @Transactional
    public Marque updateMarque(Marque updatedMarque) {
        Marque existingMarque = marqueRepo.findById(updatedMarque.getIdMarque())
                .orElseThrow(() -> new RuntimeException("Marque not found"));


        existingMarque.setNomMarque(updatedMarque.getNomMarque());
        existingMarque.setImage(updatedMarque.getImage());


        for (TypeEqui oldType : existingMarque.getTypes()) {
            oldType.getMarques().remove(existingMarque);
        }
        existingMarque.getTypes().clear();


        List<TypeEqui> attachedTypes = new ArrayList<>();
        for (TypeEqui type : updatedMarque.getTypes()) {
            TypeEqui typeFromDb = typeEquiRepo.findById(type.getIdType())
                    .orElseThrow(() -> new RuntimeException("Type not found: " + type.getIdType()));


            attachedTypes.add(typeFromDb);
            typeFromDb.getMarques().add(existingMarque);
        }

        existingMarque.setTypes(attachedTypes);

        return marqueRepo.save(existingMarque);
    }

    @Override
    public Model AddModal(Model model) {
        return modelRepo.save(model);
    }

    @Override
    public List<Model> getAllModel() {
        return modelRepo.findAll();
    }

    @Override
    public void deleteMod(int id) {
        modelRepo.deleteById(id);
    }

    @Override
    public Model updateModel(Model model) {
        Optional<Model> existingModeOpt = modelRepo.findById(model.getIdModel());

        if (existingModeOpt.isPresent()) {
            Model existingType = existingModeOpt.get();

            // Update the existing terrain's fields
            existingType.setNomModel(model.getNomModel());
            existingType.setSpecification(model.getSpecification());
            existingType.setMarque(model.getMarque());
            existingType.setTypeAssociee(model.getTypeAssociee());


            return modelRepo.save(existingType);


        }

        return null;
    }

    @Override
    public Equipement AddEquipement(Equipement equipement) {


        return equipRepo.save(equipement);
    }

    @Override
    public Page<Equipement> findAll(Pageable pageable) {
        return equipRepo.findAll(pageable);
    }

    @Override
    public void deleteEqu(int id) {
        Equipement equip = equipRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipement non trouvé"));


        Affectation affectation = affectationRepo.findByEquipementIdEqui(id) ;
        if (affectation != null) {
           affectationRepo.delete(affectation);
        }
        equipRepo.delete(equip);

    }
    @Override
    public Equipement updateEqu(Equipement equipement) {
        Optional<Equipement> existingEquiOpt = equipRepo.findById(equipement.getIdEqui());

        if (existingEquiOpt.isPresent()) {
            Equipement existingType = existingEquiOpt.get();

            // Update the existing terrain's fields
            existingType.setModel(equipement.getModel());
            existingType.setNumSerie(equipement.getNumSerie());
            existingType.setDescription(equipement.getDescription());
            existingType.setDateAffectation(equipement.getDateAffectation());
            existingType.setStatut(equipement.getStatut());
            existingType.setFournisseur(equipement.getFournisseur());
            existingType.setFournisseur(equipement.getFournisseur());


            return equipRepo.save(existingType);


        }

        return null;
    }

    @Override
    public void deleteFournisseur(int id) {
        fournisseurRepo.deleteById(id);
    }

    @Override
    public Fournisseur updateFournisseur(Fournisseur fournisseur) {
        Optional<Fournisseur> existingfournisseurOpt = fournisseurRepo.findById(fournisseur.getIdFournisseur());

        if (existingfournisseurOpt.isPresent()) {
            Fournisseur existingType = existingfournisseurOpt.get();

            // Update the existing terrain's fields
            existingType.setNomFournisseur(fournisseur.getNomFournisseur());
            existingType.setEmailFournisseur(fournisseur.getEmailFournisseur());
            existingType.setAdresseFournisseur(fournisseur.getAdresseFournisseur());
            existingType.setTelephoneFournisseur(fournisseur.getTelephoneFournisseur());
           

            return fournisseurRepo.save(existingType);
    }

        return null;
    }

    @Override
    public Fournisseur AddFournisseur(Fournisseur fournisseur) {
        return fournisseurRepo.save(fournisseur);
    }

    @Override
    public List<Fournisseur> getAllFournisseur() {
return fournisseurRepo.findAll();
    }

    @Override
    public AffectationEquipement AddAffectation(AffectationEquipement affectationEquipement) {
        System.out.println("Équipements reçus: " + affectationEquipement.getEquipement());
        return affectationEquipementRepo.save(affectationEquipement);
    }

    @Override
    public List<AffectationEquipement> getAllAffectation() {
        return affectationEquipementRepo.findAll();
    }

    @Override
    public void deleteAffectationEqui(Long id) {
        affectationEquipementRepo.deleteById(id);
    }

    @Override
    public AffectationEquipement updateAffectation(AffectationEquipement affectationEquipement) {
        Optional<AffectationEquipement> existingaffectationOpt = affectationEquipementRepo.findById(affectationEquipement.getId());

        if (existingaffectationOpt.isPresent()) {
            AffectationEquipement existingType = existingaffectationOpt.get();
            System.out.println("✅ Affectation trouvée, mise à jour en cours pour ID: " + affectationEquipement.getUserRegistrationNumber());

            // Update the existing terrain's fields
            existingType.setUserRegistrationNumber(affectationEquipement.getUserRegistrationNumber());
            existingType.setDateAffectation(affectationEquipement.getDateAffectation());
            existingType.setEquipement(affectationEquipement.getEquipement());



            return affectationEquipementRepo.save(existingType);
        }

        return null;
    }

    @Override
    public void chnageEtat(String commentaire, Long id) {

        AffectationEquipement affectationEquipement=affectationEquipementRepo.findById(id).orElse(null);
        affectationEquipement.getHistoriqueCommentaires().add(commentaire);
affectationEquipementRepo.save(affectationEquipement);



    }

    @Override
    public Page<Equipement> findEquipByMultiple(String search,String username , Pageable page) {
        return equipRepo.searchEquipements(search,username,page);
    }

    @Override
    public Affectation AddAffectation(Affectation affectation) {
        return affectationRepo.save(affectation);
    }

    @Override
    public Equipement findEquiById(Integer idEqui) {
        return equipRepo.findById(idEqui).orElse(null);
    }

    @Override
    @Transactional
    public void deleteEtatWithSuccessors(Long etatId) {
        EtatEqui etatToDelete = etatRepo.findById(etatId.intValue()).orElse(null);
        if (etatToDelete == null) {
            throw new RuntimeException("État non trouvé avec l'ID: " + etatId);
        }

        // Recursively delete all successors first
        deleteEtatAndSuccessorsRecursively(etatToDelete);
    }

    private void deleteEtatAndSuccessorsRecursively(EtatEqui etat) {
        // Find all states that have this state as their precedent (successors)
        List<EtatEqui> successors = etatRepo.findByPrecedent(etat);

        // Recursively delete all successors first
        for (EtatEqui successor : successors) {
            deleteEtatAndSuccessorsRecursively(successor);
        }

        // After deleting all successors, delete the current state
        etatRepo.delete(etat);
    }

    @Override
    public List<User> findUsers(String Search) {
        return userRepository.findByRegistrationNumberContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Search,Search,Search,Search);
    }

    @Override
    public List<EtatEqui> getSuccessors(Long etatId) {
        return etatRepo.findByPrecedentId(etatId);
    }

}

