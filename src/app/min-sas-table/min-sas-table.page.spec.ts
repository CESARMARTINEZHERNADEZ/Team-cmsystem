import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinSasTablePage } from './min-sas-table.page';

describe('MinSasTablePage', () => {
  let component: MinSasTablePage;
  let fixture: ComponentFixture<MinSasTablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinSasTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
