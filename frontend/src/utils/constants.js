export const COMPLAINT_STATUSES = {
  submitted:    { label: 'Submitted',    color: 'gray' },
  under_review: { label: 'Under Review', color: 'amber' },
  assigned:     { label: 'Assigned',     color: 'blue' },
  in_progress:  { label: 'In Progress',  color: 'indigo' },
  resolved:     { label: 'Resolved',     color: 'green' },
  closed:       { label: 'Closed',       color: 'gray' },
};

export const COMPLAINT_PRIORITIES = {
  low:    { label: 'Low',    color: 'gray' },
  medium: { label: 'Medium', color: 'yellow' },
  high:   { label: 'High',   color: 'orange' },
  urgent: { label: 'Urgent', color: 'red' },
};

export const LOST_FOUND_STATUSES = {
  active:   { label: 'Active',   color: 'blue' },
  matched:  { label: 'Matched',  color: 'amber' },
  returned: { label: 'Returned', color: 'green' },
  closed:   { label: 'Closed',   color: 'gray' },
};

export const CONTACT_STATUSES = {
  pending:  { label: 'Pending',  color: 'amber' },
  accepted: { label: 'Accepted', color: 'green' },
  declined: { label: 'Declined', color: 'red' },
  resolved: { label: 'Resolved', color: 'gray' },
};

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d)) return '—';
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function titleCase(value) {
  if (!value) return '';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}