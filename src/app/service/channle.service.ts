import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import {
  publicChannels,
  Channel,
  PrvChannel,
} from '../interface/channel.interface';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChannleService implements OnDestroy {
  firestore: Firestore = inject(Firestore);

  allChannels: Channel[] = [];
  publicChannels: string[] = publicChannels;
  showAddChannelBox: boolean = false;
  btnIsValid: boolean = false;
  saveEditBtnIsValid: boolean = false;
  openPrvChat: boolean = false;
  allPrvChannels: PrvChannel[] = [];
  channelMembers: string[] = [];
  loggedInUser: string = '';
  getChannelID: string = '';

  unsubChannel;
  unsubPrvChannel;

  constructor(private chatService: ChatService) {
    this.unsubChannel = this.subChannelList();
    this.unsubPrvChannel = this.subPrvChannelList();
  }

  /**
   * Construct Firestore path for a given collection.
   * @param path Path of the collection in Firestore.
   * @returns Firestore collection reference.
   */
  firesorePath(path: string) {
    return collection(this.firestore, path);
  }

  /**
   * Subscribe to the list of public channels in Firestore.
   * @returns Unsubscribe function.
   */
  subChannelList() {
    return onSnapshot(this.firesorePath('channels'), (list) => {
      this.allChannels = [];
      list.forEach((element) => {
        const channelWithId = { id: element.id, ...element.data() } as Channel;
        this.allChannels.push(channelWithId);
      });
    });
  }

  /**
   * Subscribe to the list of public channels in Firestore.
   * @returns Unsubscribe function.
   */
  subPrvChannelList() {
    return onSnapshot(this.firesorePath('prv-channels'), (list) => {
      this.allPrvChannels = [];
      list.forEach((element) => {
        const channelWithId = {
          id: element.id,
          ...element.data(),
        } as PrvChannel;
        this.allPrvChannels.push(channelWithId);
      });
    });
  }

  /**
   * Update name or description of a channel in Firestore.
   * @param category Collection category (e.g., 'channels' or 'prv-channels').
   * @param channelID ID of the channel to update.
   * @param channelCategory Category to update ('name' or 'description').
   * @param textValue New value for the category.
   */
  async saveAddedNameOrDescription(
    category: string,
    channelID: string,
    channelCategory: string,
    textValue: string
  ) {
    const docRef = doc(this.firestore, `${category}/${channelID}`);
    await updateDoc(docRef, { [channelCategory]: textValue });
  }

  /**
   * Create a new channel or private channel in Firestore.
   * @param newChannel Channel or private channel object to create.
   * @param path Path of the collection in Firestore.
   * @returns ID of the newly created channel or undefined if creation fails.
   */
  async createNewChannel(
    newChannel: Channel | PrvChannel,
    path: string
  ): Promise<string | undefined> {
    try {
      const docRef = await addDoc(this.firesorePath(path), newChannel);
      this.chatService.getPrvChatId = docRef.id;
      return docRef.id;
    } catch (err) {
      console.error('Error creating channel:', err);
      return undefined;
    }
  }

  /**
   * Add new member(s) to a channel in Firestore.
   * @param category Collection category (e.g., 'channels' or 'prv-channels').
   * @param channelID ID of the channel to update.
   * @param selectedUsers Array of user IDs to add as members.
   * @param checkCategory Category to check ('addUserToChannel').
   */
  async addNewMemberToChannel(
    category: string,
    channelID: string,
    selectedUsers: string[],
    checkCategory: string
  ) {
    const currentChannelUsers = this.allChannels.filter(
      (channel) => channel.id === channelID
    );
    if (checkCategory === 'addUserToChannel') {
      const allMembers: string[] = [
        ...selectedUsers,
        ...currentChannelUsers[0].addedUser,
      ];
      const docRef = doc(this.firestore, `${category}/${channelID}`);
      await updateDoc(docRef, { addedUser: allMembers });
    } else if (checkCategory === 'leaveChannel') {
      const docRef = doc(this.firestore, `${category}/${channelID}`);
      await updateDoc(docRef, { addedUser: selectedUsers });
    }
  }

  /**
   * Clean up subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    this.unsubChannel();
    this.unsubPrvChannel();
  }

  /**
   * Placeholder function for committing a batch of Firestore writes.
   * @param batch Firestore batch object.
   */
  commitBatch(batch: any) {
    throw new Error('Function not implemented.');
  }
}
