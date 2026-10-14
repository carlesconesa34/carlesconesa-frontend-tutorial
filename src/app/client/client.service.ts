import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './model/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor() {
    /* empty */
  }

  getCategories(): Observable<Client[]> {
    return new Observable();
  }
}
