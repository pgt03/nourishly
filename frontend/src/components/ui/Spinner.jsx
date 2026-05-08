export default function Spinner({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-16 h-16' }[size];
  return (
    <div className={`${s} ${className} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="xl" />
      <p className="text-gray-500 text-sm animate-pulse">Loading…</p>
    </div>
  );
}
