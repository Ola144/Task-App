import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, ProjectModel, UserModel } from '../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
} from '@angular/fire/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentData,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { collectionData, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  @ViewChild('userPassword') userPassword: ElementRef | undefined | any;

  isCreateNewUserForm: boolean = false;
  isCreateNewUserLoading: boolean = false;
  isUpdateNewUserLoading: boolean = false;

  isShowIcon: boolean = false;

  isConfirmDelete: boolean = false;
  isDeleteUserLoading: boolean = false;

  // userList = signal<UserModel[]>([]);
  userList: any = [];
  userId: any;
  filteredUser: UserModel[] = [];

  projectList: ProjectModel[] = [];

  userObj: UserModel = new UserModel();

  projectObj: ProjectModel = new ProjectModel();

  constructor() {
    this.auth = getAuth();
  }

  ngOnInit() {
    this.getAllUsers();
  }

  async getAllUsers(): Promise<void> {
    try {
      this.userList = await this.masterService.getAllUsers();
      this.filterUser('all');
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  addNewUser() {
    this.isCreateNewUserLoading = true;
    this.masterService
      .createNewUser(this.userObj)
      .then(() => {
        this.toastr.success('User Created Successfully!');
        this.isCreateNewUserLoading = false;
        this.isCreateNewUserForm = false;
        this.getAllUsers();
      })
      .catch((err) => {
        this.toastr.error(err.message);
        console.log(err.message);
        this.isCreateNewUserLoading = false;
      });
  }

  onDelete(userData: UserModel) {
    this.isConfirmDelete = true;
    window.scrollTo(0, 0);
    this.userId = userData.uid;
    console.log(userData.uid);
  }

  deleteUserById() {
    this.isDeleteUserLoading = true;
    // let i = 0,
    //   userId = 0;
    // for (; i < this.userList.length; i++){
    //   userId = this.userList[i].userId;
    // }

    this.masterService
      .deleteUser(this.userId)
      .then(() => {
        this.getAllUsers();
        this.toastr.success('User Updated Successfully!');
        this.userObj = new UserModel();
        this.isConfirmDelete = false;
        this.isDeleteUserLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isDeleteUserLoading = false;
      });
  }

  onEdit(userData: UserModel) {
    this.userObj = userData;
    this.isCreateNewUserForm = true;
    this.userId = userData.uid;
    window.scrollTo(0, 0);
  }

  async updateUser() {
    this.isUpdateNewUserLoading = true;
    await this.masterService
      .updateUser(this.userObj, this.userId)
      .then(() => {
        this.getAllUsers();
        this.toastr.success('User Updated Successfully!');
        this.userObj = new UserModel();
        this.isCreateNewUserForm = false;
        this.isUpdateNewUserLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isUpdateNewUserLoading = false;
      });
  }

  getAllProjects() {}

  openCreateNewUserForm() {
    this.isCreateNewUserForm = true;
  }

  closeCreateNewUserForm() {
    this.isCreateNewUserForm = false;
    this.userObj = new UserModel();
  }

  showLoginPassword() {
    if (this.userPassword?.nativeElement.type == 'password') {
      this.userPassword.nativeElement.type = 'text';
      this.isShowIcon = true;
    } else {
      this.userPassword.nativeElement.type = 'password';
      this.isShowIcon = false;
    }
  }

  filterUser(value: string) {
    // const formValue = (event.target as HTMLInputElement).value;

    if (!value || value == 'all') {
      this.filteredUser = this.userList;
    } else {
      this.filteredUser = this.userList.filter((user: any) =>
        user.fullName.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
}
