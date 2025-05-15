import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  router: Router = inject(Router);
  showLoader: boolean = false;

  ngOnInit() {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoader = true;
      }
      if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel) {
        this.showLoader = false;
      }
    })
  }
}
