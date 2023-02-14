import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularOrderFormComponent } from './regular-order-form.component';

describe('RegularOrderFormComponent', () => {
  let component: RegularOrderFormComponent;
  let fixture: ComponentFixture<RegularOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegularOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
