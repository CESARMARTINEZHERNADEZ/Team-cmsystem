import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransceivercounterPage } from './transceivercounter.page';

describe('TransceivercounterPage', () => {
  let component: TransceivercounterPage;
  let fixture: ComponentFixture<TransceivercounterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TransceivercounterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
