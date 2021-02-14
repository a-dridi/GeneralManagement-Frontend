import { Injectable } from '@angular/core';

/**
 * Language Item interface
 */
export interface Language {
    code: string;
    languageName: string;
    countryCode: string;
}


/**
 * All available languages in this app. 
 */
@Injectable({
    providedIn: 'root'
})
export class AppLanguages {

    public get languages(): Language[] {
        let languagesArray: Language[] = [
            { code: "en", languageName: "English", countryCode: "us" }
        ];
        return languagesArray;
    }

    public get languagesIsoCode(): string[] {
        let languageIsoCodeArray: string[] = [];
        this.languages.forEach((languageArrayItem) => {
            languageIsoCodeArray.push(languageArrayItem.code);
        });
        return languageIsoCodeArray;
    }

    public get languagesName(): string[] {
        let languageNameArray: string[] = [];
        this.languages.forEach((languageArrayItem) => {
            languageNameArray.push(languageArrayItem.languageName);
        });
        return languageNameArray;
    }
}

/**
 * Helper functions to load or save the language selection. 
 */
@Injectable({
    providedIn: 'root'
})
export class AppLanguageLoaderHelper {
    readonly SESSION_OBJECT_ID_LANGUAGE_SELECTION: string = "appC75SelectedLanguage";
    readonly DEFAULT_LANGUAGE_CODE: string = "en";
    readonly DEFAULT_LANGUAGE_NAME: string = "English";

    constructor(public appLanguages: AppLanguages) {

    }

    /**
     * Loads the selected language (saved in session object). If this is not available, then the available language of the user. English is the default fallback language.
     */
    get userLanguageCode(): string {
        let userSelectedLanguage = sessionStorage.getItem(this.SESSION_OBJECT_ID_LANGUAGE_SELECTION);
        if (userSelectedLanguage !== null) {
            //Load and return selected language
            return userSelectedLanguage;
        } else {
            //Load user language or default if not available. 
            let userLanguage = (navigator.language).split("-")[0];
            if (userLanguage !== undefined || userLanguage !== "") {
                return this.getLanguageCodeFromLanguagesList(userLanguage);
            } else {
                return this.DEFAULT_LANGUAGE_CODE;
            }
        }

    }

    /**
     * Save the passed language code in the session, if the language code is available in this app. If that is not the case, then the language code "en".
     */
    set userLanguageCode(selectedLanguageCode) {
        sessionStorage.removeItem(this.SESSION_OBJECT_ID_LANGUAGE_SELECTION);
        sessionStorage.setItem(this.SESSION_OBJECT_ID_LANGUAGE_SELECTION, this.getLanguageCodeFromLanguagesList(selectedLanguageCode));
    }

    /**
     * Returns the language code if the language is available. If not, then language code "en";
     * @param languageCode 
     */
    public getLanguageCodeFromLanguagesList(languageCode): string {
        let loadedLanguageCode = this.DEFAULT_LANGUAGE_CODE;
        this.appLanguages.languages.forEach(((languageArrayItem) => {
            if (languageArrayItem.code == languageCode) {
                loadedLanguageCode = languageArrayItem.code;
            }
        }));
        return loadedLanguageCode;
    }

    public getLanguageNameFromLanguageList(languageCode) {
        let loadedLanguageName = this.DEFAULT_LANGUAGE_NAME;
        this.appLanguages.languages.forEach(((languageArrayItem) => {
            if (languageArrayItem.code == languageCode) {
                loadedLanguageName = languageArrayItem.languageName;
            }
        }));
        return loadedLanguageName;
    }

    public getLanguageCodeByLanguageName(languageName) {
        let languageCode = this.DEFAULT_LANGUAGE_CODE;
        this.appLanguages.languages.forEach(((languageArrayItem) => {
            if (languageArrayItem.languageName == languageName) {
                languageCode = languageArrayItem.code;
            }
        }));
        return languageCode;
    }

}