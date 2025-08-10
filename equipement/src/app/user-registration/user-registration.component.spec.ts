import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UserRegistrationComponent } from './user-registration.component';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { ReferenceDataService } from './reference-data.service';

describe('UserRegistrationComponent', () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;
  let mockUtilisateurService: jasmine.SpyObj<UtilisateurService>;
  let mockReferenceDataService: jasmine.SpyObj<ReferenceDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const utilisateurServiceSpy = jasmine.createSpyObj('UtilisateurService', ['register', 'checkEmailAvailability']);
    const referenceDataServiceSpy = jasmine.createSpyObj('ReferenceDataService', [
      'getPositions', 'getJobs', 'getHarbors', 'getStatuses', 'getRoles', 'getGrades', 'getEmploymentTypes', 'getColleges'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [UserRegistrationComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: UtilisateurService, useValue: utilisateurServiceSpy },
        { provide: ReferenceDataService, useValue: referenceDataServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRegistrationComponent);
    component = fixture.componentInstance;
    mockUtilisateurService = TestBed.inject(UtilisateurService) as jasmine.SpyObj<UtilisateurService>;
    mockReferenceDataService = TestBed.inject(ReferenceDataService) as jasmine.SpyObj<ReferenceDataService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Setup default return values for reference data service
    mockReferenceDataService.getPositions.and.returnValue(of([]));
    mockReferenceDataService.getJobs.and.returnValue(of([]));
    mockReferenceDataService.getHarbors.and.returnValue(of([]));
    mockReferenceDataService.getStatuses.and.returnValue(of([]));
    mockReferenceDataService.getRoles.and.returnValue(of([]));
    mockReferenceDataService.getGrades.and.returnValue(of([]));
    mockReferenceDataService.getEmploymentTypes.and.returnValue(of([]));
    mockReferenceDataService.getColleges.and.returnValue(of([]));
  });

  beforeEach(() => {
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.get('role')?.value).toBe('USER');
  });

  it('should load reference data on init', () => {
    expect(mockReferenceDataService.getPositions).toHaveBeenCalled();
    expect(mockReferenceDataService.getJobs).toHaveBeenCalled();
    expect(mockReferenceDataService.getHarbors).toHaveBeenCalled();
    expect(mockReferenceDataService.getStatuses).toHaveBeenCalled();
    expect(mockReferenceDataService.getRoles).toHaveBeenCalled();
    expect(mockReferenceDataService.getGrades).toHaveBeenCalled();
    expect(mockReferenceDataService.getEmploymentTypes).toHaveBeenCalled();
    expect(mockReferenceDataService.getColleges).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    component.onSubmit();
    expect(component.submitted).toBe(true);
    expect(component.registrationForm.invalid).toBe(true);
  });

  it('should validate password match', () => {
    component.registrationForm.patchValue({
      password: 'password123',
      confirmPassword: 'differentPassword'
    });
    
    expect(component.registrationForm.errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should call register service on valid form submission', () => {
    // Setup valid form data
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '0612345678',
      cin: 'AB123456',
      registrationNumber: 'REG001',
      grade: 'Grade 1',
      employment: 'CDI',
      college: 'Informatique',
      dob: '1990-01-01',
      startingDate: '2023-01-01',
      recruitmentDate: '2023-01-01',
      position: { id: '1', title: 'Manager' },
      job: { id: 1, title: 'Développeur' },
      harbor: { id: 1, name: 'Port Principal', location: 'Casablanca' },
      status: { id: 1, title: 'Actif' },
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'USER'
    };

    component.registrationForm.patchValue(validFormData);
    mockUtilisateurService.register.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockUtilisateurService.register).toHaveBeenCalled();
  });

  it('should show notification on successful registration', () => {
    spyOn(component, 'showNotification');
    mockUtilisateurService.register.and.returnValue(of({ success: true }));

    // Setup valid form
    component.registrationForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '0612345678',
      cin: 'AB123456',
      registrationNumber: 'REG001',
      grade: 'Grade 1',
      employment: 'CDI',
      dob: '1990-01-01',
      startingDate: '2023-01-01',
      recruitmentDate: '2023-01-01',
      position: { id: '1', title: 'Manager' },
      job: { id: 1, title: 'Développeur' },
      harbor: { id: 1, name: 'Port Principal', location: 'Casablanca' },
      status: { id: 1, title: 'Actif' },
      username: 'johndoe',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'USER'
    });

    component.onSubmit();

    expect(component.showNotification).toHaveBeenCalledWith('success', 'Utilisateur enregistré avec succès !');
  });

  it('should reset form when resetForm is called', () => {
    component.registrationForm.patchValue({
      firstName: 'John',
      lastName: 'Doe'
    });

    component.resetForm();

    expect(component.registrationForm.get('firstName')?.value).toBe(null);
    expect(component.registrationForm.get('role')?.value).toBe('USER');
    expect(component.submitted).toBe(false);
  });

  it('should navigate to user list when navigateToUserList is called', () => {
    component.navigateToUserList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/agent']);
  });
});
