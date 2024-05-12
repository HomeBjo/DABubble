import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/main-login/register/register.component';
import { ChooseAvatarComponent } from './components/main-login/choose-avatar/choose-avatar.component';
import { PasswordForgetComponent } from './components/main-login/password-forget/password-forget.component';
import { PasswordResetComponent } from './components/main-login/password-reset/password-reset.component';
import { LoginComponent } from './components/main-login/login/login.component';
import { ImprintComponent } from './shared/components/imprint/imprint.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'avatar', component: ChooseAvatarComponent },
  { path: 'passwordForget', component: PasswordForgetComponent },
  { path: 'passwordReset', component: PasswordResetComponent },
  { path: 'main', component: MainComponent },
  { path: 'main/:id', component: MainComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
];
