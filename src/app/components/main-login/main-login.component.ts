import { Component } from '@angular/core';
import { RegisterComponent } from "./register/register.component";
import { ChooseAvatarComponent } from "./choose-avatar/choose-avatar.component";
import { LoginComponent } from "./login/login.component";
import { PasswordForgetComponent } from "./password-forget/password-forget.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { loginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-main-login',
    standalone: true,
    templateUrl: './main-login.component.html',
    styleUrl: './main-login.component.scss',
    imports: [CommonModule,RegisterComponent, ChooseAvatarComponent, LoginComponent, PasswordForgetComponent, PasswordResetComponent,RouterLink]
})
export class MainLoginComponent {
  
}
