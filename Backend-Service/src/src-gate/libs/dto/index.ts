export const queryFiltersRules = {
    pageNumber: 'required|numeric',
    limit: 'required|numeric',
    condition: 'present',
    isSearching: 'required|boolean',
    searchingField: 'present|string',
    searchingData: 'present|string',
    fetchVia: 'required|string',
    fetchOrder: 'required|numeric',
}