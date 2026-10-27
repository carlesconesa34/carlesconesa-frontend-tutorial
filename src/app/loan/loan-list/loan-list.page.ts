/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { Pageable } from '../../core/model/page/pageable';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/model/customer';
import { GameService } from '../../game/game.service';
import { Game } from '../../game/model/game';
import { LoanEditComponent } from '../loan-edit/loan-edit.component';
import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './loan-list.page.html',
  styleUrl: './loan-list.page.scss',
})
export class LoanListPage implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  filterLoan: Loan = {};
  protected readonly games = signal<Game[]>([]);
  protected readonly customers = signal<Customer[]>([]);

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'gameName', 'customerName', 'startDate', 'endDate', 'action'];

  constructor(
    private loanService: LoanService,
    private gameService: GameService,
    private customerService: CustomerService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadcustomers();
    this.loadPage();
  }

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event) {
      pageable.pageNumber = event.pageIndex;
      pageable.pageSize = event.pageSize;
    }

    this.loanService.getLoans(this.filterLoan, pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  onSearch() {
    this.pageNumber = 0;
    this.loadPage();
  }

  onCleanFilter() {
    this.filterLoan = {};
    this.pageNumber = 0;
    this.loadPage();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe((data) => {
      this.games.set(data);
    });
  }

  loadcustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.customers.set(data);
    });
  }

  createLoan() {
    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((saved) => {
      if (saved) {
        this.ngOnInit();
      }
    });
  }

  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEditComponent, {
      data: { loan: loan },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar préstamo',
        description: 'Una vez borrado el préstamo se perderán sus datos. ¿Quieres continuar?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}
