import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Agent, Utilisateur, Position, Job, Harbor, Status } from '../utilisateur/Utilisateur';
import { ReferenceDataService } from './reference-data.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  registrationForm!: FormGroup;
  submitted = false;
  loading = false;

  // Notification system
  notification = {
    show: false,
    type: 'success' as 'success' | 'error',
    message: ''
  };

  // Options pour les dropdowns
  positions: Position[] = [];
  jobs: Job[] = [];
  harbors: Harbor[] = [];
  statuses: Status[] = [];
  roles: string[] = [];
  grades: string[] = [];
  employmentTypes: string[] = [];
  colleges: string[] = [];

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private referenceDataService: ReferenceDataService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadReferenceData();
  }

  loadReferenceData(): void {

    this.referenceDataService.getPositions().subscribe(data => this.positions = data);
    this.referenceDataService.getJobs().subscribe(data => this.jobs = data);
    this.referenceDataService.getHarbors().subscribe(data => this.harbors = data);
    this.referenceDataService.getStatuses().subscribe(data => this.statuses = data);
    this.referenceDataService.getRoles().subscribe(data => this.roles = data);
    this.referenceDataService.getGrades().subscribe(data => this.grades = data);
    this.referenceDataService.getEmploymentTypes().subscribe(data => this.employmentTypes = data);
    this.referenceDataService.getColleges().subscribe(data => this.colleges = data);
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      // Informations personnelles
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      cin: ['', [Validators.required, Validators.minLength(6)]],

      // Informations professionnelles
      registrationNumber: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      employment: ['', [Validators.required]],
      college: [''],

      // Dates
      dob: ['', [Validators.required]],
      startingDate: ['', [Validators.required]],
      recruitmentDate: ['', [Validators.required]],

      // Relations
      position: [null, [Validators.required]],
      job: [null, [Validators.required]],
      harbor: [null, [Validators.required]],
      status: [null, [Validators.required]],

      // Authentification
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['USER', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validator personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  // Getters pour faciliter l'accès aux contrôles du formulaire
  get f() { return this.registrationForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      this.markFormGroupTouched();
      this.showNotification('error', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    this.loading = true;

    // Créer l'objet Agent à partir des données du formulaire
    const formData = this.registrationForm.value;

    const utilisateur: Utilisateur = {
      registrationNumber: formData.registrationNumber,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      cin: formData.cin,
      grade: formData.grade,
      employment: formData.employment,
      college: formData.college,
      startingDate: new Date(formData.startingDate),
      dob: new Date(formData.dob),
      recruitmentDate: new Date(formData.recruitmentDate),
      position: formData.position,
      job: formData.job,
      harbor: formData.harbor,
      status: formData.status,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
      }
    };

    const agent: Agent = {
      id: 0, // Sera généré par le backend
      email: formData.email,
      gender: '', // Vous pouvez ajouter ce champ si nécessaire
      phoneNumber: formData.phoneNumber,
      user: utilisateur,
      username: formData.username,
      password: formData.password,
      role: formData.role
    };
    console.log('Agent Data:', utilisateur);

    // Appel au service pour enregistrer l'utilisateur
    this.utilisateurService.register(utilisateur).subscribe({
      next: (response) => {
        console.log('Utilisateur enregistré avec succès:', response);
        this.showNotification('success', 'Utilisateur enregistré avec succès !');
        this.loading = false;

        // Rediriger vers la liste des utilisateurs après un délai
        setTimeout(() => {
          this.router.navigate(['/agent']); // ou vers la page que vous souhaitez
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
        this.loading = false;

        let errorMessage = 'Erreur lors de l\'enregistrement de l\'utilisateur';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showNotification('error', errorMessage);
      }
    });
  }

  // Marquer tous les champs comme touchés pour afficher les erreurs
  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  // Système de notifications
  showNotification(type: 'success' | 'error', message: string): void {
    this.notification = {
      show: true,
      type: type,
      message: message
    };

    // Auto-hide après 5 secondes
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification(): void {
    this.notification.show = false;
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.submitted = false;
    this.registrationForm.reset();
    this.registrationForm.patchValue({
      role: 'USER' // Valeur par défaut
    });
  }

  // Méthode pour naviguer vers une autre page
  navigateToUserList(): void {
    this.router.navigate(['/agent']);
  }

  // Vérification de la disponibilité de l'email
  checkEmailAvailability(): void {
    const email = this.registrationForm.get('email')?.value;
    if (email && this.registrationForm.get('email')?.valid) {
      this.utilisateurService.checkEmailAvailability(email).subscribe({
        next: (response) => {
          if (!response.available) {
            this.registrationForm.get('email')?.setErrors({ emailTaken: true });
          }
        },
        error: (error) => {
          console.error('Erreur lors de la vérification de l\'email:', error);
        }
      });
    }
  }
}
