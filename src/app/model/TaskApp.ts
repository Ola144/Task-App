export interface IAPIResponse {
  message: string;
  result: boolean;
  data: any;
}

export interface IProject {
  projectId?: string;
  projectName: string;
  shortName: string;
  createdDate: Date;
}

export interface ITicket {
  ticketId: string;
  createdDate: Date;
  summary: string;
  status: string;
  description: string;
  assignedTo: string;
  assignedToName: any;
  createdBy: string;
  createdByName: any;
  projectId: string;
}

export class ProjectModel {
  projectName: string;
  shortName: string;
  createdDate: Date;

  constructor() {
    this.projectName = '';
    this.shortName = '';
    this.createdDate = new Date();
  }
}

export class UserModel {
  uid: string;
  emailId: string;
  fullName: string;
  password: string;
  role: string;

  constructor() {
    this.uid = '';
    this.emailId = '';
    this.fullName = '';
    this.password = '';
    this.role = 'user';
  }
}

export class LoginModel {
  emailId: string;
  password: string;

  constructor() {
    this.emailId = '';
    this.password = '';
  }
}

export class TicketModel {
  createdDate: Date;
  summary: string;
  status: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  createdByName: string;
  createdBy: string;
  projectId: string;

  constructor() {
    this.createdDate = new Date();
    this.summary = '';
    this.status = '';
    this.description = '';
    this.assignedTo = '';
    this.assignedToName = '';
    this.createdBy = '';
    this.createdByName = '';
    this.projectId = '';
  }
}
