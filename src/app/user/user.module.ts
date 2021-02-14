import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserService } from './user.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiConfig } from '../util/api.config';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModuleModule } from '../shared-module/shared-module.module';



@NgModule({
  declarations: [UserLoginComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
  ],
  exports: [TranslateModule],
  providers: [ApiConfig, TranslateService, UserService],
})
export class UserModule { }
