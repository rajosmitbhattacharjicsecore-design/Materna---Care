/**
 * MATERNA AI 2.0 - CLINICAL RULES & ANALYSIS ENGINE
 * Rule-based, transparent, explainable recommendations aligned with
 * ACOG (American College of Obstetricians and Gynecologists) and WHO guidelines.
 */

const RulesEngine = {
  // Trimester determination
  getTrimester(week) {
    if (week <= 13) return { num: 1, name: '1st Trimester (Weeks 1-13)', slug: 't1' };
    if (week <= 27) return { num: 2, name: '2nd Trimester (Weeks 14-27)', slug: 't2' };
    return { num: 3, name: '3rd Trimester (Weeks 28-40+)', slug: 't3' };
  },

  // Calculate pre-pregnancy BMI
  calculateBmi(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = 'Normal';
    let totalGainRange = [11.5, 16.0]; // kg
    let weeklyRateT2T3 = 0.42; // kg/wk

    if (bmi < 18.5) {
      category = 'Underweight';
      totalGainRange = [12.5, 18.0];
      weeklyRateT2T3 = 0.51;
    } else if (bmi >= 25.0 && bmi < 29.9) {
      category = 'Overweight';
      totalGainRange = [7.0, 11.5];
      weeklyRateT2T3 = 0.28;
    } else if (bmi >= 30.0) {
      category = 'Obesity';
      totalGainRange = [5.0, 9.0];
      weeklyRateT2T3 = 0.22;
    }

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      totalGainRange,
      weeklyRateT2T3
    };
  },

  // Analyze weight gain relative to current week and BMI
  analyzeWeightGain(currentWeightKg, prePregWeightKg, heightCm, currentWeek) {
    const bmiInfo = this.calculateBmi(prePregWeightKg, heightCm);
    if (!bmiInfo) return { status: 'Unknown', message: 'Enter pre-pregnancy weight & height to calculate' };

    const actualGain = parseFloat((currentWeightKg - prePregWeightKg).toFixed(1));
    
    // Expected gain calculation according to IOM guidelines:
    // Trimester 1 (weeks 1-13): total 0.5 - 2.0 kg
    // Trimester 2 & 3: weeklyRateT2T3 * (week - 13)
    let minExpected = 0.5;
    let maxExpected = 2.0;

    if (currentWeek > 13) {
      const weeksPostT1 = currentWeek - 13;
      minExpected = 1.0 + (bmiInfo.weeklyRateT2T3 * 0.8 * weeksPostT1);
      maxExpected = 2.0 + (bmiInfo.weeklyRateT2T3 * 1.2 * weeksPostT1);
    }

    minExpected = parseFloat(minExpected.toFixed(1));
    maxExpected = parseFloat(maxExpected.toFixed(1));

    let status = 'On Track';
    let badgeClass = 'pill-success';
    let explanation = `Your gain of ${actualGain > 0 ? '+' : ''}${actualGain} kg is within the recommended range of ${minExpected} to ${maxExpected} kg for Week ${currentWeek} based on your pre-pregnancy BMI (${bmiInfo.bmi} - ${bmiInfo.category}).`;

    if (actualGain < minExpected) {
      status = 'Below Expected Pace';
      badgeClass = 'pill-warning';
      explanation = `Your gain of ${actualGain > 0 ? '+' : ''}${actualGain} kg is slightly below the typical range (${minExpected}-${maxExpected} kg) for week ${currentWeek}. Consider nutrient-dense snacks like nuts, dairy/tofu, and healthy fats. Discuss with your doctor.`;
    } else if (actualGain > maxExpected) {
      status = 'Above Expected Pace';
      badgeClass = 'pill-warning';
      explanation = `Your gain of +${actualGain} kg is slightly higher than the target band (${minExpected}-${maxExpected} kg). Focus on whole complex grains, plenty of water, and gentle daily walking. Never restrict calories during pregnancy without doctor advice.`;
    }

    return {
      actualGain,
      minExpected,
      maxExpected,
      bmiInfo,
      status,
      badgeClass,
      explanation
    };
  },

  // Analyze Blood Pressure
  analyzeBloodPressure(sys, dia) {
    if (!sys || !dia) return { category: 'Unknown', level: 'normal', flag: false, message: 'No BP recorded' };

    sys = parseInt(sys, 10);
    dia = parseInt(dia, 10);

    // Severe Hypertensive threshold
    if (sys >= 160 || dia >= 110) {
      return {
        category: 'Critical - Hypertensive Crisis / Severe Range',
        level: 'critical',
        flag: true,
        pillClass: 'pill-danger',
        message: 'Reading is ≥ 160/110 mmHg. This requires immediate urgent medical evaluation for gestational hypertension or pre-eclampsia.',
        action: 'Immediate Emergency Care Needed'
      };
    }

    // Stage 2 / Gestational Hypertension flag
    if (sys >= 140 || dia >= 90) {
      return {
        category: 'Needs Attention (≥140/90 mmHg)',
        level: 'danger',
        flag: true,
        pillClass: 'pill-danger',
        message: 'Your reading reaches the gestational hypertension threshold (≥140/90). Stay calm, sit down quietly, rest on your left side for 15 minutes, and contact your maternity clinician.',
        action: 'Contact Your Doctor'
      };
    }

    // Stage 1 / Borderline
    if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90)) {
      return {
        category: 'Mildly Elevated / Stage 1',
        level: 'warning',
        flag: false,
        pillClass: 'pill-warning',
        message: 'Your blood pressure is slightly above ideal baseline. Stay hydrated, reduce sodium/processed foods, practice relaxation breathing, and recheck in 2 hours.',
        action: 'Monitor Closely'
      };
    }

    // Elevated Systolic
    if (sys >= 120 && sys < 130 && dia < 80) {
      return {
        category: 'Elevated Systolic',
        level: 'attention',
        flag: false,
        pillClass: 'pill-warning',
        message: 'Systolic reading is between 120-129 mmHg with normal diastolic. Continue regular activity, hydration, and restful sleep.',
        action: 'Routine Check'
      };
    }

    // Normal / Optimal
    return {
      category: 'Optimal & Healthy',
      level: 'normal',
      flag: false,
      pillClass: 'pill-success',
      message: 'Your blood pressure is within the ideal maternal range (<120/80 mmHg). Excellent job maintaining heart and placental circulation!',
      action: 'All Good'
    };
  },

  // Trimester-aware nutrient targets
  getNutrientTargets(week, dietType = 'Vegetarian', allergies = '') {
    const tri = this.getTrimester(week);
    const isT1 = tri.num === 1;
    const isT2 = tri.num === 2;
    const isT3 = tri.num === 3;

    // Targets
    const targets = {
      calories: {
        val: isT1 ? 2000 : isT2 ? 2340 : 2450,
        unit: 'kcal',
        surplus: isT1 ? '+0 kcal' : isT2 ? '+340 kcal/day' : '+450 kcal/day',
        why: isT1 ? 'Calorie needs do not increase significantly in first 13 weeks.' : isT2 ? 'Calorie intake increases by ~340 kcal/day for rapid fetal growth and placenta.' : 'Calorie intake increases by ~450 kcal/day for maximum baby weight gain and fat accumulation.'
      },
      protein: {
        target: isT1 ? 60 : 75,
        current: 68,
        unit: 'g',
        focus: dietType.includes('Non') ? 'Eggs, chicken, salmon, lentils, Greek yogurt' : dietType.includes('Egg') ? 'Eggs, paneer, lentils, tofu, Greek yogurt' : 'Paneer, lentils/dal, chickpeas, tofu, hemp seeds, milk',
        why: 'Crucial for baby\'s cellular multiplication, brain development, and uterine muscle expansion.'
      },
      iron: {
        target: 27,
        current: 21,
        unit: 'mg',
        focus: dietType.includes('Non') ? 'Lean poultry, spinach, lentils, pumpkin seeds with citrus' : 'Spinach, poha, jaggery, chickpeas, roasted seeds, beetroot with vitamin C',
        why: 'Maternal blood volume expands by 40-50%. Iron prevents maternal anemia and supports fetal oxygen supply.'
      },
      calcium: {
        target: 1000,
        current: 920,
        unit: 'mg',
        focus: 'Milk, curd/yogurt, ragi (finger millet), sesame seeds, paneer, fortified almond milk',
        why: 'Forms baby\'s bones, tooth buds, and regulates maternal heart and muscle contractions.'
      },
      fiber: {
        target: 28,
        current: 25,
        unit: 'g',
        focus: 'Whole oats, chia seeds, guava, pears, apples with skin, green peas, whole wheat',
        why: 'Counteracts progesterone-induced slow digestion and prevents pregnancy constipation and hemorrhoids.'
      },
      folate: {
        target: 600,
        current: 580,
        unit: 'mcg',
        focus: 'Folate-fortified grains, dark leafy greens, oranges, asparagus, beans',
        why: 'Prevents neural tube defects (spina bifida) and supports DNA synthesis in rapidly dividing cells.'
      },
      dha: {
        target: 250,
        current: 200,
        unit: 'mg',
        focus: dietType.includes('Non') ? 'Low-mercury cooked fish (salmon, sardines) or algae oil' : 'Algal DHA supplement, walnuts, flaxseeds (ALA precursor)',
        why: 'Essential omega-3 fatty acid for baby\'s brain architecture and retina visual acuity.'
      },
      iodine: {
        target: 220,
        current: 210,
        unit: 'mcg',
        focus: 'Iodized salt, yogurt, cheese, eggs, dairy',
        why: 'Required for maternal and fetal thyroid hormones controlling nervous system development.'
      }
    };

    return targets;
  },

  // Red-flag symptom check
  evaluateSymptoms(symptomsList = []) {
    const redFlags = [
      'vaginal bleeding',
      'spotting',
      'severe headache',
      'visual disturbance',
      'blurred vision',
      'spots in vision',
      'reduced fetal movement',
      'decreased kicks',
      'fluid leaking',
      'water break',
      'sudden face swelling',
      'severe upper abdominal pain',
      'chest pain',
      'shortness of breath'
    ];

    const detectedFlags = symptomsList.filter(sym => 
      redFlags.some(rf => sym.toLowerCase().includes(rf))
    );

    return {
      hasRedFlag: detectedFlags.length > 0,
      detectedFlags,
      emergencySteps: [
        'Do not wait. Sit down calmly and avoid sudden movements.',
        'Call your obstetrician or hospital maternity emergency triage immediately.',
        'Have someone accompany you to the maternity emergency room.',
        'Keep your prenatal health record or digital Materna card ready.'
      ]
    };
  }
};

window.RulesEngine = RulesEngine;
