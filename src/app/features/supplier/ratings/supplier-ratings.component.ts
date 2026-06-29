import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';
import { environment } from '../../../../environments/environment';

@Component({ selector:'app-supplier-ratings', standalone:true,
  imports:[CommonModule,LayoutComponent,FormsModule],
  templateUrl:'./supplier-ratings.component.html',
  styleUrls:['./supplier-ratings.component.css'] })
export class SupplierRatingsComponent implements OnInit {
  nav = SUPPLIER_NAV;
  ratings: any[] = []; loading = true; avgRating = 0;

  // Filter & Sort State
  selectedStarFilter: string = 'all';
  onlyWithImages: boolean = false;
  sortBy: string = 'newest';

  // Lightbox State
  showLightbox = false;
  activeReview: any = null;
  activeImageIndex = 0;

  getRatingImgUrl(filename: string): string {
    if (!filename) return '';
    return `${environment.apiUrl}/profile/image/ratings/${filename}`;
  }
  constructor(private svc: SupplierService) {}
  ngOnInit() {
    this.svc.getRatings().subscribe({
      next:r=>{ 
        this.loading=false; 
        if(r.success&&r.data.length){ 
          this.ratings=r.data; 
          this.avgRating=+(r.data.reduce((s:number,x:any)=>s+x.rating,0)/r.data.length).toFixed(1); 
        } else { 
          this.ratings=this.mock(); 
          this.avgRating=+(this.ratings.reduce((s:number,x:any)=>s+x.rating,0)/this.ratings.length).toFixed(1); 
        } 
      },
      error:()=>{ 
        this.loading=false; 
        this.ratings=this.mock(); 
        this.avgRating=+(this.ratings.reduce((s:number,x:any)=>s+x.rating,0)/this.ratings.length).toFixed(1); 
      }
    });
  }
  stars(n:number){ return '★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n)); }
  dist(n:number){ 
    if (!this.ratings.length) return 0;
    return Math.round(this.ratings.filter(r=>r.rating===n).length/this.ratings.length*100); 
  }

  getRatingCount(ratingVal: number): number {
    return this.ratings.filter(r => r.rating === ratingVal).length;
  }

  getReviewsWithImagesCount(): number {
    return this.ratings.filter(r => r.images && r.images.length > 0).length;
  }

  getPositivePercentage(): number {
    if (!this.ratings.length) return 0;
    const positive = this.ratings.filter(r => r.rating >= 4).length;
    return Math.round((positive / this.ratings.length) * 100);
  }

  getFilteredRatings(): any[] {
    let filtered = [...this.ratings];

    // Star filter
    if (this.selectedStarFilter !== 'all') {
      const star = parseInt(this.selectedStarFilter, 10);
      filtered = filtered.filter(r => r.rating === star);
    }

    // Images filter
    if (this.onlyWithImages) {
      filtered = filtered.filter(r => r.images && r.images.length > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (this.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (this.sortBy === 'highest') {
        return b.rating - a.rating;
      } else if (this.sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

    return filtered;
  }

  openLightbox(review: any, index: number) {
    this.activeReview = review;
    this.activeImageIndex = index;
    this.showLightbox = true;
  }

  closeLightbox() {
    this.showLightbox = false;
    this.activeReview = null;
    this.activeImageIndex = 0;
  }

  nextImage(event?: Event) {
    if (event) event.stopPropagation();
    if (!this.activeReview || !this.activeReview.images) return;
    this.activeImageIndex = (this.activeImageIndex + 1) % this.activeReview.images.length;
  }

  prevImage(event?: Event) {
    if (event) event.stopPropagation();
    if (!this.activeReview || !this.activeReview.images) return;
    this.activeImageIndex = (this.activeImageIndex - 1 + this.activeReview.images.length) % this.activeReview.images.length;
  }

  mock(){
    return [
      {id:1,retailerEmail:'shop1@retail.com',rating:5,review:'Excellent quality! Fast delivery. Very satisfied with the grains packaging.',createdAt:'2025-02-10',images:['sample_rating_1.jpg','sample_rating_2.jpg']},
      {id:2,retailerEmail:'store2@retail.com',rating:4,review:'Good products, reliable supplier. Minor packaging scuffs.',createdAt:'2025-02-18',images:['sample_rating_3.jpg']},
      {id:3,retailerEmail:'mart3@retail.com',rating:5,review:'Best prices in the market! Fast dispatch.',createdAt:'2025-03-01',images:[]},
      {id:4,retailerEmail:'super_store@retail.com',rating:2,review:'Slight delay in delivery and package was crushed.',createdAt:'2025-03-05',images:['sample_rating_4.jpg']}
    ];
  }
}
