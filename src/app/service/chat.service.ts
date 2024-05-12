import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Chat, ChatAnswers, ChatReactions } from '../interface/chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService implements OnDestroy {
  firestore: Firestore = inject(Firestore);

  allChats: Chat[] = [];
  allChatAnswers: ChatAnswers[] = [];
  allChatReactions: ChatReactions[] = [];
  isSecondaryChatId: string = '';
  isSecondaryChatOpen: boolean = false;
  getChannelId: string = '';
  getPrvChatId: string = '';
  inputValue: string = '';

  unsubChat;
  unsubChatAnswers;
  unsubChatReactions;

  constructor() {
    this.unsubChat = this.subChatList();
    this.unsubChatAnswers = this.subChatAnswersList();
    this.unsubChatReactions = this.subChatListReactions();
  }


  /**
   * Subscribes to the chat list collection in Firestore and updates the local chat list accordingly.
   * @returns A function to unsubscribe from the chat list.
   */
  subChatList() {
    const queryRef = query(
      collection(this.firestore, 'chats'),
      orderBy('publishedTimestamp')
    );

    return onSnapshot(queryRef, (list) => {
      this.allChats = [];
      list.forEach((element) => {
        const chatWithId = { id: element.id, ...element.data() } as Chat;
        this.allChats.push(chatWithId);
      });
    });
  }


  /**
   * Subscribes to the chat answers list collection in Firestore and updates the local chat answers list accordingly.
   * @returns A function to unsubscribe from the chat answers list.
   */
  subChatAnswersList() {
    return onSnapshot(collection(this.firestore, 'chat-answers'), (list) => {
      this.allChatAnswers = [];
      list.forEach((element) => {
        const chatWithId = { id: element.id, ...element.data() } as ChatAnswers;
        this.allChatAnswers.push(chatWithId);
      });
    });
  }


  /**
   * Subscribes to the chat reactions list collection in Firestore and updates the local chat reactions list accordingly.
   * @returns A function to unsubscribe from the chat reactions list.
   */
  subChatListReactions() {
    return onSnapshot(collection(this.firestore, 'reactions'), (list) => {
      this.allChatReactions = [];
      list.forEach((element) => {
        const chatReactionsWithId = {
          id: element.id,
          ...element.data(),
        } as ChatReactions;
        this.allChatReactions.push(chatReactionsWithId);
      });
    });
  }


  /**
   * Updates the specified chat document with the provided data.
   * @param chatId The ID of the chat document to update.
   * @param update The partial data to update the chat document with.
   */
  async updateChat(chatId: string, update: Partial<Chat>) {
    const chatRef = doc(collection(this.firestore, 'chats'), chatId);
    const updatedData = { ...update, edited: true };
    await updateDoc(chatRef, updatedData).catch((err) => {
      console.error(err);
      throw err;
    });
  }


  /**
   * Updates the reaction document with the specified ID with the provided array of user IDs.
   * @param reactionId The ID of the reaction document to update.
   * @param array The array of user IDs to update the reaction with.
   */
  async updateReaction(reactionId: any, array: string[]) {
    await updateDoc(doc(collection(this.firestore, 'reactions'), reactionId), {
      userId: array,
    }).catch((err) => {
      console.error(err);
    });
  }


  /**
   * Creates a new reaction document with the provided data.
   * @param reaction The reaction data to add to Firestore.
   */
  async createNewReaction(reaction: ChatReactions) {
    await addDoc(collection(this.firestore, 'reactions'), reaction).catch(
      (err) => {
        console.error(err);
      }
    );
  }


  /**
   * Deletes a document from the specified Firestore collection.
   * @param docId The ID of the document to delete.
   * @param database The name of the Firestore collection.
   */
  async deleteData(docId: string, database: string) {
    await deleteDoc(doc(collection(this.firestore, database), docId)).catch(
      (err) => {
        console.error(err);
      }
    );
  }


  /**
   * Retrieves chat answers associated with the specified chat ID.
   * @param chatId The ID of the chat to retrieve answers for.
   * @returns An array of chat answers.
   */
  getChatAnswers(chatId: string): ChatAnswers[] {
    const filteredTasks = this.allChatAnswers.filter(
      (chat) => chat.chatId == chatId
    );
    return filteredTasks;
  }


  /**
   * Toggles the secondary chat window based on the provided chat ID.
   * @param chatId The ID of the chat to toggle the secondary window for.
   */
  toggleSecondaryChat(chatId: string) {
    if (this.isSecondaryChatId == chatId) {
      chatId = 'none';
    }
    if (chatId == 'none') {
      this.isSecondaryChatOpen = false;
      this.isSecondaryChatId = '';
    } else {
      this.isSecondaryChatOpen = true;
    }

    if (this.isSecondaryChatOpen) {
      this.isSecondaryChatId = chatId;
    }
  }


  /**
   * Unsubscribes from all Firestore subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    this.unsubChat();
    this.unsubChatAnswers();
    this.unsubChatReactions();
  }
}
