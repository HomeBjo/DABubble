import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';
import { UserService } from '../../../../service/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { SmallBtnComponent } from '../../small-btn/small-btn.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    EditUserDetailsComponent,
    TranslateModule,
    SmallBtnComponent,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
})
export class EditUserComponent {
  isOnline = true;
  openProfil = false;
  openEditUserValue = false;
  @Input() showCurrentProfile!: boolean;

  @Output() testValueChange = new EventEmitter<boolean>();

  constructor(public userService: UserService) {}

  /** Toggles the side menu. */
  showSideMenu() {
    this.openEditUserValue = !this.openEditUserValue;
  }

  /** Opens the edit user section. */
  openEditUser() {
    this.openEditUserValue = true;
  }

  /** Closes the current profile. */
  closeCurrentProfile() {
    this.showCurrentProfile = false;
    this.testValueChange.emit(this.showCurrentProfile);
    this.openEditUserValue = false;
  }

  /**
   * Updates the close value.
   * @param value The value to update.
   */
  updateCloseValue(value: boolean) {
    this.showCurrentProfile = value;
    this.openEditUserValue = value;
  }
}
