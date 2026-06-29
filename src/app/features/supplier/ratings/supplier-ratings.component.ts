import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';
import { environment } from '../../../../environments/environment';

@Component({ selector:'app-supplier-ratings', standalone:true,
  imports:[CommonModule,LayoutComponent],
  templateUrl:'./supplier-ratings.component.html',
  styleUrls:['./supplier-ratings.component.css'] })
export class SupplierRatingsComponent implements OnInit {
  nav = SUPPLIER_NAV;
  ratings: any[] = []; loading = true; avgRating = 0;

  getRatingImgUrl(filename: string): string {
    if (!filename) return '';
    return `${environment.apiUrl}/profile/image/ratings/${filename}`;
  }
  constructor(private svc: SupplierService) {}
  ngOnInit() {
    this.svc.getRatings().subscribe({
      next:r=>{ this.loading=false; if(r.success&&r.data.length){ this.ratings=r.data; this.avgRating=+(r.data.reduce((s:number,x:any)=>s+x.rating,0)/r.data.length).toFixed(1); } else { this.ratings=this.mock(); this.avgRating=4.5; } },
      error:()=>{ this.loading=false; this.ratings=this.mock(); this.avgRating=4.5; }
    });
  }
  stars(n:number){ return '★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n)); }
  dist(n:number){ return Math.round(this.ratings.filter(r=>r.rating===n).length/this.ratings.length*100); }
  mock(){return[{id:1,retailerEmail:'shop1@retail.com',rating:5,review:'Excellent quality! Fast delivery.',createdAt:'2025-02-10'},{id:2,retailerEmail:'store2@retail.com',rating:4,review:'Good products, reliable supplier.',createdAt:'2025-02-18'},{id:3,retailerEmail:'mart3@retail.com',rating:5,review:'Best prices in the market!',createdAt:'2025-03-01'}];}
}
