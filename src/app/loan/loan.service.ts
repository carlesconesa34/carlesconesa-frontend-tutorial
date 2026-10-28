import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from '../core/model/page/pageable';
import { PaginatedData } from '../core/model/page/paginated-data';
import { Loan } from './model/loan';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  protected readonly http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/loan';

  getLoans(filterLoan: Loan, pageable: Pageable): Observable<PaginatedData<Loan>> {
    const date = filterLoan.searchDate
      ? formatDate(filterLoan.searchDate, 'yyyy-MM-dd', 'en-US')
      : null;

    return this.http.post<PaginatedData<Loan>>(this.baseUrl, {
      gameId: filterLoan.gameId,
      customerId: filterLoan.customerId,
      date,
      pageable: pageable,
    });
  }

  saveLoan(loan: Loan): Observable<void> {
    const { id } = loan;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<void>(url, loan);
  }

  deleteLoan(idLoan: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl);
  }
}
