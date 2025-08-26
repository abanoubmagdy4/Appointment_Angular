import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllComponent } from './display-all.component';

describe('DisplayAllComponent', () => {
  let component: DisplayAllComponent;
  let fixture: ComponentFixture<DisplayAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
