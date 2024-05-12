import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLang);
  }


  /**
 * Switches the application's current language.
 * 
 * This method sets the current language based on the specified `lang` parameter and updates the translation service to use the new language. This is useful for enabling runtime language switching in a multi-lingual application.
 * 
 * @param lang The language code to switch to. Supported values are 'en' for English and 'de' for German.
 */
  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'de' : 'en';
    this.translate.use(this.currentLang);
  }
}
