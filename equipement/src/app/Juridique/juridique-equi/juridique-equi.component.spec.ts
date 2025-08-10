import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuridiqueEquiComponent } from './juridique-equi.component';

describe('JuridiqueEquiComponent', () => {
  let component: JuridiqueEquiComponent;
  let fixture: ComponentFixture<JuridiqueEquiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JuridiqueEquiComponent]
    });
    fixture = TestBed.createComponent(JuridiqueEquiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
