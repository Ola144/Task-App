import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MasterService } from '../service/master.service';

export const resolveProject: ResolveFn<any> = () => {
    const masterService = inject(MasterService);
    return masterService.getAllProjects();
};

export const resolveTicket: ResolveFn<any> = () => {
    const masterService = inject(MasterService);
    return masterService.getTicketsByProjectId(156);
};

export const resolveUsers: ResolveFn<any> = () => {
    const masterService = inject(MasterService);
    return masterService.getAllUsers();
};
