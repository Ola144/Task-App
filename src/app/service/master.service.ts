import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IAPIResponse, ProjectModel, TicketModel, UserModel } from '../model/TaskApp';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = '/api/Jira/';

  http: HttpClient = inject(HttpClient);

  userData!: UserModel;

  // BehaviourSubject to read localStorage again after login
  onLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Subject to get the ticket created to dashboard
  onCreateTicket$: Subject<any> = new Subject();
  onChangeProject$: Subject<any> = new Subject();

  constructor() {
    
  }
  
  isUserLogin(){
    try {
      return !!localStorage.getItem('taskAppUser')
    } catch (err) {
      return console.error(err);
    }
  }

  // User API Crud Operation
  getAllUsers(): Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(`${this.apiUrl}GetAllUsers`);
  }

  createNewUser(obj: UserModel): Observable<IAPIResponse>{
    return this.http.post<IAPIResponse>(`${this.apiUrl}CreateUser`, obj);
  }

  userLogin(obj: any){
    return this.http.post(`${this.apiUrl}Login`, obj, {
      headers: { 
        'accept': 'text/plain', 
        'Content-Type': 'application/json-patch+json'
      }
    });
  }

  updateExistingUser(obj: UserModel): Observable<IAPIResponse>{
    return this.http.put<IAPIResponse>(`${this.apiUrl}UpdateUser`, obj);
  }

  deleteExistingUserById(id: number): Observable<IAPIResponse>{
    return this.http.delete<IAPIResponse>(`${this.apiUrl}DeleteUserById?id=${id}`)
  }

  // Project API Crud Operation
  getAllProjects(): Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(`${this.apiUrl}GetAllProjects`);
  }

  createNewProject(obj: ProjectModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(`${this.apiUrl}CreateProject`, obj);
  }

  updateExistingProject(obj: ProjectModel): Observable<IAPIResponse> {
    return this.http.put<IAPIResponse>(`${this.apiUrl}UpdateProject`, obj);
  }

  deleteProjectById(id: number): Observable<IAPIResponse>{
    return this.http.delete<IAPIResponse>(`${this.apiUrl}DeleteProjectById?id=${id}`)
  }

  // Ticket API Crud Operation
  createTicket(obj: TicketModel): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(`${this.apiUrl}CreateTicket`, obj);
  }

  getTicketsByProjectId(id: number): Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(`${this.apiUrl}GetTicketsByProjectId?projectid=${id}`);
  }

  getTicketsAssignedByUserId(id: number): Observable<IAPIResponse>{
    return this.http.get<IAPIResponse>(`${this.apiUrl}GetTicketsAssignedByUserId?userId=${id}`);
  }

  updateTicket(obj: TicketModel): Observable<IAPIResponse> {
    return this.http.put<IAPIResponse>(`${this.apiUrl}UpdateTicket`, obj);
  }

  deleteTicketById(id: number): Observable<IAPIResponse>{
    return this.http.delete<IAPIResponse>(`${this.apiUrl}DeleteTicketById?id=${id}`)
  }


}
