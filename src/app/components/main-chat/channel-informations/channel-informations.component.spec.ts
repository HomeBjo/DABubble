import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelInformationsComponent } from './channel-informations.component';

describe('ChannelInformationsComponent', () => {
  let component: ChannelInformationsComponent;
  let fixture: ComponentFixture<ChannelInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelInformationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
