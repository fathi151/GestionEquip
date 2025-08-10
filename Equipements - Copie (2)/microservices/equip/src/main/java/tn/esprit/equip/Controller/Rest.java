package tn.esprit.equip.Controller;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.equip.Entity.*;
import tn.esprit.equip.Repository.*;
import tn.esprit.equip.Service.IServiceEqui;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import static tn.esprit.equip.Entity.Statut.AFFECTE;
import static tn.esprit.equip.Entity.Statut.DISPONIBLE;

@AllArgsConstructor
@RestController
@RequestMapping("/equi")
@CrossOrigin(origins = "http://localhost:4200")

public class Rest {


    IServiceEqui serviceimpl;
    EquipRepo equipRepo;
    AffectationRepo affectationRepo;
    HstoriqueRepo historiqueRepo;
    ModelRepo modelRepo;
    EtatRepo etatRepo;

    PanneRepo panneRepo;


    @GetMapping("/test-auth")
    public ResponseEntity<Object> testAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Authentication successful! You have access to equipment functions.");
        response.put("username", authentication.getName());
        response.put("authorities", authentication.getAuthorities());
        response.put("isAuthenticated", authentication.isAuthenticated());
        response.put("principal", authentication.getPrincipal().getClass().getSimpleName());

        // Extract role from authorities
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        response.put("role", role);
        response.put("timestamp", java.time.LocalDateTime.now());

        // Debug current security context
        System.out.println("Test-auth endpoint - Authentication: " + authentication);
        System.out.println("Test-auth endpoint - Authorities: " + authentication.getAuthorities());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/debug-auth")
    public ResponseEntity<Object> debugAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        java.util.Map<String, Object> response = new java.util.HashMap<>();

        if (authentication == null) {
            response.put("error", "No authentication found in SecurityContext");
            return ResponseEntity.status(401).body(response);
        }

        response.put("authType", authentication.getClass().getSimpleName());
        response.put("principal", authentication.getPrincipal());
        response.put("credentials", authentication.getCredentials() != null ? "Present" : "Null");
        response.put("authorities", authentication.getAuthorities());
        response.put("isAuthenticated", authentication.isAuthenticated());
        response.put("name", authentication.getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/public-test")
    public ResponseEntity<Object> publicTest() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Public endpoint working - no authentication required");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/token-info")
    public ResponseEntity<Object> tokenInfo(jakarta.servlet.http.HttpServletRequest request) {
        java.util.Map<String, Object> response = new java.util.HashMap<>();

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = tn.esprit.equip.Service.auth.JwtUtils.extractUsername(token);
                java.util.Date expiration = tn.esprit.equip.Service.auth.JwtUtils.extractExpiration(token);
                boolean isExpired = tn.esprit.equip.Service.auth.JwtUtils.isTokenExpired(token);

                response.put("username", username);
                response.put("expiration", expiration);
                response.put("isExpired", isExpired);
                response.put("currentTime", new java.util.Date());
                response.put("tokenValid", !isExpired);
            } catch (Exception e) {
                response.put("error", "Invalid token: " + e.getMessage());
            }
        } else {
            response.put("error", "No Bearer token found");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> adminOnly() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "This endpoint requires ADMIN role");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user-only")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> userOnly() {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "This endpoint requires USER role");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addType")
    public TypeEqui AddTypeEqui(@RequestBody TypeEqui typeEqui) {
        return serviceimpl.AddTypeEqui(typeEqui);
    }

    @PostMapping("/addMarque")
    public Marque AddMarque(@RequestBody Marque marque) {
        return serviceimpl.AddMarque(marque);
    }

    @PostMapping("/images")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Path path = Paths.get("file:C:/Users/Lenovo/Desktop/Equipements/microservices/equip/src/main/resources/static/images/" + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        }
    }


    @GetMapping("/getTypes")
    public List<TypeEqui> getAllTypeEqui() {
        return serviceimpl.getAllTypeEqui();
    }

    @GetMapping("/getall")
    public List<TypeEqui> getAllTypes() {
        return serviceimpl.getAllTypes();
    }

    @GetMapping("/getallMarque")
    public List<Marque> getAllMarque() {
        return serviceimpl.getAllMarque();
    }

    @DeleteMapping("/deleteType/{id}")
    public void delete(@PathVariable("id") int id) {
        serviceimpl.delete(id);
    }

    @PutMapping("/updateType")
    public TypeEqui updateTypee(@RequestBody TypeEqui typeEqui) {
        // Fetch the existing terrain by ID
        return serviceimpl.updateTypee(typeEqui);
    }

    @DeleteMapping("/deleteMarque/{id}")
    public void deleteM(@PathVariable("id") int id) {
        serviceimpl.deleteM(id);
    }

    @PutMapping("/updateMarque")
    public Marque updateMarque(@RequestBody Marque marque) {
        return serviceimpl.updateMarque(marque);
    }

    @PostMapping("/addModel")
    public Model AddModel(@RequestBody Model model) {
        return serviceimpl.AddModal(model);
    }


    @GetMapping("/getModels")
    public List<Model> getAllModels() {
        return serviceimpl.getAllModel();

    }
    @GetMapping("/getModels1")
    public Page<Model> getAllModels1(@RequestParam int size,@RequestParam int page) {
        Pageable pageable = PageRequest.of(page, size);
        return modelRepo.findAll(pageable);

    }
@DeleteMapping("/deleteModel/{id}")
    public void deleteMod(@PathVariable("id") int id) {
        serviceimpl.deleteMod(id);
    }

    @PutMapping("/updateModel")
    public Model updateModel(@RequestBody Model model) {
        return serviceimpl.updateModel(model);
    }
    @PostMapping("/addEqui")
    public Equipement AddEquipement(@RequestBody Equipement equi) {
        return serviceimpl.AddEquipement(equi);
    }
    @GetMapping("/getallEqui")
    public Page<Equipement> getAllEquipements(
            @RequestParam int page,
            @RequestParam int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
       return serviceimpl.findAll(pageable);
    }

    @GetMapping("/searchedEqui")
    public Page<Equipement> findEquipByMultiple(@RequestParam String keyword,
@RequestParam String username,
                                                @RequestParam int page,
                                                @RequestParam int size) {


        Pageable pageable = PageRequest.of(page, size);
        return serviceimpl.findEquipByMultiple(keyword,username, pageable);
    }

    @GetMapping("/searchedEqui1")
    public Page<Equipement> findEquipByMultiplewithStatus(@RequestParam String keyword,
@RequestParam Statut statut,
                                                @RequestParam int page,
                                                @RequestParam int size) {

        Pageable pageable = PageRequest.of(page, size);
        return equipRepo.searchEquipementsWithStatut(keyword,statut,pageable);
    }



    @DeleteMapping("/deleteEqui/{id}")
    public void deleteEqui(@PathVariable("id") int id) {
        serviceimpl.deleteEqu(id);
    }

    @PutMapping("/updateEqui")
    public Equipement updateEqui(@RequestBody Equipement equipement) {
        return serviceimpl.updateEqu(equipement);
    }


    @DeleteMapping("/deleteFournisseur/{id}")
    public void deleteFournisseur(@PathVariable("id") int id) {
        serviceimpl.deleteFournisseur(id);
    }

    @PutMapping("/updateFournisseur")
    public Fournisseur updateFournisseur(@RequestBody Fournisseur fournisseur) {
    return  serviceimpl.updateFournisseur(fournisseur);
    }

    @PostMapping("/addFournisseur")
    public Fournisseur AddFournisseur(@RequestBody Fournisseur fournisseur) {
return  serviceimpl.AddFournisseur(fournisseur);
    }

    @GetMapping("/getallFournisseur")

    public List<Fournisseur> getAllFournisseur() {
return serviceimpl.getAllFournisseur();
    }


    @PostMapping("/affToEqui")
    public AffectationEquipement AddAffectation(@RequestBody  AffectationEquipement affectationEquipement) {
        return serviceimpl.AddAffectation(affectationEquipement);
    }
    @GetMapping("/getallAffectation")
    public List<AffectationEquipement> getAllAffectation() {
        return serviceimpl.getAllAffectation();
    }

    @DeleteMapping("/deleteAffectation/{id}")
    public void deleteAffectation(@PathVariable("id") Long id) {
        Affectation aff = affectationRepo.findById(id).orElse(null);
        if (aff != null) {
            aff.setVerrou("dessafecter");
            affectationRepo.save(aff);
        }
    }

    @PutMapping("/updateAffectation")
    public AffectationEquipement updateAffectation(@RequestBody AffectationEquipement affectationEquipement) {
        return serviceimpl.updateAffectation(affectationEquipement);
    }

    @PutMapping("/updateCommentaire/{id}")
    public void changeEtat(@RequestBody  String commentaire, @PathVariable("id") Long id) {
        serviceimpl.chnageEtat(commentaire, id);
    }
    @GetMapping("/findedUsers")
    List<User>findUsers(@RequestParam("q") String Search)
    {
     return    serviceimpl.findUsers(Search);

    }


    @PostMapping("/addAff")
    public Affectation AddAffectation(@RequestBody Affectation affectation) {
        return serviceimpl.AddAffectation(affectation);
    }


    @GetMapping("/getEquip/{id}")
    public Equipement getEquip(@PathVariable("id") int id) {
        return serviceimpl.findEquiById(id);
    }


    @PutMapping("/statutAffecte/{id}")
    public void statutAffecte(@PathVariable("id") Integer id) {
        Equipement equipement = serviceimpl.findEquiById(id);
        equipement.setStatut(AFFECTE);
        equipRepo.save(equipement);
    }
    @PutMapping("/statutDisponible/{id}")
    public void statutDisponible(@PathVariable("id") Integer id) {
        Equipement equipement = serviceimpl.findEquiById(id);
        equipement.setStatut(DISPONIBLE);
        equipRepo.save(equipement);
    }
@PutMapping("/updateAffect")
    public Affectation updateAffectation(@RequestBody Affectation affectation) {

        Affectation affectationPrevious=affectationRepo.findByEquipementIdEqui(affectation.getEquipement().getIdEqui());
        affectationPrevious.setVerrou("dessaffecter");

         return affectationRepo.save(affectation);
    }


    @GetMapping("/getAff/{id}")
    public Affectation getAff(@PathVariable("id") int id) {
        return affectationRepo.findByEquipementIdEqui(id);
    }


    @DeleteMapping("/deleteAffect/{id}")
    public void deleteAffectation(@PathVariable("id") int id) {
        Affectation aff= affectationRepo.findByEquipementIdEqui(id);
        affectationRepo.delete(aff);
    }

    @GetMapping("/getallAff")
    public Page<Affectation> getAllAff(@RequestParam int page,@RequestParam int size) {
            Pageable pageable = PageRequest.of(page, size);
            return affectationRepo.findAll(pageable);

    }
    @PostMapping("/addHistorique")
    public Historique AddHistorique(@RequestBody Historique historique) {
        return historiqueRepo.save(historique);
    }

    @GetMapping("/getMode")
    public List<Model> getAllom(@RequestParam("q") String Search) {
        return modelRepo.findModelByNomModel(Search);
    }

    @GetMapping("/allHistorique")
    public Page<Affectation> getAllHistorique(@RequestParam int page,@RequestParam int size) {
        return affectationRepo.findAll(PageRequest.of(page, size, Sort.by("dateAffectation").descending()));

    }

    @GetMapping("/getSearchedHistorique")
    Page<Historique> findHistoriqueByMultiple(@RequestParam String keyword, @RequestParam int page, @RequestParam int size) {
        Pageable pageable=PageRequest.of(page,size,Sort.by("date").descending());
        return historiqueRepo.findByCommentairet(keyword,pageable);
    }

    @GetMapping("/getAffectationsByEquipments")
    public List<Affectation> getAffectationsByEquipments(@RequestParam List<Integer> ids) {
List<Equipement> equipements=equipRepo.findAllByIdEquiIn(ids);
return affectationRepo.findByEquipementInAndCerouEqualsOne(equipements);

    }
    @GetMapping("/DSIEquip")
    public Page<Equipement> findEquipementsDSI(@RequestParam int page,@RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return affectationRepo.findEquipementsDSI(pageable);
    }

    @GetMapping("/DAGEquip")
    public Page<Equipement> findEquipementsDAGE(@RequestParam int page,@RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return affectationRepo.findEquipmentDAG(pageable);
    }
    @GetMapping("/JuridiqueEquip")
    public Page<Equipement> findEquipementsJuridique(@RequestParam int page,@RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return affectationRepo.findEquipmentJuridique(pageable);
    }


    @PostMapping("/AjoutPanne")
    public Panne addPanne(@RequestBody Panne panneData) {
        Equipement equipement = equipRepo.findById(panneData.getEquipement().getIdEqui())
                .orElseThrow(() -> new RuntimeException("Equipement not found"));


        panneData.setEquipement(equipement);
        Panne savedPanne = panneRepo.save(panneData);


        equipement.setPanne(savedPanne);
        equipRepo.save(equipement);

        return savedPanne;
    }


    @PutMapping("/changerEtatPanne/{id}/{idEtat}")
    public void changerEtatPanne(@PathVariable("id") Integer id,@PathVariable("idEtat") Integer idEtat) {
        Panne panne=panneRepo.findById(id).get();
EtatEqui etat=etatRepo.findById(idEtat).get();
        panne.setEtatActuel(etat);
        panneRepo.save(panne);
    }


    @DeleteMapping("/annulerPanne/{equipementId}")
    public ResponseEntity<?> annulerPanne(@PathVariable("equipementId") Integer equipementId) {
        try {
            Equipement equipement = equipRepo.findById(equipementId).orElse(null);
            if (equipement != null && equipement.getPanne() != null) {
                Panne panne = equipement.getPanne();


                EtatEqui etatActuel = panne.getEtatActuel();


                panne.setEtatActuel(null);
                equipement.setPanne(null);


                equipRepo.save(equipement);


                if (etatActuel != null) {
                    etatRepo.deleteById(etatActuel.getId().intValue());
                }

                // Finally delete the panne
                panneRepo.delete(panne);

                return ResponseEntity.ok().body("Panne annulée avec succès");
            } else {
                return ResponseEntity.badRequest().body("Aucune panne trouvée pour cet équipement");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'annulation de la panne");
        }
    }
    @PutMapping("/updatePanne/{id}")
    public void updatePanne(@PathVariable("id") Integer id) {
        Panne pa = panneRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Panne avec id " + id + " non trouvée"));


        EtatEqui etatActuel = pa.getEtatActuel();
        EtatEqui precedent = etatActuel.getPrecedent();



            precedent = etatRepo.save(precedent);


        pa.setEtatActuel(precedent);
        panneRepo.save(pa);
        etatRepo.deleteById(etatActuel.getId().intValue());

    }



    @GetMapping("/etats")
    public List<EtatEqui> getAllEtats() {
        return etatRepo.findAll();
    }

    @GetMapping("/default")
    public List<EtatEqui> getDefaultEtats() {
        return etatRepo.findDefaultStates();
    }

    @GetMapping("/etats/{id}")
    public ResponseEntity<EtatEqui> getEtatById(@PathVariable("id") Long id) {
        EtatEqui etat = etatRepo.findById(id.intValue()).orElse(null);
        if (etat != null) {
            return ResponseEntity.ok(etat);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/etatsAjou")
    public EtatEqui createEtat(@RequestBody EtatEqui etat) {
        return etatRepo.save(etat);
    }

    @PutMapping("/etatUpdate/{id}")
    public ResponseEntity<EtatEqui> updateEtat(@PathVariable("id") Long id, @RequestBody EtatEqui etatDetails) {
        EtatEqui etat = etatRepo.findById(id.intValue()).orElse(null);
        if (etat != null) {
            etat.setTitre(etatDetails.getTitre());
            etat.setResponsable(etatDetails.getResponsable());
            etat.setPrecedent(etatDetails.getPrecedent());
            return ResponseEntity.ok(etatRepo.save(etat));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deleteetats/{id}")
    public void deleteEtat(@PathVariable("id") Long id) {
            serviceimpl.deleteEtatWithSuccessors(id);

    }

    @GetMapping("/etats/{id}/successors")
    public List<EtatEqui> getSuccessors(@PathVariable("id") Long id) {
        return etatRepo.findByPrecedentId(id);
    }
    @GetMapping("/etats/{id}/successorsDSI")
    public List<EtatEqui> getSuccessorsDSI(@PathVariable("id") Long id) {
        return etatRepo.findByPrecedentIdDSI(id);
    }

    // New endpoints with inter-department transitions
    @GetMapping("/etats/{id}/successors/dsi")
    public List<EtatEqui> getSuccessorsDSIWithTransitions(@PathVariable("id") Long id) {
        return etatRepo.findByPrecedentIdDSIWithTransitions(id);
    }

    @GetMapping("/etats/{id}/successors/dag")
    public List<EtatEqui> getSuccessorsDAGWithTransitions(@PathVariable("id") Long id) {
        return etatRepo.findByPrecedentIdDAGWithTransitions(id);
    }

    @GetMapping("/etats/{id}/successors/juridique")
    public List<EtatEqui> getSuccessorsJuridiqueWithTransitions(@PathVariable("id") Long id) {
        return etatRepo.findByPrecedentIdJuridiqueWithTransitions(id);
    }

















































}