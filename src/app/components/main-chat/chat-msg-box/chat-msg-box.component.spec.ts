import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMsgBoxComponent } from './chat-msg-box.component';

describe('ChatMsgBoxComponent', () => {
  let component: ChatMsgBoxComponent;
  let fixture: ComponentFixture<ChatMsgBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMsgBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatMsgBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
