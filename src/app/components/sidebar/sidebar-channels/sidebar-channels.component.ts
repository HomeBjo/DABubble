import { Component, Input } from '@angular/core';
import { ChannleService } from '../../../service/channle.service';
import { Channel, publicChannels } from '../../../interface/channel.interface';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { UserService } from '../../../service/user.service';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../service/shared.service';

@Component({
  selector: 'app-sidebar-channels',
  standalone: true,
  imports: [
    RouterLink,
    SmallBtnComponent,
    CommonModule,
    FormsModule,
    AddNewChannelComponent,
    TranslateModule,
  ],
  templateUrl: './sidebar-channels.component.html',
  styleUrl: './sidebar-channels.component.scss',
})
export class SidebarChannelsComponent {
  @Input() currentChannel: string = '';
  @Input() viewWidth: number = 0;

  minimizeChannels: boolean = true;

  constructor(
    public channelService: ChannleService,
    public chatService: ChatService,
    public userService: UserService,
    public toggleBoolean: ToggleBooleanService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;

  /**
   * Toggles the visibility of channels.
   */
  minimizeAllChannels() {
    this.minimizeChannels = !this.minimizeChannels;
  }

  /**
   * Opens the add new channel window.
   */
  openAddChannelWindow() {
    this.channelService.btnIsValid = false;
    this.channelService.showAddChannelBox = true;
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
   * The channels accessible to the current user are scrolled, public channels are at the top
   * @returns {Channel[]} An array of Channel objects.
   */
  getChannels(): Channel[] {
    const userChannels = this.channelService.allChannels.filter((channel) =>
      channel.addedUser.includes(this.userService.getCurrentUserId())
    );
    const priorityChannels = userChannels.filter((channel) =>
      publicChannels.includes(channel.id!)
    );
    const otherChannels = userChannels.filter(
      (channel) => !priorityChannels.includes(channel)
    );

    return [...priorityChannels, ...otherChannels];
  }
}
