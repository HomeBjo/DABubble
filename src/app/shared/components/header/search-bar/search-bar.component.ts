import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../../../interface/user.interface';
import { Channel } from '../../../../interface/channel.interface';
import { Chat } from '../../../../interface/chat.interface';
import { UserService } from '../../../../service/user.service';
import { ToggleBooleanService } from '../../../../service/toggle-boolean.service';
import { ChannleService } from '../../../../service/channle.service';
import { ChatService } from '../../../../service/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighlightPipe } from '../../../../highlight.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../../service/shared.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HighlightPipe,
    TranslateModule,
  ],
})
export class SearchBarComponent {
  @Input() viewWidth: number = 0;

  openMenu: boolean = false;
  showCurrentProfile: boolean = false;
  isOnline: boolean = true;
  closeProfil: boolean = false;
  openSearchWindow: boolean = false;
  inputValue: string = '';
  filteredUsers: User[] = [];
  filteredChannels: Channel[] = [];
  filteredChats: Chat[] = [];

  constructor(
    public userService: UserService,
    public toggleBoolean: ToggleBooleanService,
    private channelService: ChannleService,
    private chatService: ChatService,
    public sanitizer: DomSanitizer,
    private route: Router,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;

  /**
   * Closes the secondary chat window & sidebar.
   */
  closeSecondaryChatAndSidebar() {
    this.chatService.toggleSecondaryChat('none');
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD) {
      this.toggleBoolean.isSidebarOpen = false;
      this.inputValue = '';
    }
  }

  /**
   * Filters all information based on the input value.
   * @param inputValue The input value entered by the user.
   */
  filterAllInfo(inputValue: string) {
    if (inputValue !== '') {
      this.toggleBoolean.openSearchWindowHead = true;
      const getInputValue = inputValue.toLowerCase().trim();
      this.filterUsersChannelsChats(getInputValue);
    } else {
      this.toggleBoolean.openSearchWindowHead = false;
    }
  }

  /**
   * Filters users, channels, and chats based on the input value.
   * @param inputValue The input value entered by the user.
   */
  filterUsersChannelsChats(inputValue: string) {
    const filterUsers = this.getFilterUsers(inputValue);
    const filterChannels = this.getFilterChannels(inputValue);
    const filterChants = this.getFilterChats(inputValue);

    this.sortPrvAndPublicMessages(filterChants);

    this.filteredUsers = filterUsers;
    this.filteredChannels = filterChannels;
  }

  /**
   * Filters users based on the input value.
   * @param inputValue The input value entered by the user.
   * @returns An array of filtered users.
   */
  getFilterUsers(inputValue: string) {
    return this.userService.getUsers().filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(inputValue);
    });
  }

  /**
   * Filters channels based on the input value.
   * @param inputValue The input value entered by the user.
   * @returns An array of filtered channels.
   */
  getFilterChannels(inputValue: string) {
    const userHasAccessChannels = this.checkUserHasAccessToChannel();
    return userHasAccessChannels.filter((channel) => {
      const channelName = `${channel.name}`.toLowerCase();
      return channelName.includes(inputValue);
    });
  }

  /**
   * Filters chats based on the input value.
   * @param inputValue The input value entered by the user.
   * @returns An array of filtered chats.
   */
  getFilterChats(inputValue: string) {
    const userChannels = this.checkUserHasAccessToChannel();

    return this.chatService.allChats.filter((chat) => {
      const chatMessage = `${chat.message}`.toLowerCase();
      return (
        chatMessage.includes(inputValue) &&
        userChannels.some((channel) => channel.id === chat.channelId)
      );
    });
  }

  /**
   * Checks whether the user has access to a channel.
   * @returns {Array} - A list of channels to which the user has access.
   */
  checkUserHasAccessToChannel() {
    const isUserAChannelMember = this.channelService.allChannels.some(
      (channel) =>
        channel.addedUser.includes(this.userService.getCurrentUserId())
    );

    if (isUserAChannelMember) {
      return this.channelService.allChannels.filter((channel) =>
        channel.addedUser.includes(this.userService.getCurrentUserId())
      );
    }
    return [];
  }

  /**
   * Retrieves the channel associated with the specified chat ID.
   * @param chatID The ID of the chat.
   * @returns The name of the channel.
   */
  getChannel(chatID: string) {
    if (this.inputValue != '') {
      const filteredChatBoolean = this.filteredChats.some(
        (chat) => chat.channelId === chatID
      );
      if (filteredChatBoolean) {
        const filteredChat = this.filteredChats.find(
          (chat) => chat.channelId === chatID
        );
        const channelName = this.channelService.allChannels.find(
          (channel) => channel.id === filteredChat!.channelId
        );
        return channelName!.name;
      }
    } else {
      return '';
    }
    return '';
  }

  /**
   * Sorts private and public messages.
   * @param chats The array of chats to sort.
   */
  sortPrvAndPublicMessages(chats: Chat[]) {
    const publicChats: Chat[] = [];

    for (const chat of chats) {
      const isPublicChannel = this.channelService.allPrvChannels.some(
        (prvChannel) => prvChannel.id === chat.channelId
      );
      if (!isPublicChannel) {
        publicChats.push(chat);
      }
    }
    this.filteredChats = publicChats;
  }

  /**
   * Checks the route based on the specified user.
   * @param user The user to check the route for.
   */
  async checkRoute(user: User[]) {
    const userId = user[0].id!;
    const channelExistsBoolean = this.channelService.allPrvChannels.some(
      (channel) =>
        (channel.creatorId === userId &&
          channel.talkToUserId === this.userService.getCurrentUserId()) ||
        (channel.creatorId === this.userService.getCurrentUserId() &&
          channel.talkToUserId === userId)
    );
    if (!channelExistsBoolean) {
      const id = await this.userService.createPrvChannel(userId);
      if (id) {
        this.route.navigateByUrl(`main/${id}`);
      }
    }
    this.getRouteToPrvChat(userId, channelExistsBoolean);
  }

  /**
   * Navigates to the private chat route based on the specified user.
   * @param userId The ID of the user.
   * @param channelExistsBoolean A boolean indicating whether the channel exists.
   */
  getRouteToPrvChat(userId: string, channelExistsBoolean: boolean) {
    if (channelExistsBoolean) {
      const existingChannel = this.channelService.allPrvChannels.find(
        (channel) =>
          (channel.creatorId === userId &&
            channel.talkToUserId === this.userService.getCurrentUserId()) ||
          (channel.creatorId === this.userService.getCurrentUserId() &&
            channel.talkToUserId === userId)
      );
      this.route.navigateByUrl(`main/${existingChannel!.id}`);
    }
  }
}
