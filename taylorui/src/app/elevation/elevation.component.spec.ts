import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevationComponent } from './elevation.component';

describe('ElevationComponent', () => {
  let component: ElevationComponent;
  let fixture: ComponentFixture<ElevationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
