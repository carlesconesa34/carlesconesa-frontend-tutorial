import { formatDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { validateFields } from '../../core/helpers/validation.helper';
import { CustomerService } from '../../customer/customer.service';
import { Customer } from '../../customer/model/customer';
import { GameService } from '../../game/game.service';
import { Game } from '../../game/model/game';
import { LoanService } from '../loan.service';
import { Loan } from '../model/loan';

@Component({
  selector: 'app-loan-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './loan-edit.component.html',
  styleUrl: './loan-edit.component.scss',
})
export class LoanEditComponent implements OnInit {
  protected readonly loanService = inject(LoanService);
  protected readonly dialogRef = inject(MatDialogRef<LoanEditComponent>);
  protected readonly data = inject(MAT_DIALOG_DATA);

  protected readonly customerService = inject(CustomerService);
  protected readonly gameService = inject(GameService);

  protected readonly id = signal<number | null>(null);
  protected readonly customerId = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly customerName = signal<string | null>(null);
  protected readonly gameName = signal<string | null>(null);

  protected readonly today = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);

  customers: Customer[] = [];
  games: Game[] = [];

  loadFormData(initialData: Loan | null) {
    this.id.set(initialData?.id ?? null);
    this.customerId.set(initialData?.customer?.id ?? initialData?.customerId ?? null);
    this.gameId.set(initialData?.game?.id ?? initialData?.gameId ?? null);
    this.customerName.set(initialData?.customer?.name ?? null);
    this.gameName.set(initialData?.game?.title ?? null);
    this.startDate.set(initialData?.startDate ?? null);
    this.endDate.set(initialData?.endDate ?? null);
  }

  ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);

    this.customerService.getCustomers().subscribe((data) => {
      console.log('customerS', data);
      this.customers = data;
    });

    this.gameService.getGames().subscribe((data) => {
      this.games = data;
    });
  }

  onSave() {
    const id = this.id();
    const customerId = this.customerId();
    const gameId = this.gameId();
    const startDate = this.startDate();
    const endDate = this.endDate();

    const requiredFields = ['customerId', 'gameId', 'startDate', 'endDate'] as const;
    const data = { customerId, gameId, startDate, endDate };

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const start = new Date(startDate!);
    const end = new Date(endDate!);

    if (start < this.today) {
      alert('La fecha de inicio debe ser igual o posterior al día actual.');
      return;
    }

    if (end < start) {
      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
      return;
    }

    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 14) {
      alert('El período máximo de préstamo es de 14 días');
      return;
    }

    const loan = {
      id,
      game: { id: gameId },
      customer: { id: customerId },
      startDate: formatDate(startDate!, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(endDate!, 'yyyy-MM-dd', 'en-US'),
    } as unknown as Loan;
    this.loanService.saveLoan(loan).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Error al guardar el préstamo:', err);

        const message =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message || err.error?.error || 'Comprueba los datos introducidos.';
        alert(message);
      },
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
