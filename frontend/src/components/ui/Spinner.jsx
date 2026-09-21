export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-4 border-lincoln-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}