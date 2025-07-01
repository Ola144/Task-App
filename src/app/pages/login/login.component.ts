import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, LoginModel, UserModel } from '../../model/TaskApp';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  masterService: MasterService = inject(MasterService);
  router: Router = inject(Router);
  toastr: ToastrService = inject(ToastrService);
  http: HttpClient = inject(HttpClient);

  @ViewChild('loginPassword') loginPassword: ElementRef | any;

  isLoginLoading: boolean = false;
  isShowIcon: boolean = false;

  userObj: UserModel = new UserModel();

  loginUser() {
    this.isLoginLoading = true;
    this.masterService
      .userLogin(this.userObj!)
      .then(() => {
        this.toastr.success('Login Successfully!');
        this.masterService.onLogin$.next(true);
        this.router.navigateByUrl('/dashboard');
        this.isLoginLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        console.log(err.message);
        this.isLoginLoading = false;
      });
  }

  showLoginPassword() {
    if (this.loginPassword?.nativeElement.type == 'password') {
      this.loginPassword.nativeElement.type = 'text';
      this.isShowIcon = true;
    } else {
      this.loginPassword.nativeElement.type = 'password';
      this.isShowIcon = false;
    }
  }
}
