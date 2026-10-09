import { SortPage } from './port-page';

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortPage[];
}
