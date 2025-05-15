import { Component, inject, OnInit } from '@angular/core';
import { CreateTaskComponent } from "./create-task/create-task.component";
import { IAPIResponse, ProjectModel, TicketModel, UserModel } from '../../model/TaskApp';
import { MasterService } from '../../service/master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CreateTaskComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  isCreateTaskForm: boolean = false;

  isConfirmDelete: boolean = false;
  isDeleteTicketLoading: boolean = false;

  projectList: ProjectModel[] = [];
  ticketList: TicketModel[] = [];
  userList: UserModel[] = [];

  status: string[] = ["To Do", "In Progress", "Done"];

  selectedProjectData: ProjectModel | any;
  loggedUserData: any;

  selectedTicket!: TicketModel;
  yourWork!: ProjectModel;

  constructor() {
    try {
      const localData = localStorage.getItem('taskAppUser');
      if (localData != null) {
        this.loggedUserData = JSON.parse(localData);
      }
    } finally { }
  }

  ngOnInit() {
    this.getAllProjects();
    this.getTicketsByProjectId(0);

    this.masterService.onCreateTicket$.subscribe({
      next: (res: any) => {
        this.getTicketsByProjectId(this.selectedProjectData.projectId);
      }
    })

    this.masterService.onChangeProject$.subscribe({
      next: (res: any) => {
        this.getTicketAssignedByUserId(this.loggedUserData.userId);
      }
    })
  }

  getAllUsers() {
    this.masterService.getAllUsers().subscribe({
      next: (res: IAPIResponse) => {
        this.userList = res.data
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
      }
    })
  }

  getAllProjects() {
    this.masterService.getAllProjects().subscribe({
      next: (res: IAPIResponse) => {
        this.projectList = res.data;
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
      }
    })
  }

  setProject(obj: ProjectModel) {
    this.getTicketsByProjectId(obj.projectId);
    this.selectedProjectData = obj;
  }


  getTicketsByProjectId(id: number) {
    this.masterService.getTicketsByProjectId(id).subscribe({
      next: (res: IAPIResponse) => {
        this.ticketList = res.data;
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
      }
    });
  }

  getTicketAssignedByUserId(id: number): any {
    this.masterService.getTicketsAssignedByUserId(id).subscribe({
      next: (res: IAPIResponse) => {
        this.ticketList = res.data;
      },
      error: (res: IAPIResponse) => {
        this.toastr.error(res.message);
      }
    })
  }

  filterTicket(status: string) {
    return this.ticketList.filter(ticket => ticket.status == status)
  }

  onEdit(obj: any) {
    this.isCreateTaskForm = true;
    window.scrollTo(0, 0);
    this.selectedTicket = obj;
  }

  onDelete() {
    this.isConfirmDelete = true;
    window.scrollTo(0, 0);
  }

  deleteTicketById() {
    this.isDeleteTicketLoading = true;
    let i = 0,
      ticketId = 0;
    for (; i < this.ticketList.length; i++) {
      ticketId = this.ticketList[i].ticketId;
    }

    this.masterService.deleteTicketById(ticketId).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.isDeleteTicketLoading = false;
          this.isConfirmDelete = false;
          this.getTicketsByProjectId(this.selectedProjectData.projectId);
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isDeleteTicketLoading = false;
      }
    })
  }

  openCreateTaskForm() {
    this.isCreateTaskForm = true;
  }

  closeCreateTaskForm() {
    this.isCreateTaskForm = false;
  }

}
