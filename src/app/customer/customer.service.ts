/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from './model/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  protected readonly http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/customer';

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  saveCustomer(customer: Customer): Observable<void> {
    const { id } = customer;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<void>(url, customer);
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${customerId}`);
  }
}
