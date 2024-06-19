import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinSasCounterPage } from './min-sas-counter.page';

describe('MinSasCounterPage', () => {
  let component: MinSasCounterPage;
  let fixture: ComponentFixture<MinSasCounterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinSasCounterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
