import { Component, ElementRef, Renderer2 } from '@angular/core';
import { loginService } from '../../../service/login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/components/login/footer/footer.component';
import { CommonModule } from '@angular/common';
import { StartHeaderComponent } from '../../../shared/components/login/start-header/start-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    FooterComponent,
    RouterLink,
    StartHeaderComponent,
    TranslateModule,
  ],
})
export class LoginComponent {
  constructor(
    public loginService: loginService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Initializes the component and manages the removal of the 'startIntroScrollProtect' class from an element.
   * On the first load, this class is removed after a delay of 4.5 seconds to manage initial UI transitions.
   * On subsequent loads, the class is removed immediately, ensuring the UI remains consistent without delay.
   * This behavior is controlled by the `isFirstLoad` property of the loginService.
   */
  ngOnInit(): void {
    const element = this.elRef.nativeElement.querySelector(
      '.startIntroScrollProtect'
    );

    if (this.loginService.isFirstLoad) {
      setTimeout(() => {
        if (element) {
          this.renderer.removeClass(element, 'startIntroScrollProtect');
        }
      }, 4500);

      this.loginService.isFirstLoad = false;
    } else if (element) {
      this.renderer.removeClass(element, 'startIntroScrollProtect');
    }
  }

  /**
   * Handles form submission by triggering the login process through a login service.
   * This method would typically be called when a user submits a form associated with logging in.
   */
  onSubmit() {
    this.loginService.login();
  }
}
