import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGiftOrderComponent } from './edit-gift-order.component';

describe('EditGiftOrderComponent', () => {
  let component: EditGiftOrderComponent;
  let fixture: ComponentFixture<EditGiftOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGiftOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGiftOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
