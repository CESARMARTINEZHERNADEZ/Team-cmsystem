import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cat6counterPage } from './cat6counter.page';

describe('Cat6counterPage', () => {
  let component: Cat6counterPage;
  let fixture: ComponentFixture<Cat6counterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Cat6counterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
