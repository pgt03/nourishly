/**
 * Nourishly End-User Playbook — PDF Generator
 * Run: node backend/scripts/generate-playbook.js
 * Output: Nourishly_User_Playbook.pdf (project root)
 */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../../Nourishly_User_Playbook.pdf');
const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Nourishly User Playbook', Author: 'Nourishly' } });
doc.pipe(fs.createWriteStream(OUT));

const GREEN = '#16a34a';
const DARK  = '#111827';
const GRAY  = '#6b7280';
const LIGHT = '#f0fdf4';
const ACCENT = '#059669';

function hr(y) {
  doc.moveTo(50, y || doc.y).lineTo(545, y || doc.y).stroke('#e5e7eb');
  doc.moveDown(0.5);
}

function sectionHeader(icon, title, color = GREEN) {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(1);
  doc.roundedRect(50, doc.y, 495, 38, 6).fill(LIGHT);
  doc.fillColor(color).fontSize(16).font('Helvetica-Bold')
    .text(`${icon}  ${title}`, 62, doc.y - 32, { lineBreak: false });
  doc.moveDown(1.2);
  doc.fillColor(DARK);
}

function step(num, heading, body) {
  if (doc.y > 700) doc.addPage();
  doc.moveDown(0.4);
  // Number bubble
  doc.circle(65, doc.y + 7, 9).fill(GREEN);
  doc.fillColor('white').fontSize(8).font('Helvetica-Bold').text(String(num), 62, doc.y - 2, { lineBreak: false });
  // Heading
  doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold').text(heading, 82, doc.y - 16);
  // Body
  doc.fillColor(GRAY).fontSize(10).font('Helvetica').text(body, 82, doc.y + 2, { width: 460, lineGap: 2 });
  doc.moveDown(0.6);
}

// ── Cover Page ──────────────────────────────────────────────────────────────
doc.rect(0, 0, 595, 280).fill(GREEN);
doc.fillColor('white').fontSize(42).font('Helvetica-Bold').text('🥗 Nourishly', 50, 80);
doc.fontSize(18).font('Helvetica').text('End-User Playbook', 50, 135);
doc.fontSize(12).fillColor('#bbf7d0')
  .text('AI-powered healthy cooking ecosystem', 50, 165)
  .text('helping busy modern families cook smarter,', 50, 183)
  .text('healthier, faster and more affordably.', 50, 201);
doc.fillColor('white').fontSize(10).text(`Generated ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, 50, 245);

doc.fillColor(DARK);
doc.y = 310;

// ── Table of Contents ────────────────────────────────────────────────────────
doc.fontSize(20).font('Helvetica-Bold').fillColor(DARK).text('Table of Contents', 50, doc.y);
doc.moveDown(0.8);
hr();
const toc = [
  ['1', 'Getting Started', ''],
  ['2', 'The Recipe Feed', ''],
  ['3', 'Posting a Recipe', ''],
  ['4', 'Recipe Detail Page', ''],
  ['5', 'AI Features', ''],
  ['6', 'Social Features', ''],
  ['7', 'Settings & Profile', ''],
  ['8', 'Dark Mode', ''],
  ['9', 'Quick Tips & FAQ', ''],
];
toc.forEach(([num, title]) => {
  doc.fillColor(DARK).fontSize(11).font('Helvetica')
    .text(`${num}.  ${title}`, 60, doc.y + 2);
  doc.moveDown(0.55);
});

doc.addPage();

// ── Section 1: Getting Started ──────────────────────────────────────────────
sectionHeader('🚀', '1. Getting Started');
step(1, 'Create your free account',
  'Open http://localhost:5173 in your browser. Click "Sign up free" in the top navigation bar. Enter your full name, email address, and a password (minimum 6 characters). You will be logged in immediately — no email verification is required.');
step(2, 'Sign in with Google',
  'If Google OAuth has been configured by your admin (GOOGLE_CLIENT_ID set in .env), a "Continue with Google" button will appear on both the Login and Sign Up pages. Click it to sign in with your Google account in one tap — no separate password needed.');
step(3, 'Log in to an existing account',
  'Click "Log in" in the top navigation. Enter your email and password. Use the 👁️ button to reveal your password if needed.');
step(4, 'Demo accounts for testing',
  'Two pre-loaded demo accounts are available:\n  • chef@demo.com / demo1234\n  • cook@demo.com / demo1234\nThese accounts contain sample recipes so you can explore the app without creating an account.');

// ── Section 2: The Recipe Feed ───────────────────────────────────────────────
sectionHeader('🏠', '2. The Recipe Feed');
step(1, 'Browse all community recipes',
  'The home page (/) shows all recipes from all users, sorted newest first, in a responsive card grid. Each card shows the photo, recipe title, difficulty badge, cook time, cuisine, like count, and save count.');
step(2, 'Search by name or ingredient',
  'Type any recipe name or ingredient into the search box at the top of the feed. Results update live as you type (with a short debounce delay). Click ✕ to clear the search.');
step(3, 'Use the filter panel',
  'Click the ⚙️ Filters button to expand the filter panel. You can filter by:\n  • Difficulty: Easy / Medium / Hard\n  • Cuisine type: Indian, Italian, Mexican, Chinese, etc.\n  • ⚡ Under 15 min: only quick meals\n  • 💰 Budget meals: affordable recipes\n  • 👶 Kid-friendly: family-safe options\nMultiple filters can be combined. An orange dot on the Filters button indicates active filters.');
step(4, 'Like and save from the feed',
  'Each recipe card has two action buttons:\n  • ❤️/🤍 Like button — tap to like or unlike a recipe\n  • 🔖/📑 Save button — tap to save or unsave a recipe to your personal collection\nYou do not need to open the full recipe to take these actions. You must be logged in to like or save.');

// ── Section 3: Posting a Recipe ──────────────────────────────────────────────
sectionHeader('✍️', '3. Posting a Recipe');
step(1, 'Open the Post Recipe form',
  'Click "+ Post Recipe" in the top navigation bar. You must be logged in. You will be redirected to the login page if you are not authenticated.');
step(2, 'Use "What\'s in your fridge?" AI generator',
  'At the top of the form, expand the "What\'s in your fridge?" panel. Type any ingredients you currently have (e.g. "eggs, spinach, tomato, onion"). Click "Find Recipes". The AI suggests 3 practical recipes using those ingredients plus common pantry staples. Click any suggestion to pre-fill the form with that recipe idea.');
step(3, 'Fill in the recipe title',
  'Enter a clear, descriptive recipe title. This is required and appears on recipe cards in the feed.');
step(4, 'Generate an AI description',
  'After entering a title and at least one ingredient, click the "Generate with AI ✨" button below the description field. The AI will write a warm, appetising 2-sentence description in seconds. You can edit the generated text or click the button again to regenerate.');
step(5, 'Add ingredients',
  'Click "+ Add ingredient" to add each ingredient with name, amount, and unit. Click the red × button to remove an ingredient. Use the "Can\'t find an ingredient?" link next to any ingredient row to get AI-powered substitution suggestions if you need to swap something out.');
step(6, 'Write the cooking steps',
  'Enter numbered step-by-step instructions. Each step should describe one action clearly.');
step(7, 'Set recipe metadata',
  'Fill in:\n  • Cook time (in minutes)\n  • Number of servings\n  • Difficulty: Easy / Medium / Hard\n  • Cuisine type (select from dropdown)');
step(8, 'Add lifestyle tags',
  'Check any that apply:\n  • 💰 Budget meal — affordable ingredients\n  • ⚡ Under 15 minutes — quick cook time\n  • 👶 Kid-friendly — suitable for children\nThese tags make your recipe appear in filtered searches.');
step(9, 'Upload a recipe photo',
  'Click the photo upload area to add an image. Supports JPG and PNG formats, maximum 5 MB. A photo significantly increases engagement with your recipe.');

// ── Section 4: Recipe Detail Page ────────────────────────────────────────────
sectionHeader('📖', '4. Recipe Detail Page');
step(1, 'Open a recipe',
  'Click anywhere on a recipe card to open the full detail page. You will see the full photo, complete description, all metadata, the full ingredients list, and numbered step-by-step instructions.');
step(2, 'Ingredient substitution',
  'Below the ingredients list, click "Can\'t find an ingredient?". Select the ingredient you need to swap from the dropdown. The AI instantly suggests 2 practical household alternatives with a brief explanation of why each works. This is especially useful when you\'re missing a specialist ingredient.');
step(3, 'Like and save',
  'The Like ❤️ and Save 🔖 buttons are prominently displayed on the recipe detail page. Your saved recipes are stored in your personal Saved collection.');
step(4, 'Leave a comment',
  'Scroll to the Comments section at the bottom. Type your comment in the input field and press Enter or click Post. You can delete your own comments using the × button next to each comment.');
step(5, 'Visit the author\'s profile',
  'Click the recipe author\'s avatar or username to visit their public profile. You will see all recipes they have shared with the community.');
step(6, 'Edit or delete (recipe owners only)',
  'If you are the author of the recipe, Edit and Delete buttons will appear near the top of the detail page. Editing takes you back to the full recipe form with all fields pre-populated. Deletion is immediate and cannot be undone.');

// ── Section 5: AI Features ────────────────────────────────────────────────────
sectionHeader('🤖', '5. AI Features', ACCENT);
step(1, 'Recipe Description Generator',
  'Location: Post Recipe form → Description field\nAfter entering a recipe title and at least one ingredient, click "Generate with AI ✨". Powered by Groq\'s Llama 3.1 model, the AI creates a warm, beginner-friendly 2-sentence description under 60 words. It considers the cuisine type and ingredients to make the description specific and appealing. You can regenerate as many times as you like.');
step(2, 'Ingredient Substitution',
  'Location: Post Recipe form (next to each ingredient) or Recipe Detail page (below ingredients list)\nSelect any ingredient and the AI suggests 2 realistic alternatives using common household items. Each suggestion includes a brief reason explaining why the substitute works. Particularly useful for hard-to-find or specialist ingredients.');
step(3, '"What\'s in your fridge?" Recipe Generator',
  'Location: Post Recipe form → collapsible panel at the top\nType ingredients you have available, separated by commas (e.g. "chicken, lemon, garlic, spinach"). Click "Find Recipes". The AI generates 3 practical recipe suggestions using those ingredients plus basic pantry staples (oil, salt, pepper, garlic). Each suggestion shows the name, a brief description, estimated cook time, and difficulty level. Click any suggestion to instantly pre-fill the Post Recipe form.');

// ── Section 6: Social Features ────────────────────────────────────────────────
sectionHeader('👥', '6. Social Features');
step(1, 'Public user profiles',
  'Every user has a public profile page accessible by clicking their name or avatar anywhere in the app. Profiles show the user\'s display name, bio, join date, avatar, and all recipes they have posted.');
step(2, 'Saved Recipes collection',
  'Click "🔖 Saved" in the top navigation to view all recipes you have saved. The page shows them in the same card grid layout as the feed. Click the save button again on any recipe to remove it from your collection.');
step(3, 'Liking recipes',
  'Likes show appreciation for a recipe and appear on both the recipe card (in the feed) and the recipe detail page. The total like count is visible to all users.');
step(4, 'Comments',
  'Each recipe has a comments section. Leave feedback, ask questions, or share tips. Comments appear in chronological order. You can only delete your own comments.');

// ── Section 7: Settings & Profile ────────────────────────────────────────────
sectionHeader('⚙️', '7. Settings & Profile');
step(1, 'Access Settings',
  'Click your username or avatar in the top-right navigation bar to open the dropdown menu. Select "⚙️ Settings" to open the settings page.');
step(2, 'Update your display name',
  'Enter a new username in the Display Name field. Usernames must be unique across all Nourishly accounts. Click Save to apply the change.');
step(3, 'Update your bio',
  'Write a short bio about yourself in the Bio text area. This appears on your public profile page visible to other users.');
step(4, 'Change your password',
  'Enter your current password, then your new password (minimum 6 characters), and confirm the new password. Click Update Password to apply the change.');
step(5, 'Upload a profile avatar',
  'Click on the avatar circle at the top of the Settings page to upload a new profile photo. Accepts JPG and PNG formats, maximum 2 MB. Your avatar appears next to your name throughout the app.');

// ── Section 8: Dark Mode ──────────────────────────────────────────────────────
sectionHeader('🌙', '8. Dark Mode');
step(1, 'Toggle dark / light mode',
  'Click the moon 🌙 icon (light mode) or sun ☀️ icon (dark mode) in the top-right corner of the navigation bar. The entire app theme switches instantly.');
step(2, 'Automatic preference detection',
  'On first visit, Nourishly automatically detects your operating system\'s dark/light mode preference and applies it. On Windows 11: Settings → Personalisation → Colours → Choose your mode.');
step(3, 'Preference is saved',
  'Your dark/light mode choice is saved in your browser\'s local storage. It will be remembered the next time you visit, even after closing the browser.');

// ── Section 9: Quick Tips & FAQ ──────────────────────────────────────────────
sectionHeader('💡', '9. Quick Tips & FAQ', '#d97706');
doc.moveDown(0.3);
const faq = [
  ['Do I need an account to browse recipes?', 'No. The recipe feed and all recipe detail pages are publicly visible. However, you must be logged in to post recipes, like, save, comment, or use AI features.'],
  ['Can I use the app on mobile?', 'Yes. Nourishly is fully responsive and works on mobile browsers. The layout adapts to smaller screens automatically.'],
  ['What if the AI description button doesn\'t work?', 'Check that the GROQ_AI_KEY is configured in the backend .env file. If AI is unavailable, the button shows "AI unavailable — write a description manually" and you can simply type your own description.'],
  ['How do I delete my account?', 'Account deletion is not available in the current version. Contact your system administrator.'],
  ['Can I edit a recipe after posting?', 'Yes. Open the recipe detail page and click the Edit button (only visible to the recipe author). All fields can be updated including the photo.'],
  ['What image formats are supported?', 'JPG and PNG for both recipe photos (max 5 MB) and profile avatars (max 2 MB).'],
  ['How does the fridge recipe generator work?', 'Type whatever ingredients you have available, click "Find Recipes", and the AI suggests 3 meals you can cook using those ingredients plus basic pantry staples like oil, salt, pepper, and garlic.'],
];
faq.forEach(([q, a], i) => {
  if (doc.y > 680) doc.addPage();
  doc.fillColor(GREEN).fontSize(11).font('Helvetica-Bold').text(`Q${i+1}: ${q}`, 60, doc.y);
  doc.moveDown(0.2);
  doc.fillColor(GRAY).fontSize(10).font('Helvetica').text(a, 60, doc.y, { width: 475, lineGap: 2 });
  doc.moveDown(0.7);
});

// ── Back cover ────────────────────────────────────────────────────────────────
doc.addPage();
doc.rect(0, 0, 595, 842).fill(GREEN);
doc.fillColor('white').fontSize(36).font('Helvetica-Bold').text('🥗', 50, 320, { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(24).text('Nourishly', { align: 'center' });
doc.moveDown(0.4);
doc.fontSize(13).font('Helvetica').fillColor('#bbf7d0')
  .text('Cook Better. Live Better.', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(11).fillColor('white')
  .text('http://localhost:5173', { align: 'center', link: 'http://localhost:5173' });

doc.end();
console.log(`\n✅  PDF generated: ${OUT}\n`);
