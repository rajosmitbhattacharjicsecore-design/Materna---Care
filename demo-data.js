/**
 * MATERNA AI 2.0 - SAMPLE & DEMO PROFILE DATA
 * Realistic clinical demo data for immediate testing and presentation.
 */

const DEMO_DATA = {
  profile: {
    name: 'Priya Sharma',
    age: 28,
    dueDate: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // ~16 weeks from now (24 weeks pregnant)
    lmp: new Date(Date.now() - 168 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currentWeek: 24,
    heightCm: 162,
    prePregWeightKg: 58.0,
    currentWeightKg: 63.5,
    dietType: 'Vegetarian',
    allergies: 'Peanuts',
    bloodGroup: 'B Positive (Rh+)',
    doctorName: 'Dr. Anita Rao, OB/GYN',
    doctorPhone: '+91 98765 43210',
    hospitalName: 'Cloudnine Maternity Care',
    hospitalPhone: '+91 98765 11223',
    emergencyContact: 'Rahul Sharma (Spouse) - +91 98765 99887',
    waterBaseL: 2.5,
    unitSystem: 'metric',
    isPostpartum: false
  },

  vitals: [
    { date: 'Week 16', week: 16, weight: 59.2, bpSys: 110, bpDia: 70, hb: 12.2, vitD: 28, iron: 24, water: 2.1, sleep: 8.0 },
    { date: 'Week 18', week: 18, weight: 60.1, bpSys: 112, bpDia: 72, hb: 12.0, vitD: 30, iron: 23, water: 2.3, sleep: 7.8 },
    { date: 'Week 20', week: 20, weight: 61.3, bpSys: 114, bpDia: 74, hb: 11.8, vitD: 31, iron: 21, water: 2.4, sleep: 7.5 },
    { date: 'Week 21', week: 21, weight: 61.8, bpSys: 115, bpDia: 75, hb: 11.7, vitD: 32, iron: 22, water: 2.5, sleep: 7.2 },
    { date: 'Week 22', week: 22, weight: 62.4, bpSys: 116, bpDia: 74, hb: 11.6, vitD: 33, iron: 20, water: 2.2, sleep: 7.0 },
    { date: 'Week 23', week: 23, weight: 62.9, bpSys: 118, bpDia: 76, hb: 11.5, vitD: 32, iron: 19, water: 2.4, sleep: 7.5 },
    { date: 'Week 24', week: 24, weight: 63.5, bpSys: 118, bpDia: 76, hb: 11.6, vitD: 32, iron: 21, water: 2.5, sleep: 7.6 }
  ],

  meds: [
    {
      id: 'med-1',
      name: 'Prenatal Multivitamin with Methylfolate',
      dose: '1 tablet daily',
      time: '08:00 AM',
      takenToday: true,
      lastTaken: new Date().toISOString()
    },
    {
      id: 'med-2',
      name: 'Calcium & Vitamin D3 Chewable',
      dose: '500mg / 250 IU',
      time: '02:00 PM',
      takenToday: true,
      lastTaken: new Date().toISOString()
    },
    {
      id: 'med-3',
      name: 'Elemental Iron Supplement',
      dose: '30mg (with vitamin C, avoid dairy)',
      time: '08:00 PM',
      takenToday: false,
      lastTaken: null
    }
  ],

  meals: {
    breakfast: 'Oatmeal cooked in almond milk with chia seeds, banana slices, and walnuts.',
    lunch: '2 Whole wheat rotis, 1 cup Palak Paneer (spinach with cottage cheese), mixed cucumber salad, and curd.',
    snacks: 'Roasted makhana (fox nuts) and roasted chana with a cup of warm saffron almond milk.',
    dinner: 'Moong dal khichdi with mixed vegetables (carrots, beans), ghee dollop, and pomegranate raita.',
    waterConsumedL: 1.8
  },

  activities: [
    { id: 'act-1', date: 'Yesterday', title: 'Gentle Prenatal Walking', durationMin: 30, type: 'walking', notes: 'Brisk but comfortable pace in neighborhood park.' },
    { id: 'act-2', date: '2 days ago', title: 'Pelvic Mobility & Cat-Cow', durationMin: 20, type: 'yoga', notes: 'Gentle hip circles and child pose relief for lower back.' }
  ],

  symptoms: [
    { id: 'sym-1', date: 'Today', symptoms: ['Mild Heartburn', 'Leg Cramp (morning)'], severity: 'mild', mood: 'Calm & Happy', notes: 'Sleeping with pregnancy pillow helped.' },
    { id: 'sym-2', date: '3 days ago', symptoms: ['Fatigue'], severity: 'mild', mood: 'Tired', notes: 'Took an afternoon nap.' }
  ],

  appointments: [
    {
      id: 'apt-1',
      title: 'Level II Ultrasound (Fetal Anomaly Scan)',
      doctor: 'Dr. Anita Rao',
      date: 'Completed - Week 20',
      status: 'completed',
      notes: 'Baby anatomy normal, placenta posterior, amniotic fluid adequate.'
    },
    {
      id: 'apt-2',
      title: 'Gestational Diabetes Glucose Screen (OGTT)',
      doctor: 'Lab Diagnostics',
      date: 'Next Week (Week 26)',
      status: 'upcoming',
      notes: 'Fasting required for 8 hours before glucose drink.'
    },
    {
      id: 'apt-3',
      title: 'Tdap Vaccine & Routine 3rd Trimester Scan',
      doctor: 'Dr. Anita Rao',
      date: 'In 4 Weeks (Week 28)',
      status: 'upcoming',
      notes: 'Whooping cough protection transfer for baby.'
    }
  ],

  chat: [
    {
      sender: 'bot',
      text: 'Namaste Priya! 🌸 Welcome to Materna AI 2.0. You are in Week 24 of your beautiful journey. How is your baby bump feeling today? You can ask me anything about your diet, kick counts, or symptoms.',
      time: '08:30 AM'
    }
  ],

  settings: {
    theme: 'light',
    fontSize: 'normal',
    language: 'en'
  }
};

window.DEMO_DATA = DEMO_DATA;
