import { ComponentFixture, TestBed } from '@angular/core/testing';
import { C2tablePage } from './c2table.page';

describe('C2tablePage', () => {
  let component: C2tablePage;
  let fixture: ComponentFixture<C2tablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(C2tablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
