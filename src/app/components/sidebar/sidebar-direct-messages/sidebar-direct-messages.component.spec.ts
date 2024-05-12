import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDirectMessagesComponent } from './sidebar-direct-messages.component';

describe('SidebarDirectMessagesComponent', () => {
  let component: SidebarDirectMessagesComponent;
  let fixture: ComponentFixture<SidebarDirectMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDirectMessagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarDirectMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
