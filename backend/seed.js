/**
 * Seed script — creates demo accounts and 8 sample recipes
 * Run from: C:\...\Nourishly\backend> node --experimental-sqlite seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { getDb } = require('./src/db/database');

async function seed() {
  const db = getDb();
  console.log('\n🌱 Seeding Nourishly demo data…\n');

  const pass = await bcrypt.hash('demo1234', 10);

  let uid1, uid2;
  try {
    const r = db.prepare('INSERT INTO users (email, username, password, bio) VALUES (?,?,?,?)').run(
      'chef@demo.com', 'homeChef', pass, 'Passionate home cook sharing simple, healthy recipes for busy families.'
    );
    uid1 = r.lastInsertRowid;
    console.log('✅ User 1: homeChef (chef@demo.com / demo1234)');
  } catch {
    uid1 = db.prepare("SELECT id FROM users WHERE email='chef@demo.com'").get().id;
    console.log('ℹ️  User 1 already exists');
  }

  try {
    const r = db.prepare('INSERT INTO users (email, username, password, bio) VALUES (?,?,?,?)').run(
      'cook@demo.com', 'dailyCook', pass, 'Quick weeknight meals and budget-friendly cooking ideas.'
    );
    uid2 = r.lastInsertRowid;
    console.log('✅ User 2: dailyCook (cook@demo.com / demo1234)');
  } catch {
    uid2 = db.prepare("SELECT id FROM users WHERE email='cook@demo.com'").get().id;
    console.log('ℹ️  User 2 already exists');
  }

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
      ingredients: JSON.stringify([{ amount: '400g', unit: '', name: 'spaghetti' }, { amount: '400g', unit: '', name: 'crushed tomatoes (canned)' }, { amount: '4', unit: 'cloves', name: 'garlic' }, { amount: '3', unit: 'tbsp', name: 'olive oil' }, { amount: '1', unit: 'handful', name: 'fresh basil' }]),
      steps: JSON.stringify(['Cook spaghetti in heavily salted boiling water until al dente. Reserve 1 cup pasta water.', 'Heat olive oil in a large pan, add sliced garlic and cook on low heat until golden.', 'Add crushed tomatoes, season generously, and simmer for 10 minutes.', 'Toss drained pasta in the sauce with a splash of pasta water.', 'Top with fresh basil and a drizzle of olive oil.']),
      tags: JSON.stringify(['Vegetarian']), cook_time: 20, prep_time: 5, servings: 4, difficulty: 'Easy', save_count: 24, like_count: 19
    },
    {
      user_id: uid2, title: 'Chicken Stir-Fry with Vegetables', cuisine_type: 'Chinese',
      description: 'A vibrant, protein-packed stir-fry that gets dinner on the table in under 15 minutes — colourful vegetables and tender chicken in a savory ginger-garlic sauce.',
      ingredients: JSON.stringify([{ amount: '300g', unit: '', name: 'chicken breast, sliced thin' }, { amount: '1', unit: 'cup', name: 'broccoli florets' }, { amount: '1', unit: '', name: 'bell pepper, sliced' }, { amount: '2', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tbsp', name: 'oyster sauce' }, { amount: '2', unit: 'cloves', name: 'garlic, minced' }]),
      steps: JSON.stringify(['Mix soy sauce and oyster sauce in a small bowl. Set aside.', 'Heat oil in a wok over high heat. Add chicken and stir-fry 4-5 minutes.', 'Add garlic and ginger, stir 30 seconds. Add vegetables and stir-fry 3 minutes.', 'Return chicken to wok, pour sauce over, toss 1 minute. Serve over rice.']),
      tags: JSON.stringify(['High-Protein', 'Quick']), cook_time: 15, prep_time: 10, servings: 3, difficulty: 'Easy', is_fifteen_min: 1, save_count: 18, like_count: 14
    },
    {
      user_id: uid2, title: 'One-Pan Budget Dal', cuisine_type: 'Indian',
      description: 'Hearty, warming red lentil dal with gently spiced tomatoes and creamy coconut — a deeply nutritious meal that costs almost nothing and feeds a family of four.',
      ingredients: JSON.stringify([{ amount: '1', unit: 'cup', name: 'red lentils, rinsed' }, { amount: '400g', unit: '', name: 'canned diced tomatoes' }, { amount: '1', unit: '', name: 'onion, diced' }, { amount: '3', unit: 'cloves', name: 'garlic' }, { amount: '1', unit: 'tsp', name: 'cumin' }, { amount: '1', unit: 'tsp', name: 'turmeric' }, { amount: '200ml', unit: '', name: 'coconut milk' }]),
      steps: JSON.stringify(['Sauté onion in oil until golden, about 5 minutes.', 'Add garlic and spices, cook 1 minute until fragrant.', 'Add lentils, tomatoes, and 2 cups water. Bring to a boil, reduce and simmer 20 minutes.', 'Stir in coconut milk, simmer 5 more minutes. Season and serve with flatbread.']),
      tags: JSON.stringify(['Vegan', 'Budget', 'High-Protein']), cook_time: 30, prep_time: 10, servings: 4, difficulty: 'Easy', is_budget: 1, save_count: 31, like_count: 22
    },
    {
      user_id: uid1, title: 'Greek Salad with Feta', cuisine_type: 'Mediterranean',
      description: 'Crisp cucumbers, juicy tomatoes, briny olives, and creamy feta come together in this classic Greek salad ready in 10 minutes flat.',
      ingredients: JSON.stringify([{ amount: '2', unit: 'large', name: 'tomatoes, chopped' }, { amount: '1', unit: '', name: 'cucumber, chopped' }, { amount: '1/2', unit: '', name: 'red onion, sliced' }, { amount: '100g', unit: '', name: 'feta cheese, crumbled' }, { amount: '1/2', unit: 'cup', name: 'Kalamata olives' }, { amount: '3', unit: 'tbsp', name: 'olive oil' }]),
      steps: JSON.stringify(['Chop tomatoes, cucumber, and red onion into rough chunks.', 'Toss all vegetables with olive oil, red wine vinegar, salt, and pepper.', 'Top with olives and crumbled feta. Sprinkle with oregano and serve.']),
      tags: JSON.stringify(['Vegetarian', 'Gluten-Free', 'Quick']), cook_time: 10, prep_time: 10, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, save_count: 15, like_count: 11
    },
    {
      user_id: uid2, title: 'Banana Oat Pancakes', cuisine_type: 'American',
      description: 'These fluffy, naturally sweet pancakes made with just oats and bananas are wholesome, kid-approved, and endlessly customisable — ready in 15 minutes!',
      ingredients: JSON.stringify([{ amount: '2', unit: '', name: 'ripe bananas' }, { amount: '1', unit: 'cup', name: 'rolled oats' }, { amount: '2', unit: '', name: 'eggs' }, { amount: '1', unit: 'tsp', name: 'vanilla extract' }, { amount: '1/2', unit: 'tsp', name: 'cinnamon' }]),
      steps: JSON.stringify(['Blend bananas, oats, eggs, vanilla, and cinnamon until smooth. Rest 2 minutes.', 'Heat a non-stick pan on medium-low and grease lightly.', 'Pour small rounds of batter, cook 2-3 minutes per side until golden.', 'Serve with honey, fresh fruit, or maple syrup.']),
      tags: JSON.stringify(['Vegetarian', 'Gluten-Free']), cook_time: 15, prep_time: 5, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, is_kid_friendly: 1, save_count: 27, like_count: 20
    },
    {
      user_id: uid1, title: 'Spicy Thai Peanut Noodles', cuisine_type: 'Thai',
      description: 'Satisfying noodles in a creamy peanut-sesame sauce that are bold, fresh, and ready in 20 minutes — toss in any vegetables you have for a perfect weeknight meal.',
      ingredients: JSON.stringify([{ amount: '200g', unit: '', name: 'rice noodles or spaghetti' }, { amount: '3', unit: 'tbsp', name: 'peanut butter' }, { amount: '2', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tbsp', name: 'sesame oil' }, { amount: '1', unit: 'tbsp', name: 'honey' }, { amount: '1', unit: 'tsp', name: 'chili paste' }, { amount: '2', unit: 'stalks', name: 'spring onion, sliced' }]),
      steps: JSON.stringify(['Cook noodles per package. Rinse under cold water, drain.', 'Whisk peanut butter, soy sauce, sesame oil, honey, chili paste, and garlic with 2 tbsp warm water.', 'Toss noodles with the peanut sauce.', 'Top with spring onions and serve. Add cucumber or edamame if desired.']),
      tags: JSON.stringify(['Vegan', 'Quick']), cook_time: 20, prep_time: 10, servings: 2, difficulty: 'Easy', save_count: 21, like_count: 17
    },
    {
      user_id: uid2, title: 'Quick Egg Fried Rice', cuisine_type: 'Chinese',
      description: 'Transform leftover rice into a speedy, satisfying meal — fluffy scrambled eggs, crispy vegetables, and perfectly seasoned fried rice in under 15 minutes.',
      ingredients: JSON.stringify([{ amount: '2', unit: 'cups', name: 'cooked rice (day-old is best)' }, { amount: '3', unit: '', name: 'eggs, beaten' }, { amount: '1', unit: 'cup', name: 'frozen peas and carrots' }, { amount: '3', unit: 'tbsp', name: 'soy sauce' }, { amount: '1', unit: 'tsp', name: 'sesame oil' }, { amount: '2', unit: 'cloves', name: 'garlic, minced' }]),
      steps: JSON.stringify(['Heat oil in a wok until very hot. Add garlic and stir 30 seconds.', 'Push to the side, add eggs and scramble until just set.', 'Add rice, break up clumps, stir-fry 3-4 minutes. Add frozen vegetables.', 'Add soy sauce and sesame oil. Toss well. Garnish with spring onions.']),
      tags: JSON.stringify(['Budget', 'Quick']), cook_time: 12, prep_time: 5, servings: 2, difficulty: 'Easy', is_fifteen_min: 1, is_budget: 1, save_count: 19, like_count: 15
    }
  ];

  let inserted = 0;
  for (const r of recipes) {
    try {
      db.prepare(`
        INSERT INTO recipes (user_id, title, description, ingredients, steps, tags, cuisine_type, cook_time, prep_time, servings, difficulty, is_budget, is_kid_friendly, is_fifteen_min, save_count, like_count)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `).run(r.user_id, r.title, r.description, r.ingredients, r.steps, r.tags || '[]', r.cuisine_type || null, r.cook_time || null, r.prep_time || null, r.servings || null, r.difficulty || null, r.is_budget || 0, r.is_kid_friendly || 0, r.is_fifteen_min || 0, r.save_count || 0, r.like_count || 0);
      console.log(`  ✅ ${r.title}`);
      inserted++;
    } catch (e) {
      console.log(`  ⚠️  ${r.title}: ${e.message}`);
    }
  }

  console.log(`\n✨ Seed complete! ${inserted} recipes added.\n`);
  console.log('Demo login credentials:');
  console.log('  Email: chef@demo.com  | Password: demo1234');
  console.log('  Email: cook@demo.com  | Password: demo1234\n');
}

seed().catch(e => { console.error('Seed failed:', e); process.exit(1); });
