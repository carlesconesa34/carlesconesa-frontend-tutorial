import { Pageable } from './pageable';

export interface PaginatedData<TData> {
  content: TData[];
  pageable: Pageable;
  totalElements: number;
}
