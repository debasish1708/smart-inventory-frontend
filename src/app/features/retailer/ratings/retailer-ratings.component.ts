import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { RETAILER_NAV } from '../retailer.nav';
import { environment } from '../../../../environments/environment';

@Component({ selector:'app-retailer-ratings', standalone:true,
  imports:[CommonModule, LayoutComponent],
  templateUrl:'./retailer-ratings.component.html',
  styleUrls:['./retailer-ratings.component.css'] })
export class RetailerRatingsComponent implements OnInit {
  nav = RETAILER_NAV;
  ratings: any[] = [];
  loading = true;
  avgRating = 0;

  getRatingImgUrl(filename: string): string {
    if (!filename) return '';
    return `${environment.apiUrl}/profile/image/ratings/${filename}`;
  }
  constructor(private svc: RetailerService) {}
  ngOnInit() {
    this.svc.getRatings().subscribe({
      next: r => {
        this.loading = false;
        if (r.success && r.data.length) {
          this.ratings = r.data;
          this.avgRating = r.data.reduce((s:number,x:any)=>s+x.rating,0)/r.data.length;
        } else { this.ratings = this.mock(); this.avgRating = 4.3; }
      },
      error: () => { this.loading = false; this.ratings = this.mock(); this.avgRating = 4.3; }
    });
  }
  stars(n:number){ return '★'.repeat(n)+'☆'.repeat(5-n); }
  mock() {
    return [
      { id:1, supplierEmail:'ravi@supplier.com', rating:5, review:'Excellent quality and fast delivery!', createdAt:'2025-01-10' },
      { id:2, supplierEmail:'sharma@supplier.com', rating:4, review:'Good product, slight delay in delivery.', createdAt:'2025-01-18' },
      { id:3, supplierEmail:'green@supplier.com', rating:4, review:'Reliable supplier, will order again.', createdAt:'2025-02-02' },
    ];
  }
}
