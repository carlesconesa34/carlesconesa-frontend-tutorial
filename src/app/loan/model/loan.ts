import { Client } from '../../client/model/client';
import { Game } from '../../game/model/game';
export interface Loan {
  id?: number;
  startDate?: Date;
  endDate?: Date;
  searchDate?: Date;

  game?: Game;
  client?: Client;
  gameId?: number;
  clientId?: number;
}
