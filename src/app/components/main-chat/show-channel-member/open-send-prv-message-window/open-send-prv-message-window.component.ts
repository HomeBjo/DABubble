import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../interface/user.interface';
import { ToggleBooleanService } from '../../../../service/toggle-boolean.service';
import { ChannleService } from '../../../../service/channle.service';
import { UserService } from '../../../../service/user.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-open-send-prv-message-window',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './open-send-prv-message-window.component.html',
  styleUrl: './open-send-prv-message-window.component.scss',
})
export class OpenSendPrvMessageWindowComponent {
  @Input() user!: User[];
  @Input() talkToUser!: User[];
  @Input() openUserWindowBoolean!: boolean;
  @Input() showProfil!: boolean;
  @Output() closeUserWondow = new EventEmitter<boolean>();
  @Output() showProfilWindow = new EventEmitter<boolean>();
  isOnline: boolean = false;

  constructor(
    public toggleBoolean: ToggleBooleanService,
    private channelService: ChannleService,
    public userService: UserService,
    private route: Router
  ) {}

  /**
   * Closes the user window and profile window if open.
   * Emits events to notify about window closure.
   */
  closeWindow() {
    this.openUserWindowBoolean = false;
    this.showProfil = false;
    this.closeUserWondow.emit(this.openUserWindowBoolean);
    this.showProfilWindow.emit(this.showProfil);
  }

  /**
   * Closes all open windows and resets toggle booleans.
   * Emits events to notify about window closures.
   */
  closeEverything() {
    this.openUserWindowBoolean = false;
    this.closeUserWondow.emit(this.openUserWindowBoolean);
    this.toggleBoolean.openChannelMemberWindow = false;
    this.toggleBoolean.closeChannelMemberWindow = false;
  }

  /**
   * Routes to the user's private chat.
   * If the chat channel does not exist, it creates one.
   * @param {User[]} user - The user to route to.
   */
  routeToUser(user: User[]) {
    const userId = user[0].id!;
    const channelExistsBoolean = this.channelService.allPrvChannels.some(
      (channel) =>
        (channel.creatorId === userId &&
          channel.talkToUserId === this.userService.getCurrentUserId()) ||
        (channel.creatorId === this.userService.getCurrentUserId() &&
          channel.talkToUserId === userId)
    );

    if (!channelExistsBoolean) {
      const createChannelPromise = this.userService.createPrvChannel(userId);
      if (createChannelPromise instanceof Promise) {
        createChannelPromise.then((docId) => {
          this.route.navigateByUrl(`main/${docId}`);
        });
      }
    } else {
      this.getRouteToPrvChat(userId, channelExistsBoolean);
    }
    this.closeEverything();
  }

  /**
   * Routes to the existing private chat.
   * @param {string} userId - The ID of the user to route to.
   * @param {boolean} channelExistsBoolean - Indicates whether the chat channel exists.
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
