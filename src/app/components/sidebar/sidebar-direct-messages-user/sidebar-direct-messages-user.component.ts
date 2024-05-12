import { Component, Input } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { ChannleService } from '../../../service/channle.service';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';
import { SharedService } from '../../../service/shared.service';
import { PrvChannel } from '../../../interface/channel.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-direct-messages-user',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './sidebar-direct-messages-user.component.html',
  styleUrl: './sidebar-direct-messages-user.component.scss',
})
export class SidebarDirectMessagesUserComponent {
  @Input() currentChannel: string = '';
  @Input() viewWidth: number = 0;

  constructor(
    public userService: UserService,
    private channelService: ChannleService,
    public chatService: ChatService,
    public toggleBoolean: ToggleBooleanService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;

  /**
   * Get users for private chat.
   * @param userId The ID of the user.
   * @returns Array of User objects.
   */
  getChatUsers(userId: string) {
    const filteredTasks = this.userService
      .getUsers()
      .filter((user) => user.id == userId);
    return filteredTasks;
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
   * Display private chat channels associated with the provided user ID.
   * @param {string} userId - The ID of the user for whom private chat channels are to be displayed.
   * @returns {Array} - An array of unique private chat channels sorted based on specific criteria.
   */
  displayPrivateChat(userId: string) {
    const creatorChannels = this.channelService.allPrvChannels.filter(
      (channel) => channel.creatorId === userId
    );
    const talkToUserChannels = this.channelService.allPrvChannels.filter(
      (channel) => channel.talkToUserId === userId
    );
    const allChannels = creatorChannels.concat(talkToUserChannels);

    // Sort the channels so that the channel with corrent logged in userId comes first
    this.sortUserPrivatChannel(allChannels, userId);
    const firstChannel = allChannels.shift();

    // Sort the channels based on the last date of the chat
    this.sortAllAnotherChannel(allChannels, userId);

    if (firstChannel) {
      allChannels.unshift(firstChannel);
    }

    return Array.from(new Set(allChannels));
  }

  /**
   * Sorts an array if it is the own user channel
   * @param {PrvChannel[]} allChannels - Array of private channels to sort.
   * @param {string} userId - The ID of the user.
   */
  sortUserPrivatChannel(allChannels: PrvChannel[], userId: string) {
    allChannels.sort((a, b) => {
      if (a.creatorId === userId) return -1;
      if (b.creatorId === userId) return 1;
      return 0;
    });
  }

  /**
   * Sorts an array of private channels based on the last message's timestamp.
   * @param {PrvChannel[]} allChannels - Array of private channels to sort.
   * @param {string} userId - The ID of the user.
   */
  sortAllAnotherChannel(allChannels: PrvChannel[], userId: string) {
    allChannels.sort((a, b) => {
      const lastMessageA = this.chatService.allChats
        .filter((chat) => chat.channelId === a.id)
        .sort((x, y) => y.publishedTimestamp - x.publishedTimestamp)[0];

      const lastMessageB = this.chatService.allChats
        .filter((chat) => chat.channelId === b.id)
        .sort((x, y) => y.publishedTimestamp - x.publishedTimestamp)[0];

      if (!lastMessageA) return 1;
      if (!lastMessageB) return -1;

      return lastMessageB.publishedTimestamp - lastMessageA.publishedTimestamp;
    });
  }
}
