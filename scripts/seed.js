/**
 * Seed script — creates demo accounts and 8 sample recipes
 * Run: node scripts/seed.js
 */
// Run from backend dir so node_modules resolve correctly
process.chdir(require('path').join(__dirname, '../backend'));
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { getDb } = require('./src/db/database');

async function seed() {
  const db = getDb();
  console.log('\n🌱 Seeding Nourishly demo data…\n');

  // Create demo users
  const pass1 = await bcrypt.hash('demo1234', 10);
  const pass2 = await bcrypt.hash('demo1234', 10);

  let u1, u2;
  try {
    u1 = db.prepare('INSERT INTO users (email, username, password, bio) VALUES (?,?,?,?)').run(
      'chef@demo.com', 'homeChef', pass1, 'Passionate home cook sharing simple, healthy recipes for busy families.'
    );
    console.log('✅ User 1: homeChef (chef@demo.com / demo1234)');
  } catch { u1 = { lastInsertRowid: db.prepare("SELECT id FROM users WHERE email='chef@demo.com'").get().id }; console.log('ℹ️  User 1 already exists'); }

  try {
    u2 = db.prepare('INSERT INTO users (email, username, password, bio) VALUES (?,?,?,?)').run(
      'cook@demo.com', 'dailyCook', pass2, 'Quick weeknight meals and budget-friendly cooking ideas.'
    );
    console.log('✅ User 2: dailyCook (cook@demo.com / demo1234)');
  } catch { u2 = { lastInsertRowid: db.prepare("SELECT id FROM users WHERE email='cook@demo.com'").get().id }; console.log('ℹ️  User 2 already exists'); }

  const uid1 = u1.lastInsertRowid;
  const uid2 = u2.lastInsertRowid;

  const recipes = [
    {
      user_id: uid1, title: 'Mango Lassi', cuisine_type: 'Indian',
      description: 'A creamy, refreshing yogurt drink bursting with ripe mango flavour — the perfect cooling treat for a hot day or a sweet breakfast alongside your morning toast.',
      ingredients: JSON.stringify([{ amount: '2', unit: 'cups', name: 'plain yogurt' }, { amount: '1', unit: 'cup', name: 'ripe mango chunks' }, { amount: '2', unit: 'tbsp', name: 'sugar' }, { amount: '1/2', unit: 'cup', name: 'cold milk' }, { amount: '4-5', unit: '', name: 'ice cubes' }]),
      steps: JSON.stringify(['Add mango chunks, yogurt, milk, and sugar into a blender.', 'Blend on high speed for 60 seconds until completely smooth.', 'Taste and adjust sugar as needed.', 'Pour over ice cubes and serve immediately.']),
      tags: JSON.stringify(['Vegetarian', 'Quick']), cook_time: 5, prep_time: 5, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, save_count: 12, like_count: 8
    },
    {
      user_id: uid1, title: "Nonna's Pasta Pomodoro", cuisine_type: 'Italian',
      description: 'This timeless Italian classic with sweet tomatoes and fresh basil is the weeknight hero your family will ask for again and again — simple, soulful, and ready in 20 minutes.',
      ingredients: JSON.stringify([{ amount: '400g', unit: '', name: 'spaghetti' }, { amount: '400g', unit: '', name: 'crushed tomatoes (canned)' }, { amount: '4', unit: 'cloves', name: 'garlic' }, { amount: '3', unit: 'tbsp', name: 'olive oil' }, { amount: '1', unit: 'handful', name: 'fresh basil' }, { amount: '', unit: 'to taste', name: 'salt and pepper' }]),
      steps: JSON.stringify(['Cook spaghetti in heavily salted boiling water until al dente. Reserve 1 cup pasta water.', 'Heat olive oil in a large pan, add sliced garlic and cook on low heat until golden.', 'Add crushed tomatoes, season generously, and simmer for 10 minutes.', 'Toss drained pasta in the sauce with a splash of pasta water.', 'Top with fresh basil and a drizzle of olive oil.']),
      tags: JSON.stringify(['Vegetarian']), cook_time: 20, prep_time: 5, servings: 4, difficulty: 'Easy', is_fifteen_min: 0, save_count: 24, like_count: 19
    },
    {
      user_id: uid2, title: 'Chicken Stir-Fry with Vegetables', cuisine_type: 'Chinese',
      description: 'A vibrant, protein-packed stir-fry that gets dinner on the table in under 15 minutes — colourful vegetables and tender chicken in a savory ginger-garlic sauce.',
      ingredients: JSON.stringify([{ amount: '300g', unit: '', name: 'chicken breast, sliced thin' }, { amount: '1', unit: 'cup', name: 'broccoli florets' }, { amount: '1', unit: '', name: 'bell pepper, sliced' }, { amount: '2', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tbsp', name: 'oyster sauce' }, { amount: '2', unit: 'cloves', name: 'garlic, minced' }, { amount: '1', unit: 'tsp', name: 'fresh ginger, grated' }, { amount: '2', unit: 'tbsp', name: 'vegetable oil' }]),
      steps: JSON.stringify(['Mix soy sauce and oyster sauce in a small bowl. Set aside.', 'Heat oil in a wok or large skillet over high heat.', 'Add chicken and stir-fry for 4-5 minutes until cooked through. Remove from wok.', 'Add garlic and ginger, stir for 30 seconds until fragrant.', 'Add vegetables and stir-fry for 3 minutes until tender-crisp.', 'Return chicken to wok, pour sauce over, toss everything together for 1 minute.', 'Serve immediately over steamed rice.']),
      tags: JSON.stringify(['High-Protein', 'Quick']), cook_time: 15, prep_time: 10, servings: 3, difficulty: 'Easy', is_fifteen_min: 1, save_count: 18, like_count: 14
    },
    {
      user_id: uid2, title: 'One-Pan Budget Dal', cuisine_type: 'Indian',
      description: 'Hearty, warming red lentil dal with gently spiced tomatoes and creamy coconut — a deeply nutritious meal that costs almost nothing and feeds a family of four.',
      ingredients: JSON.stringify([{ amount: '1', unit: 'cup', name: 'red lentils, rinsed' }, { amount: '400g', unit: '', name: 'canned diced tomatoes' }, { amount: '1', unit: '', name: 'onion, diced' }, { amount: '3', unit: 'cloves', name: 'garlic' }, { amount: '1', unit: 'tsp', name: 'cumin' }, { amount: '1', unit: 'tsp', name: 'turmeric' }, { amount: '1/2', unit: 'tsp', name: 'chili flakes' }, { amount: '200ml', unit: '', name: 'coconut milk' }, { amount: '2', unit: 'cups', name: 'water' }]),
      steps: JSON.stringify(['Sauté onion in oil until golden, about 5 minutes.', 'Add garlic and spices, cook for 1 minute until fragrant.', 'Add lentils, tomatoes, and water. Bring to a boil.', 'Reduce heat and simmer 15-20 minutes until lentils are soft.', 'Stir in coconut milk, simmer 5 more minutes.', 'Season with salt and serve with flatbread or rice.']),
      tags: JSON.stringify(['Vegan', 'Budget', 'High-Protein']), cook_time: 30, prep_time: 10, servings: 4, difficulty: 'Easy', is_budget: 1, save_count: 31, like_count: 22
    },
    {
      user_id: uid1, title: 'Greek Salad with Feta', cuisine_type: 'Mediterranean',
      description: 'Crisp cucumbers, juicy tomatoes, briny olives, and creamy feta come together in this classic Greek salad that is refreshing, satisfying, and on the table in 10 minutes flat.',
      ingredients: JSON.stringify([{ amount: '2', unit: 'large', name: 'tomatoes, chopped' }, { amount: '1', unit: '', name: 'cucumber, chopped' }, { amount: '1/2', unit: '', name: 'red onion, thinly sliced' }, { amount: '100g', unit: '', name: 'feta cheese, crumbled' }, { amount: '1/2', unit: 'cup', name: 'Kalamata olives' }, { amount: '3', unit: 'tbsp', name: 'olive oil' }, { amount: '1', unit: 'tbsp', name: 'red wine vinegar' }, { amount: '', unit: 'to taste', name: 'dried oregano, salt and pepper' }]),
      steps: JSON.stringify(['Chop tomatoes, cucumber, and red onion into rough chunks.', 'Toss all vegetables with olive oil, vinegar, salt, and pepper.', 'Top with olives and crumbled feta cheese.', 'Sprinkle with oregano and serve.']),
      tags: JSON.stringify(['Vegetarian', 'Gluten-Free', 'Quick']), cook_time: 10, prep_time: 10, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, save_count: 15, like_count: 11
    },
    {
      user_id: uid2, title: 'Banana Oat Pancakes', cuisine_type: 'American',
      description: 'These fluffy, naturally sweet pancakes are made with just oats and bananas — a wholesome, kid-approved breakfast that is gluten-free, filling, and endlessly customisable.',
      ingredients: JSON.stringify([{ amount: '2', unit: '', name: 'ripe bananas' }, { amount: '1', unit: 'cup', name: 'rolled oats' }, { amount: '2', unit: '', name: 'eggs' }, { amount: '1', unit: 'tsp', name: 'vanilla extract' }, { amount: '1/2', unit: 'tsp', name: 'cinnamon' }, { amount: '', unit: '', name: 'butter or oil for frying' }]),
      steps: JSON.stringify(['Blend bananas, oats, eggs, vanilla, and cinnamon until smooth.', 'Let batter rest for 2 minutes.', 'Heat a non-stick pan on medium-low and grease lightly.', 'Pour small rounds of batter, cook 2-3 minutes per side until golden.', 'Serve with honey, fresh fruit, or maple syrup.']),
      tags: JSON.stringify(['Vegetarian', 'Gluten-Free', 'Kid-Friendly']), cook_time: 15, prep_time: 5, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, is_kid_friendly: 1, save_count: 27, like_count: 20
    },
    {
      user_id: uid1, title: 'Spicy Thai Peanut Noodles', cuisine_type: 'Thai',
      description: 'These satisfying cold noodles in a creamy peanut-sesame sauce are bold, fresh, and endlessly versatile — toss in any vegetables you have on hand for a 20-minute weeknight winner.',
      ingredients: JSON.stringify([{ amount: '200g', unit: '', name: 'rice noodles or spaghetti' }, { amount: '3', unit: 'tbsp', name: 'peanut butter' }, { amount: '2', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tbsp', name: 'sesame oil' }, { amount: '1', unit: 'tbsp', name: 'rice vinegar' }, { amount: '1', unit: 'tsp', name: 'chili paste or sriracha' }, { amount: '1', unit: 'clove', name: 'garlic, minced' }, { amount: '1', unit: 'tbsp', name: 'honey' }, { amount: '2', unit: 'stalks', name: 'spring onion, sliced' }]),
      steps: JSON.stringify(['Cook noodles per package instructions. Rinse under cold water, drain.', 'Whisk together peanut butter, soy sauce, sesame oil, vinegar, chili paste, garlic, and honey. Add 2-3 tbsp warm water to loosen.', 'Toss noodles with the peanut sauce.', 'Top with spring onions and serve. Add cucumber, edamame, or shredded carrot if desired.']),
      tags: JSON.stringify(['Vegan', 'Quick']), cook_time: 20, prep_time: 10, servings: 2, difficulty: 'Easy', save_count: 21, like_count: 17
    },
    {
      user_id: uid2, title: 'Egg Fried Rice', cuisine_type: 'Chinese',
      description: 'Transform leftover rice into a speedy, satisfying meal — fluffy scrambled eggs, crispy vegetables, and perfectly seasoned fried rice ready in less than 15 minutes.',
      ingredients: JSON.stringify([{ amount: '2', unit: 'cups', name: 'cooked rice (day-old is best)' }, { amount: '3', unit: '', name: 'eggs, beaten' }, { amount: '1', unit: 'cup', name: 'frozen peas and carrots' }, { amount: '3', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tsp', name: 'sesame oil' }, { amount: '2', unit: 'cloves', name: 'garlic, minced' }, { amount: '2', unit: 'tbsp', name: 'vegetable oil' }, { amount: '2', unit: '', name: 'spring onions, sliced' }]),
      steps: JSON.stringify(['Heat oil in a wok or large pan until very hot.', 'Add garlic and stir for 30 seconds.', 'Push to the side, add eggs and scramble until just set.', 'Add rice and break up any clumps, stir-fry 3-4 minutes.', 'Add frozen vegetables, soy sauce, and sesame oil. Toss well.', 'Garnish with spring onions and serve.']),
      tags: JSON.stringify(['Budget', 'Quick']), cook_time: 12, prep_time: 5, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, is_budget: 1, save_count: 19, like_count: 15
    }
  ];

  let inserted = 0;
  for (const r of recipes) {
    try {
      db.prepare(`
        INSERT INTO recipes (user_id, title, description, ingredients, steps, tags, cuisine_type, cook_time, prep_time, servings, difficulty, is_budget, is_kid_friendly, is_fifteen_min, save_count, like_count)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(r.user_id, r.title, r.description, r.ingredients, r.steps, r.tags, r.cuisine_type || null, r.cook_time || null, r.prep_time || null, r.servings || null, r.difficulty || null, r.is_budget || 0, r.is_kid_friendly || 0, r.is_fifteen_min || 0, r.save_count || 0, r.like_count || 0);
      console.log(`  ✅ ${r.title}`);
      inserted++;
    } catch (e) { console.log(`  ⏭️  ${r.title} (already exists or error: ${e.message})`); }
  }

  console.log(`\n✨ Seed complete! ${inserted} recipes added.\n`);
  console.log('Demo login credentials:');
  console.log('  Email: chef@demo.com  | Password: demo1234');
  console.log('  Email: cook@demo.com  | Password: demo1234\n');
}

seed().catch(e => { console.error('Seed failed:', e); process.exit(1); });
