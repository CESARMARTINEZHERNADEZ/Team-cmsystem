import { ComponentFixture, TestBed } from '@angular/core/testing';
import { C2counterPage } from './c2counter.page';

describe('C2counterPage', () => {
  let component: C2counterPage;
  let fixture: ComponentFixture<C2counterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(C2counterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
