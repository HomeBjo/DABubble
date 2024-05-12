import { Component, ElementRef, Input } from '@angular/core';
import { ChannleService } from '../../service/channle.service';
import { MainComponent } from '../main/main.component';
import { ChatService } from '../../service/chat.service';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.interface';
import {
  Channel,
  PrvChannel,
  publicChannels,
} from '../../interface/channel.interface';
import { Chat } from '../../interface/chat.interface';
import { NavigationStart, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatContentComponent } from './chat-content/chat-content.component';
import { SingleChatComponent } from './single-chat/single-chat.component';
import { ToggleBooleanService } from '../../service/toggle-boolean.service';
import { ChatMsgBoxComponent } from './chat-msg-box/chat-msg-box.component';
import { FormsModule } from '@angular/forms';
import { SmallBtnComponent } from '../../shared/components/small-btn/small-btn.component';
import { ShowChannelMemberComponent } from './show-channel-member/show-channel-member.component';
import { SharedService } from '../../service/shared.service';
import { ChannelInformationsComponent } from './channel-informations/channel-informations.component';
import { filter } from 'rxjs';
import { OpenSendPrvMessageWindowComponent } from './show-channel-member/open-send-prv-message-window/open-send-prv-message-window.component';
import { HighlightPipe } from '../../highlight.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [
    MainComponent,
    CommonModule,
    ChatContentComponent,
    SingleChatComponent,
    ChatMsgBoxComponent,
    FormsModule,
    SmallBtnComponent,
    ShowChannelMemberComponent,
    ChannelInformationsComponent,
    OpenSendPrvMessageWindowComponent,
    HighlightPipe,
    TranslateModule,
  ],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.scss',
})
export class MainChatComponent {
  @Input() currentChannel: string = '';
  @Input() isSecondaryChatOpen: boolean = false;
  @Input() viewWidth: number = 0;

  firstLetter: string = '';
  openSearchWindow: boolean = false;
  channelCreator: boolean = false;
  openMenu: boolean = false;
  showProfil: boolean = false;
  talkToUser!: User[];
  routToPrvCHannel: boolean = false;

  constructor(
    private route: Router,
    public userService: UserService,
    public channelService: ChannleService,
    public chatService: ChatService,
    public toggleBoolean: ToggleBooleanService,
    private sharedService: SharedService
  ) {
    this.checkPrivatChatRouteEvent();
    this.routeToStartChannel();
  }

  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  /**
   * Sets the openMenu property based on the provided variable.
   * @param {boolean} variable - The value to set for openMenu.
   */
  closeEditEmitter(variable: boolean) {
    this.openMenu = variable;
  }

  /**
   * Sets the showProfil property based on the provided value.
   * @param {boolean} value - The value to set for showProfil.
   */
  getShowProfilWindowBoolean(value: boolean) {
    this.showProfil = value;
  }

  /**
   * Checks the route events for private chat messages.
   */
  checkPrivatChatRouteEvent() {
    this.route.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe((event: NavigationStart) => {
        const urlParts = this.route.url.split('/');
        const id = urlParts[urlParts.length - 1];
        this.hasPrivatChatMessages(id);
      });
  }

  /**
   * Checks if there are private chat messages for a given chat ID and performs necessary actions.
   * @param {string} chatId - The ID of the chat.
   */
  hasPrivatChatMessages(chatId: string) {
    const isPrivatChannel = this.channelService.allPrvChannels.filter(
      (user) => user.id === chatId
    );
    if (isPrivatChannel.length > 0) {
      const countMessages = this.chatService.allChats.filter(
        (user) => user.channelId === chatId
      );
      const userChannel = this.channelService.allPrvChannels.filter(
        (user) =>
          user.creatorId === this.userService.getCurrentUserId() &&
          user.talkToUserId === this.userService.getCurrentUserId() &&
          user.id === chatId
      );
      if (countMessages.length === 0 && userChannel.length === 0) {
        this.chatService.deleteData(chatId, 'prv-channels');
      }
    }
  }

  /**
   * Redirects to the start channel if the current channel is empty and the user is logged in.
   */
  routeToStartChannel() {
    if (
      this.currentChannel === '' &&
      this.userService.getCurrentUserId() !== undefined
    ) {
      this.route.navigateByUrl(`/main/${publicChannels[0]}`);
    }
  }

  /**
   * Checks if the current user has access to any channels.
   * @returns {Channel[]} Array of Channel objects that the user has access to.
   */
  checkIfUserHasAccessToChannel() {
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
   * Sets the openMenu property to true.
   */
  showMenu() {
    this.openMenu = true;
  }

  /**
   * Retrieves users associated with a chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {User[]} Array of User objects associated with the chat ID.
   */
  getChatUsers(chatId: string) {
    const filteredTasks = this.userService.allUsers.filter(
      (user) => user.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves chats associated with a chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {Chat[]} Array of Chat objects associated with the chat ID.
   */
  getChatChannel(chatId: string) {
    const filteredTasks = this.chatService.allChats.filter(
      (chat) => chat.channelId == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves channel information for a given channel ID.
   * @param {string} chatId - The ID of the channel.
   * @returns {Channel[]} Array of Channel objects matching the provided channel ID.
   */
  getChannelName(chatId: string) {
    const filteredTasks = this.channelService.allChannels.filter(
      (channel) => channel.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves private chat information for a given private chat ID.
   * @param {string} prvChatId - The ID of the private chat.
   * @returns {PrvChannel[]} Array of PrvChannel objects matching the provided private chat ID.
   */
  getPrvChat(prvChatId: string) {
    const filteredChats = this.channelService.allPrvChannels.filter(
      (prvChat) => prvChat.id == prvChatId
    );
    this.getTalkToUser(filteredChats);
    return filteredChats;
  }

  /**
   * Retrieves the user associated with a filtered private chat.
   * @param {PrvChannel[]} filteredChat - The filtered private chat.
   */
  getTalkToUser(filteredChat: PrvChannel[]) {
    const talkToUser = filteredChat[0].talkToUserId;
    const getUser = this.userService.allUsers.filter(
      (user) => user.id === talkToUser
    );
    if (getUser) {
      this.talkToUser = getUser;
    }
  }

  /**
   * Filters users based on the provided talkToUserId.
   * @param {string} talkToUserId - The ID of the user to filter.
   * @returns {User[]} Array of User objects matching the provided user ID.
   */
  filterUser(talkToUserId: string) {
    return this.userService.allUsers.filter((user) => user.id == talkToUserId);
  }

  /**
   * Checks the type of the current channel.
   * @param {string} currentChannel - The ID of the current channel.
   * @returns {string} Type of the current channel ('searchBar', 'allChannels', 'allPrvChannels').
   */
  checkCurrentChannel(currentChannel: string) {
    if (currentChannel === 'searchBar') {
      return 'searchBar';
    }
    const allChannels = this.channelService.allChannels.some(
      (channel) => channel.id == currentChannel
    );
    const allPrvChannels = this.channelService.allPrvChannels.some(
      (channel) => channel.id == currentChannel
    );

    if (allChannels) {
      return 'allChannels';
    } else if (allPrvChannels) {
      return 'allPrvChannels';
    }
    return '';
  }

  /**
   * Filters channels and users based on the input value.
   * @param {string} inputValue - The input value to filter.
   * @returns {string} Type of filtering ('filterChannel', 'filterUsers').
   */
  filterChannelAndUser(inputValue: string) {
    const filterChannels = '#';
    const filterUsers = '@';
    this.firstLetter = inputValue[0];
    if (this.firstLetter == filterChannels) {
      this.toggleBoolean.openSearchWindow = true;
      return 'filterChannel';
    } else if (this.firstLetter == filterUsers) {
      this.toggleBoolean.openSearchWindow = true;
      return 'filterUsers';
    }
    return (this.chatService.inputValue = '');
  }

  /**
   * Sets the showProfil property to true.
   */
  openUserProfil() {
    this.showProfil = true;
  }

  /**
   * Chooses an element and performs necessary actions based on its type.
   * @param {Channel | User} element - The element to choose.
   */
  chooseElement(element: Channel | User) {
    if ('firstName' in element) {
      this.chatService.inputValue = `@${element.firstName} ${element.lastName}`;
      const getUserID = element.id!;
      this.routToPrvCHannel = true;
      this.checkIfPrvChatExist(getUserID);
    } else {
      this.chatService.inputValue = `#${element.name}`;
      this.chatService.getChannelId = element.id!;
    }
    this.toggleBoolean.openSearchWindow = false;
  }

  /**
   * Checks if a private chat exists for the provided user ID and performs necessary actions.
   * @param {string} userID - The ID of the user.
   */
  checkIfPrvChatExist(userID: string) {
    const filterPrvChannelBoolean = this.channelService.allPrvChannels.some(
      (chat) => chat.talkToUserId == userID
    );
    if (!filterPrvChannelBoolean) {
      this.userService.createPrvChannel(userID);
    } else {
      const filterPrvChannelValue = this.channelService.allPrvChannels.filter(
        (chat) => chat.talkToUserId == userID
      );
      this.chatService.getPrvChatId = filterPrvChannelValue[0].id!;
    }
  }

  /**
   * Filters channels for a selected user.
   * @param {string} currentChannel - The ID of the current channel.
   * @returns {boolean} Boolean indicating if the channel is found.
   */
  filterChannelForSelectedUser(currentChannel: string) {
    const getBoolean = this.channelService.allChannels.some(
      (channel) => channel.id == currentChannel
    );
    const getAddedUsers = this.channelService.allChannels.filter(
      (channel) => channel.id == currentChannel
    );
    this.filterUsers(getAddedUsers[0].addedUser);
    return getBoolean;
  }

  /**
   * Filters users based on an array of user IDs.
   * @param {string[]} userArray - The array of user IDs to filter.
   */
  filterUsers(userArray: string[]) {
    this.userService.getFiltertUsers = [];
    for (let i = 0; i < this.userService.allUsers.length; i++) {
      const currentUser = this.userService.allUsers[i];
      if (userArray.includes(currentUser.id!)) {
        this.userService.getFiltertUsers.push(currentUser);
      }
    }
  }

  /**
   * Opens the channel member window.
   * @param {boolean} boolean - Boolean value to open or close the add member window.
   */
  openMemberWindow(boolean: boolean) {
    this.toggleBoolean.openChannelMemberWindow = true;
    this.toggleBoolean.openAddMemberWindow(boolean);
  }
}
