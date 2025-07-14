import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import useDebounce from '../hooks/useDebounce';
import DashboardStats from '../components/DashboardStats';
import CandidateList from '../components/CandidateList';
import CandidateFormModal from '../components/CandidateFormModal';
import { Plus, Search, X } from 'lucide-react';

const DashboardPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearchTerm) params.q = debouncedSearchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const { data } = await api.get('/candidates', { params });
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to fetch candidates.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const handleAdd = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.delete(`/candidates/${id}`);
        toast.success('Candidate deleted successfully!');
        fetchCandidates();
      } catch (error) {
        toast.error('Failed to delete candidate.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchCandidates();
  };
  
  const clearFilters = () => {
      setSearchTerm('');
      setStatusFilter('');
  }

  return (
    <div className="space-y-6">
      <DashboardStats candidates={candidates} />
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, position, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2 md:col-span-1 justify-end">
            {(searchTerm || statusFilter) && (
                <button
                    onClick={clearFilters}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <X className="h-5 w-5 mr-1" /> Clear
                </button>
            )}
            <button
              onClick={handleAdd}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Candidate
            </button>
          </div>
        </div>
      </div>

      <CandidateList
        candidates={candidates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {isModalOpen && (
        <CandidateFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          candidate={editingCandidate}
        />
      )}
    </div>
  );
};

export default DashboardPage;
