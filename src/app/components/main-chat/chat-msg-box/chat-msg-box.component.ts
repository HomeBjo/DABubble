import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { DownloadFilesService } from '../../../service/download-files.service';
import { UserService } from '../../../service/user.service';
import { EmojiPickerComponent } from '../../../shared/components/emoji-picker/emoji-picker.component';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { ChatService } from '../../../service/chat.service';
import { Router } from '@angular/router';
import { ChannleService } from '../../../service/channle.service';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';
import { User } from '../../../interface/user.interface';
import { MessageData } from '../../../interface/chat.interface';
import { TranslateModule } from '@ngx-translate/core';
import { Channel } from '../../../interface/channel.interface';

@Component({
  selector: 'app-chat-msg-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PickerComponent,
    EmojiPickerComponent,
    SmallBtnComponent,
    TranslateModule,
  ],
  templateUrl: './chat-msg-box.component.html',
  styleUrl: './chat-msg-box.component.scss',
})
export class ChatMsgBoxComponent {
  @Input() currentChannel: string = '';
  @Input() target: string = '';
  @Output() newMsgEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('textarea') textAreaRef!: ElementRef;

  hasFile: boolean = false;
  currentFiles!: FileList;
  files: any;
  getFileIcons = [
    './assets/img/documentIcon.svg',
    './assets/img/imgIcon.svg',
    './assets/img/mp3Icon.svg',
    './assets/img/pdfIcon.svg',
    './assets/img/videoIcon.svg',
  ];
  textArea: string = '';
  isEmojiPickerVisible: boolean | undefined;
  currentChatValue: string = '';
  showTargetMember: boolean = true;
  showChannels: boolean = false;
  showUsers: boolean = false;
  openSmallWindow: boolean = false;

  constructor(
    private route: Router,
    public downloadFilesService: DownloadFilesService,
    private firestore: Firestore,
    public userService: UserService,
    private chatService: ChatService,
    public channelService: ChannleService,
    public toggleBoolean: ToggleBooleanService
  ) {}

  /**
   * Handles the output from the emoji picker.
   * @param $event The selected emoji.
   */
  emojiOutputEmitter($event: any) {
    this.addEmoji($event);
  }

  /**
   * Select Textarea at onload.
   */
  ngAfterViewInit() {
    this.textAreaRef.nativeElement.select();
  }

  /**
   * Handles file input change event.
   * @param event The file change event.
   */
  onFileChange(event: any) {
    if (this.downloadFilesService.uploadFiles.length < 1) {
      this.currentFiles = event.target.files;
      this.hasFile = this.currentFiles!.length > 0;
      if (this.currentFiles) {
        for (let i = 0; i < this.currentFiles.length; i++) {
          const fileInfo = this.currentFiles[i];
          this.downloadFilesService.uploadFiles.push(fileInfo);
        }
      }
    }
  }

  /**
   * Checks the file type and returns the corresponding icon.
   * @param fileInfo The file object.
   * @returns The file icon path.
   */
  checkIcon(fileInfo: any) {
    if (fileInfo.type == 'audio/mpeg') {
      return this.getFileIcons[2];
    } else if (fileInfo.type == 'image/jpeg') {
      return this.getFileIcons[1];
    } else if (fileInfo.type == 'application/pdf') {
      return this.getFileIcons[3];
    } else if (fileInfo.type == 'video/mp4') {
      return this.getFileIcons[4];
    } else {
      return this.getFileIcons[0];
    }
  }

  /**
   * Deletes the selected file.
   * @param file The file to be deleted.
   */
  deleteFile(file: File) {
    const index = this.downloadFilesService.uploadFiles.indexOf(file);
    if (index !== -1) {
      this.downloadFilesService.uploadFiles.splice(index, 1);
      this.hasFile = this.downloadFilesService.uploadFiles.length > 0;
    }
  }

  /**
   * Opens the selected file in a new tab.
   * @param file The file to be opened.
   */
  showCurrentFile(file: File) {
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  /**
   * Adds the selected emoji to the message text area.
   * @param event The selected emoji.
   */
  public addEmoji(event: any) {
    this.textArea = `${this.textArea}${event}`;
    this.isEmojiPickerVisible = false;
  }

  /**
   * Toggles the visibility of the emoji picker.
   */
  toggleEmojiPicker() {
    this.isEmojiPickerVisible = !this.isEmojiPickerVisible;
  }

  /**
   * Displays the list of target chat users.
   * @param event The event object.
   */
  targetChatUser(event: Event) {
    event.stopPropagation();
    this.toggleBoolean.selectUserInMsgBox = true;
  }

  /**
   * Appends the selected user's name to the message text area.
   * @param user The selected user.
   */
  chooseUser(user: User) {
    const userName = ` @${user.firstName} ${user.lastName} `;

    this.textArea += userName;
    this.toggleBoolean.selectUserInMsgBox = false;
  }

  /**
   * Sends a message when Enter key is pressed.
   * @param e The keyboard event.
   */
  sendMessageWithEnter(e: KeyboardEvent) {
    if (this.textArea.trim() !== '') {
      if (e.keyCode === 13) {
        this.sendMessage();
      }
    }
  }

  /**
   * Sends the message to the target channel.
   */
  async sendMessage() {
    if (this.currentChannel && this.textArea.trim() !== '') {
      const messageRef = collection(this.firestore, this.target);
      const messageData = this.checkCollection(this.target);
      if (messageData) {
        await addDoc(messageRef, messageData)
          .then((docRef) => {
            this.downloadFilesService.loadAllFiles(docRef.id);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      } else {
        console.error('Invalid target:', this.target);
      }
    }
    this.forwardToChannel();
    this.resetValues();
    this.newMsgEmitter.emit(true);
  }

  /**
   * Checks the target collection and returns the message data.
   * @param target The target collection.
   * @returns The message data.
   */
  checkCollection(target: string): MessageData | null {
    let messageData: Partial<MessageData> = {
      message: this.textArea,
      publishedTimestamp: Math.floor(Date.now() / 1000),
      userId: this.userService.getCurrentUserId(),
      edited: false,
    };

    if (target === 'chats') {
      messageData.channelId = this.checkChannelId();
    } else if (target === 'chat-answers') {
      messageData.chatId = this.checkChatId();
    } else {
      console.error('Invalid target:', target);
      return null;
    }
    return messageData as MessageData;
  }

  /**
   * Checks
   * the channel ID based on the chat service.
   * @returns The channel ID.
   */
  checkChannelId() {
    if (this.chatService.getChannelId) {
      return this.chatService.getChannelId;
    } else if (this.chatService.getPrvChatId) {
      return this.chatService.getPrvChatId;
    } else if (
      this.currentChannel === 'searchBar' &&
      this.chatService.inputValue === ''
    ) {
      return '';
    }
    return this.currentChannel;
  }

  /**
   * Checks the chat ID based on the chat service.
   * @returns The chat ID.
   */
  checkChatId() {
    if (this.chatService.isSecondaryChatId) {
      return this.chatService.isSecondaryChatId;
    }
    return;
  }

  /**
   * Navigates to the target channel after sending the message.
   */
  forwardToChannel() {
    if (this.chatService.getChannelId || this.chatService.getPrvChatId) {
      this.route.navigateByUrl(`/main/${this.checkChannelId()}`);
    }
  }

  /**
   * Close popups by leaving with the mouse the chat-msg-box.
   */
  mouseLeave() {
    this.isEmojiPickerVisible = false;
    this.toggleBoolean.selectUserInMsgBox = false;
    this.openSmallWindow = false;
    this.showChannels = false;
    this.showUsers = false;
  }

  /**
   * Open channels or user window by pressing @ or #.
   */
  checkChannelAndUser(e: KeyboardEvent) {
    if (e.key === '#') {
      this.openSmallWindow = true;
      this.showChannels = true;
      this.showUsers = false;
    } else if (e.key === '@') {
      this.openSmallWindow = true;
      this.showChannels = false;
      this.showUsers = true;
    }
    if (e.key === 'Backspace') {
      this.openSmallWindow = false;
      this.showChannels = false;
      this.showUsers = false;
    }
  }

  /**
   * Checks if the current user has access to any channels.
   * @returns {Channel[]} Array of Channel objects that the user has access to.
   */
  checkIfUserHasAccessToChannel() {
    const isUserAChannelMember = this.channelService.allChannels.some(
      (channel) =>
        channel.addedUser.includes(this.userService.getCurrentUserId())
    );

    if (isUserAChannelMember) {
      return this.channelService.allChannels.filter((channel) =>
        channel.addedUser.includes(this.userService.getCurrentUserId())
      );
    }
    return [];
  }

  /**
   * Chooses an element and performs necessary actions based on its type.
   * @param {Channel | User} element - The element to choose.
   */
  chooseElement(element: Channel | User) {
    if ('firstName' in element) {
      this.textArea += `${element.firstName} ${element.lastName} `;
    } else {
      this.textArea += `${element.name} `;
    }
    this.showUsers = false;
    this.showChannels = false;
    this.openSmallWindow = false;
    this.textAreaRef.nativeElement.focus();
  }

  /**
   * Resets input values after sending the message.
   */
  resetValues() {
    this.textArea = '';
    this.downloadFilesService.uploadFiles = [];
    this.hasFile = false;
    this.chatService.inputValue = '';
    this.chatService.getChannelId = '';
    this.chatService.getPrvChatId = '';
  }
}
