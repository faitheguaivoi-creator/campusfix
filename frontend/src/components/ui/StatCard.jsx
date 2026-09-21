import clsx from 'clsx';

export default function StatCard({ label, value, icon: Icon, color = 'bg-lincoln-500' }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 truncate">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? 0}</p>
        </div>
        {Icon && (
          <div className={clsx('p-2.5 rounded-lg text-white flex-shrink-0', color)}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}