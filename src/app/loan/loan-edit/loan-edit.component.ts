import { formatDate } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/client';
import { validateFields } from '../../core/helpers/validation.helper';
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

  protected readonly clientsService = inject(ClientService);
  protected readonly gameService = inject(GameService);

  protected readonly id = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientName = signal<string | null>(null);
  protected readonly gameName = signal<string | null>(null);
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);

  clients: Client[] = [];
  games: Game[] = [];

  loadFormData(initialData: Loan | null) {
    this.id.set(initialData?.id ?? null);
    this.clientId.set(initialData?.client?.id ?? initialData?.clientId ?? null);
    this.gameId.set(initialData?.game?.id ?? initialData?.gameId ?? null);
    this.clientName.set(initialData?.client?.name ?? null);
    this.gameName.set(initialData?.game?.title ?? null);
    this.startDate.set(initialData?.startDate ?? null);
    this.endDate.set(initialData?.endDate ?? null);
  }

  ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);

    this.clientsService.getClients().subscribe((data) => {
      console.log('CLIENTS', data);
      this.clients = data;
    });

    this.gameService.getGames().subscribe((data) => {
      this.games = data;
    });
  }

  onSave() {
    const id = this.id();
    const clientId = this.clientId();
    const gameId = this.gameId();
    const startDate = this.startDate();
    const endDate = this.endDate();

    const requiredFields = ['clientId', 'gameId', 'startDate', 'endDate'] as const;
    const data = { clientId, gameId, startDate, endDate };

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const start = new Date(startDate!);
    const end = new Date(endDate!);

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
      client: { id: clientId },
      startDate: formatDate(startDate!, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(endDate!, 'yyyy-MM-dd', 'en-US'),
    } as unknown as Loan;
    this.loanService.saveLoan(loan).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('ERROR', err),
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
