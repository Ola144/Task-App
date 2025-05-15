import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, UserModel } from '../../model/TaskApp';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  masterService: MasterService = inject(MasterService);
  router: Router = inject(Router);
  toastr: ToastrService = inject(ToastrService);
  http: HttpClient = inject(HttpClient);

  @ViewChild('loginPassword') loginPassword: ElementRef | any;

  isLoginLoading: boolean = false;
  isShowIcon: boolean = false;

  userObj: any = {
      userId: 0,
      emailId: "",
      fullName: "",
      password: ""
  }

  loginUser() {
    this.isLoginLoading = true;
    this.masterService.userLogin(this.userObj).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.isLoginLoading = false;
          try{
            localStorage.setItem("taskAppUser", JSON.stringify(res.data));
          } finally { }
          this.router.navigateByUrl('/dashboard');
          this.toastr.success(res.message);
          this.masterService.onLogin$.next(true);
        }
      },
      error: (err: any)=>{
          this.toastr.error(err.message);
          this.isLoginLoading = false;
      }
    })
  }

  showLoginPassword() {
    if (this.loginPassword?.nativeElement.type == "password") {
      this.loginPassword.nativeElement.type = "text";
      this.isShowIcon = true;
    } else {
      this.loginPassword.nativeElement.type = "password";
      this.isShowIcon = false;
    }
  }

}
