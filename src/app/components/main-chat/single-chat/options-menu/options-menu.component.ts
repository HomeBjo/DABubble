import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SingleChatComponent } from '../single-chat.component';
import { SmallBtnComponent } from '../../../../shared/components/small-btn/small-btn.component';
import { ChatService } from '../../../../service/chat.service';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { UserService } from '../../../../service/user.service';
import { ChatReactions } from '../../../../interface/chat.interface';
import { User } from '../../../../interface/user.interface';
import { SharedService } from '../../../../service/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-options-menu',
  standalone: true,
  imports: [
    CommonModule,
    SingleChatComponent,
    SmallBtnComponent,
    EmojiPickerComponent,
    TranslateModule,
  ],
  templateUrl: './options-menu.component.html',
  styleUrl: './options-menu.component.scss',
})
export class OptionsMenuComponent {
  @Input() user: User = {} as User;
  @Input() currentChat: string = '';
  @Input() openOnSecondaryChat: boolean = false;
  @Input() isPrivatChannel: boolean = false;
  @Input() viewWidth: number = 0;
  @Output() editMsgEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  isNavOpen: boolean = false;
  isEmojiPickerVisible: boolean = false;

  constructor(
    public chatService: ChatService,
    public userService: UserService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  /**
   * Emits signal to edit message and toggles navigation.
   */
  editMsg() {
    this.editMsgEmitter.emit(true);
    this.toggleNav();
  }

  /**
   * Deletes message from specified database and toggles navigation.
   * @param {string} database - The name of the database to delete from.
   */
  deleteMsg(database: string) {
    this.toggleNav();
    this.chatService.deleteData(this.currentChat, database);
  }

  /**
   * Emits emoji output event for a chat message.
   * @param {*} $event - The event containing the emoji.
   * @param {string} chatId - The ID of the chat message.
   */
  emojiOutputEmitter($event: any, chatId: string) {
    if (!this.checkExistEmojiOnChat(chatId, $event)) {
      this.addNewReaction($event, chatId);
    }
  }

  /**
   * Adds reaction icon to a chat message.
   * @param {string} icon - The icon to add as reaction.
   * @param {string} chatId - The ID of the chat message.
   */
  addReactionIcon(icon: string, chatId: string) {
    if (!this.checkExistEmojiOnChat(chatId, icon)) {
      this.addNewReaction(icon, chatId);
    } else {
      const id = this.getReactionIcon(chatId, icon)[0].id;
      if (id != undefined) {
        this.toggleEmoji(id);
      }
    }
  }

  /**
   * Adds a new reaction to a chat message.
   * @param {*} event - The event containing the reaction.
   * @param {string} chatId - The ID of the chat message.
   */
  addNewReaction(event: any, chatId: string) {
    let reaction: ChatReactions = {
      chatId: chatId,
      icon: event,
      userId: [this.userService.getCurrentUserId()],
    };
    const { id, ...reactionWithoutId } = reaction;
    this.chatService.createNewReaction(reactionWithoutId);
  }

  /**
   * Checks if a specific emoji exists on a chat message.
   * @param {string} chatId - The ID of the chat message.
   * @param {string} icon - The icon to check for existence.
   * @returns {boolean} - True if the emoji exists, false otherwise.
   */
  checkExistEmojiOnChat(chatId: string, icon: string) {
    return this.getReaction(chatId).length > 0 &&
      this.getReactionIcon(chatId, icon).length > 0
      ? true
      : false;
  }

  /**
   * Retrieves all reactions for a chat message.
   * @param {string} chatId - The ID of the chat message.
   * @returns {Array} - Array of reactions for the chat message.
   */
  getReaction(chatId: string) {
    return this.chatService.allChatReactions.filter(
      (reaction) => reaction.chatId === chatId
    );
  }

  /**
   * Retrieves reactions with a specific icon for a chat message.
   * @param {string} chatId - The ID of the chat message.
   * @param {string} icon - The icon to filter reactions.
   * @returns {Array} - Array of reactions with the specified icon.
   */
  getReactionIcon(chatId: string, icon: string) {
    const chat = this.getReaction(chatId);
    return chat.filter((reaction) => reaction.icon == icon);
  }

  /**
   * Emits signal to toggle emoji picker visibility.
   * @param {*} $event - The event containing the visibility state.
   */
  emojiVisibleEmitter($event: any) {
    this.isEmojiPickerVisible = $event;
  }

  /**
   * Toggles the navigation bar state.
   */
  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
    this.isEmojiPickerVisible = false;
  }

  /**
   * Toggles the secondary chat display.
   * @param {string} chatId - The ID of the chat message.
   */
  toggleSecondaryChat(chatId: string) {
    this.chatService.toggleSecondaryChat(chatId);
    this.isEmojiPickerVisible = false;
  }

  /**
   * Toggles the visibility of the emoji picker.
   */
  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  /**
   * Retrieves the document ID for a reaction.
   * @param {string} chatId - The ID of the chat message.
   * @returns {Array} - Array containing the reaction document ID.
   */
  getReactionDocId(chatId: string) {
    return this.chatService.allChatReactions.filter(
      (reaction) => reaction.id === chatId
    );
  }

  /**
   * Toggles the reaction of a user on a chat message.
   * @param {string} reactionID - The ID of the reaction.
   */
  toggleEmoji(reactionID: string) {
    const userIds = this.getReactionDocId(reactionID)[0].userId;
    if (userIds.includes(this.userService.getCurrentUserId())) {
      userIds.splice(userIds.indexOf(this.userService.getCurrentUserId()), 1);
      if (userIds.length == 0) {
        this.chatService.deleteData(reactionID, 'reactions');
      } else {
        this.chatService.updateReaction(reactionID, userIds);
      }
    } else {
      userIds.push(this.userService.getCurrentUserId());
      this.chatService.updateReaction(reactionID, userIds);
    }
  }
}
