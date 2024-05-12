import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../interface/user.interface';
import { Chat, ChatAnswers } from '../../../interface/chat.interface';
import { ChatContentComponent } from '../chat-content/chat-content.component';
import { CommonModule, NgSwitchCase } from '@angular/common';
import { ChatService } from '../../../service/chat.service';
import { DownloadFilesService } from '../../../service/download-files.service';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { OptionsMenuComponent } from './options-menu/options-menu.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { ChatMsgBoxComponent } from '../chat-msg-box/chat-msg-box.component';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { FormsModule, NgForm } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EditMsgComponent } from './edit-msg/edit-msg.component';
import { ReactionEmojisComponent } from './reaction-emojis/reaction-emojis.component';
import { UserService } from '../../../service/user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-single-chat',
  standalone: true,
  imports: [
    ChatContentComponent,
    CommonModule,
    FormsModule,
    NgSwitchCase,
    NgxExtendedPdfViewerModule,
    OptionsMenuComponent,
    AttachmentsComponent,
    ChatMsgBoxComponent,
    SmallBtnComponent,
    PickerComponent,
    EditMsgComponent,
    ReactionEmojisComponent,
    TranslateModule,
  ],
  templateUrl: './single-chat.component.html',
  styleUrl: './single-chat.component.scss',
})
export class SingleChatComponent {
  @Input() user: User = {} as User;
  @Input() chat: Chat | ChatAnswers = {} as Chat | ChatAnswers;
  @Input() index: number = 0;
  @Input() currentChat: string = '';
  @Input() isPrivatChannel: boolean = false;
  @Input() showAnswer: boolean = false;
  @Input() openOnSecondaryChat: boolean = false;
  @Input() secondaryChatFirstMsg: boolean = false;
  @Input() viewWidth: number = 0;

  trustedUrl: string = '';
  isOptionMenuVisible: boolean = false;
  isMsgEditFormOpen: boolean = false;
  firstLoadOptionMenu: boolean = false;

  constructor(
    public chatService: ChatService,
    public channelService: ChatService,
    public userService: UserService,
    public downloadFilesService: DownloadFilesService
  ) {}

  /**
   * Emits a signal to edit a message.
   * @param {boolean} variable - The value indicating whether the message edit form should be open or not.
   */
  editMsgEmitter(variable: boolean) {
    this.isMsgEditFormOpen = variable;
  }

  /**
   * Emits a signal to close the message edit form and hide the option menu.
   * @param {boolean} value - The value indicating whether the message edit form should be closed.
   */
  closeEditMsgEmitter(value: boolean) {
    this.isMsgEditFormOpen = value;
    this.hideOptionMenu();
  }

  /**
   * Shows the option menu.
   */
  showOptionMenu() {
    this.isOptionMenuVisible = true;
    this.firstLoadOptionMenu = true;
  }

  /**
   * Hides the option menu.
   */
  hideOptionMenu() {
    this.isOptionMenuVisible = false;
    this.firstLoadOptionMenu = true;
  }

  /**
   * Displays the count of chat answers.
   * @returns {number} The count of chat answers.
   */
  displayCountChatAnswer() {
    return this.chatService.getChatAnswers(this.chat.id).length;
  }

  /**
   * Displays the timestamp of the last chat answer in a formatted time.
   * @returns {string|null} The formatted time of the last chat answer.
   */
  displayLastChatAnswer() {
    const getChatAnswers = this.chatService.getChatAnswers(this.chat.id);
    const lastChatAnswer = getChatAnswers[getChatAnswers.length - 1];
    if (lastChatAnswer) {
      return this.convertTimestampHour(lastChatAnswer.publishedTimestamp);
    }
    return null;
  }

  /**
   * Converts a timestamp to a formatted time string.
   * @param {number} timestamp - The timestamp to convert.
   * @returns {string} The formatted time string.
   */
  convertTimestampHour(timestamp: number) {
    const date = new Date(timestamp * 1000);
    let hour = date.getHours();
    const minute = ('0' + date.getMinutes()).slice(-2);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    let hourWithNull = ('0' + hour).slice(-2);

    const formattedTime = `${hourWithNull}:${minute} ${period}`;
    return formattedTime;
  }

  /**
   * Converts a timestamp to a formatted date string.
   * @param {number} timestamp - The timestamp to convert.
   * @returns {string} The formatted date string.
   */
  convertTimestampDate(timestamp: number) {
    const currentDate = new Date();
    const inputDate = new Date(timestamp * 1000);
    const months = [
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

    const dayNumber = inputDate.getDate();
    const month = months[inputDate.getMonth()];

    if (inputDate.toDateString() === currentDate.toDateString()) {
      return `Today`;
    } else {
      return `${dayNumber} ${month}`;
    }
  }

  /**
   * Opens a secondary chat.
   * @param {string} chatId - The ID of the secondary chat to open.
   */
  openSecondaryChat(chatId: string) {
    this.chatService.toggleSecondaryChat(chatId);
  }
}
