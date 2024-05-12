import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../interface/user.interface';
import { ChannleService } from './channle.service';
import { getAuth, signOut } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  nameValue: string = '';
  emailValue: string = '';
  allUsers: User[] = [];
  getUserIDs: string[] = [];
  getFiltertUsers: User[] = [];
  isUserLogin: boolean = true;

  unsubUser;

  constructor(private channelService: ChannleService, private route: Router) {
    this.unsubUser = this.subUserList();
  }

  /**
   * Retrieves the current user's ID from local storage.
   * @returns {string|number|undefined} The ID of the current user if found in local storage, otherwise undefined.
   */
  getCurrentUserId() {
    let currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }

  /**
   * Subscribe to the list of users in Firestore.
   * @returns Unsubscribe function.
   */
  subUserList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.allUsers = [];
      this.getUserIDs = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as User;
        this.allUsers.push(userWithId);
        this.getUserIDs.push(userWithId.id!);
      });
    });
  }

  /**
   * Get all users.
   * @returns Array of User objects.
   */
  getUsers(): User[] {
    return this.allUsers;
  }

  /**
   * Get current user's data.
   * @returns Array containing current user's data.
   */
  getCurentUsers() {
    const filteredUser = this.getUsers().filter(
      (user) => user.id == this.getCurrentUserId()
    );
    this.nameValue =
      filteredUser[0]?.firstName + ' ' + filteredUser[0]?.lastName;
    this.emailValue = filteredUser[0]?.email;
    return filteredUser;
  }

  /**
   * Create a private channel between the current user and another user.
   * @param filterUserID ID of the user to create the private channel with.
   * @returns Existing private channel if it already exists, otherwise an empty string.
   */
  createPrvChannel(filterUserID: string) {
    const newPrvChannel = {
      creatorId: this.getCurrentUserId(),
      talkToUserId: filterUserID,
    };

    const channelExistsBoolean = this.channelService.allPrvChannels.some(
      (channel) =>
        (channel.creatorId === newPrvChannel.creatorId &&
          channel.talkToUserId === newPrvChannel.talkToUserId) ||
        (channel.creatorId === newPrvChannel.talkToUserId &&
          channel.talkToUserId === newPrvChannel.creatorId)
    );
    if (!channelExistsBoolean) {
      const docId = this.channelService.createNewChannel(
        newPrvChannel,
        'prv-channels'
      );
      return docId;
    }
    return '';
  }

  /**
   * Update current user's data in Firestore.
   * @param newFirstName New first name.
   * @param newLastName New last name.
   * @param newEmail New email.
   */
  updateUserData(newFirstName: string, newLastName: string, newEmail: string) {
    const userDocRef = doc(this.firestore, 'users', this.getCurrentUserId());
    const updates: any = {};

    if (newEmail !== '') {
      updates.email = newEmail;
    }
    if (newFirstName !== '') {
      updates.firstName = newFirstName;
      updates.lastName = newLastName;
    }

    updateDoc(userDocRef, updates).catch((error) => {
      console.error(error);
    });
  }

  /**
   * Log out the current user.
   */
  currentUserLogout() {
    const auth = getAuth();
    const userId = this.getCurrentUserId();

    if (userId) {
      const userDocRef = doc(this.firestore, `users/${userId}`);

      updateDoc(userDocRef, { status: false })
        .then(() => {
          signOut(auth)
            .then(() => {
              this.deleteUserIdInLocalStorage();
              this.route.navigate(['/login']);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('Keine UserID gefunden');
    }
  }

  /**
   * Deletes the user ID from local storage.
   */
  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUser');
  }

  /**
   * Clean up subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    this.unsubUser();
  }
}
