import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { SmallBtnComponent } from '../../../../shared/components/small-btn/small-btn.component';
import { CommonModule } from '@angular/common';
import {
  Chat,
  ChatAnswers,
  ChatReactions,
} from '../../../../interface/chat.interface';
import { UserService } from '../../../../service/user.service';
import { ChatService } from '../../../../service/chat.service';
import { ChannleService } from '../../../../service/channle.service';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { timeInterval } from 'rxjs';
import { User } from '../../../../interface/user.interface';
import { SharedService } from '../../../../service/shared.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reaction-emojis',
  standalone: true,
  imports: [
    CommonModule,
    SmallBtnComponent,
    EmojiPickerComponent,
    EmojiComponent,
    TranslateModule,
  ],
  templateUrl: './reaction-emojis.component.html',
  styleUrl: './reaction-emojis.component.scss',
})
export class ReactionEmojisComponent {
  @Input() user: User = {} as User;
  @Input() chat: Chat | ChatAnswers = {} as Chat | ChatAnswers;
  @Input() openOnSecondaryChat: boolean = false;
  @Input() secondaryChatFirstMsg: boolean = false;
  @Input() viewWidth: number = 0;

  reactionDialogId: string = '';
  reactionDialogLeft = 0;
  isEmojiPickerVisible: boolean = false;
  emojiSectionWidth: number = 0;
  dialogX: number = 0;
  dialogY: number = 0;

  constructor(
    private elementRef: ElementRef,
    public userService: UserService,
    private chatService: ChatService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  /**
   * Emits an emoji output event.
   * @param {any} $event - The emoji event.
   * @param {string} chatId - The ID of the chat.
   */
  emojiOutputEmitter($event: any, chatId: string) {
    if (!this.checkExistEmojiOnChat(chatId, $event)) {
      let reaction: ChatReactions = {
        chatId: chatId,
        icon: $event,
        userId: [this.userService.getCurrentUserId()],
      };
      const { id, ...reactionWithoutId } = reaction;
      this.chatService.createNewReaction(reactionWithoutId);
    }
  }

  /**
   * Emits an event indicating the visibility of the emoji picker.
   * @param {any} $event - The visibility event.
   */
  emojiVisibleEmitter($event: any) {
    this.isEmojiPickerVisible = $event;
  }

  /**
   * Opens a dialog for a reaction.
   * @param {any} reactionId - The ID of the reaction.
   * @param {MouseEvent} event - The mouse event triggering the dialog.
   */
  openDialog(reactionId: any, event: MouseEvent) {
    this.reactionDialogId = reactionId;
    this.updateDialogPosition(event);
  }

  /**
   * Closes the currently opened dialog.
   */
  closeDialog() {
    this.reactionDialogId = '';
  }

  /**
   * Updates the position of the dialog based on the mouse event.
   * @param {MouseEvent} event - The mouse event triggering the update.
   */
  updateDialogPosition(event: MouseEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    if (currentTarget) {
      const rect = currentTarget.getBoundingClientRect();
      this.dialogX = event.clientX - 200;
      this.dialogY = event.clientY + 10;
    }
  }

  /**
   * Checks if a given emoji exists on a chat.
   * @param {string} chatId - The ID of the chat.
   * @param {string} icon - The icon to check.
   * @returns {boolean} True if the emoji exists, otherwise false.
   */
  checkExistEmojiOnChat(chatId: string, icon: string) {
    return this.getReaction(chatId).length > 0 &&
      this.getReactionIcon(chatId, icon).length > 0
      ? true
      : false;
  }

  /**
   * Finds the index of an element in an array.
   * @param {any[]} array - The array to search in.
   * @param {any} element - The element to find the index of.
   * @returns {number} The index of the element in the array.
   */
  indexOfArray(array: any[], element: any): number {
    return array.indexOf(element);
  }

  /**
   * Retrieves all reactions for a given chat.
   * @param {string} chatId - The ID of the chat.
   * @returns {ChatReactions[]} All reactions for the chat.
   */
  getReaction(chatId: string) {
    return this.chatService.allChatReactions.filter(
      (reaction) => reaction.chatId === chatId
    );
  }

  /**
   * Retrieves reactions with a specific icon for a given chat.
   * @param {string} chatId - The ID of the chat.
   * @param {string} icon - The icon to filter by.
   * @returns {ChatReactions[]} Reactions with the specified icon for the chat.
   */
  getReactionIcon(chatId: string, icon: string) {
    const chat = this.getReaction(chatId);
    return chat.filter((reaction) => reaction.icon == icon);
  }

  /**
   * Retrieves the reaction document ID for a given chat.
   * @param {string} chatId - The ID of the chat.
   * @returns {ChatReactions[]} The reaction document ID for the chat.
   */
  getReactionDocId(chatId: string) {
    return this.chatService.allChatReactions.filter(
      (reaction) => reaction.id === chatId
    );
  }

  /**
   * Counts the number of reaction document IDs for a given chat.
   * @param {string} chatId - The ID of the chat.
   * @returns {number} The count of reaction document IDs for the chat.
   */
  countReactionDocId(chatId: string) {
    let count = 0;
    this.chatService.allChatReactions.forEach((reaction) => {
      if (reaction.id === chatId) {
        count++;
      }
    });
    return count;
  }

  /**
   * Retrieves user information based on user ID.
   * @param {string} userId - The ID of the user.
   * @returns {User[]} User information for the given user ID.
   */
  getUserId(userId: string) {
    const filteredUser = this.userService
      .getUsers()
      .filter((user) => user.id == userId);
    return filteredUser;
  }

  /**
   * Toggles the presence of a user's reaction to a chat.
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

  /**
   * Toggles the visibility of the emoji picker.
   */
  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }
}
