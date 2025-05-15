import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
