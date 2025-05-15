import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MasterService } from '../../../service/master.service';
import { IAPIResponse, ProjectModel, TicketModel, UserModel } from '../../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit, AfterViewInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  @Output() closeCreateTaskForm: EventEmitter<any> = new EventEmitter<any>();
  @Input() onEditTicket: any;

  userList: UserModel[] = [];
  projectList: ProjectModel[] = [];

  loggedData: any;

  status: string[] = ["To Do", "In Progress", "Done"];
  issueType: string[] = ["Ticket", "Defect", "RnD Work"];

  isCreateTicketLoading: boolean = false;
  isUpdateTicketLoading: boolean = false;

  taskForm: FormGroup = new FormGroup({})

  constructor() {
    try {
      const localData = localStorage.getItem('taskAppUser');
      if (localData != null) {
        const parseData = JSON.parse(localData);

        // this.ticketObj.createdBy = parseData.userId;
        this.taskForm.patchValue({ createdBy: parseData.userId });
        this.loggedData = parseData;
      }
    } catch (err) {
      console.error(err)
    }

    this.initializeForm();
  }

  ngOnInit() {
    this.getAllProjects();
    this.getAllUsers();

    this.taskForm.patchValue({ createdBy: this.loggedData.userId });
  }

  ngAfterViewInit(): void {
    if (this.onEditTicket) {
      // this.taskForm = this.onEditTicket;
      this.taskForm.patchValue({
        ticketId: this.onEditTicket.ticketId,
        summary: this.onEditTicket.summary,
        status: this.onEditTicket.status,
        description: this.onEditTicket.description,
        assignedTo: this.onEditTicket.assignedTo,
        projectId: this.onEditTicket.projectId,
        createdBy: this.loggedData.userId,
      });
      // this.ticketObj.createdBy = this.loggedData.userId;
    }
  }

  initializeForm() {
    this.taskForm = new FormGroup({
      ticketId: new FormControl(0),
      createdDate: new FormControl(new Date()),
      summary: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      parentId: new FormControl(0),
      storyPoint: new FormControl(0),
      ticketGuid: new FormControl(''),
      assignedTo: new FormControl(0, Validators.required),
      createdBy: new FormControl(0, Validators.required),
      projectId: new FormControl(0, Validators.required),
    })
  }

  getAllUsers() {
    this.masterService.getAllUsers().subscribe({
      next: (res: IAPIResponse) => {
        this.userList = res.data
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
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

  createTicket() {
    this.isCreateTicketLoading = true;
    const formValue = this.taskForm.value;
    this.masterService.createTicket(formValue).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.taskForm.patchValue({
            ticketId: new FormControl(0),
            createdDate: new FormControl(new Date()),
            summary: new FormControl(''),
            status: new FormControl(''),
            description: new FormControl(''),
            parentId: new FormControl(0),
            storyPoint: new FormControl(0),
            ticketGuid: new FormControl(''),
            assignedTo: new FormControl(0),
            projectId: new FormControl(0),
            createdBy: this.loggedData.userId,
          });
          this.closeCreateTaskForm.next(false);
          this.isCreateTicketLoading = false;
          this.masterService.onCreateTicket$.next(true);
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isCreateTicketLoading = false;
      }
    })
  }

  updateTicket() {
    this.isUpdateTicketLoading = true;
    const formValue = this.taskForm.value;
    this.masterService.updateTicket(formValue).subscribe({
      next: (res: IAPIResponse) => {
        if (res.result) {
          this.toastr.success(res.message);
          this.taskForm.patchValue({
            ticketId: new FormControl(0),
            createdDate: new FormControl(new Date()),
            summary: new FormControl(''),
            status: new FormControl(''),
            description: new FormControl(''),
            parentId: new FormControl(0),
            storyPoint: new FormControl(0),
            ticketGuid: new FormControl(''),
            assignedTo: new FormControl(0),
            projectId: new FormControl(0),
            createdBy: this.loggedData.userId,
          });
          this.isUpdateTicketLoading = false;
          this.closeCreateTaskForm.next(false);
          this.masterService.onCreateTicket$.next(true);
        }
      },
      error: (err: IAPIResponse) => {
        this.toastr.error(err.message);
        this.isUpdateTicketLoading = false;
      }
    })
  }


  closeCreateTaskFormBtn() {
    this.closeCreateTaskForm.next(false);
    this.closeCreateTaskForm.next(
      this.taskForm.patchValue({
        ticketId: new FormControl(0),
        createdDate: new FormControl(new Date()),
        summary: new FormControl(''),
        status: new FormControl(''),
        description: new FormControl(''),
        parentId: new FormControl(0),
        storyPoint: new FormControl(0),
        ticketGuid: new FormControl(''),
        assignedTo: new FormControl(0),
        projectId: new FormControl(0),
        createdBy: this.loggedData.userId,
      })
    )
  }
}
