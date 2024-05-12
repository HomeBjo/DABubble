import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../../shared/components/login/footer/footer.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StartHeaderComponent } from '../../../shared/components/login/start-header/start-header.component';
import { SmallBtnComponent } from '../../../shared/components/small-btn/small-btn.component';
import { Router, ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { confirmPasswordReset } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    StartHeaderComponent,
    FooterComponent,
    RouterModule,
    SmallBtnComponent,
    TranslateModule
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  password: string = '';
  passwordRepeat: string = '';
  oobCode: string = '';
  private queryParamsSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}


/**
 * Initializes the component by subscribing to query parameters.
 */
  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.oobCode = params['oobCode'];
      }
    );
  }


/**
 * Handles the submission of the password reset form.
 * @param ngForm The form data of the password reset form.
 */
  onSubmit(ngForm: NgForm): void {
    this.resetPassword(ngForm);
  }


/**
 * Performs the password reset operation using Firebase Authentication.
 * @param ngForm The form data of the password reset form.
 */
  resetPassword(ngForm: NgForm): void {
    const auth = getAuth();
    const newPassword = this.passwordRepeat;
    confirmPasswordReset(auth, this.oobCode, newPassword)
      .then(() => {
        ngForm.resetForm();
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Fehler beim Zurücksetzen des Passworts:', error);
      });
  }


  /**
 * Cleans up the component by unsubscribing from the query parameters subscription.
 */
  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }


  /**
 * Checks if the entered passwords match.
 * @returns true if the password and repeated password are the same.
 */
  passwordsMatch(): boolean {
    return this.password === this.passwordRepeat;
  }
}
