import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/model/client';
import { validateFields } from '../../core/helpers/validation.helper';
import { GameService } from '../../game/game-list/game.service';
import { Game } from '../../game/model/game';
import { LoanService } from '../loan-list/loan.service';
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
    MatNativeDateModule,
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
    this.clientId.set(initialData?.clientId ?? null);
    this.gameId.set(initialData?.gameId ?? null);
    this.clientName.set(initialData?.client?.name ?? null);
    this.gameName.set(initialData?.client?.name ?? null);
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

    const loan = {
      id,
      game: { id: gameId },
      client: { id: clientId },
      startDate: this.toIsoDate(startDate!),
      endDate: this.toIsoDate(endDate!),
    } as unknown as Loan;
    this.loanService.saveLoan(loan).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('ERROR', err),
    });
  }

  private toIsoDate(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
