import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralinventoryPage } from './generalinventory.page';

describe('GeneralinventoryPage', () => {
  let component: GeneralinventoryPage;
  let fixture: ComponentFixture<GeneralinventoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralinventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
