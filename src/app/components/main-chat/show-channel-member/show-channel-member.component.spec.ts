import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowChannelMemberComponent } from './show-channel-member.component';

describe('ShowChannelMemberComponent', () => {
  let component: ShowChannelMemberComponent;
  let fixture: ComponentFixture<ShowChannelMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowChannelMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowChannelMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
