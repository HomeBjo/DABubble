import { Injectable, Input, OnInit } from '@angular/core';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadFilesService {
  uploadFiles: File[] = [];
  downloadedFiles: BehaviorSubject<{ id: string; files: string[] }[]> =
    new BehaviorSubject<{ id: string; files: string[] }[]>([]);

  fileNames: any[] = [];

  constructor() {
    this.listAllFiles();
  }

  loadAllFiles(docID: string) {
    // lädt die fails in den firebase storage
    const storage = getStorage();
    for (const file of this.uploadFiles) {
      const storageRef = ref(storage, `chatFiles/${docID}/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        this.listAllFiles();
      });
    }
  }

  listAllFiles() {
    const storage = getStorage();
    const listRef2 = ref(storage, 'chatFiles');

    listAll(listRef2)
      .then(async (res) => {
        const downloadedFilesData: { id: string; files: string[] }[] = [];

        for (const folderRef of res.prefixes) {
          const folderID = folderRef.name;
          const folderFiles = [];

          const folderRes = await listAll(folderRef);

          for (const fileRef of folderRes.items) {
            const url = await getDownloadURL(fileRef);
            folderFiles.push(url);
          }

          downloadedFilesData.push({ id: folderID, files: folderFiles });
        }

        // Emit the updated value
        this.downloadedFiles.next(downloadedFilesData);
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen der Dateien:', error);
      });
  }
}
