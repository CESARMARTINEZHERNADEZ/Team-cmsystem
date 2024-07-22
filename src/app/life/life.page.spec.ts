import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifePage } from './life.page';

describe('LifePage', () => {
  let component: LifePage;
  let fixture: ComponentFixture<LifePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LifePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
