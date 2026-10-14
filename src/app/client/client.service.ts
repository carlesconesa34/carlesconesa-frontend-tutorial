import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './model/client';
import { CLIENT_DATA } from './model/mock-clients';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor() {
    /* empty */
  }

  getClients(): Observable<Client[]> {
    return of(CLIENT_DATA);
  }
}
