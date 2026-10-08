import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../model/category';
import { CATEGORY_DATA } from '../model/mock-categorie';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor() {
    /* empty */
  }

  saveCategory(category: Category): Observable<Category> | null {
    return of(null);
  }

  deleteCategory(idCategory: number): Observable<unknown> {
    return of(null);
  }
  getCategories(): Observable<Category[]> {
    return of(CATEGORY_DATA);
  }
}
