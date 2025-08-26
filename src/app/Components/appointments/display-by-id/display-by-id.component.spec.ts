import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayByIdComponent } from './display-by-id.component';

describe('DisplayByIdComponent', () => {
  let component: DisplayByIdComponent;
  let fixture: ComponentFixture<DisplayByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
