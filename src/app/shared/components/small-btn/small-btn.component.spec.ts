import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallBtnComponent } from './small-btn.component';

describe('SmallBtnComponent', () => {
  let component: SmallBtnComponent;
  let fixture: ComponentFixture<SmallBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmallBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
