import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function RouteManagement() {
  const routes = [
    { id: '32', name: 'Giap Bat - Nhon', type: 'Electric', frequency: '10-15 mins', status: 'Active' },
    { id: '14', name: 'Bo Ho - Co Nhue', type: 'Standard', frequency: '15-20 mins', status: 'Active' },
    { id: '01', name: 'Gia Lam - Yen Nghia', type: 'Standard', frequency: '10 mins', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Route & Schedule Management</h2>
        <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-primary-dark)] transition-colors shadow-md">
          <Plus className="w-5 h-5" />
          Create New Route
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Route ID</th>
                <th className="px-6 py-4">Name / Path</th>
                <th className="px-6 py-4">Bus Type</th>
                <th className="px-6 py-4">Frequency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routes.map((route, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 font-bold px-3 py-1 rounded-lg">{route.id}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{route.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${route.type === 'Electric' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {route.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{route.frequency}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-600">{route.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
