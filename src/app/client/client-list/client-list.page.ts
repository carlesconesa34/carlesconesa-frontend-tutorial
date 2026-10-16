import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation.component';
import { clientEditComponent } from '../client-edit/client-edit.component';
import { Client } from '../model/client';
import { ClientService } from './client.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  templateUrl: './client-list.page.html',
  styleUrl: './client-list.page.scss',
})
export class ClientListPage {
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly clientService = inject(ClientService);
  protected readonly dialog = inject(MatDialog);

  loadData(): void {
    this.clientService.getClients().subscribe((clients) => (this.dataSource.data = clients));
  }

  ngOnInit(): void {
    this.loadData();
  }

  createClient() {
    const dialogRef = this.dialog.open(clientEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(clientEditComponent, {
      data: { client },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar cliente',
        description:
          'Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clientService.deleteClient(client.id).subscribe(() => {
          this.loadData();
        });
      }
    });
  }
}
