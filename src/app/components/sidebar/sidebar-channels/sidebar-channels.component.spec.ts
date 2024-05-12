import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarChannelsComponent } from './sidebar-channels.component';

describe('SidebarChannelsComponent', () => {
  let component: SidebarChannelsComponent;
  let fixture: ComponentFixture<SidebarChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
