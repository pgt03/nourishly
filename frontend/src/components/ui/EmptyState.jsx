export default function EmptyState({ emoji = '🍽️', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6">{message}</p>
      {action}
    </div>
  );
}
