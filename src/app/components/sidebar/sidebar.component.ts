import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SidebarChannelsComponent } from './sidebar-channels/sidebar-channels.component';
import { SidebarDirectMessagesComponent } from './sidebar-direct-messages/sidebar-direct-messages.component';
import { SmallBtnComponent } from '../../shared/components/small-btn/small-btn.component';
import { CommonModule } from '@angular/common';
import { ChannleService } from '../../service/channle.service';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { ToggleBooleanService } from '../../service/toggle-boolean.service';
import { ChatService } from '../../service/chat.service';
import { SharedService } from '../../service/shared.service';
import { SearchBarComponent } from '../../shared/components/header/search-bar/search-bar.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    SidebarChannelsComponent,
    SidebarDirectMessagesComponent,
    SmallBtnComponent,
    CommonModule,
    SearchbarComponent,
    SearchBarComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @Input() viewWidth: number = 0;
  @Input() btnPosition: boolean = false;

  currentChannel: string = '';

  constructor(
    public channelService: ChannleService,
    public toggleBoolean: ToggleBooleanService,
    private router: ActivatedRoute,
    public chatService: ChatService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;

  ngOnInit() {
    this.routeUserId();
  }

  /**
   * Opens the search bar by toggling a boolean value.
   */
  openSearchbar() {
    this.toggleBoolean.openSearchWindow = true;
  }

  /**
   * Closes the secondary chat window & sidebar.
   */
  closeSecondaryChatAndSidebar() {
    this.chatService.toggleSecondaryChat('none');
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD) {
      this.toggleBoolean.isSidebarOpen = false;
    }
  }

  /**
   * Retrieves the user ID from the route parameters.
   */
  routeUserId() {
    if (this.router.params.subscribe()) {
      this.router.params.subscribe((params) => {
        this.currentChannel = params['id'];
      });
    }
  }
}
