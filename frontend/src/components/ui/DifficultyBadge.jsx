export default function DifficultyBadge({ difficulty }) {
  if (!difficulty) return null;
  const styles = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700'
  };
  return <span className={`badge ${styles[difficulty] || 'bg-gray-100 text-gray-600'}`}>{difficulty}</span>;
}
