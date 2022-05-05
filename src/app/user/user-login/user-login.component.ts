import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAt, faKey, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { MessageCreator } from 'src/app/util/messageCreator';
import { RefererCache } from 'src/app/util/refererCache';
import { UserAuthentication } from 'src/app/util/user-authentication';
import { User } from '../model/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  faAt = faAt;
  faKey = faKey;
  faSignInAlt = faSignInAlt;

  email: String;
  password: String;
  jwtAuthenticationHeaderValue: any;

  loginButtonText: string;

  isLoading: boolean = false;

  constructor(private messageService: MessageService, private messageCreator: MessageCreator, private userService: UserService, public userAuthentication: UserAuthentication, private translateService: TranslateService, private router: Router, private refererCache: RefererCache) { }

  ngOnInit(): void {
    let passWordInput = document.getElementById("loginPassword");
    passWordInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("loginSubmit").click();
      }
    });
    this.loadUiText();
  }

  loadUiText() {
    this.translateService.get(['userLogin.loginButton']).subscribe(translations => {
      this.loginButtonText = translations['userLogin.loginButton'];
    });
  }

  /**
   * Get User object for passed username and password. Save User Id from User object. Get response header to save the JWT authentication token.
   */
  doLogin() {
    this.isLoading = true;
    this.userService.doLogin(this.email, this.password).subscribe(resp => {
      if (resp.status !== 200) {
        this.showLoginFailedMessage();
      }
      this.jwtAuthenticationHeaderValue = resp.headers.get("Authorization");
      this.userService.getAuthenticatedUser(this.email, this.password).subscribe((authenticatedUserId: Number) => {
        this.userAuthentication.saveUserAuthentication(authenticatedUserId, this.jwtAuthenticationHeaderValue);
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
          return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        this.refererCache.redirectToSavedUri();
      }, err => {
        this.showLoginFailedMessage();
        console.log(err);
      });
    }, err => {
      this.showLoginFailedMessage();

      console.log(err);
    });
  }

  showLoginFailedMessage() {

    this.messageCreator.showUnEscapedErrorMessage('loginLoginFailedError1');
    console.log("LOGIN FAILED");
    this.isLoading = false;
  }

}
