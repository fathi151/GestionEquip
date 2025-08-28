import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectaComponent } from './affecta.component';

describe('AffectaComponent', () => {
  let component: AffectaComponent;
  let fixture: ComponentFixture<AffectaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectaComponent]
    });
    fixture = TestBed.createComponent(AffectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
