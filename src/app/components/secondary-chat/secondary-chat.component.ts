import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../service/user.service';
import { ChannleService } from '../../service/channle.service';
import { ChatService } from '../../service/chat.service';
import { Channel } from '../../interface/channel.interface';
import { MainComponent } from '../main/main.component';
import { SingleChatComponent } from '../main-chat/single-chat/single-chat.component';
import { Chat, ChatAnswers } from '../../interface/chat.interface';
import { CommonModule } from '@angular/common';
import { User } from '../../interface/user.interface';
import { ChatMsgBoxComponent } from '../main-chat/chat-msg-box/chat-msg-box.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-secondary-chat',
  standalone: true,
  imports: [
    MainComponent,
    SingleChatComponent,
    ChatMsgBoxComponent,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './secondary-chat.component.html',
  styleUrl: './secondary-chat.component.scss',
})
export class SecondaryChatComponent implements AfterViewChecked {
  @Input() currentChannel: string = '';
  @Input() viewWidth: number = 0;
  @ViewChild('messageBody') messageBody: ElementRef | undefined;
  sidebarLoaded: boolean = false;
  isNewMessage: boolean = false;

  constructor(
    public userService: UserService,
    public channelService: ChannleService,
    public chatService: ChatService,
    private renderer: Renderer2
  ) {}

  /**
   * Scrolls to the bottom if the secondary chat is open and the sidebar has not been loaded yet.
   */
  ngAfterViewChecked() {
    setTimeout(() => {
      if (this.chatService.isSecondaryChatOpen && !this.sidebarLoaded) {
        this.scrollToBottom();
      }
    }, 200);
  }

  /**
   * Updates the isNewMessage flag and scrolls to the bottom if there's a new message.
   * @param {boolean} variable - Flag indicating if there's a new message.
   */
  editMsgEmitter(variable: boolean) {
    this.isNewMessage = variable;
    if (this.isNewMessage) {
      this.scrollToBottom();
    }
  }

  /**
   * Scrolls the message body to the bottom.
   */
  scrollToBottom(): void {
    if (this.messageBody) {
      const element = this.messageBody.nativeElement;
      this.renderer.setProperty(
        element,
        'scrollTop',
        element.scrollHeight - element.clientHeight
      );
      this.sidebarLoaded = true;
    }
  }

  /**
   * Returns the count of chat answers for a given chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {number} - The count of chat answers.
   */
  displayCountChatAnswer(chatId: string) {
    return this.chatService.getChatAnswers(chatId).length;
  }

  /**
   * Closes the thread chat window.
   */
  closeSecondaryChat() {
    this.chatService.toggleSecondaryChat('none');
    this.sidebarLoaded = false;
  }

  /**
   * Retrieves a single chat by its ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {Chat[]} - An array containing the single chat.
   */
  getSingleChat(chatId: string): Chat[] {
    const filteredTasks = this.chatService.allChats.filter(
      (chat) => chat.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves chat answers for a given chat ID.
   * @param {string} chatId - The ID of the chat.
   * @returns {ChatAnswers[]} - An array containing chat answers.
   */
  getChatAnswers(chatId: string): ChatAnswers[] {
    const filteredTasks = this.chatService.allChatAnswers.filter(
      (chat) => chat.chatId === chatId
    );

    filteredTasks.sort((a, b) => b.publishedTimestamp - a.publishedTimestamp);

    return filteredTasks;
  }

  /**
   * Retrieves users belonging to a chat.
   * @param {string} chatId - The ID of the chat.
   * @returns {User[]} - An array containing users.
   */
  getChatUsers(chatId: string) {
    const filteredTasks = this.userService.allUsers.filter(
      (user) => user.id == chatId
    );
    return filteredTasks;
  }

  /**
   * Retrieves the name of the channel.
   * @returns {Channel[]} - An array containing the channel name.
   */
  getChannelName() {
    const filteredTasks = this.channelService.allChannels.filter(
      (channel) => channel.id == this.currentChannel
    );
    return filteredTasks;
  }

  /**
   * Retrieves chats belonging to a channel.
   * @param {string} chatId - The ID of the chat (channel).
   * @returns {Chat[]} - An array containing chats.
   */
  getChatChannel(chatId: string) {
    const filteredTasks = this.chatService.allChats.filter(
      (chat) => chat.channelId == chatId
    );
    return filteredTasks;
  }
}
