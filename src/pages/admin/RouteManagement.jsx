import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Route as RouteIcon } from 'lucide-react';
import RouteFormModal from '../../components/RouteFormModal';
import { getRoutes } from '../../lib/db';

export default function RouteManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setRoutes(getRoutes());
  }, []);

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.end.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredRoutes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoutes = filteredRoutes.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <RouteIcon className="w-6 h-6 text-[var(--color-primary)]" />
            Route & Schedule Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage public transit routes, terminals, and frequencies.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Route
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search routes by name or terminal..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <th className="p-4 pl-6 whitespace-nowrap">Route Name</th>
                <th className="p-4 whitespace-nowrap">Start Terminal</th>
                <th className="p-4 whitespace-nowrap">End Terminal</th>
                <th className="p-4 whitespace-nowrap">Frequency</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 pr-6 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-gray-800 bg-gray-100 w-max px-3 py-1 rounded-lg border border-gray-200">
                        {route.name}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-600">{route.start}</td>
                    <td className="p-4 font-medium text-gray-600">{route.end}</td>
                    <td className="p-4 text-gray-500 text-sm">{route.frequency}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        route.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-flex items-center justify-center">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">
                    No routes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>Showing {filteredRoutes.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRoutes.length)} of {filteredRoutes.length} entries</div>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              
              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {totalPages <= 1 && filteredRoutes.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div>Showing all {filteredRoutes.length} entries</div>
          </div>
        )}
      </div>

      <RouteFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
