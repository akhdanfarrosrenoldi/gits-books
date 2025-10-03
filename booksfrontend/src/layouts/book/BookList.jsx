import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axios";
import useSWR, { useSWRConfig } from "swr";
import SearchFilter from "../../components/SearchFilter";
import Pagination from "../../components/Pagination";
import useDebounce from "../../hooks/useDebounce";

const BookList = () => {
  const { mutate } = useSWRConfig();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    authorId: '',
    publisherId: '',
    publishedYear_min: '',
    publishedYear_max: ''
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  
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
    
    if (filters.authorId) {
      params.append('authorId', filters.authorId);
    }
    
    if (filters.publisherId) {
      params.append('publisherId', filters.publisherId);
    }
    
    if (filters.publishedYear_min || filters.publishedYear_max) {
      const yearRange = `${filters.publishedYear_min || ''},${filters.publishedYear_max || ''}`;
      params.append('publishedYear', yearRange);
    }
    
    return params.toString();
  }, [page, limit, debouncedSearchTerm, sortBy, sortOrder, filters]);

  // SWR with optimized configuration to prevent flashing
  const { data, error, isLoading, isValidating } = useSWR(
    `/books?${queryString}`, 
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
  const deleteBook = useCallback(async (bookId) => {
    const currentBooks = data?.data || [];
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axiosInstance.delete(`/books/${bookId}`);
        
        // Check if we need to go to previous page after deletion
        const currentItemsOnPage = currentBooks.length;
        const isLastItemOnPage = currentItemsOnPage === 1;
        const isNotFirstPage = page > 1;
        
        if (isLastItemOnPage && isNotFirstPage) {
          setPage(page - 1);
        } else {
          mutate(`/books?${queryString}`);
        }
      } catch (error) {
        alert('Error deleting book: ' + (error.response?.data?.message || error.message));
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
      authorId: '',
      publisherId: '',
      publishedYear_min: '',
      publishedYear_max: ''
    });
  }, []);
  
  const sortOptions = useMemo(() => [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
    { value: 'publishedYear', label: 'Published Year' },
    { value: 'createdAt', label: 'Date Added' }
  ], []);
  
  const filterOptions = useMemo(() => ({
    authorId: {
      label: 'Author',
      type: 'select',
      options: authors.map(author => ({
        value: author.id,
        label: author.name
      }))
    },
    publisherId: {
      label: 'Publisher',
      type: 'select',
      options: publishers.map(publisher => ({
        value: publisher.id,
        label: publisher.name
      }))
    },
    publishedYear: {
      label: 'Published Year',
      type: 'range'
    }
  }), [authors, publishers]);
  
  // Load authors and publishers for filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [authorsRes, publishersRes] = await Promise.all([
          axiosInstance.get('/authors?limit=100'),
          axiosInstance.get('/publishers?limit=100')
        ]);
        
        if (authorsRes.data.success) {
          setAuthors(authorsRes.data.data);
        }
        
        if (publishersRes.data.success) {
          setPublishers(publishersRes.data.data);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };
    
    loadFilterOptions();
  }, []);
  
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
      Error loading books: {error.message}
    </div>
  );

  if (!data || !data.success) return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
      No data available
    </div>
  );

  const books = data.data || [];
  const pagination = data.pagination || {};
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Books</h1>
            {isValidating && data && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm">Updating...</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            {pagination.totalItems ? `${pagination.totalItems} books found` : 'No books found'}
          </p>
        </div>
        <Link
          to="/book/add"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
        >
          Add Book
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
        placeholder="Search books by title or description..."
      />
      
      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {books.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(v => v) 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding a new book'}
            </p>
            {!searchTerm && !Object.values(filters).some(v => v) && (
              <div className="mt-6">
                <Link
                  to="/book/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add Book
                </Link>
              </div>
            )}
          </div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Book Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Published Year</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium">Publisher</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr
                  className="hover:bg-gray-50 transition-colors duration-200"
                  key={book.id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="max-w-xs truncate" title={book.title}>
                      {book.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    <div className="max-w-xs truncate" title={book.description}>
                      {book.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{book.publishedYear}</td>
                  <td className="px-6 py-4 text-gray-500">{book.author?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">{book.publisher?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/book/edit/${book.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBook(book.id)}
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
        itemName="books"
      />
    </div>
  );
};

export default BookList;
