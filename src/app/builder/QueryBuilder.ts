import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }
  // search query
  search(searchableField: string[]) {
    const searchTerm = this?.query?.searchTerm as string;
    if (searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchableField.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }
  // filter query
  filter() {
    const queryObj = { ...this.query };
    const excludingFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludingFields.forEach((elm) => delete queryObj[elm]);
    this.queryModel = this.queryModel.find(queryObj as FilterQuery<T>);

    return this;
  }
  // sort query
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.queryModel = this.queryModel.sort(sort as string);

    return this;
  }
  // paginate query
  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.queryModel = this.queryModel.skip(skip).limit(limit);

    return this;
  }
  // field limiting query
  fieldLimiting() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.queryModel = this.queryModel.select(fields);

    return this;
  }
}

export default QueryBuilder;
