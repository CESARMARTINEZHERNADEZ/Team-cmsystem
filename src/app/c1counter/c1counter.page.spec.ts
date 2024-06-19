import { ComponentFixture, TestBed } from '@angular/core/testing';
import { C1counterPage } from './c1counter.page';

describe('C1counterPage', () => {
  let component: C1counterPage;
  let fixture: ComponentFixture<C1counterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(C1counterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
