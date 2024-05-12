import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionEmojisComponent } from './reaction-emojis.component';

describe('ReactionEmojisComponent', () => {
  let component: ReactionEmojisComponent;
  let fixture: ComponentFixture<ReactionEmojisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionEmojisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReactionEmojisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
