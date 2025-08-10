import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarqueComponent } from './marque.component';

describe('MarqueComponent', () => {
  let component: MarqueComponent;
  let fixture: ComponentFixture<MarqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarqueComponent]
    });
    fixture = TestBed.createComponent(MarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
