import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { SupplierService } from '../../../core/services/supplier.service';
import { SUPPLIER_NAV } from '../supplier.nav';

@Component({ selector:'app-supplier-inventory', standalone:true,
  imports:[CommonModule,FormsModule,LayoutComponent],
  templateUrl:'./supplier-inventory.component.html',
  styleUrls:['./supplier-inventory.component.css'] })
export class SupplierInventoryComponent implements OnInit {
  nav = SUPPLIER_NAV;
  items: any[] = []; filtered: any[] = [];
  search = ''; loading = true; showModal = false; editItem: any = null;
  saving = false; error = ''; success = '';
  form = { productName:'', category:'', price:0, moq:0, stockQuantity:0, unit:'', brand:'', leadTime:1, isActive:true };

  constructor(private svc: SupplierService) {}
  ngOnInit() { this.load(); }

  get calculatedAvailabilityPreview(): Date {
    const d = new Date();
    d.setDate(d.getDate() + (this.form.leadTime || 1));
    return d;
  }

  getAvailabilityDate(leadTime: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + (leadTime || 1));
    return d;
  }

  load() {
    this.svc.getInventory().subscribe({
      next:r=>{ this.loading=false; if(r.success){ this.items=r.data; this.apply(); } else { this.items=[]; this.filtered=[]; } },
      error:()=>{ this.loading=false; this.items=[]; this.filtered=[]; }
    });
  }
  apply() { this.filtered=this.search?this.items.filter(i=>i.productName?.toLowerCase().includes(this.search.toLowerCase())):[...this.items]; }
  openAdd()      { this.editItem=null; this.form={productName:'',category:'',price:0,moq:0,stockQuantity:0,unit:'',brand:'',leadTime:1,isActive:true}; this.showModal=true; }
  openEdit(i:any){ this.editItem=i; this.form={...i}; this.showModal=true; }
  closeModal()   { this.showModal=false; this.error=''; }

  save() {
    this.saving=true; this.error='';
    const obs=this.editItem?this.svc.updateInventory(this.editItem.id,this.form):this.svc.addInventory(this.form);
    obs.subscribe({
      next:r=>{ this.saving=false; if(r.success){ this.success='Saved!'; this.closeModal(); this.load(); setTimeout(()=>this.success='',3000); } else this.error=r.message; },
      error:err=>{ this.saving=false; this.error=err.error?.message||'Failed'; }
    });
  }
  delete(id:number) { if(!confirm('Remove listing?')) return; this.svc.deleteInventory(id).subscribe({next:()=>this.load()}); }
}
