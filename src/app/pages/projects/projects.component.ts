import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, IProject, ProjectModel } from '../../model/TaskApp';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  isProjectForm: boolean = false;
  isAddProjectLoading: boolean = false;
  isUpdateProjectLoading: boolean = false;
  isConfirmDelete: boolean = false;
  isDeleteProjectLoading: boolean = false;

  projectList: IProject[] = [];
  projectObj: ProjectModel = new ProjectModel();
  projectId: undefined | any;
  loggedInUser: any;

  ngOnInit(): void {
    this.getAllProjects();

    try {
      const localData = localStorage.getItem('TaskUser');
      if (localData !== null) {
        this.loggedInUser = JSON.parse(localData);
      }
    } finally {
    }
  }

  async getAllProjects() {
    try {
      this.projectList = await this.masterService.getAllProjects();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async createNewProject() {
    this.isAddProjectLoading = true;
    const project = {
      ...this.projectObj,
    };
    await this.masterService
      .createNewProject(project)
      .then(() => {
        this.toastr.success('Project Created Successfully!');
        this.getAllProjects();
        this.closeProjectForm();
        this.projectId = undefined;
        this.isAddProjectLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isAddProjectLoading = false;
      });
  }

  onDelete(projectData: IProject) {
    this.isConfirmDelete = true;
    this.projectId = projectData.projectId;
    window.scrollTo(0, 0);
    console.log(projectData.projectId);
  }

  async deleteProjectById() {
    this.isDeleteProjectLoading = true;
    await this.masterService
      .deleteProjectById(this.projectId)
      .then(() => {
        this.toastr.success('Project Deleted Successfully!');
        this.isConfirmDelete = false;
        this.isDeleteProjectLoading = false;
        this.getAllProjects();
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isDeleteProjectLoading = false;
      });
    // let i = 0,
    //   projectId = 0;
    // for (; i < this.projectList.length; i++) {
    //   projectId = this.projectList[i].projectId;
    // }
  }

  onEdit(projectData: IProject) {
    this.isProjectForm = true;
    this.projectId = projectData.projectId;
    this.projectObj = projectData;
    console.log(projectData.projectId);
    window.scrollTo(0, 0);
  }

  async updateProject() {
    this.isUpdateProjectLoading = true;

    // let i = 0,
    //   projectId = 0;
    // for (; i < this.projectList.length; i++) {
    //   projectId = this.projectList[i].projectId;
    // }

    const project = {
      ...this.projectObj,
    };

    await this.masterService
      .updateExistingProject(project, this.projectId)
      .then(() => {
        this.toastr.success('Project Updated Successfully!');
        this.getAllProjects();
        this.closeProjectForm();
        this.projectId = undefined;
        this.isUpdateProjectLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        console.log(err.message);
        this.isUpdateProjectLoading = false;
      });
  }

  closeProjectForm() {
    this.isProjectForm = false;
    this.projectObj = new ProjectModel();
    this.projectId = undefined;
  }
}
