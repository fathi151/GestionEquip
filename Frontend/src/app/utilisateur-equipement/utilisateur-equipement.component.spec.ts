import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateurEquipementComponent } from './utilisateur-equipement.component';

describe('UtilisateurEquipementComponent', () => {
  let component: UtilisateurEquipementComponent;
  let fixture: ComponentFixture<UtilisateurEquipementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UtilisateurEquipementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateurEquipementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
