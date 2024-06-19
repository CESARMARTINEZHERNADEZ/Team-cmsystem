import { ComponentFixture, TestBed } from '@angular/core/testing';
import { C1tablePage } from './c1table.page';

describe('C1tablePage', () => {
  let component: C1tablePage;
  let fixture: ComponentFixture<C1tablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(C1tablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
