import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { Category } from '../model/category';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  templateUrl: './category-list.page.html',
  styleUrl: './category-list.page.scss',
})
export class CategoryListPage implements OnInit {
  dataSource = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly categoryService = inject(CategoryService);
  protected readonly dialog = inject(MatDialog);

  loadData(): void {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.dataSource.data = categories));
  }

  ngOnInit(): void {
    this.loadData();
  }

  createCategory() {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }
}
