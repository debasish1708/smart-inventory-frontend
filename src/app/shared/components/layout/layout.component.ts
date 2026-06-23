import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent, NavItem } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  @Input() pageTitle = 'Dashboard';
  @Input() navItems: NavItem[] = [];
  @Input() roleLabel = '';
}
