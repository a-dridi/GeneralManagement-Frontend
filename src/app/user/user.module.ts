import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserService } from './user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiConfig } from '../util/api.config';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [UserLoginComponent],
  imports: [
    CommonModule,
    SharedModuleModule,
    ProgressSpinnerModule
  ],
  exports: [TranslateModule],
  providers: [ApiConfig, TranslateService, UserService],
})
export class UserModule { }
