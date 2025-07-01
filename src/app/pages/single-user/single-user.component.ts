import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { ITicket } from '../../model/TaskApp';
import { ToastrService } from 'ngx-toastr';
import { CreateTaskComponent } from '../dashboard/create-task/create-task.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [CreateTaskComponent, RouterLink],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.css',
})
export class SingleUserComponent implements OnInit {
  user: any;
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);
  isLoggedIn: any = false;

  ticketList: ITicket[] = [];
  status: string[] = ['To Do', 'In Progress', 'Done'];

  isCreateTaskForm: boolean = false;

  selectedTicket!: ITicket;
  ticketId: any;

  isConfirmDelete: boolean = false;
  isDeleteTicketLoading: boolean = false;

  constructor() {
    const localUser = localStorage.getItem('TaskUser');
    if (localUser != null) {
      this.user = JSON.parse(localUser);
    }
  }

  ngOnInit(): void {
    this.getAllTickets();

    this.masterService.onLogin$.subscribe({
      next: (res) => {
        this.isLoggedIn = this.masterService.isUserLogin();
      },
    });
  }

  async getAllTickets() {
    try {
      this.ticketList = await this.masterService.getAllTickets();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  filterTicket(status: string) {
    return this.ticketList.filter((ticket) => ticket.status == status);
  }

  userTicket(status: string) {
    return this.filterTicket(status).filter(
      (ticket) => ticket.assignedTo == this.user.uid
    );
  }

  onEdit(ticketObj: ITicket) {
    this.isCreateTaskForm = true;
    window.scrollTo(0, 0);
    this.selectedTicket = ticketObj;
    this.ticketId = ticketObj.ticketId;
  }

  onDelete(ticketObj: ITicket) {
    this.isConfirmDelete = true;
    window.scrollTo(0, 0);
    this.ticketId = ticketObj.ticketId;
  }

  deleteTicketById() {
    this.isDeleteTicketLoading = true;
    //   let i = 0,
    //     ticketId = 0;
    //   for (; i < this.ticketList.length; i++) {
    //     ticketId = this.ticketList[i].ticketId;
    //   }

    this.masterService
      .deleteTicketById(this.ticketId)
      .then(() => {
        this.toastr.success('Ticket Deleted Successfully!');
        this.getAllTickets();
        this.isDeleteTicketLoading = false;
        this.isConfirmDelete = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isDeleteTicketLoading = false;
      });
  }

  closeCreateTaskForm() {
    this.isCreateTaskForm = false;
  }
}
