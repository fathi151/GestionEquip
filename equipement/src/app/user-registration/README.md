# Composant d'Enregistrement d'Utilisateur

## Description
Ce composant fournit une interface complète pour l'enregistrement de nouveaux utilisateurs dans le système. Il s'agit d'une page indépendante avec un formulaire complet de validation et d'enregistrement.

## Fonctionnalités

### ✅ Formulaire Complet
- **Informations personnelles** : Prénom, nom, email, téléphone, CIN, date de naissance
- **Informations professionnelles** : Numéro d'enregistrement, grade, emploi, collège, dates importantes
- **Affectations** : Position, poste, port, statut
- **Authentification** : Nom d'utilisateur, mot de passe, rôle

### ✅ Validation Avancée
- Validation en temps réel des champs
- Vérification de la correspondance des mots de passe
- Validation de l'unicité de l'email
- Validation des formats (email, téléphone, etc.)
- Messages d'erreur contextuels

### ✅ Interface Utilisateur
- Design responsive avec Bootstrap
- Sections organisées et claires
- Notifications de succès/erreur
- Indicateurs de chargement
- Navigation intuitive

### ✅ Services Intégrés
- Service utilisateur pour l'enregistrement
- Service de données de référence pour les dropdowns
- Gestion des erreurs et notifications

## Structure des Fichiers

```
src/app/user-registration/
├── user-registration.component.ts      # Logique du composant
├── user-registration.component.html    # Template HTML
├── user-registration.component.css     # Styles CSS
├── user-registration.component.spec.ts # Tests unitaires
├── reference-data.service.ts           # Service pour les données de référence
└── README.md                          # Documentation
```

## Utilisation

### Navigation
Le composant est accessible via la route `/user-registration` et est intégré dans la barre de navigation principale.

### Workflow d'Enregistrement
1. L'utilisateur remplit le formulaire
2. Validation en temps réel des champs
3. Soumission du formulaire
4. Appel au service backend
5. Notification du résultat
6. Redirection vers la liste des utilisateurs

## Configuration

### Routes
```typescript
{path:'user-registration',component:UserRegistrationComponent}
```

### Services Requis
- `UtilisateurService` : Pour l'enregistrement des utilisateurs
- `ReferenceDataService` : Pour les données de référence (positions, jobs, etc.)

### Dépendances
- Angular Reactive Forms
- Bootstrap pour le styling
- Font Awesome pour les icônes

## API Backend

### Endpoint d'Enregistrement
```
POST /auth/register
```

**Payload :**
```json
{
  "id": 0,
  "email": "user@example.com",
  "gender": "",
  "phoneNumber": "0612345678",
  "user": {
    "registrationNumber": "REG001",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "0612345678",
    "cin": "AB123456",
    "grade": "Grade 1",
    "employment": "CDI",
    "college": "Informatique",
    "startingDate": "2023-01-01T00:00:00.000Z",
    "dob": "1990-01-01T00:00:00.000Z",
    "recruitmentDate": "2023-01-01T00:00:00.000Z",
    "position": { "id": "1", "title": "Manager" },
    "job": { "id": 1, "title": "Développeur" },
    "harbor": { "id": 1, "name": "Port Principal", "location": "Casablanca" },
    "status": { "id": 1, "title": "Actif" },
    "username": "johndoe",
    "email": "user@example.com",
    "password": "password123",
    "role": "USER"
  },
  "username": "johndoe",
  "password": "password123",
  "role": "USER"
}
```

### Endpoints de Données de Référence (Optionnels)
```
GET /api/reference/positions
GET /api/reference/jobs
GET /api/reference/harbors
GET /api/reference/statuses
GET /api/reference/roles
```

## Personnalisation

### Ajout de Nouveaux Champs
1. Ajouter le champ dans `initializeForm()`
2. Ajouter la validation appropriée
3. Mettre à jour le template HTML
4. Modifier l'objet de données envoyé au backend

### Modification des Données de Référence
Les données de référence sont gérées par `ReferenceDataService`. Vous pouvez :
- Modifier les données statiques dans le service
- Connecter le service à des endpoints backend réels
- Ajouter de nouvelles catégories de données

### Styling
Le composant utilise des classes Bootstrap et des styles CSS personnalisés. Vous pouvez :
- Modifier `user-registration.component.css` pour les styles spécifiques
- Utiliser des variables CSS pour la cohérence du thème
- Ajouter des animations personnalisées

## Tests

### Tests Unitaires
```bash
ng test --include="**/user-registration/**"
```

### Tests d'Intégration
Le composant inclut des tests pour :
- Initialisation du formulaire
- Validation des champs
- Soumission du formulaire
- Gestion des erreurs
- Navigation

## Sécurité

### Validation Côté Client
- Validation des formats d'entrée
- Vérification de la force du mot de passe
- Sanitisation des données

### Recommandations Backend
- Validation côté serveur obligatoire
- Hachage sécurisé des mots de passe
- Vérification de l'unicité des données
- Authentification et autorisation appropriées

## Maintenance

### Logs et Debugging
Le composant inclut des logs console pour le debugging. En production, considérez :
- Utiliser un service de logging approprié
- Masquer les informations sensibles
- Implémenter un monitoring des erreurs

### Performance
- Les données de référence sont chargées une seule fois
- Validation asynchrone optimisée
- Lazy loading possible pour les grandes listes

## Support

Pour toute question ou problème :
1. Vérifiez la console pour les erreurs
2. Consultez les tests unitaires pour les exemples d'utilisation
3. Vérifiez la configuration des services et routes
