import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSendPrvMessageWindowComponent } from './open-send-prv-message-window.component';

describe('OpenSendPrvMessageWindowComponent', () => {
  let component: OpenSendPrvMessageWindowComponent;
  let fixture: ComponentFixture<OpenSendPrvMessageWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenSendPrvMessageWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenSendPrvMessageWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
