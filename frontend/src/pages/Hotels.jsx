import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {HotelCard, HotelFilters} from '../components/index';

import { getHotels, setPage } from '../redux/slices/hotelSlice';

export default function Hotels() {
  const dispatch = useDispatch();
  const { hotels, loading, error, pages, currentPage, filters } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    dispatch(getHotels({ ...filters, page: currentPage }));
  }, [filters, currentPage, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Find Your Perfect Hotel</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div>
          <HotelFilters />
        </div>

        {/* Hotels List */}
        <div className="lg:col-span-3">
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && hotels.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No hotels found matching your filters</p>
            </div>
          )}

          {!loading && hotels.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => dispatch(setPage(currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => dispatch(setPage(page))}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => dispatch(setPage(currentPage + 1))}
                    disabled={currentPage === pages}
                    className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}