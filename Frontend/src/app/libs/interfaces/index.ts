export interface IFilters  {
    pageNumber: number,
    limit: number,
    condition: object,
    isSearching: boolean,
    searchingField: string,
    searchingData: string,
    fetchVia: string,
    fetchOrder: number
}