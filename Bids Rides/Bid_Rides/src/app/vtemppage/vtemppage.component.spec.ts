import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VtemppageComponent } from './vtemppage.component';

describe('VtemppageComponent', () => {
  let component: VtemppageComponent;
  let fixture: ComponentFixture<VtemppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VtemppageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VtemppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
