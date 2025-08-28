package tn.esprit.equip.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/images")
public class imgrest {

    private final String imageDirectory = "src/main/resources/static/images";

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        try {
            // Vérifier si le répertoire existe, sinon, créer le répertoire
            File directory = new File(imageDirectory);
            if (!directory.exists()) {
                if (!directory.mkdirs()) {
                    throw new IOException("Échec de la création du répertoire.");
                }
            }

            // Récupérer le nom du fichier et le sauvegarder
            String filename = file.getOriginalFilename();
            Path path = Paths.get(directory.getAbsolutePath(), filename);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Construire l'URL de l'image
            String imageUrl = "/images/" + filename;

            // Retourner l'URL de l'image
            response.put("imageUrl", imageUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            // Si une erreur se produit, retourner un message d'erreur
            e.printStackTrace();
            response.put("error", "Erreur lors de l'upload de l'image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



}
