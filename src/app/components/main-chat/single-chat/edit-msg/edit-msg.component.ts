import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  Chat,
  ChatAnswers,
  ChatReactions,
} from '../../../../interface/chat.interface';
import { SingleChatComponent } from '../single-chat.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChatService } from '../../../../service/chat.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SmallBtnComponent } from '../../../../shared/components/small-btn/small-btn.component';
import { DownloadFilesService } from '../../../../service/download-files.service';
import { EmojiPickerComponent } from '../../../../shared/components/emoji-picker/emoji-picker.component';
import { UserService } from '../../../../service/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../../service/shared.service';

@Component({
  selector: 'app-edit-msg',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SingleChatComponent,
    PickerComponent,
    SmallBtnComponent,
    EmojiPickerComponent,
    TranslateModule,
  ],
  templateUrl: './edit-msg.component.html',
  styleUrl: './edit-msg.component.scss',
})
export class EditMsgComponent {
  @Input() chat!: Chat | ChatAnswers;
  @Input() viewWidth: number = 0;
  @Input() openOnSecondaryChat: boolean = false;
  @Output() closeEditMsgEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  isEmojiPickerVisible: boolean | undefined;
  public originalMessage: string = '';

  constructor(
    public chatService: ChatService,
    public downloadFilesService: DownloadFilesService,
    public userService: UserService,
    private sharedService: SharedService
  ) {}

  RESPONSIVE_THRESHOLD = this.sharedService.RESPONSIVE_THRESHOLD;
  RESPONSIVE_THRESHOLD_MOBILE = this.sharedService.RESPONSIVE_THRESHOLD_MOBILE;

  ngOnInit() {
    this.originalMessage = this.chat.message as string;
  }

  /**
   * Restore the original message and emit an event to close the edit message form.
   */
  closeEditMsg() {
    this.chat.message = this.originalMessage;
    this.closeEditMsgEmitter.emit(false);
  }

  /**
   * Submit the edited message and update the chat.
   * @param {string} chatId - The ID of the chat.
   * @param {NgForm} form - The form containing the edited message.
   */
  onSubmit(chatId: string, form: NgForm) {
    this.chatService.updateChat(chatId, form.value);
    this.closeEditMsg();
  }

  /**
   * Submit the message when the Enter key is pressed.
   * @param {KeyboardEvent} e - The keyboard event.
   * @param {string} chatId - The ID of the chat.
   * @param {NgForm} form - The form containing the message.
   */
  sendMessageWithEnter(e: KeyboardEvent, chatId: string, form: NgForm) {
    if (e.keyCode === 13) {
      this.onSubmit(chatId, form);
    }
  }

  // EMOJI

  /**
   * Add an emoji to the message.
   * @param {any} $event - The emitted event containing the emoji.
   */
  emojiOutputEmitter($event: any) {
    this.addEmoji($event);
  }

  /**
   * Add an emoji to the message.
   * @param {any} event - The emitted event containing the emoji.
   */
  public addEmoji(event: any) {
    this.chat.message = `${this.chat.message}${event}`;
    this.isEmojiPickerVisible = false;
  }

  /**
   * Toggle the visibility of the emoji picker.
   */
  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  // FILES

  /**
   * Open the file in a new tab.
   * @param {string} filePath - The path to the file.
   */
  showCurrentFile(filePath: string) {
    const url = filePath;
    window.open(url, '_blank');
  }

  /**
   * Get the type of file based on its extension.
   * @param {string} filePath - The path to the file.
   * @returns {string} - The path to the corresponding file icon.
   */
  getFileType(filePath: string): string {
    const fileName = filePath.split('?')[0].split('/').pop();

    if (fileName) {
      if (fileName.endsWith('.mp3')) {
        return 'assets/img/mp3Icon.svg';
      } else if (fileName.endsWith('.jpg' || '.jpeg' || '.png' || '.gif')) {
        return 'assets/img/imgIcon.svg';
      } else if (fileName.endsWith('.pdf' || '.doc' || '.txt')) {
        return 'assets/img/pdfIcon.svg';
      } else if (fileName.endsWith('.mp4' || '.avi')) {
        return 'assets/img/videoIcon.svg';
      }
    }
    return 'assets/img/documentIcon.svg';
  }

  /**
   * Delete a file.
   * @param {string} file - The file to be deleted.
   */
  deleteFile(file: string) {
    console.log('Deleted:' + file);
  }
}
