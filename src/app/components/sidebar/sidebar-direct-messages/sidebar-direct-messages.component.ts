import { Component, HostListener, Input } from '@angular/core';
import { SidebarDirectMessagesUserComponent } from '../sidebar-direct-messages-user/sidebar-direct-messages-user.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { ShowAllUsersComponent } from '../show-all-users/show-all-users.component';

@Component({
  selector: 'app-sidebar-direct-messages',
  standalone: true,
  imports: [
    SidebarDirectMessagesUserComponent,
    CommonModule,
    TranslateModule,
    SmallBtnComponent,
    ShowAllUsersComponent,
  ],
  templateUrl: './sidebar-direct-messages.component.html',
  styleUrl: './sidebar-direct-messages.component.scss',
})
export class SidebarDirectMessagesComponent {
  @Input() currentChannel: string = '';
  @Input() viewWidth: number = 0;

  minimizeUsers: boolean = false;
  showAllUsers: boolean = false;

  /**
   * Toggles the visibility of direct message users.
   */
  minimizeAllUsers() {
    this.minimizeUsers = !this.minimizeUsers;
  }

  /**
   * Toggles the state of the member list emitter.
   * @param {boolean} variable - The boolean variable determining the state of the member list emitter.
   */
  toggleMemberListEmitter(variable: boolean) {
    this.showAllUsers = variable;
  }

  /**
   * Toggles the visibility of the all users window.
   */
  toggleAllUsersWindow() {
    this.showAllUsers = !this.showAllUsers;
  }

  /**
   * Checks if the click event happens outside of the all users window, and closes it if necessary.
   * @param {MouseEvent} event - The mouse event object.
   */
  @HostListener('document:click', ['$event'])
  checkOpenAllUsersWindow(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.whiteBoxAllUsersWindow') &&
      !targetElement.closest('.btnAllUsersWindow')
    ) {
      this.showAllUsers = false;
    }
  }
}
