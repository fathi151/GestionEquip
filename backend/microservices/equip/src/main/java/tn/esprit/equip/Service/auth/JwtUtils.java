package tn.esprit.equip.Service.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    // Définir une clé secrète statique et unique
    private static final String SECRET_KEY = "votre_clé_secrète_uniquevzrbgrbaefbaetntenadsvjsdkvblrBKVSPVOUBZDVP OUBFVPOUV SBDVBSDVÖSDVBSDVUOBSDVBF IUFVBJEFVI"; // Utilisez une chaîne secrète robuste
    private static final Key KEY = new SecretKeySpec(SECRET_KEY.getBytes(), SignatureAlgorithm.HS256.getJcaName());

    private static final long EXPIRATION_TIME = 86400000; // 24 heures (en millisecondes)

    // Génération du token
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)  // Ajoute l'username dans le JWT
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Expiration dans 24 heures
                .signWith(KEY)  // Signature avec la clé secrète
                .compact();  // Génère le token compact
    }

    // Extraction de l'username à partir du token
    public static String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)  // Utilisation de la même clé pour vérifier la signature
                .build()
                .parseClaimsJws(token)  // Parse le token
                .getBody()
                .getSubject();  // Récupère l'username
    }

    // Validation du token
    public static boolean validateToken(String jwtToken, UserDetails userDetails) {
        try {
            String username = extractUsername(jwtToken);  // Récupère l'username du token
            return username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken);
        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            return false;
        }
    }

    // Vérification de l'expiration du token
    public static boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            System.err.println("Error checking token expiration: " + e.getMessage());
            return true; // Consider expired if we can't parse
        }
    }

    // Extraction de la date d'expiration
    public static Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }
}
