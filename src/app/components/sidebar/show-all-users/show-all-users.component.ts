import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../service/user.service';
import { User } from '../../../interface/user.interface';
import { ChannleService } from '../../../service/channle.service';
import { Router } from '@angular/router';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { ChatService } from '../../../service/chat.service';
import { SharedService } from '../../../service/shared.service';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';

@Component({
  selector: 'app-show-all-users',
  standalone: true,
  imports: [TranslateModule, SmallBtnComponent],
  templateUrl: './show-all-users.component.html',
  styleUrl: './show-all-users.component.scss',
})
export class ShowAllUsersComponent {
  @Input() viewWidth: number = 0;
  @Output() toggleMemberListEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    public userService: UserService,
    private route: Router,
    private channelService: ChannleService,
    private chatService: ChatService,
    public toggleBoolean: ToggleBooleanService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;

  /**
   * Toggles the member list by emitting an event.
   * @param {boolean} isVisible - Indicates whether the member list should be visible or not.
   */
  toggleMemberList() {
    this.toggleMemberListEmitter.emit(false);
  }

  /**
   * Closes the secondary chat window & sidebar.
   */
  closeSecondaryChatAndSidebar() {
    this.chatService.toggleSecondaryChat('none');
    this.toggleMemberList();
    if (this.viewWidth <= this.RESPONSIVE_THRESHOLD) {
      this.toggleBoolean.isSidebarOpen = false;
    }
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
