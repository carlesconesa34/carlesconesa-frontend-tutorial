import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { clientEditComponent } from '../client-edit/client-edit.component';
import { ClientService } from '../client.service';
import { Client } from '../model/client';

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

  constructor() {
    /* empty */
  }

  protected readonly categoryService = inject(ClientService);
  protected readonly dialog = inject(MatDialog);
  createClient() {
    const dialogRef = this.dialog.open(clientEditComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }
  loadData() {
    throw new Error('Method not implemented.');
  }
}
