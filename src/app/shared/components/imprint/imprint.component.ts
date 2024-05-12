import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from "../login/header/header.component";
import { SmallBtnComponent } from "../small-btn/small-btn.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-imprint',
    standalone: true,
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss',
    imports: [TranslateModule, HeaderComponent, SmallBtnComponent,RouterLink]
})
export class ImprintComponent {
  constructor(private location: Location) {}


  /**
  * Navigates back to the previous location.
  */
  backClicked() {
    this.location.back();
  }
}
