const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

export function getPagination(_page: number, _limit: number) {
  const page = Math.abs(_page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(_limit) || DEFAULT_PAGE_LIMIT;

  const offset = (page - 1) * limit;

  return { offset, limit };
}

export function getPagingData(data: any, page: number, _limit: number) {
  const totalItems = data[1];
  const items = data[0];
  const totalPages = Math.ceil(totalItems / _limit);
  const currentPage = page ? +page : 0;

  return { totalItems, items, totalPages, currentPage };
}
