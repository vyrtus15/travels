import { Injectable } from '@nestjs/common';
import { Document, DocumentQuery, Model } from 'mongoose';
import { PageResult } from '../../../../interfaces/pageResult.interface';
import { PageSearch } from '../../../../interfaces/pageSearch.interface';

@Injectable()
export class QueryService {

  async page<T extends Document>(model: Model<T>, filter: PageSearch): Promise<PageResult<T>> {
    const countQuery = model.find(filter.condition).countDocuments();

    let query = model.find(filter.condition);
    query = this.applySorting(query, filter);
    query = this.applyPagination(query, filter);

    const [total, items] = await Promise.all([countQuery.exec(), query.exec()]);

    return {
      page: filter.page,
      limit: filter.limit,
      total,
      items,
    };
  }

  private applySorting<T extends Document>(query: DocumentQuery<T[], T>, filter: PageSearch) {
    const sortField = filter.sort ?? '_id';
    const sort = { [sortField.replace(/^-/, '')]: sortField.startsWith('-') ? -1 : 1 };

    return query.sort(sort);
  }

  private applyPagination<T extends Document>(query: DocumentQuery<T[], T>, filter: PageSearch) {
    const skip = ((filter.page ?? 1) - 1) * (filter.limit ?? 10);
    const limit = filter.limit ?? 10;

    return query.skip(skip).limit(limit);
  }
}
