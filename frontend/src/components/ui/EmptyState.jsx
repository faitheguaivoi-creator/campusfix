import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  message,
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Icon size={24} className="text-gray-400" />
      </div>
      <p className="font-medium text-gray-700">{title}</p>
      {message && <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}