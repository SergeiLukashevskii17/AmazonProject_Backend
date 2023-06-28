import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination-dto';

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto) {
    const defaultPerPage = 30;
    const defaultPage = 1;

    const page = Number(dto.page || defaultPage);
    const perPage = Number(dto.perPage || defaultPerPage);

    const skip = (page - 1) * perPage;

    return { perPage, skip };
  }
}
