import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KotPrintingComponent } from './kot-printing.component';

describe('KotPrintingComponent', () => {
  let component: KotPrintingComponent;
  let fixture: ComponentFixture<KotPrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KotPrintingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KotPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
