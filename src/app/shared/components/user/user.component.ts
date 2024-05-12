import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  isOnline = true;
  openProfil = false;

  /**
   * Toggles the display of the side menu for user profile.
   */
  showSideMenu() {
    this.openProfil = !this.openProfil;
  }
}
