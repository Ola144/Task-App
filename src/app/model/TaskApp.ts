export interface IAPIResponse {
  message: string;
  result: boolean;
  data: any;
}

export class ProjectModel {
  projectId: number;
  projectName: string;
  shortName: string;
  createdDate: Date;

  constructor(){
    this.projectId = 0;
    this.projectName = '';
    this.shortName = '';
    this.createdDate = new Date();
  }
}

export class UserModel{
  userId: number;
  emailId: string;
  fullName: string;
  password: string;

  constructor() {
    this.userId = 0;
    this.emailId = '';
    this.fullName = '';
    this.password = '';
  }
}

export class TicketModel {
  ticketId: number;
  createdDate: Date;
  summary: string;
  status: string;
  description: string;
  parentId: number;
  storyPoint: number;
  ticketGuid: string;
  assignedTo: number;
  createdBy: number;
  projectId: number

  constructor() {
    this.ticketId = 0;
    this.createdDate = new Date();
    this.summary = '';
    this.status = '';
    this.description = '';
    this.parentId = 0;
    this.storyPoint = 0;
    this.ticketGuid = '';
    this.assignedTo = 0;
    this.createdBy = 0;
    this.projectId = 0;
  }
}
