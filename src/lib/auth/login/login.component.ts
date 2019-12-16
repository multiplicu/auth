import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  Input,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthUser } from '../../services/auth.service';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'xcu-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  @Input() public urlEndpoint: string;
  @Input() public title: string = 'Sign in to Multipli Credit Union';
  @Output() public loginSuccess: EventEmitter<AuthUser> = new EventEmitter();
  @Output() public loginError: EventEmitter<
    HttpErrorResponse
  > = new EventEmitter();

  public loginForm: FormGroup;

  private subs_: Subscription[] = [];

  public constructor(
    public authService: AuthService,
    private fb_: FormBuilder
  ) {
    this.loginForm = this.fb_.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public ngOnDestroy(): void {
    this.subs_.map((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  public onSubmit(): void {
    this.subs_.push(
      this.authService
        .login(
          this.loginForm.get('username').value,
          this.loginForm.get('password').value,
          this.urlEndpoint
        )
        .subscribe(
          (user: AuthUser) => this.loginSuccess.next(user ? user : null),
          (error: HttpErrorResponse) => this.loginError.next(error)
        )
    );
  }
}
