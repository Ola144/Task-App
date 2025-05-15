import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, ProjectModel, UserModel } from '../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { STATUS_CODES } from 'http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  @ViewChild('userPassword') userPassword: ElementRef | undefined | any;

  isCreateNewUserForm: boolean = false;
  isCreateNewUserLoading: boolean = false;
  isUpdateNewUserLoading: boolean = false;

  isShowIcon: boolean = false;

  isConfirmDelete: boolean = false;
  isDeleteUserLoading: boolean = false;

  // userList = signal<UserModel[]>([]);
  userList: UserModel[] = [];
  filteredUser: UserModel[] = [];

  projectList: ProjectModel[] = [];

  userObj: UserModel = new UserModel();
  projectObj: ProjectModel = new ProjectModel();

  ngOnInit(): void {
    this.getAllUsers();

    this.getAllProjects();
  }

  getAllUsers() {
    this.masterService.getAllUsers().subscribe({
      next: (res: IAPIResponse) => {
        this.userList = res.data;
        this.filterUser('all');
      },
      error: (err: IAPIResponse) => {
          this.toastr.error(err.message);
        }
    })
  }

  addNewUser() {
    this.isCreateNewUserLoading = true;
    this.masterService.createNewUser(this.userObj).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.getAllUsers();
          this.isCreateNewUserLoading = false;
          this.isCreateNewUserForm = false;
          this.userObj = new UserModel();
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isCreateNewUserLoading = false;
      }
    })
  }

  onDelete() {
    this.isConfirmDelete = true;
    window.scrollTo(0, 0);
  }

  deleteUserById() {
    this.isDeleteUserLoading = true;
    let i = 0,
      userId = 0;
    
    for (; i < this.userList.length; i++){
      userId = this.userList[i].userId;
    }

    this.masterService.deleteExistingUserById(userId).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.isConfirmDelete = false;
          this.isDeleteUserLoading = false;
          this.getAllUsers();
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isDeleteUserLoading = false;
      }
    })
  }

  onEdit(userData: UserModel) {
    this.userObj = userData;
    this.isCreateNewUserForm = true;
    window.scrollTo(0, 0);
  }

  updateUser() {
    this.isUpdateNewUserLoading = true;
    this.masterService.updateExistingUser(this.userObj).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.getAllUsers();
          this.isUpdateNewUserLoading = false;
          this.isCreateNewUserForm = false;
          this.userObj = new UserModel();
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isUpdateNewUserLoading = false;
      }
    })
  }

  getAllProjects() {
    this.masterService.getAllProjects().subscribe({
      next: (res: IAPIResponse) => {
        this.projectList = res.data;
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
      }
    });
  }

  openCreateNewUserForm() {
    this.isCreateNewUserForm = true;
  }

  closeCreateNewUserForm() {
    this.isCreateNewUserForm = false;
    this.userObj = new UserModel();
  }

  showLoginPassword() {
    if (this.userPassword?.nativeElement.type == "password") {
      this.userPassword.nativeElement.type = "text";
      this.isShowIcon = true;
    } else {
      this.userPassword.nativeElement.type = "password";
      this.isShowIcon = false;
    }
  }

  filterUser(value: string) {
    // const formValue = (event.target as HTMLInputElement).value;

    if(!value || (value == "all")){
      this.filteredUser = this.userList;
    } else {
      this.filteredUser = this.userList.filter(user => user.fullName.toLowerCase().includes(value.toLowerCase()));
    }
  }
}
