import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../../shared/components/login/footer/footer.component';
import { RouterModule } from '@angular/router';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { loginService } from '../../../service/login.service';
import { StartHeaderComponent } from '../../../shared/components/login/start-header/start-header.component';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss',
  imports: [
    StartHeaderComponent,
    FooterComponent,
    RouterModule,
    SmallBtnComponent,
    CommonModule,
    TranslateModule
  ],
})
export class ChooseAvatarComponent {
  avatarSrc: string = './assets/img/user-icons/guest.svg';
  firestore: Firestore = inject(Firestore);
  selectedFile: File | null = null;
  avatarImages: string[] = [
    './assets/img/user-icons/female-1.svg',
    './assets/img/user-icons/female-2.svg',
    './assets/img/user-icons/male-1.svg',
    './assets/img/user-icons/male-2.svg',
    './assets/img/user-icons/male-3.svg',
    './assets/img/user-icons/male-4.svg',
  ];

  constructor(public loginService: loginService) {}

  
  /**
   * Handles file selection changes and initiates the upload of the avatar.
   * @param event The DOM event containing the file selection.
   */
  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];

      if (!file.type.startsWith('image/')) {
        console.error('Datei ist kein Bild.');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarSrc = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadFile(file);
    }
  }


  /**
   * Uploads the selected file to Firebase Storage.
   * @param file The file to be uploaded.
   */
  uploadFile(file: File) {
    const storage = getStorage();
    const storageRef = ref(storage, 'avatars/' + file.name);
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log('Datei hochgeladen!', snapshot);
        getDownloadURL(ref(storage, 'avatars/' + file.name))
          .then((url) => {
            this.avatarSrc = url;
            console.log('bild url hier', url);
            this.loginService.getAvatarUrl(url);
          })
          .catch((error) =>
            console.error('Fehler beim Abrufen der Download-URL:', error)
          );
      })
      .catch((error) => {
        console.error('Fehler beim Hochladen:', error);
      });
  }


  /**
   * Selects an avatar from the list of predefined avatars.
   * @param index Index of the chosen avatar in the avatarImages list.
   */
  chooseExistAvatar(index: number) {
    this.avatarSrc = this.avatarImages[index];
    this.loginService.getAvatarUrl(this.avatarSrc);
  }
}
