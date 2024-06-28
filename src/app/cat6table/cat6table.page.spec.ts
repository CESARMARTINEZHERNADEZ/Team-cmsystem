import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cat6tablePage } from './cat6table.page';

describe('Cat6tablePage', () => {
  let component: Cat6tablePage;
  let fixture: ComponentFixture<Cat6tablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Cat6tablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
