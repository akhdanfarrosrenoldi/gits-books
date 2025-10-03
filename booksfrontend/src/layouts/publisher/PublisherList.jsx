import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import useSWR, { useSWRConfig } from "swr";
import SearchFilter from "../../components/SearchFilter";
import Pagination from "../../components/Pagination";
import useDebounce from "../../hooks/useDebounce";

const PublisherList = () => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    name: '',
    address: ''
  });
  
  const limit = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 800);
  
  const fetcher = useCallback(async (url) => {
    const response = await axiosInstance.get(url);
    return response.data;
  }, []);

  // Memoized query string to prevent unnecessary re-renders
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    
    if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
    }
    
    if (sortBy) {
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
    }
    
    if (filters.name) {
      params.append('name', filters.name);
    }
    
    if (filters.address) {
      params.append('address', filters.address);
    }
    
    return params.toString();
  }, [page, limit, debouncedSearchTerm, sortBy, sortOrder, filters]);

  // SWR with optimized configuration to prevent flashing
  const { data, error, isLoading, isValidating } = useSWR(
    `/publishers?${queryString}`, 
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      dedupingInterval: 2000,
      keepPreviousData: true,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
      loadingTimeout: 10000,
      refreshInterval: 0,
      refreshWhenHidden: false,
      refreshWhenOffline: false
    }
  );

  // All hooks must be called before any conditional returns
  const deletePublisher = useCallback(async (publisherId) => {
    const currentPublishers = data?.data || [];
    if (window.confirm('Are you sure you want to delete this publisher?')) {
      try {
        await axiosInstance.delete(`/publishers/${publisherId}`);
        
        // Check if we need to go to previous page after deletion
        const currentItemsOnPage = currentPublishers.length;
        const isLastItemOnPage = currentItemsOnPage === 1;
        const isNotFirstPage = page > 1;
        
        if (isLastItemOnPage && isNotFirstPage) {
          setPage(page - 1);
        } else {
          mutate(`/publishers?${queryString}`);
        }
      } catch (error) {
        alert('Error deleting publisher: ' + (error.response?.data?.message || error.message));
      }
    }
  }, [data?.data, page, queryString, mutate]);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSortBy('id');
    setSortOrder('asc');
    setFilters({
      name: '',
      address: ''
    });
  }, []);
  
  const sortOptions = useMemo(() => [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Date Added' }
  ], []);
  
  const filterOptions = useMemo(() => ({
    name: {
      label: 'Name',
      type: 'text'
    },
    address: {
      label: 'Address',
      type: 'text'
    }
  }), []);
  
  // Reset page when search/filter changes (but not on initial load)
  const prevFiltersRef = React.useRef();
  useEffect(() => {
    const filtersChanged = prevFiltersRef.current && (
      prevFiltersRef.current.debouncedSearchTerm !== debouncedSearchTerm ||
      prevFiltersRef.current.sortBy !== sortBy ||
      prevFiltersRef.current.sortOrder !== sortOrder ||
      JSON.stringify(prevFiltersRef.current.filters) !== JSON.stringify(filters)
    );
    
    if (filtersChanged) {
      setPage(1);
    }
    
    prevFiltersRef.current = { debouncedSearchTerm, sortBy, sortOrder, filters };
  }, [debouncedSearchTerm, sortBy, sortOrder, filters]);

  // Show loading only on initial load, not on subsequent fetches
  if (isLoading && !data) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error && !data) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      Error loading publishers: {error.message}
    </div>
  );

  if (!data || !data.success) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      No data available
    </div>
  );

  const publishers = data.data || [];
  const pagination = data.pagination || {};
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Publishers</h1>
            {isValidating && data && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm">Updating...</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {pagination.totalItems ? `${pagination.totalItems} publishers found` : 'No publishers found'}
          </p>
        </div>
        <Link
          to="/publishers/add"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
        >
          Add Publisher
        </Link>
      </div>
      
      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        placeholder="Search publishers by name or address..."
      />
      
      {/* Publishers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {publishers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No publishers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(v => v) 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding a new publisher'}
            </p>
            {!searchTerm && !Object.values(filters).some(v => v) && (
              <div className="mt-6">
                <Link
                  to="/publishers/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Publisher
                </Link>
              </div>
            )}
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Address</th>
                <th className="px-6 py-3 font-medium">Books Count</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {publishers.map((publisher) => (
                <tr
                  className="hover:bg-gray-50 transition-colors duration-200"
                  key={publisher.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="max-w-xs truncate" title={publisher.name}>
                      {publisher.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="max-w-sm truncate" title={publisher.address}>
                      {publisher.address || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {publisher._count?.books || 0} books
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/publishers/edit/${publisher.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePublisher(publisher.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
      
      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={pagination.totalItems || 0}
        itemsPerPage={limit}
        itemName="publishers"
      />
    </div>
  );
};

export default PublisherList;
