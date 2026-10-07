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

  getCategories(): Observable<Category[]> {
    return of(CATEGORY_DATA);
  }
}
