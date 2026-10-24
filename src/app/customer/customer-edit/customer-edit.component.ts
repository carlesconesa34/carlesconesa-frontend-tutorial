import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from '../customer.service';
import { Customer } from '../model/customer';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss',
})
export class CustomerEditComponent implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef<CustomerEditComponent>);
  protected readonly customerService = inject(CustomerService);
  protected readonly data = inject(MAT_DIALOG_DATA) as { customer: Customer };

  protected readonly id = signal<number | null>(null);
  protected readonly name = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFormData(this.data.customer ?? null);
  }

  loadFormData(initialData: Customer | null): void {
    this.id.set(initialData?.id ?? null);
    this.name.set(initialData?.name ?? null);
  }

  onSave() {
    const id = this.id();
    const name = this.name();

    if (!name) {
      return;
    }

    const customer = { id, name } as Customer;
    this.customerService.saveCustomer(customer).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
