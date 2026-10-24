import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { CustomerService } from '../customer.service';
import { Customer } from '../model/customer';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  templateUrl: './customer-list.page.html',
  styleUrl: './customer-list.page.scss',
})
export class CustomerListPage {
  dataSource = new MatTableDataSource<Customer>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly customerService = inject(CustomerService);
  protected readonly dialog = inject(MatDialog);

  loadData(): void {
    this.customerService.getCustomers().subscribe((customers) => (this.dataSource.data = customers));
  }

  ngOnInit(): void {
    this.loadData();
  }

  createCustomer() {
    const dialogRef = this.dialog.open(CustomerEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  editCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerEditComponent, {
      data: { customer },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  deleteCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar cliente',
        description:
          'Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.customerService.deleteCustomer(customer.id).subscribe(() => {
          this.loadData();
        });
      }
    });
  }
}
