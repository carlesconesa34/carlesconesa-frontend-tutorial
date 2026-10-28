import { Customer } from '../../customer/model/customer';
import { Game } from '../../game/model/game';
export interface Loan {
  id?: number;
  startDate?: Date;
  endDate?: Date;
  searchDate?: Date;

  game?: Game;
  customer?: Customer;
  gameId?: number;
  customerId?: number;
}
