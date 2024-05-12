import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { FooterComponent } from '../../../shared/components/login/footer/footer.component';
import { loginService } from '../../../service/login.service';
import { StartHeaderComponent } from '../../../shared/components/login/start-header/start-header.component';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    SmallBtnComponent,
    FooterComponent,
    RouterLink,
    StartHeaderComponent,
    TranslateModule
  ],
})
export class RegisterComponent {
  firestore: Firestore = inject(Firestore);
  isChecked: boolean = false;
  currentImage: string;
  defaultImage = './assets/img/login/box.png';
  clickedImage = './assets/img/login/box-checked.png';
  hoverImage = './assets/img/login/box-hover.png';
  clickedHoverImage = './assets/img/login/box-checked-hover.png';

  constructor(public loginService: loginService, private router: Router) {
    this.currentImage = this.defaultImage;
  }


  /**
 * Handles the form submission, extracting first and last names from a full name and navigating to the avatar page.
 * @param ngForm The Angular form object representing the form submission.
 */
  onSubmit(ngForm: NgForm) {
    const names = this.loginService.name.split(' ');
    this.loginService.firstName = names[0];
    this.loginService.lastName = names.slice(1).join(' ');
    this.router.navigate(['/avatar']);
  }


  /**
 * Toggles a checkbox state and updates the corresponding image based on the new state.
 */
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
    this.updateImage();
  }


  /**
 * Updates the current image to a hover state image when the mouse is over the related component.
 */
  onMouseOver() {
    this.updateImage(true);
  }


  /**
 * Reverts the current image to its default state when the mouse is out of the related component.
 */
  onMouseOut() {
    this.updateImage();
  }


  /**
 * Updates the image displayed based on the checkbox state and hover state.
 * @param isHovering Boolean indicating if the mouse is hovering over the image component (default is false).
 */
  updateImage(isHovering: boolean = false) {
    if (this.isChecked) {
      this.currentImage = isHovering
        ? this.clickedHoverImage
        : this.clickedImage;
    } else {
      this.currentImage = isHovering ? this.hoverImage : this.defaultImage;
    }
  }

  /**
   * Clear the values, if user click on the arrow back button.
   */
  resetValues(){
    this.loginService.name = '';
    this.loginService.email = '';
    this.loginService.password = '';
  }
}
