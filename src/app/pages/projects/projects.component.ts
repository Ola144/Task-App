import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, ProjectModel } from '../../model/TaskApp';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  isProjectForm: boolean = false;
  isAddProjectLoading: boolean = false;
  isUpdateProjectLoading: boolean = false;
  isConfirmDelete: boolean = false;
  isDeleteProjectLoading: boolean = false;

  projectList: ProjectModel[] = [];
  projectObj: ProjectModel = new ProjectModel();

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.masterService.getAllProjects().subscribe({
      next: (res: IAPIResponse)=>{
        this.projectList = res.data;
      }
    })
  }

  createNewProject() {
    this.isAddProjectLoading = true;
    this.masterService.createNewProject(this.projectObj).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.getAllProjects();
          this.isProjectForm = false;
          this.isAddProjectLoading = false;
          this.projectObj = new ProjectModel();
        }
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
        this.isAddProjectLoading = false;
      }
    })
  }

  onDelete() {
    this.isConfirmDelete = true;
    window.scrollTo(0, 0);
  }

  deleteProjectById() {
    this.isDeleteProjectLoading = true;

    let i = 0,
      projectId = 0;
    
    for (; i < this.projectList.length; i++){
      projectId = this.projectList[i].projectId;
    }

    this.masterService.deleteProjectById(projectId).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.getAllProjects();
          this.isDeleteProjectLoading = false;
          this.isConfirmDelete = false;
        }
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
        this.isDeleteProjectLoading = false;
      }
    })
  }

  onEdit(projectData: ProjectModel) {
    this.isProjectForm = true;
    this.projectObj = projectData;
    window.scrollTo(0, 0);
  }

  updateProject() {
    this.isUpdateProjectLoading = true;
    this.masterService.createNewProject(this.projectObj).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.getAllProjects();
          this.isProjectForm = false;
          this.isUpdateProjectLoading = false;
          this.projectObj = new ProjectModel();
        }
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
        this.isUpdateProjectLoading = false;
      }
    })
  }

  closeProjectForm() {
    this.isProjectForm = false;
    this.projectObj = new ProjectModel();
  }
}
