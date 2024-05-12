import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../../shared/components/login/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StartHeaderComponent } from '../../../shared/components/login/start-header/start-header.component';
import { TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-password-forget',
  standalone: true,
  templateUrl: './password-forget.component.html',
  styleUrl: './password-forget.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    FooterComponent,
    RouterModule,
    SmallBtnComponent,
    StartHeaderComponent,
    TranslateModule
  ],
})

export class PasswordForgetComponent {
  email: string = '';
  emailSentBtn = false;
  firestore: Firestore = inject(Firestore);
  constructor(private router: Router) {}


   /**
   * Initiates a password reset process for the user.
   * Sends a password reset email to the user's registered email address.
   * 
   * @param ngForm The form data from the Angular form, used to manage form state.
   */
  passwordReset(ngForm: NgForm) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.email)
      .then(() => {
        ngForm.resetForm(ngForm);
         this.router.navigate(['/login']);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


 /**
   * Handles the form submission, invoking the password reset function and then sending a notification email.
   * 
   * @param ngForm The form instance containing user input.
   */
  onSubmit(ngForm: NgForm) {
    this.passwordReset(ngForm);
    this.sendEmail();
  }

  
  /**
   * Simulates sending an email by toggling a button state to show feedback to the user.
   * After a set timeout, resets the button state.
   */
  sendEmail() {
    this.emailSentBtn = true;
    setTimeout(() => {
      this.emailSentBtn = false;
    }, 6000);
  }
}
