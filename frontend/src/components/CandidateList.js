import { Edit, Trash2, Loader2, User, Mail, Briefcase, Star } from 'lucide-react';

const CandidateList = ({ candidates, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow-md">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700">No Candidates Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or add a new candidate to get started.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      screening: 'bg-purple-100 text-purple-800',
      interview: 'bg-yellow-100 text-yellow-800',
      offer: 'bg-orange-100 text-orange-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Position</th>
              <th scope="col" className="px-6 py-3">Experience</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    {candidate.name}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Mail className="w-3 h-3 mr-2" />
                    {candidate.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    {candidate.position}
                   </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-gray-400" />
                    {candidate.experience_years} years
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusColor(candidate.status)}`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(candidate)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(candidate.id)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;
