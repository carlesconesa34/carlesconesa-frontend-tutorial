export interface Loan {
  id: number;
  startDate: Date;
  endDate: Date;
  searchDate: Date;

  gameId: number;
  gameName: string;
  clientId: number;
  clientName: string;
}
