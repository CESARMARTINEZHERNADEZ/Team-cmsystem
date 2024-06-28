import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransceivertablePage } from './transceivertable.page';

describe('TransceivertablePage', () => {
  let component: TransceivertablePage;
  let fixture: ComponentFixture<TransceivertablePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransceivertablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
