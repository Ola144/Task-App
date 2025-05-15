import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MasterService } from '../service/master.service';

export const canDeactivateTaskGuard: CanActivateFn = (route, state) => {
  const masterService = inject(MasterService);
  const router = inject(Router);
  
  if (masterService.isUserLogin()) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
