import clsx from 'clsx';

const COLOR_MAP = {
  gray:   'bg-gray-100 text-gray-700 border-gray-200',
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  amber:  'bg-amber-50 text-amber-700 border-amber-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  red:    'bg-lincoln-50 text-lincoln-700 border-lincoln-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

export default function Badge({ color = 'gray', children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        COLOR_MAP[color] || COLOR_MAP.gray,
        className
      )}
    >
      {children}
    </span>
  );
}