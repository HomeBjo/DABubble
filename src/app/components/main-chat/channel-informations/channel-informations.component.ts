import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../interface/channel.interface';
import { ChannleService } from '../../../service/channle.service';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { User } from '../../../interface/user.interface';
import { SharedService } from '../../../service/shared.service';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { OpenSendPrvMessageWindowComponent } from '../show-channel-member/open-send-prv-message-window/open-send-prv-message-window.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-channel-informations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SmallBtnComponent,
    OpenSendPrvMessageWindowComponent,
    TranslateModule,
  ],
  templateUrl: './channel-informations.component.html',
  styleUrl: './channel-informations.component.scss',
})
export class ChannelInformationsComponent {
  @Input() currentChannel: string = '';
  @Input() viewWidth: number = 0;
  @Output() closeEditEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  openEditNameInput: boolean = false;
  openEditNameDescription: boolean = false;
  nameValue: string = '';
  descriptionValue: string = '';
  getCurrentChannel: Channel[] = [];
  openUserWindowBoolean: boolean = false;
  user: User[] = [];

  constructor(
    private route: Router,
    public channelService: ChannleService,
    public userService: UserService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  /**
   * Closes the menu by emitting a signal to close editing.
   */
  showMenu() {
    this.closeEditEmitter.emit(true);
  }

  /**
   * Closes the menu and resets various states.
   */
  closeMenu() {
    this.closeEditEmitter.emit(false);
    this.openEditNameDescription = false;
    this.openEditNameInput = false;
    this.descriptionValue = '';
    this.nameValue = '';
    this.getCurrentChannel = [];
  }

  /**
   * Prevents the propagation of an event.
   * @param {Event} event - The event to stop propagation.
   */
  preventCloseWhiteBox(event: Event) {
    event.stopPropagation();
  }

  /**
   * Retrieves the channel name based on its ID.
   * @param {string} chatId - The ID of the channel.
   * @returns {Channel[]} - The filtered channels.
   */
  getChannelName(chatId: string) {
    const filteredTasks = this.channelService.allChannels.filter(
      (channel) => channel.id == chatId
    );
    this.getCurrentChannel = filteredTasks;
    return filteredTasks;
  }

  /**
   * Retrieves all channel members based on channel ID.
   * @param {string} channelId - The ID of the channel.
   * @returns {User[]} - The filtered users.
   */
  getAllChannelMembers(channelId: string) {
    return this.channelService.allChannels.filter(
      (channel) => channel.id === channelId
    );
  }

  /**
   * Retrieves chat users based on user ID.
   * @param {string} userId - The ID of the user.
   * @returns {User[]} - The filtered users.
   */
  getChatUsers(userId: string) {
    return this.userService.allUsers.filter((user) => user.id === userId);
  }

  /**
   * Retrieves channel members based on channel ID.
   * @param {string} chatId - The ID of the channel.
   * @returns {User[]} - The filtered users.
   */
  getChannelMembers(chatId: string) {
    const filteredTasks = this.userService.allUsers.filter(
      (user) => user.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Checks if the current user is the creator of the channel.
   * @param {string} currentChannel - The ID of the current channel.
   * @returns {boolean} - True if the user is the creator, false otherwise.
   */
  checkCreator(currentChannel: string) {
    const getChannel = this.channelService.allChannels.filter(
      (channel) => channel.id == currentChannel
    );
    if (getChannel[0].creator === this.userService.getCurrentUserId()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Opens a window displaying information about a user.
   * @param {User} user - The user to display information about.
   */
  openUserWindow(user: User) {
    this.user = [user];
    this.openUserWindowBoolean = !this.openUserWindowBoolean;
  }

  /**
   * Changes the state of the user window.
   * @param {boolean} value - The new state of the user window.
   */
  changeOpenUserWindowBoolean(value: boolean) {
    this.openUserWindowBoolean = value;
  }

  /**
   * Initiates editing the channel name.
   * @param {Event} event - The event that triggered the editing.
   */
  editChannelName(event: Event) {
    event.stopPropagation();
    this.openEditNameInput = true;
    this.nameValue = this.getCurrentChannel[0].name;
  }

  /**
   * Saves the edited channel name.
   * @param {Event} event - The event that triggered the save.
   */
  saveEditChannelName(event: Event) {
    event.stopPropagation();
    this.openEditNameInput = false;
    this.channelService.saveAddedNameOrDescription(
      'channels',
      this.currentChannel!,
      'name',
      this.nameValue
    );
  }

  /**
   * Initiates editing the channel description.
   * @param {Event} event - The event that triggered the editing.
   */
  editChannelDescription(event: Event) {
    event.stopPropagation();
    this.openEditNameDescription = true;
    this.descriptionValue = this.getCurrentChannel[0].description || '';
  }

  /**
   * Saves the edited channel description.
   * @param {Event} event - The event that triggered the save.
   */
  saveEditChannelDescription(event: Event) {
    event.stopPropagation();
    this.openEditNameDescription = false;
    this.channelService.saveAddedNameOrDescription(
      'channels',
      this.currentChannel!,
      'description',
      this.descriptionValue
    );
  }

  /**
   * Allows the user to leave the channel.
   * @param {string} currentChannel - The ID of the current channel.
   * @param {Event} event - The event that triggered the action.
   */
  leaveChannel(currentChannel: string, event: Event) {
    event.stopPropagation();
    const getLogedInUser: string = this.userService.getCurrentUserId();
    const getChannel = this.channelService.allChannels.filter(
      (channel) => channel.id == currentChannel
    );
    if (getChannel) {
      const userIndex = getChannel[0].addedUser.indexOf(getLogedInUser);
      if (userIndex !== -1) {
        getChannel[0].addedUser.splice(userIndex, 1);
        const userArray = getChannel[0].addedUser;
        this.channelService.addNewMemberToChannel(
          'channels',
          currentChannel,
          userArray,
          'leaveChannel'
        );
        this.closeEditEmitter.emit(false);
        this.route.navigateByUrl(`main`);
      }
    }
  }

  ngOnDestroy() {
    this.closeMenu();
  }
}
