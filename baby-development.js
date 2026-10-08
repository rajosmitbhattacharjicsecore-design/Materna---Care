/**
 * MATERNA AI 2.0 - BABY DEVELOPMENT DATABASE
 * Week-by-week size comparisons, anatomical milestones, and clinical tips (Weeks 4 - 42).
 */

const BabyDevelopment = {
  data: {
    4: {
      fruit: 'Poppy Seed',
      emoji: '🌱',
      lengthCm: 0.1,
      weightG: 0.1,
      milestone: 'Blastocyst implants into the uterine lining. The neural tube begins forming.',
      bodyChanges: 'Missed period, mild uterine cramping, subtle breast tenderness.',
      tip: 'Start high-quality prenatal vitamin with 400-600 mcg folic acid immediately.'
    },
    6: {
      fruit: 'Sweet Pea',
      emoji: '🫛',
      lengthCm: 0.6,
      weightG: 0.5,
      milestone: 'Heart begins beating rhythmically at 100-160 bpm. Tiny facial indentations form.',
      bodyChanges: 'Morning sickness, heightened sense of smell, fatigue kicks in.',
      tip: 'Eat small, frequent meals with dry crackers before getting out of bed.'
    },
    8: {
      fruit: 'Raspberry',
      emoji: '🫐',
      lengthCm: 1.6,
      weightG: 1.0,
      milestone: 'Fingers and toes webbed, eyelids form, taste buds begin sprouting.',
      bodyChanges: 'Frequent urination as the expanding uterus presses on the bladder.',
      tip: 'Schedule your initial dating and viability prenatal scan with your OB/GYN.'
    },
    10: {
      fruit: 'Strawberry',
      emoji: '🍓',
      lengthCm: 3.1,
      weightG: 4.0,
      milestone: 'Embryonic stage ends; officially called a fetus! Vital organs are formed.',
      bodyChanges: 'Veins become more visible on breasts and abdomen due to increased blood volume.',
      tip: 'Wear comfortable, non-wired cotton support bras for sensitive breast tissue.'
    },
    12: {
      fruit: 'Lime',
      emoji: '🍋',
      lengthCm: 5.4,
      weightG: 14.0,
      milestone: 'Fetal reflexes appear: baby can curl toes and clench tiny fingers. Kidneys produce urine.',
      bodyChanges: 'End of 1st trimester near! Nausea often starts easing, placenta takes over hormone production.',
      tip: 'Time for first trimester screening / NT scan (nuchal translucency) and NIPT blood tests.'
    },
    14: {
      fruit: 'Lemon',
      emoji: '🍋',
      lengthCm: 8.7,
      weightG: 43.0,
      milestone: 'Welcome to the 2nd trimester! Baby can squint, frown, and suck their thumb.',
      bodyChanges: 'Energy bounce back! Skin may develop the glowing pregnancy flush.',
      tip: 'Focus on calcium-rich foods (milk, ragi, curd) to build baby’s skeleton.'
    },
    16: {
      fruit: 'Avocado',
      emoji: '🥑',
      lengthCm: 11.6,
      weightG: 100.0,
      milestone: 'Eyes can make sluggish movements and baby’s scalp hair patterning begins.',
      bodyChanges: 'Baby bump starts becoming visibly rounded. You might feel tiny flutterings (quickening).',
      tip: 'Sleep comfortably on your side with a supportive pillow between your knees.'
    },
    18: {
      fruit: 'Bell Pepper',
      emoji: '🫑',
      lengthCm: 14.2,
      weightG: 190.0,
      milestone: 'Myelin sheath begins coating baby\'s nerves. Baby can hear loud external sounds.',
      bodyChanges: 'Backaches may begin as your center of gravity shifts forward.',
      tip: 'Practice gentle Cat-Cow yoga poses to release tension in the lumbar spine.'
    },
    20: {
      fruit: 'Banana',
      emoji: '🍌',
      lengthCm: 25.6,
      weightG: 300.0,
      milestone: 'Halfway mark! Vernix caseosa (protective white coating) covers baby’s delicate skin.',
      bodyChanges: 'Uterine fundus reaches belly button level. Distinct kicks become noticeable.',
      tip: 'Undergo the comprehensive Level II Anomaly Scan to evaluate organ development.'
    },
    22: {
      fruit: 'Papaya (Small)',
      emoji: '🥭',
      lengthCm: 27.8,
      weightG: 430.0,
      milestone: 'Eyebrows and eyelashes fully developed. Baby establishes sleep-wake cycles.',
      bodyChanges: 'Mild ankle or foot swelling (physiologic edema) after long standing.',
      tip: 'Elevate your feet on a footstool and stay well-hydrated to reduce fluid retention.'
    },
    24: {
      fruit: 'Ear of Corn',
      emoji: '🌽',
      lengthCm: 30.0,
      weightG: 600.0,
      milestone: 'Viability milestone! Inner ear balance sensors are formed; baby responds to mom’s voice and music.',
      bodyChanges: 'Stretching abdominal skin can feel itchy. Occasional painless Braxton Hicks practice tightenings.',
      tip: 'Schedule your Gestational Diabetes Screen (OGTT) between weeks 24 and 28.'
    },
    26: {
      fruit: 'Zucchini / Red Cabbage',
      emoji: '🥬',
      lengthCm: 35.6,
      weightG: 760.0,
      milestone: 'Baby’s eyes open for the first time! Baby practices breathing motions with amniotic fluid.',
      bodyChanges: 'Heartburn or acid reflux as the growing uterus nudges the stomach upwards.',
      tip: 'Eat 5-6 smaller meals rather than 2 heavy meals. Avoid eating 2 hours before bed.'
    },
    28: {
      fruit: 'Eggplant',
      emoji: '🍆',
      lengthCm: 37.6,
      weightG: 1000.0,
      milestone: 'Welcome to the 3rd trimester! Baby can dream (REM sleep) and weigh about 1 full kilogram.',
      bodyChanges: 'Shortness of breath on stairs as diaphragm is slightly pushed.',
      tip: 'Start daily kick counting: ensure at least 10 kicks in 2 hours during active periods.'
    },
    30: {
      fruit: 'Cabbage',
      emoji: '🥬',
      lengthCm: 39.9,
      weightG: 1300.0,
      milestone: 'Red blood cells now produced by baby\'s bone marrow. Brain surface shows complex convolutions.',
      bodyChanges: 'Mood sensitivity, trouble finding a comfortable sleeping position.',
      tip: 'Practice prenatal 4-7-8 relaxation breathing before bedtime for deeper sleep.'
    },
    32: {
      fruit: 'Jicama / Butternut Squash',
      emoji: '🎃',
      lengthCm: 42.4,
      weightG: 1700.0,
      milestone: 'Baby is practicing swallowing, sucking, breathing, and blinking. Toenails are complete.',
      bodyChanges: 'Colostrum (first breast milk) might leak occasionally; perfectly normal.',
      tip: 'Check your iron and hemoglobin levels to prevent late-term fatigue and anemia.'
    },
    34: {
      fruit: 'Cantaloupe',
      emoji: '🍈',
      lengthCm: 45.0,
      weightG: 2150.0,
      milestone: 'Immune system matures as maternal antibodies transfer across placenta.',
      bodyChanges: 'Pelvic pressure increases as baby settles lower into cephalic (head-down) position.',
      tip: 'Pack your hospital birth bag with essentials, comfortable clothing, and ID records.'
    },
    36: {
      fruit: 'Honeydew Melon',
      emoji: '🍈',
      lengthCm: 47.4,
      weightG: 2600.0,
      milestone: 'Nearly full term! Lungs are almost completely mature, producing sufficient surfactant.',
      bodyChanges: 'Lightening may occur (baby drops into the pelvis), making breathing easier.',
      tip: 'Doctor visits increase to weekly. Screening for Group B Streptococcus (GBS).'
    },
    38: {
      fruit: 'Winter Squash',
      emoji: '🎃',
      lengthCm: 49.8,
      weightG: 3100.0,
      milestone: 'Full term! Baby has firm grasp reflexes and shedding lanugo hair.',
      bodyChanges: 'Cervical effacement (thinning) begins. Bloody show or mucous plug may pass.',
      tip: 'Learn the 5-1-1 contraction rule: contractions 5 mins apart, lasting 1 min, for 1 hour.'
    },
    40: {
      fruit: 'Watermelon',
      emoji: '🍉',
      lengthCm: 51.2,
      weightG: 3500.0,
      milestone: 'Official due date! Baby is ready to meet you and take their first breath.',
      bodyChanges: 'Intense anticipation, frequent Braxton Hicks or early labor waves.',
      tip: 'Rest, stay well-hydrated, trust your body, and keep hospital emergency contact on speed dial.'
    }
  },

  getWeekData(week) {
    week = parseInt(week, 10);
    if (this.data[week]) return this.data[week];

    // Fallback interpolator for intermediate weeks
    const availableWeeks = Object.keys(this.data).map(Number).sort((a,b) => a - b);
    let closest = availableWeeks[0];
    for (const w of availableWeeks) {
      if (w <= week) closest = w;
      else break;
    }
    const base = this.data[closest];
    return {
      fruit: base.fruit,
      emoji: base.emoji,
      lengthCm: parseFloat((base.lengthCm + ((week - closest) * 1.1)).toFixed(1)),
      weightG: Math.round(base.weightG + ((week - closest) * 110)),
      milestone: base.milestone,
      bodyChanges: base.bodyChanges,
      tip: base.tip
    };
  }
};

window.BabyDevelopment = BabyDevelopment;
