import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorloginComponent } from './vendorlogin.component';

describe('VendorloginComponent', () => {
  let component: VendorloginComponent;
  let fixture: ComponentFixture<VendorloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
