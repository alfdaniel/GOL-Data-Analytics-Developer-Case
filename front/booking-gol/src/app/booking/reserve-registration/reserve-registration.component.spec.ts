import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveRegistrationComponent } from './reserve-registration.component';

describe('ReserveRegistrationComponent', () => {
  let component: ReserveRegistrationComponent;
  let fixture: ComponentFixture<ReserveRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReserveRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserveRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
