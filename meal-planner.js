/**
 * MATERNA AI 2.0 - MEAL PLANNER & NUTRITION ENGINE
 * - Weekly Indian-friendly menus by diet type & trimester
 * - Foods-to-Avoid database with medical rationale
 * - Interactive Categorized Grocery List with checklist
 */

const MealPlanner = {
  // Weekly menus by diet type
  menus: {
    Vegetarian: {
      days: [
        {
          day: 'Monday',
          breakfast: 'Moong Dal Chilla with mint coriander chutney and 1 cup warm milk/fortified almond milk',
          midMorning: '1 Sweet orange or bowl of pomegranate pearls with 4 soaked walnuts',
          lunch: '2 Phulkas (multigrain rotis), Palak Paneer (iron + calcium), sprouted moong salad, and curd',
          eveningSnack: 'Roasted Makhana (fox nuts) sprinkled with turmeric and rock salt',
          dinner: 'Mixed vegetable Khichdi cooked with a dollop of pure A2 cow ghee, served with tomato soup'
        },
        {
          day: 'Tuesday',
          breakfast: 'Ragi (Finger Millet) Dosa with coconut vegetable sambar and tender coconut water',
          midMorning: 'Handful of roasted pumpkin seeds and soaked dried figs (anjeer)',
          lunch: 'Brown rice or quinoa, Rajma (Kidney bean curry - protein & iron), steamed beans, and cucumber raita',
          eveningSnack: 'Steamed corn chaat with lemon squeeze (Vitamin C booster)',
          dinner: 'Paneer Bhurji with 2 whole wheat rotis, steamed zucchini, and warm turmeric milk before bed'
        },
        {
          day: 'Wednesday',
          breakfast: 'Rolled Oats cooked with milk, chia seeds, sliced bananas, and crushed almonds',
          midMorning: 'Fresh guava or apple slices with a pinch of black salt',
          lunch: '2 Rotis, Chana Dal with bottle gourd (lauki), methi (fenugreek) sabzi, and fresh buttermilk (chaas)',
          eveningSnack: 'Boiled sweet potato chaat with lime and chaat masala',
          dinner: 'Tofu and bell pepper stir fry with brown rice or millet roti and dal soup'
        },
        {
          day: 'Thursday',
          breakfast: 'Vegetable Poha made with thick beaten rice, peanuts, peas, and fresh lime',
          midMorning: 'Fresh coconut water with a spoon of tender pulp',
          lunch: '2 Rotis, Paneer Kofta in mild yogurt gravy, stir-fried spinach and carrots, and fresh curd',
          eveningSnack: 'Roasted chana (Bengal gram) and a cup of fennel herbal tea',
          dinner: 'Vegetable Dalia (broken wheat) with green peas, carrots, and moong dal'
        },
        {
          day: 'Friday',
          breakfast: 'Methi (Fenugreek) Thepla with fresh curd and a bowl of fresh papaya-free seasonal fruit',
          midMorning: 'Handful of mixed nuts (walnuts, almonds, pistachios)',
          lunch: 'Rice, Dal Makhani (mild cooked), beetroot-carrot poriyal, and pomegranate raita',
          eveningSnack: 'Besan (gram flour) vegetable chilla with mint chutney',
          dinner: 'Paneer and vegetable pulao served with cucumber mint yogurt'
        },
        {
          day: 'Saturday',
          breakfast: 'Idli (fermented rice-lentil cakes) with drumstick sambar and coconut coriander chutney',
          midMorning: '1 Ripe banana with 1 spoon peanut butter',
          lunch: '2 Multigrain rotis, Chole (chickpea curry), steamed green beans, and spiced buttermilk',
          eveningSnack: 'Roasted lotus seeds (makhana) with a cup of warm saffron milk',
          dinner: 'Moong dal soup with baked vegetable cutlets and steamed greens'
        },
        {
          day: 'Sunday',
          breakfast: 'Whole wheat stuffed Paneer Paratha (mildly spiced) with fresh curd and mint dip',
          midMorning: 'Kiwi or orange slices with pumpkin seeds',
          lunch: 'Jeera rice, Gujarati sweet-sour dal, sautéed bhindi (okra), and salad',
          eveningSnack: 'Fruit chaat with chia seeds',
          dinner: 'Light vegetable khichdi with ghee and roasted papad (non-fried)'
        }
      ]
    },

    Eggetarian: {
      days: [
        {
          day: 'Monday',
          breakfast: '2 Boiled Eggs with 2 whole wheat toasted slices and 1 fresh orange',
          midMorning: 'Bowl of pomegranate and 4 soaked almonds',
          lunch: 'Rice or roti with Egg Curry (mild gravy), steamed beans, and curd',
          eveningSnack: 'Roasted makhana and coconut water',
          dinner: 'Vegetable khichdi with paneer or an egg white omelet and greens'
        },
        {
          day: 'Tuesday',
          breakfast: 'Vegetable & Spinach Omelet with whole grain toast and avocado slices',
          midMorning: 'Soaked dried figs (anjeer) and walnuts',
          lunch: '2 Rotis, Dal Tadka, French beans poriyal, and 1 hard-boiled egg with pepper',
          eveningSnack: 'Sprouted moong chaat with lemon juice',
          dinner: 'Egg and vegetable fried rice (light olive oil) with vegetable clear soup'
        }
      ]
    },

    'Non-vegetarian': {
      days: [
        {
          day: 'Monday',
          breakfast: 'Scrambled Eggs with spinach, whole wheat toast, and 1 cup warm milk',
          midMorning: 'Fresh apple with soaked walnuts',
          lunch: 'Rice or 2 rotis with well-cooked lean Chicken Curry, dal, and fresh cucumber salad',
          eveningSnack: 'Roasted chickpeas and lime water',
          dinner: 'Grilled well-cooked Salmon or freshwater fish (rich in DHA) with quinoa and steamed broccoli'
        },
        {
          day: 'Tuesday',
          breakfast: 'Oatmeal cooked in milk with nuts, plus 1 boiled egg',
          midMorning: 'Fresh sweet lime (mosambi) juice',
          lunch: '2 Rotis, Chicken and vegetable stew with carrots and beans, and curd',
          eveningSnack: 'Boiled egg chaat with rock salt and lemon',
          dinner: 'Light chicken and vegetable khichdi or chicken noodle soup'
        }
      ]
    }
  },

  // Foods to avoid during pregnancy with clinical rationales
  foodsToAvoid: [
    {
      food: 'Raw or Semi-Ripe Papaya',
      danger: 'Contains high concentrations of latex and papain enzymes that can trigger premature uterine contractions and prostaglandin release.',
      category: 'Fruit / Produce'
    },
    {
      food: 'Unpasteurized Milk & Soft Cheeses (Brie, Camembert, Feta)',
      danger: 'Risk of Listeria monocytogenes infection. Listeriosis can cross the placenta and cause miscarriage or severe neonatal infection.',
      category: 'Dairy'
    },
    {
      food: 'High-Mercury Fish (King Mackerel, Shark, Swordfish, Tilefish)',
      danger: 'Bioaccumulated methylmercury damages fetal brain and nervous system development. Opt instead for low-mercury fish like salmon or anchovies.',
      category: 'Seafood'
    },
    {
      food: 'Raw Sprouts (Alfalfa, Clover, Radish, Raw Mung)',
      danger: 'Moist conditions required for sprouting harbor Salmonella and E. coli. Always cook sprouts thoroughly before eating.',
      category: 'Produce'
    },
    {
      food: 'Raw or Undercooked Eggs & Meat',
      danger: 'Risk of Salmonella and Toxoplasma gondii parasites, which can cause severe congenital anomalies. Eggs should have firm yolks.',
      category: 'Proteins'
    },
    {
      food: 'Excess Caffeine (>200 mg/day)',
      danger: 'Caffeine crosses the placenta freely; high intake is linked to restricted fetal growth and low birth weight. Limit to 1 cup coffee/tea.',
      category: 'Beverages'
    },
    {
      food: 'Unwashed Vegetables & Salads',
      danger: 'Toxoplasma parasites in garden soil. Always wash salads, greens, and fruits under clean running water.',
      category: 'Produce'
    }
  ],

  // Interactive Grocery Checklist
  defaultGrocery: [
    { id: 'g1', category: 'Dairy & Alternatives', item: 'Organic Pasteurized Milk / Almond Milk', checked: false },
    { id: 'g2', category: 'Dairy & Alternatives', item: 'Fresh Cottage Cheese (Paneer) or Tofu', checked: true },
    { id: 'g3', category: 'Dairy & Alternatives', item: 'Fresh Probiotic Plain Curd / Yogurt', checked: false },
    { id: 'g4', category: 'Produce & Fruits', item: 'Fresh Spinach (Palak) & Fenugreek (Methi)', checked: false },
    { id: 'g5', category: 'Produce & Fruits', item: 'Sweet Oranges / Mosambi (Vitamin C)', checked: true },
    { id: 'g6', category: 'Produce & Fruits', item: 'Pomegranates & Ripe Bananas', checked: false },
    { id: 'g7', category: 'Grains & Pulses', item: 'Whole Wheat Flour & Rolled Oats', checked: true },
    { id: 'g8', category: 'Grains & Pulses', item: 'Yellow Moong Dal & Sprouted Chana', checked: false },
    { id: 'g9', category: 'Nuts & Seeds', item: 'Walnuts, Almonds, and Chia Seeds', checked: false },
    { id: 'g10', category: 'Nuts & Seeds', item: 'Fox Nuts (Phool Makhana)', checked: true },
    { id: 'g11', category: 'Pantry', item: 'Pure A2 Cow Ghee & Rock Salt', checked: false }
  ],

  getGroceryList() {
    return window.StorageEngine?.get('materna_grocery_v2', this.defaultGrocery);
  },

  saveGroceryList(list) {
    window.StorageEngine?.set('materna_grocery_v2', list);
  }
};

window.MealPlanner = MealPlanner;
