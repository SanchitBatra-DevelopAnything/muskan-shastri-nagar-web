import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomGiftboxFormComponent } from './custom-giftbox-form.component';

describe('CustomGiftboxFormComponent', () => {
  let component: CustomGiftboxFormComponent;
  let fixture: ComponentFixture<CustomGiftboxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomGiftboxFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomGiftboxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
