import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipDaGComponent } from './equip-da-g.component';

describe('EquipDaGComponent', () => {
  let component: EquipDaGComponent;
  let fixture: ComponentFixture<EquipDaGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipDaGComponent]
    });
    fixture = TestBed.createComponent(EquipDaGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
