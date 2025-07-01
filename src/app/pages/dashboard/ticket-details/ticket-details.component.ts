import { Component, inject, OnInit } from '@angular/core';
import { ITicket } from '../../../model/TaskApp';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../../service/master.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css',
})
export class TicketDetailsComponent implements OnInit {
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  masterService: MasterService = inject(MasterService);

  ticketList!: ITicket | any;
  selectedTicket!: ITicket | any;
  ticketId!: string;

  async ngOnInit() {
    this.ticketId = this.activeRoute.snapshot.paramMap.get('ticketId')!;

    try {
      this.ticketList = (await this.masterService.getAllTickets()).find(
        (ticket) => ticket.ticketId === this.ticketId
      );
    } finally {
    }

    // console.log(this.ticketList);

    // this.selectedTicket = this.ticketList?.find(
    //   (ticket) => (ticket.ticketId = this.ticketId)
    // );
  }
}
