import { FindAndCountOptions, Model, ModelStatic } from "sequelize";

export default async function GetRowsByPagination<T extends Model>(
  model: ModelStatic<T>,
  page?: number,
  limit?: number,
  findOptions?: FindAndCountOptions
): Promise<{ list: T[]; totalCount: number }> {
  try {
    // Pagination filtering.
    const findOpt: FindAndCountOptions = {
      ...findOptions,
    };

    let _limit: number | undefined = undefined;
    let _offset: number = 0;
    if (limit != undefined && !Number.isNaN(limit)) {
      if (limit < 0) _limit = 0;
      else _limit = limit;
      if (page != undefined && !Number.isNaN(page)) {
        if (page < 0) _offset = 0;
        else _offset = (page - 1) * _limit;
      }
    }

    findOpt.limit = _limit;
    findOpt.offset = _offset;
    const { count, rows } = await model.findAndCountAll(findOpt);

    return {
      list: rows,
      totalCount: count,
    };
  } catch (e) {
    throw e;
  }
}
