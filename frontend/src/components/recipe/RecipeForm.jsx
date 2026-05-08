import { useState, useRef } from 'react';
import { CUISINES, DIFFICULTIES, TAGS } from '../../utils/formatters';
import AIDescriptionBtn from '../ai/AIDescriptionBtn';
import FridgeAIPanel from '../ai/FridgeAIPanel';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';

const EMPTY_ING = () => ({ amount: '', unit: '', name: '' });
const EMPTY_STEP = () => '';

export default function RecipeForm({ initialValues = {}, onSubmit, submitLabel = 'Post Recipe', loading = false }) {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [ingredients, setIngredients] = useState(initialValues.ingredients?.length ? initialValues.ingredients : [EMPTY_ING()]);
  const [steps, setSteps] = useState(initialValues.steps?.length ? initialValues.steps : ['']);
  const [cuisineType, setCuisineType] = useState(initialValues.cuisine_type || '');
  const [cookTime, setCookTime] = useState(initialValues.cook_time || '');
  const [prepTime, setPrepTime] = useState(initialValues.prep_time || '');
  const [servings, setServings] = useState(initialValues.servings || '');
  const [difficulty, setDifficulty] = useState(initialValues.difficulty || '');
  const [tags, setTags] = useState(initialValues.tags || []);
  const [isBudget, setIsBudget] = useState(initialValues.is_budget || false);
  const [isKidFriendly, setIsKidFriendly] = useState(initialValues.is_kid_friendly || false);
  const [isFifteenMin, setIsFifteenMin] = useState(initialValues.is_fifteen_min || false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(initialValues.photo_url || null);
  const fileRef = useRef();

  // Ingredients helpers
  const setIng = (i, k, v) => setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [k]: v } : ing));
  const addIng = () => setIngredients(prev => [...prev, EMPTY_ING()]);
  const removeIng = (i) => setIngredients(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  // Steps helpers
  const setStep = (i, v) => setSteps(prev => prev.map((s, idx) => idx === i ? v : s));
  const addStep = () => setSteps(prev => [...prev, '']);
  const removeStep = (i) => setSteps(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleTag = (tag) => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleFridgeSuggestion = (suggestion) => {
    if (suggestion.name) setTitle(suggestion.name);
    if (suggestion.description) setDescription(suggestion.description);
    if (suggestion.cook_time) setCookTime(String(suggestion.cook_time));
    if (suggestion.difficulty) setDifficulty(suggestion.difficulty);
    toast.success('Recipe details filled from AI suggestion!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validIngs = ingredients.filter(i => i.name.trim());
    const validSteps = steps.filter(s => s.trim());
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!validIngs.length) { toast.error('Add at least one ingredient'); return; }
    if (!validSteps.length) { toast.error('Add at least one step'); return; }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('ingredients', JSON.stringify(validIngs));
    formData.append('steps', JSON.stringify(validSteps));
    formData.append('tags', JSON.stringify(tags));
    if (cuisineType) formData.append('cuisine_type', cuisineType);
    if (cookTime) formData.append('cook_time', cookTime);
    if (prepTime) formData.append('prep_time', prepTime);
    if (servings) formData.append('servings', servings);
    if (difficulty) formData.append('difficulty', difficulty);
    formData.append('is_budget', String(isBudget));
    formData.append('is_kid_friendly', String(isKidFriendly));
    formData.append('is_fifteen_min', String(isFifteenMin));
    if (photo) formData.append('photo', photo);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Fridge AI */}
      <FridgeAIPanel onSelectRecipe={handleFridgeSuggestion} />

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Recipe Title *</label>
        <input className="input-field text-lg font-medium" placeholder="e.g. Mango Lassi, Nonna's Pasta…" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      {/* Photo */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">Recipe Photo</label>
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/30 transition-all"
        >
          {photoPreview ? (
            <div className="relative">
              <img src={photoPreview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-cover" />
              <p className="text-xs text-gray-400 mt-2">Click to change photo</p>
            </div>
          ) : (
            <>
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm font-medium text-gray-600">Click to upload a photo</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      {/* Description + AI */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-800">Description</label>
          <AIDescriptionBtn
            title={title}
            ingredients={ingredients.filter(i => i.name)}
            cuisineType={cuisineType}
            onResult={setDescription}
          />
        </div>
        <textarea
          className="input-field min-h-[100px] resize-y"
          placeholder="Describe your recipe — or click Generate with AI ✨"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Ingredients *</label>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center animate-fade-in">
              <input className="input-field w-20 text-center" placeholder="Qty" value={ing.amount} onChange={e => setIng(i, 'amount', e.target.value)} />
              <input className="input-field w-24 text-center" placeholder="Unit" value={ing.unit} onChange={e => setIng(i, 'unit', e.target.value)} />
              <input className="input-field flex-1" placeholder="Ingredient name *" value={ing.name} onChange={e => setIng(i, 'name', e.target.value)} />
              <button type="button" onClick={() => removeIng(i)} className="text-gray-300 hover:text-red-400 transition-colors text-xl flex-shrink-0" title="Remove">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addIng} className="mt-3 text-sm text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
          + Add ingredient
        </button>
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Steps *</label>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start animate-fade-in">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-3">{i + 1}</span>
              <textarea
                className="input-field flex-1 resize-none"
                placeholder={`Step ${i + 1}…`}
                rows={2}
                value={step}
                onChange={e => setStep(i, e.target.value)}
              />
              <button type="button" onClick={() => removeStep(i)} className="text-gray-300 hover:text-red-400 transition-colors text-xl flex-shrink-0 mt-3" title="Remove">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStep} className="mt-3 text-sm text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
          + Add step
        </button>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Cuisine</label>
          <select className="input-field text-sm" value={cuisineType} onChange={e => setCuisineType(e.target.value)}>
            <option value="">Any</option>
            {CUISINES.filter(c => c !== 'Any').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Difficulty</label>
          <select className="input-field text-sm" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="">Select…</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Cook Time (min)</label>
          <input type="number" className="input-field text-sm" placeholder="30" min={1} value={cookTime} onChange={e => setCookTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Prep Time (min)</label>
          <input type="number" className="input-field text-sm" placeholder="15" min={1} value={prepTime} onChange={e => setPrepTime(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Servings</label>
          <input type="number" className="input-field text-sm" placeholder="4" min={1} value={servings} onChange={e => setServings(e.target.value)} />
        </div>
      </div>

      {/* Special tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-3">Special Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: '⚡ Under 15 minutes', val: isFifteenMin, set: setIsFifteenMin },
            { label: '💰 Budget meal', val: isBudget, set: setIsBudget },
            { label: '👶 Kid-friendly', val: isKidFriendly, set: setIsKidFriendly },
          ].map(({ label, val, set }) => (
            <button key={label} type="button" onClick={() => set(!val)} className={`badge border cursor-pointer transition-all ${val ? 'bg-brand-100 text-brand-700 border-brand-300' : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-300'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(t => (
            <button key={t} type="button" onClick={() => toggleTag(t)} className={`badge border cursor-pointer transition-all text-xs ${tags.includes(t) ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2">
        {loading ? <><Spinner size="sm" /> Saving…</> : submitLabel}
      </button>
    </form>
  );
}
