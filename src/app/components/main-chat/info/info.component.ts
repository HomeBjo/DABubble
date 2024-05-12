import { Component, Input } from '@angular/core';
import { ChannleService } from '../../../service/channle.service';
import { UserService } from '../../../service/user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
})
export class InfoComponent {
  @Input() currentChannel: string = '';

  constructor(
    private channelService: ChannleService,
    public userService: UserService
  ) {}

  /**
   * Retrieves chat users based on the provided chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {Array} - An array containing the users associated with the chat.
   */
  getChatUsers(chatId: string) {
    const filteredTasks = this.userService.allUsers.filter(
      (user) => user.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves a channel based on the provided chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {Array} - An array containing the channel matching the provided chat ID.
   */
  getChannel(chatId: string) {
    const filteredTasks = this.channelService.allChannels.filter(
      (channel) => channel.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves a private channel based on the provided chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {Array} - An array containing the private channel matching the provided chat ID.
   */
  getPrivatChannel(chatId: string) {
    const filteredTasks = this.channelService.allPrvChannels.filter(
      (channel) => channel.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Converts a date string to a formatted time string.
   * @param {string} dateString - The date string to convert.
   * @returns {string} - The formatted time string (e.g., "Jan. 1, 2022").
   */
  timeConverter(dateString: string) {
    var a = new Date(dateString);
    var months = [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May.',
      'Jun.',
      'Jul.',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
  }
}
