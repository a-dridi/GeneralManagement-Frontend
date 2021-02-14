import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAt, faKey, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/api/message';
import { UserAuthentication } from 'src/app/util/user-authentication';
import { User } from '../user.model';
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
  loggedInUser: User;
  jwtAuthenticationHeaderValue: any;

  loginButtonText: string;

  constructor(private messageService: MessageService, private userService: UserService, public userAuthentication: UserAuthentication, private translateService: TranslateService, private router: Router) { }

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
    this.userService.doLogin(this.email, this.password).subscribe(resp => {
      console.log("IN DO LOG !!!!");
      if (resp.status !== 200) {
        this.showLoginFailedMessage();
      }

      this.jwtAuthenticationHeaderValue = resp.headers.get("Authorization");
      this.userService.getAuthenticatedUser(this.email, this.password).subscribe((authenticatedUserId: Number) => {
        this.userAuthentication.saveUserAuthentication(authenticatedUserId, this.jwtAuthenticationHeaderValue);
        this.router.navigate(['/']);
        console.log("Logged in.");
        window.location.assign(window.location.origin + "/");
      }, (err) => {
        this.showLoginFailedMessage();
        console.log(err);
      });
    }, err => {
      console.log("FAIL IN DO LOG !!!!");
      this.showLoginFailedMessage();

      console.log(err);
    });
  }

  showLoginFailedMessage() {
    this.translateService.get(['messages.loginLoginFailedError1']).subscribe(translations => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: translations['messages.loginLoginFailedError1'] });
    });
    console.log("LOGIN FAILED");
  }

}
