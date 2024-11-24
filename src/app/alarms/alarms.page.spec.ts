import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmsPage } from './alarms.page';

describe('AlarmsPage', () => {
  let component: AlarmsPage;
  let fixture: ComponentFixture<AlarmsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
