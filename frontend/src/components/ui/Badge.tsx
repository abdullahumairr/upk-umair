interface BadgeProps {
  label: string;
  variant?: 'easy' | 'medium' | 'hard' | 'published' | 'draft' | 'default';
}

const variants = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
  published: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
  default: 'bg-gray-100 text-gray-600',
};

const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  );
};

export default Badge;