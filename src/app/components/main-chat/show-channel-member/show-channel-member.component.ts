import { Component, Input } from '@angular/core';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';
import { CommonModule } from '@angular/common';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { User } from '../../../interface/user.interface';
import { FormsModule } from '@angular/forms';
import { ChannleService } from '../../../service/channle.service';
import { UserService } from '../../../service/user.service';
import { OpenSendPrvMessageWindowComponent } from './open-send-prv-message-window/open-send-prv-message-window.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-show-channel-member',
  standalone: true,
  imports: [
    CommonModule,
    SmallBtnComponent,
    FormsModule,
    OpenSendPrvMessageWindowComponent,
    TranslateModule,
  ],
  templateUrl: './show-channel-member.component.html',
  styleUrl: './show-channel-member.component.scss',
})
export class ShowChannelMemberComponent {
  @Input() isSecondaryChatOpen: boolean = false;

  userName: string = '';
  showExistenUsers: boolean = false;
  getSearchedUser: User[] = [];
  getCurrentChannelName: string = '';
  getSelectedUsers: User[] = [];
  selectedUsers: string[] = [];

  openUserWindowBoolean: boolean = false;
  user: User[] = [];

  @Input() getFiltertUsers!: User[];
  @Input() currentChannel!: string;

  constructor(
    public toggleBoolean: ToggleBooleanService,
    public channelService: ChannleService,
    public userService: UserService
  ) {}

  /**
   * Closes the channel member window and resets related values.
   */
  closeChannelMemberWindow() {
    this.toggleBoolean.openChannelMemberWindow = false;
    this.toggleBoolean.closeChannelMemberWindow = false;
    this.resetValues();
  }

  /**
   * Filters users based on search value and updates the list of searched users.
   * @param {string} searchValue - The value to search for.
   */
  filterUsers(searchValue: string) {
    if (searchValue != '') {
      this.showExistenUsers = true;
      this.getSearchedUser = [];
      const searchedUser = searchValue.toLowerCase().trim();
      const filteredUsers = this.userService.getUsers().filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchedUser);
      });
      this.checkIfUserIsInChannel(filteredUsers);
    }
  }

  /**
   * Checks if users from the filtered list are already in the current channel and updates the searched user list.
   * @param {User[]} filteredUsers - The list of filtered users.
   */
  checkIfUserIsInChannel(filteredUsers: User[]) {
    const getChannel = this.channelService.allChannels.filter(
      (channel) => channel.id === this.currentChannel
    );

    for (const user of getChannel) {
      const userArray = user.addedUser;
      this.channelService.channelMembers = userArray;

      for (const user of filteredUsers) {
        const isUserInChannel = userArray.some(
          (channelUser) => channelUser === user.id
        );
        if (!isUserInChannel) {
          this.getSearchedUser.push(user);
        }
      }
    }
  }

  /**
   * Checks if a user is already selected.
   * @param {User} user - The user to check.
   * @returns {boolean} Returns true if the user is already selected, otherwise false.
   */
  isUserAlreadySelectet(user: User) {
    return this.getSelectedUsers.some(
      (selectedUser) => selectedUser.id === user.id
    );
  }

  /**
   * Adds a user to the list of selected users.
   * @param {User} user - The user to add.
   */
  chooseUser(user: User) {
    const isUserAlreadySelected = this.getSelectedUsers.some(
      (selectedUser) => selectedUser.id === user.id
    );

    if (!isUserAlreadySelected) {
      this.selectedUsers.push(user.id!);
      this.getSelectedUsers.push(user);
    }
    this.userName = '';
    this.showExistenUsers = false;
  }

  /**
   * Removes the user at the specified index from the list of selected users.
   * @param {number} index - The index of the user to remove.
   */
  spliceCurrentUser(index: number) {
    this.getSelectedUsers.splice(index, 1);
    this.showExistenUsers = false;
  }

  /**
   * Gets the name of the current channel.
   * @param {string} currentChannel - The ID of the current channel.
   * @returns {boolean} Returns true if the channel exists, otherwise false.
   */
  getChannelName(currentChannel: string) {
    const getName = this.channelService.allChannels.some(
      (channel) => channel.id == currentChannel
    );
    const getChannelName = this.channelService.allChannels.filter(
      (channel) => channel.id == currentChannel
    );
    this.getCurrentChannelName = getChannelName[0].name;
    return getName;
  }

  /**
   * Adds selected users to the current channel.
   */
  addUserToChannel() {
    this.channelService.addNewMemberToChannel(
      'channels',
      this.currentChannel,
      this.selectedUsers,
      'addUserToChannel'
    );
    this.closeChannelMemberWindow();
  }

  /**
   * Opens a user window.
   *
   * @param {User} user - The user to be displayed in the window.
   * @returns {void}
   */
  openUserWindow(user: User) {
    this.user = [user];
    this.openUserWindowBoolean = !this.openUserWindowBoolean;
  }

  /**
   * Opens or closes the user window based on the given value.
   * @param {boolean} value - The value to set for opening/closing the user window.
   */
  changeOpenUserWindowBoolean(value: boolean) {
    this.openUserWindowBoolean = value;
  }

  /**
   * Resets various values used in the component.
   */
  resetValues() {
    this.userName = '';
    this.showExistenUsers = false;
    this.getSearchedUser = [];
    this.getCurrentChannelName = '';
    this.getSelectedUsers = [];
    this.selectedUsers = [];
  }
}
