import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './shared/components/user/user.component';
import { EditUserDetailsComponent } from './shared/components/header/edit-user/edit-user-details/edit-user-details.component';
import { ToggleBooleanService } from './service/toggle-boolean.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent, EditUserDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'dabubble';

  constructor(public toggleAllBooleans:ToggleBooleanService){}
}
