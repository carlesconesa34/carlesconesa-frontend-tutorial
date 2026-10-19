import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientService } from '../client.service';
import { Client } from '../model/client';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss',
})
export class clientEditComponent implements OnInit {
  protected readonly dialogRef = inject(MatDialogRef<clientEditComponent>);
  protected readonly clientService = inject(ClientService);
  protected readonly data = inject(MAT_DIALOG_DATA) as { client: Client };

  protected readonly id = signal<number | null>(null);
  protected readonly name = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFormData(this.data.client ?? null);
  }

  loadFormData(initialData: Client | null): void {
    this.id.set(initialData?.id ?? null);
    this.name.set(initialData?.name ?? null);
  }

  onSave() {
    const id = this.id();
    const name = this.name();

    if (!name) {
      return;
    }

    const client = { id, name } as Client;
    this.clientService.saveClient(client).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
