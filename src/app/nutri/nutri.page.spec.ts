import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NutriPage } from './nutri.page';

describe('NutriPage', () => {
  let component: NutriPage;
  let fixture: ComponentFixture<NutriPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NutriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
