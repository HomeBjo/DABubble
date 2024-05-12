import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';
import { OverlayService } from '../../../service/overlay.service';
import { CommonModule } from '@angular/common';
import { SmallBtnComponent } from '../small-btn/small-btn.component';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [CommonModule, SmallBtnComponent],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.scss',
})
export class OverlayComponent implements OnInit {
  overlayData: any;

  constructor(private overlayService: OverlayService) {}


  /**
   * Initializes the component and subscribes to overlay data changes.
   */
  ngOnInit(): void {
    this.overlayService.overlayData$.subscribe((data) => {
      this.overlayData = data;
    });
  }


  /**
   * Extracts the file type from the file name.
   * @param file The file name.
   * @returns The file type.
   */
  getFileType(file: string): string {
    const extension = file.split('.').pop()?.toLowerCase();
    const getTag = extension!.split('?')[0];
    return getTag || '';
  }


  /**
   * Closes the overlay.
   */
  onCloseOverlay() {
    this.overlayData = '';
  }


  /**
   * Checks if the contact edit overlay is open and closes it if the click is outside the overlay content.
   * @param event The mouse event.
   */
  @HostListener('document:click', ['$event'])
  checkOpenContactEdit(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.overlayContent') &&
      !targetElement.closest('.attachments')
    ) {
      this.onCloseOverlay();
    }
  }
}
