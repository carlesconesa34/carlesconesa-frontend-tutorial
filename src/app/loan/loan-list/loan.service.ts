import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from '../../core/model/page/pageable';
import { PaginatedData } from '../../core/model/page/paginated-data';
import { Loan } from '../model/loan';

@Service()
export class LoanService {
  protected readonly http = inject(HttpClient);

  private baseUrl = 'http://localhost:8080/loan';

  getLoans(filterLoan: Loan, pageable: Pageable): Observable<PaginatedData<Loan>> {
    return this.http.post<PaginatedData<Loan>>(this.baseUrl, {
      gameId: filterLoan.gameId,
      clientId: filterLoan.clientId,
      searchDate: filterLoan.searchDate,
      pageable: pageable,
    });
  }

  saveLoan(Loan: Loan): Observable<Loan> {
    const { id } = Loan;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Loan>(url, Loan);
  }

  deleteLoan(idLoan: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idLoan}`);
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl);
  }
}
