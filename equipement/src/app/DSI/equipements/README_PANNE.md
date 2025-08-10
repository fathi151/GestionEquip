# Modèle de Panne - Design Simple

## ✅ Implémentation Terminée

### 🎯 Fonctionnalités
- **Bouton "Panne"** dans chaque ligne du tableau d'équipements
- **Modal simple** avec design cohérent avec les autres composants
- **Formulaire de déclaration** avec 3 champs : titre, priorité, description
- **Validation basique** des champs requis

### 🎨 Design
- **Style cohérent** avec les autres modals de l'application
- **Modal simple** sans Bootstrap complexe
- **Même CSS** que les autres composants (form-inputp, btn-cancel, btn-submit)
- **Design épuré** et fonctionnel

### 📋 Champs du Formulaire
1. **Titre** : Description courte de la panne
2. **Priorité** : Faible, Moyenne, Haute, Critique
3. **Description** : Explication détaillée du problème

### 🔧 Utilisation
1. Cliquer sur le bouton rouge "Panne" dans le tableau
2. Remplir le formulaire dans le modal
3. Cliquer sur "Déclarer" pour soumettre

### 🚀 Backend Requis
L'endpoint suivant doit être implémenté dans Spring Boot :
```java
@PostMapping("/declarerPanne")
public ResponseEntity<Panne> declarerPanne(@RequestBody PanneDTO panneData)
```

### 📁 Fichiers Modifiés
- `equipements.component.ts` : Logique du modal et formulaire
- `equipements.component.html` : Bouton et modal HTML
- `equipements.component.css` : Styles simples
- `type.service.ts` : Méthode `declarerPanne()`
- `Panne.ts` : Modèle de données existant

Le modèle de panne est maintenant **prêt à utiliser** avec un design simple et cohérent ! 🎉
