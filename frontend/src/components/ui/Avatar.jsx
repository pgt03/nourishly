export default function Avatar({ src, username, size = 'md' }) {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-3xl' };
  const cls = sizes[size] || sizes.md;
  const initials = username ? username.slice(0, 2).toUpperCase() : '?';
  if (src) return <img src={src} alt={username} className={`${cls} rounded-full object-cover ring-2 ring-white`} />;
  return (
    <div className={`${cls} rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-white ring-2 ring-white flex-shrink-0`}>
      {initials}
    </div>
  );
}
