import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToggleBooleanService } from '../../../service/toggle-boolean.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  inputValue: string = '';

  constructor(private toggleBoolean: ToggleBooleanService) {}


  /**
   * Closes the search window.
   * @param event The event object.
   */
  closeSearchWindow(event: Event) {
    this.toggleBoolean.openSearchWindow = false;
    event.stopPropagation();
    this.inputValue = '';
  }

  /**
   * Opens the search bar.
   * @param event The event object.
   */
  openSearchbar(event: Event){
    this.toggleBoolean.openSearchWindow = true;
    event.stopPropagation();
  }
  
}
