import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDirectMessagesUserComponent } from './sidebar-direct-messages-user.component';

describe('SidebarDirectMessagesUserComponent', () => {
  let component: SidebarDirectMessagesUserComponent;
  let fixture: ComponentFixture<SidebarDirectMessagesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDirectMessagesUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarDirectMessagesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
