import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomOrderComponent } from './edit-custom-order.component';

describe('EditCustomOrderComponent', () => {
  let component: EditCustomOrderComponent;
  let fixture: ComponentFixture<EditCustomOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustomOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
