import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import {
  IAPIResponse,
  IProject,
  ITicket,
  LoginModel,
  ProjectModel,
  TicketModel,
  UserModel,
} from '../model/TaskApp';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  Firestore,
  getDoc,
  collectionData,
  query,
  where,
  getDocs,
  onSnapshot,
  QuerySnapshot,
  updateDoc,
  deleteDoc,
  DocumentReference,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  http: HttpClient = inject(HttpClient);

  userData!: UserModel;

  // BehaviourSubject to read localStorage again after login
  onLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  createTicket$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Subject to get the ticket created to dashboard
  onCreateTicket$: Subject<any> = new Subject();
  onChangeProject$: Subject<any> = new Subject();

  constructor(private firestore: Firestore, private auth: Auth) {
    const usersRef = collection(this.firestore, 'users');
  }

  isUserLogin() {
    return !!localStorage.getItem('TaskUser');
  }

  // User API Crud Operation
  async getAllUsers() {
    const userRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as UserModel) }));
  }

  async updateUser(userObj: any, userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
    await updateDoc(userDocRef, userObj, { merge: true });
  }

  async deleteUser(userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
    await deleteDoc(userDocRef);
  }

  userLogout() {
    return localStorage.removeItem('TaskUser'), this.auth.signOut();
  }

  async createNewUser(userObj: UserModel): Promise<void> {
    let { emailId, password, fullName, role } = userObj;
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      emailId,
      password
    );
    const uid = cred.user.uid;
    await setDoc(doc(this.firestore, 'users', uid), {
      uid: uid,
      emailId,
      password,
      fullName,
      role,
      time: Timestamp.now(),
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    });
  }

  async userLogin(obj: UserModel) {
    const { emailId, password, fullName, role } = obj;
    const cred = await signInWithEmailAndPassword(this.auth, emailId, password);
    const uid = cred.user.uid;

    // Fetch user document from firestore
    const userDocRef = doc(this.firestore, 'users', uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      localStorage.setItem('TaskUser', JSON.stringify(userData));
      return userData;
    } else {
      throw new Error('User data not found in Firestore!');
    }
  }

  // Project API Crud Operation
  async getAllProjects() {
    const projectRef = collection(this.firestore, 'projects');
    const snapshot = await getDocs(projectRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as ProjectModel) }));
  }

  async createNewProject(obj: any) {
    const projectRef = collection(this.firestore, 'projects');
    const newDocRef: DocumentReference = doc(projectRef);
    const projectWithId = { projectId: newDocRef.id, ...obj };
    await setDoc(newDocRef, projectWithId);
  }

  async updateExistingProject(obj: any, projectId: string): Promise<void> {
    const projectDocRef = doc(this.firestore, 'projects', projectId);
    await updateDoc(projectDocRef, obj, { merge: true });
  }

  deleteProjectById(projectId: number) {
    const projectDocRef = doc(this.firestore, 'projects', projectId.toString());
    return deleteDoc(projectDocRef);
  }

  // Ticket API Crud Operation
  async createTicket(obj: TicketModel) {
    const ticketRef = collection(this.firestore, 'tickets');
    const newDocRef: DocumentReference = doc(ticketRef);
    const ticketWithId = { ticketId: newDocRef.id, ...obj };
    await setDoc(newDocRef, ticketWithId);
  }

  async getAllTickets() {
    const ticketRef = collection(this.firestore, 'tickets');
    const snapshot = await getDocs(ticketRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as ITicket) }));
  }

  getTicketsByProjectId(id: number) {}

  getTicketsAssignedByUserId(id: number) {}

  async updateTicket(obj: any, ticketId: string) {
    const ticketDocRef = doc(this.firestore, 'tickets', ticketId);
    await updateDoc(ticketDocRef, obj, { merge: true });
  }

  async deleteTicketById(ticketId: string) {
    const ticketDocRef = doc(this.firestore, 'tickets', ticketId);
    await deleteDoc(ticketDocRef);
  }
}
