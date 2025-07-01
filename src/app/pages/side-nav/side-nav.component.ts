import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, ProjectModel, UserModel } from '../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  router: Router = inject(Router);
  toastr: ToastrService = inject(ToastrService);

  @ViewChild('sidebar') sidebar: ElementRef | undefined;

  projectList: ProjectModel[] = [];
  yourWork!: ProjectModel;

  userData: any;
  isLoggedIn: any = false;

  ngOnInit() {
    // this.getAllProjects();

    try {
      const localData = localStorage.getItem('TaskUser');
      if (localData != null) {
        this.userData = JSON.parse(localData);
      }
    } finally {
    }

    this.masterService.onLogin$.subscribe({
      next: (res) => {
        this.isLoggedIn = this.masterService.isUserLogin();
      },
    });
  }

  getAllProjects() {}

  yourWorkMethod(obj: ProjectModel) {
    this.masterService.onChangeProject$.next(obj);
  }

  toggleSideBar() {
    this.sidebar?.nativeElement.classList.toggle('collapsed');
  }

  logOut() {
    this.masterService
      .userLogout()
      .then(() => {
        this.router.navigateByUrl('/login');
        this.userData = undefined;
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }
}
