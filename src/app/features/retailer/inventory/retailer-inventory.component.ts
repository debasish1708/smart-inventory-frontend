import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { RetailerService } from '../../../core/services/retailer.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogCategory, CatalogProduct } from '../../../core/models/auth.models';
import { RETAILER_NAV } from '../retailer.nav';

@Component({
  selector: 'app-retailer-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  templateUrl: './retailer-inventory.component.html',
  styleUrls: ['./retailer-inventory.component.css']
})
export class RetailerInventoryComponent implements OnInit {
  nav = RETAILER_NAV;
  items: any[] = [];
  filtered: any[] = [];
  search = '';
  loading = true;
  showModal = false;
  editItem: any = null;
  saving = false;
  error = ''; success = '';

  // Catalog data
  categories: CatalogCategory[] = [];
  products: CatalogProduct[] = [];
  filteredProducts: CatalogProduct[] = [];
  catalogLoading = false;

  form = { productName: '', category: '', quantity: 0, price: 0, thresholdValue: 10, unit: '', brand: '' };

  constructor(private svc: RetailerService, private catalog: CatalogService) {}

  ngOnInit() {
    this.load();
    this.loadCategories();
  }

  load() {
    this.svc.getInventory().subscribe({
      next: r => { this.loading = false; if (r.success) { this.items = r.data; this.applyFilter(); } },
      error: () => { this.loading = false; this.items = []; this.filtered = []; }
    });
  }

  loadCategories() {
    this.catalog.getCategories().subscribe({
      next: r => { if (r.success) this.categories = r.data; },
      error: () => {}
    });
  }

  onCategoryChange() {
    const cat = this.categories.find(c => c.name === this.form.category);
    this.form.productName = '';
    this.form.unit = '';
    this.form.brand = '';
    if (cat) {
      this.catalogLoading = true;
      this.catalog.getProducts(cat.id).subscribe({
        next: r => { this.catalogLoading = false; this.filteredProducts = r.success ? r.data : []; },
        error: () => { this.catalogLoading = false; this.filteredProducts = []; }
      });
    } else {
      this.filteredProducts = [];
    }
  }

  onProductChange() {
    const p = this.filteredProducts.find(p => p.name === this.form.productName);
    if (p) {
      if (p.unit)  this.form.unit  = p.unit;
      if (p.brand) this.form.brand = p.brand;
    }
  }

  applyFilter() {
    this.filtered = this.search
      ? this.items.filter(i => i.productName?.toLowerCase().includes(this.search.toLowerCase()))
      : [...this.items];
  }

  openAdd() {
    this.editItem = null;
    this.form = { productName: '', category: '', quantity: 0, price: 0, thresholdValue: 10, unit: '', brand: '' };
    this.filteredProducts = [];
    this.showModal = true;
  }

  openEdit(i: any) {
    this.editItem = i;
    this.form = { ...i };
    // Pre-load products for existing category
    const cat = this.categories.find(c => c.name === i.category);
    if (cat) {
      this.catalog.getProducts(cat.id).subscribe({
        next: r => { this.filteredProducts = r.success ? r.data : []; },
        error: () => { this.filteredProducts = []; }
      });
    } else {
      this.filteredProducts = [];
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; this.error = ''; }

  save() {
    this.saving = true; this.error = '';
    const obs = this.editItem
      ? this.svc.updateInventory(this.editItem.id, this.form)
      : this.svc.addInventory(this.form);
    obs.subscribe({
      next: r => {
        this.saving = false;
        if (r.success) { this.success = 'Saved!'; this.closeModal(); this.load(); setTimeout(() => this.success = '', 3000); }
        else this.error = r.message;
      },
      error: err => { this.saving = false; this.error = err.error?.message || 'Failed'; }
    });
  }

  delete(id: number) {
    if (!confirm('Delete this item?')) return;
    this.svc.deleteInventory(id).subscribe({ next: () => this.load() });
  }

  lowStock(i: any) { return i.quantity <= (i.thresholdValue ?? 10); }
}
