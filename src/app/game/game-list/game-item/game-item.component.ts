import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Game } from '../../model/game';

@Component({
  selector: 'app-game-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-item.component.html',
  styleUrl: './game-item.component.scss',
})
export class GameItemComponent {
  protected readonly game = input.required<Game>();
}
