import { useState } from 'react';
import { aiAPI } from '../../api/client';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

export default function IngredientSubBtn({ ingredients, cuisineType }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState(null);

  const find = async () => {
    if (!selected) { toast.error('Select an ingredient'); return; }
    setLoading(true);
    setSubs(null);
    try {
      const res = await aiAPI.ingredientSub({ ingredient: selected, cuisine_type: cuisineType });
      setSubs(res.data.substitutes);
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI unavailable');
    } finally { setLoading(false); }
  };

  const ingredientNames = ingredients?.map(i => i.name || i).filter(Boolean) || [];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
      >
        🔄 Can't find an ingredient?
      </button>

      <Modal isOpen={open} onClose={() => { setOpen(false); setSubs(null); setSelected(''); }} title="🔄 Ingredient Substitutes">
        <p className="text-sm text-gray-500 mb-4">Select an ingredient to find practical substitutes.</p>
        <select
          className="input-field mb-4"
          value={selected}
          onChange={e => { setSelected(e.target.value); setSubs(null); }}
        >
          <option value="">Select an ingredient…</option>
          {ingredientNames.map((name, i) => <option key={i} value={name}>{name}</option>)}
        </select>
        <button onClick={find} disabled={!selected || loading} className="btn-primary w-full mb-4">
          {loading ? <span className="flex items-center justify-center gap-2"><Spinner size="sm" /> Finding substitutes…</span> : '✨ Find Substitutes'}
        </button>
        {subs && (
          <div className="space-y-3 animate-fade-in">
            {subs.map((s, i) => (
              <div key={i} className="p-3 bg-indigo-50 rounded-xl">
                <p className="font-semibold text-indigo-800 text-sm">✅ {s.substitute}</p>
                {s.reason && <p className="text-xs text-indigo-600 mt-1">{s.reason}</p>}
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
