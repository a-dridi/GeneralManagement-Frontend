import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


/**
 * Display error and success message popup on page. 
 */
@Injectable({
    providedIn: 'root'
})
export class MessageCreator {
    constructor(private messageService: MessageService, private translateService: TranslateService) {

    }

    /**
     * Show success message that contains the passed translation string text according to the activated language
     * @param messageId The key (id) of the translation string of the translation category "messages". (i18n) 
     */
    public showSuccessMessage(messageId) {
        this.translateService.get(['messages.' + messageId]).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: 'OK', detail: (translations['messages.' + messageId]) });
        });
    }

    /**
    * Show error message that contains the passed translation string text according to the activated language
    * @param messageId The key (id) of the translation string of the translation category "messages". (i18n) 
    */
    public showErrorMessage(messageId) {
        this.translateService.get(['messages.' + messageId, 'messages.errorMessageTitle']).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: translations['messages.errorMessageTitle'], detail: (translations['messages.' + messageId]) });
        });
    }

    /**
* Show an error message that is not hidden automatically after few seconds, which contains the passed translation string text according to the activated language
* @param messageId The key (id) of the translation string of the translation category "messages". (i18n) 
*/
    public showUnEscapedErrorMessage(messageId) {
        this.translateService.get(['messages.' + messageId, 'messages.errorMessageTitle']).subscribe(translations => {
            this.messageService.add({ severity: 'error', closable: false, summary: translations['messages.errorMessageTitle'], detail: (translations['messages.' + messageId]) });
        });
    }

}