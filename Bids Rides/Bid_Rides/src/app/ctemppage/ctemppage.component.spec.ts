import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtemppageComponent } from './ctemppage.component';

describe('CtemppageComponent', () => {
  let component: CtemppageComponent;
  let fixture: ComponentFixture<CtemppageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtemppageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtemppageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
