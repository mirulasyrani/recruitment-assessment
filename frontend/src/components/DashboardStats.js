import { Users, UserCheck, UserX, Clock, Award } from 'lucide-react';

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const DashboardStats = ({ candidates }) => {
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === 'hired').length;
  const rejected = candidates.filter(c => c.status === 'rejected').length;
  const inProgress = total - hired - rejected;
  const hireRate = total > 0 ? ((hired / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard icon={<Users />} title="Total Candidates" value={total} color="blue" />
      <StatCard icon={<Clock />} title="In Progress" value={inProgress} color="yellow" />
      <StatCard icon={<UserCheck />} title="Hired" value={hired} color="green" />
      <StatCard icon={<UserX />} title="Rejected" value={rejected} color="red" />
      <StatCard icon={<Award />} title="Hire Rate" value={`${hireRate}%`} color="purple" />
    </div>
  );
};

export default DashboardStats;
