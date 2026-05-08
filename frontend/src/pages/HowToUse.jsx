import { useState } from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'start',
    icon: '🚀',
    title: 'Getting Started',
    color: 'brand',
    steps: [
      {
        heading: 'Create your free account',
        body: 'Click "Sign up free" in the top navigation. Enter your name, email, and a password (min 6 characters). You\'re in instantly — no email verification needed.',
      },
      {
        heading: 'Sign in with Google',
        body: 'If your admin has configured Google OAuth, you\'ll see a "Continue with Google" button on the login and signup pages for one-click access.',
      },
      {
        heading: 'Demo accounts (for testing)',
        body: 'Use chef@demo.com / demo1234 or cook@demo.com / demo1234 to explore the app without creating an account.',
      },
    ],
  },
  {
    id: 'feed',
    icon: '🏠',
    title: 'The Recipe Feed',
    color: 'blue',
    steps: [
      {
        heading: 'Browse all recipes',
        body: 'The home page shows all community recipes, newest first, in a responsive grid. Each card shows the photo, title, difficulty, cook time, likes, and saves at a glance.',
      },
      {
        heading: 'Search by name or ingredient',
        body: 'Type any recipe name or ingredient into the search box. Results update live as you type — no need to press Enter.',
      },
      {
        heading: 'Filter recipes',
        body: 'Click ⚙️ Filters to narrow results by: Difficulty (Easy / Medium / Hard), Cuisine type, ⚡ Under 15 min, 💰 Budget meals, 👶 Kid-friendly. Multiple filters can be combined.',
      },
      {
        heading: 'Like & save from the feed',
        body: 'Click ❤️ to like a recipe or 🔖 to save it to your collection — without opening the full detail page.',
      },
    ],
  },
  {
    id: 'post',
    icon: '✍️',
    title: 'Posting a Recipe',
    color: 'green',
    steps: [
      {
        heading: 'Open the form',
        body: 'Click "+ Post Recipe" in the navbar (you must be logged in). Fill in the title, ingredients, steps, and other details.',
      },
      {
        heading: 'AI Description Generator',
        body: 'Once you\'ve entered a title and some ingredients, click "Generate with AI ✨". The AI writes a warm, appetising 2-sentence description in seconds. You can edit it or regenerate.',
      },
      {
        heading: 'What\'s in your fridge?',
        body: 'Expand the "What\'s in your fridge?" panel at the top of the form. Type your available ingredients (e.g. "eggs, spinach, tomato") and click Find Recipes. The AI suggests 3 meals you can cook right now. Click a suggestion to pre-fill the form.',
      },
      {
        heading: 'Add ingredients',
        body: 'Add each ingredient with name, amount, and unit. Use the "Can\'t find an ingredient?" link next to any ingredient to get AI-powered substitution suggestions.',
      },
      {
        heading: 'Tags & flags',
        body: 'Check the Budget, Under 15 min, or Kid-friendly boxes so your recipe appears in the right filtered views.',
      },
      {
        heading: 'Upload a photo',
        body: 'Add a JPG or PNG photo (max 5 MB). This appears on the recipe card in the feed and at the top of the detail page.',
      },
    ],
  },
  {
    id: 'detail',
    icon: '📖',
    title: 'Recipe Detail Page',
    color: 'orange',
    steps: [
      {
        heading: 'Open a recipe',
        body: 'Click any recipe card to open the full detail view — photo, description, complete ingredients list, step-by-step instructions, and metadata.',
      },
      {
        heading: 'Ingredient substitution',
        body: 'Click "Can\'t find an ingredient?" below the ingredients list. Select the ingredient you need to swap. The AI instantly suggests 2 practical alternatives with brief explanations.',
      },
      {
        heading: 'Like & save',
        body: 'Use the ❤️ Like and 🔖 Save buttons at the top of the page. Your saved recipes are accessible any time from the Saved page.',
      },
      {
        heading: 'Comments',
        body: 'Scroll to the bottom to read comments from other users or leave your own. You can delete your own comments at any time.',
      },
      {
        heading: 'Edit or delete (your recipes only)',
        body: 'If you posted the recipe, you\'ll see Edit and Delete buttons. Edit takes you back to the full recipe form with all fields pre-filled.',
      },
    ],
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI Features',
    color: 'purple',
    steps: [
      {
        heading: 'Recipe Description Generator',
        body: 'On the Post Recipe page, after entering a title and ingredients, click "Generate with AI ✨". Powered by Groq\'s Llama 3.1, it writes a concise, warm description in under 2 seconds.',
      },
      {
        heading: 'Ingredient Substitution',
        body: 'Available on both the Post Recipe form and Recipe Detail page. Pick any ingredient and get 2 realistic household alternatives with reasons why each works.',
      },
      {
        heading: 'Fridge Recipe Generator',
        body: 'The "What\'s in your fridge?" panel on the Post Recipe page lets you type whatever ingredients you have on hand. The AI suggests 3 practical recipes using those ingredients plus basic pantry staples.',
      },
    ],
  },
  {
    id: 'social',
    icon: '👥',
    title: 'Social Features',
    color: 'pink',
    steps: [
      {
        heading: 'User profiles',
        body: 'Click any recipe author\'s name or avatar to visit their public profile. You\'ll see their bio, join date, and all recipes they\'ve posted.',
      },
      {
        heading: 'Saved recipes',
        body: 'Click "🔖 Saved" in the navbar to view your saved collection. Unsave a recipe by clicking the bookmark icon again.',
      },
      {
        heading: 'Likes',
        body: 'Liked recipes show a ❤️ count. Your likes are visible to other users on the recipe card and detail page.',
      },
    ],
  },
  {
    id: 'settings',
    icon: '⚙️',
    title: 'Settings & Profile',
    color: 'gray',
    steps: [
      {
        heading: 'Update your profile',
        body: 'Click your username in the navbar → Settings. You can update your display name, bio, and password.',
      },
      {
        heading: 'Upload an avatar',
        body: 'In Settings, click the avatar area to upload a new profile photo (JPG/PNG, max 2 MB).',
      },
      {
        heading: 'Dark mode',
        body: 'Click the 🌙 / ☀️ icon in the top-right of the navbar to switch between dark and light themes. Your preference is saved automatically.',
      },
    ],
  },
];

const colorMap = {
  brand: { bg: 'bg-brand-100 dark:bg-brand-900/30', text: 'text-brand-700 dark:text-brand-300', border: 'border-brand-200 dark:border-brand-800' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  gray: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' },
};

function Section({ section }) {
  const [open, setOpen] = useState(true);
  const c = colorMap[section.color];
  return (
    <div className={`card border ${c.border} overflow-visible`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${c.bg} flex-shrink-0`}>
            {section.icon}
          </span>
          <h2 className={`text-xl font-bold ${c.text}`}>{section.title}</h2>
        </div>
        <span className={`text-xl transition-transform duration-200 ${open ? 'rotate-180' : ''} text-gray-400`}>▾</span>
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 animate-slide-up">
          {section.steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-7 h-7 rounded-full ${c.bg} ${c.text} text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{step.heading}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HowToUse() {
  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="text-5xl mb-4">📚</div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">How to Use Nourishly</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
          Everything you need to cook smarter, eat better, and share your favourite family recipes.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className={`badge cursor-pointer ${colorMap[s.color].bg} ${colorMap[s.color].text} border ${colorMap[s.color].border} hover:opacity-80 transition-opacity`}>
              {s.icon} {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(s => (
          <div key={s.id} id={s.id}>
            <Section section={s} />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 text-center card p-8 bg-gradient-to-br from-brand-50 to-warm-50 dark:from-brand-900/20 dark:to-gray-800 border-brand-100 dark:border-brand-800">
        <div className="text-4xl mb-3">🥗</div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to cook smarter?</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm">
          Join the Nourishly community — share recipes, discover new meals, and let AI help you cook better.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/signup" className="btn-primary">Get started free</Link>
          <Link to="/" className="btn-secondary">Browse recipes</Link>
        </div>
      </div>
    </div>
  );
}
