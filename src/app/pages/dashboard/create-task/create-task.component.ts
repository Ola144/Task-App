import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MasterService } from '../../../service/master.service';
import {
  IAPIResponse,
  IProject,
  ProjectModel,
  TicketModel,
  UserModel,
} from '../../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent implements OnInit, AfterViewInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  @Output() closeCreateTaskForm: EventEmitter<any> = new EventEmitter<any>();
  @Input() onEditTicket: any;
  @Input() ticketId: any;

  userList: UserModel[] = [];
  projectList: IProject[] = [];

  loggedDataId: any;
  loggedInUser: any;

  status: string[] = ['To Do', 'In Progress', 'Done'];
  issueType: string[] = ['Ticket', 'Defect', 'RnD Work'];

  isCreateTicketLoading: boolean = false;
  isUpdateTicketLoading: boolean = false;

  taskForm: FormGroup = new FormGroup({});

  constructor() {
    try {
      const localData = localStorage.getItem('TaskUser');
      if (localData !== null) {
        const parseData = JSON.parse(localData);

        this.loggedInUser = JSON.parse(localData);
        // this.ticketObj.createdBy = parseData.userId;
        this.taskForm.patchValue({ createdBy: parseData.uid });
        this.loggedDataId = parseData;
      }
    } finally {
    }

    this.initializeForm();
  }

  ngOnInit() {
    this.getAllProjects();
    this.getAllUsers();

    this.taskForm.patchValue({ createdBy: this.loggedDataId.uid });
  }

  ngAfterViewInit(): void {
    if (this.onEditTicket) {
      // this.taskForm = this.onEditTicket;
      this.taskForm.patchValue({
        summary: this.onEditTicket.summary,
        status: this.onEditTicket.status,
        description: this.onEditTicket.description,
        assignedTo: this.onEditTicket.assignedTo,
        assignedToName: this.onEditTicket.assignedToName,
        projectId: this.onEditTicket.projectId,
        createdById: this.loggedDataId.uid,
        createdByName: this.loggedDataId.fullName,
      });
      // this.ticketObj.createdBy = this.loggedData.userId;
    }
  }

  initializeForm() {
    this.taskForm = new FormGroup({
      createdDate: new FormControl(new Date()),
      summary: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      assignedTo: new FormControl('', Validators.required),
      assignedToName: new FormControl(''),
      createdById: new FormControl(this.loggedDataId.uid, Validators.required),
      createdByName: new FormControl(this.loggedDataId.fullName),
      projectId: new FormControl('', Validators.required),
    });

    // Optional: keep syncing when select changes
    this.taskForm.get('assignedTo')?.valueChanges.subscribe((value: string) => {
      const userName = this.userList.find((user) => user.uid === value);
      this.taskForm
        .get('assignedToName')
        ?.setValue(userName, { emitEvent: false });
    });

    // Set the value of input based on the select element's value on page render
    // const initialCreatedById = this.taskForm.get('createdBy')?.value;
    // const createdName = this.userList.find(
    //   (user) => user.uid === initialCreatedById
    // );
    // this.taskForm
    //   .get('createdByName')
    //   ?.setValue({ initialCreatedById, ...createdName });

    // this.taskForm.get('createdBy')?.valueChanges.subscribe((value: string) => {
    //   const createdName = this.userList.find((user) => user.uid === value);
    //   this.taskForm
    //     .get('createdByName')
    //     ?.setValue(createdName, { emitEvent: false });
    // });
  }

  async getAllUsers(): Promise<void> {
    try {
      this.userList = await this.masterService.getAllUsers();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async getAllProjects() {
    try {
      this.projectList = await this.masterService.getAllProjects();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async createTicket() {
    this.isCreateTicketLoading = true;
    const formValue = this.taskForm.value;

    await this.masterService
      .createTicket(formValue)
      .then(() => {
        this.toastr.success('Ticket Created Successfully!');
        this.isCreateTicketLoading = false;
        this.closeCreateTaskFormBtn();

        this.masterService.createTicket$.next(true);
        // this.taskForm.patchValue({
        //   assignedToName: this.userList.find((user) => user.fullName),
        // });
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isCreateTicketLoading = false;
      });
  }

  updateTicket() {
    this.isUpdateTicketLoading = true;
    const formValue = this.taskForm.value;

    this.masterService
      .updateTicket(formValue, this.ticketId)
      .then(() => {
        this.toastr.success('Ticket Updated Successfully!');
        this.isUpdateTicketLoading = false;
        this.closeCreateTaskFormBtn();

        this.masterService.createTicket$.next(true);
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isUpdateTicketLoading = false;
      });
  }

  closeCreateTaskFormBtn() {
    this.closeCreateTaskForm.next(false);
    this.taskForm.reset();
    this.closeCreateTaskForm.next(
      this.taskForm.patchValue({
        // createdDate: new FormControl(''),
        // summary: new FormControl(''),
        // status: new FormControl(''),
        // description: new FormControl(''),
        // assignedTo: new FormControl(''),
        // projectId: new FormControl('0'),
        createdById: this.loggedDataId.uid,
      })
    );
  }
}
