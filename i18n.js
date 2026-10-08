/**
 * MATERNA AI 2.0 - INTERNATIONALIZATION (i18n)
 * Multi-language engine supporting English, Hindi (हिंदी), Bengali (বাংলা), and Spanish (Español).
 */

const I18nEngine = {
  currentLang: 'en',

  translations: {
    en: {
      appName: 'Materna AI 2.0',
      welcome: 'Hello',
      chooseInputStyle: 'Choose your input style',
      preciseInput: 'Precise Input',
      preciseInputSub: 'Answer guided pregnancy and health parameters.',
      talkAi: 'Talk with Materna AI',
      talkAiSub: 'Have an empathetic conversation with your wellness assistant.',
      todayGlance: 'Today at a Glance',
      quickActions: 'Quick Actions',
      nutrition: 'Nutrition',
      medication: 'Medication',
      activity: 'Activity',
      asanas: 'Pregnancy Asanas',
      tools: 'Clinical Tools',
      trends: 'Maternal Trends',
      babyDev: 'Baby Development',
      mealPlan: 'Meal Planner',
      emergencyCard: 'Emergency SOS',
      shareDoctor: 'Share with Doctor',
      postpartum: 'Postpartum Mode',
      waterIntake: 'Water Intake',
      medAdherence: 'Medication Adherence',
      dietPlan: 'Diet Plan',
      week: 'weeks',
      trimester: 'Trimester',
      updateProfile: 'Update Profile & Analyze',
      contactDoctor: 'Contact Your Doctor',
      disclaimer: 'Materna AI provides educational wellness guidance. Always verify clinical choices with your OB/GYN.',
      foodsToAvoid: 'Foods to Avoid',
      groceryList: 'Grocery List'
    },

    hi: {
      appName: 'मातृना AI 2.0',
      welcome: 'नमस्ते',
      chooseInputStyle: 'अपना पसंदीदा इनपुट चुनें',
      preciseInput: 'सटीक स्वास्थ्य इनपुट',
      preciseInputSub: 'गर्भावस्था और स्वास्थ्य मानकों का विवरण दर्ज करें।',
      talkAi: 'मातृना AI से बात करें',
      talkAiSub: 'अपनी डिजिटल सहायिका से स्वाभाविक बातचीत करें।',
      todayGlance: 'आज का स्वास्थ्य सारांश',
      quickActions: 'त्वरित क्रियाएं',
      nutrition: 'पोषण और आहार',
      medication: 'दवाइयाँ',
      activity: 'शारीरिक व्यायाम',
      asanas: 'गर्भावस्था योगासन',
      tools: 'क्लिनिकल टूल्स',
      trends: 'स्वास्थ्य रुझान',
      babyDev: 'शिशु का विकास',
      mealPlan: 'साप्ताहिक भोजन योजना',
      emergencyCard: 'आपातकालीन कार्ड',
      shareDoctor: 'डॉक्टर रिपोर्ट',
      postpartum: 'प्रसवोत्तर मोड',
      waterIntake: 'जल सेवन',
      medAdherence: 'दवा अनुपालन',
      dietPlan: 'आहार प्रकार',
      week: 'सप्ताह',
      trimester: 'तिमाही',
      updateProfile: 'प्रोफ़ाइल अपडेट और विश्लेषण करें',
      contactDoctor: 'डॉक्टर से संपर्क करें',
      disclaimer: 'मातृना AI शैक्षिक स्वास्थ्य मार्गदर्शन प्रदान करता है। नैदानिक परामर्श हमेशा अपने डॉक्टर से लें।',
      foodsToAvoid: 'परहेज़ करने योग्य खाद्य पदार्थ',
      groceryList: 'किराने की सूची'
    },

    bn: {
      appName: 'মাতৃনা AI 2.0',
      welcome: 'নমস্কার',
      chooseInputStyle: 'আপনার ইনপুট শৈলী চয়ন করুন',
      preciseInput: 'নির্দিষ্ট স্বাস্থ্য তথ্য',
      preciseInputSub: 'গর্ভাবস্থার স্বাস্থ্য পরামিতি পূরণ করুন।',
      talkAi: 'মাতৃনা AI এর সাথে কথা বলুন',
      talkAiSub: 'আপনার স্বাস্থ্য সহকারীর সাথে সহানুভূতিশীল কথোপকথন।',
      todayGlance: 'আজকের সামগ্রিক তথ্য',
      quickActions: 'দ্রুত পদক্ষেপ',
      nutrition: 'পুষ্টি ও খাদ্য',
      medication: 'ওষুধের তালিকা',
      activity: 'শারীরিক ক্রিয়াকলাপ',
      asanas: 'গর্ভাবস্থার যোগাসন',
      tools: 'ক্লিনিক্যাল টুলস',
      trends: 'স্বাস্থ্য প্রবণতা',
      babyDev: 'শিশুর বিকাশ',
      mealPlan: 'সাপ্তাহিক খাবারের তালিকা',
      emergencyCard: 'জরুরী কার্ড',
      shareDoctor: 'ডাক্তারের রিপোর্ট',
      postpartum: 'প্রসবোত্তর মোড',
      waterIntake: 'জল গ্রহণ',
      medAdherence: 'ওষুধ সেবনের হার',
      dietPlan: 'খাদ্যের ধরণ',
      week: 'সপ্তাহ',
      trimester: 'ত্রৈমাসিক',
      updateProfile: 'প্রোফাইল আপডেট এবং বিশ্লেষণ করুন',
      contactDoctor: 'ডাক্তারের সাথে যোগাযোগ করুন',
      disclaimer: 'মাতৃনা AI শিক্ষামূলক স্বাস্থ্য নির্দেশিকা প্রদান করে। সর্বদা ডাক্তারের পরামর্শ নিন।',
      foodsToAvoid: 'বর্জনীয় খাবার',
      groceryList: 'বাজারের তালিকা'
    },

    es: {
      appName: 'Materna AI 2.0',
      welcome: 'Hola',
      chooseInputStyle: 'Elija su estilo de entrada',
      preciseInput: 'Entrada Precisa',
      preciseInputSub: 'Complete los parámetros guiados de salud.',
      talkAi: 'Hablar con Materna AI',
      talkAiSub: 'Tenga una conversación cálida con su asistente.',
      todayGlance: 'Hoy de un Vistazo',
      quickActions: 'Acciones Rápidas',
      nutrition: 'Nutrición',
      medication: 'Medicamentos',
      activity: 'Actividad Física',
      asanas: 'Asanas Prenatales',
      tools: 'Herramientas Clínicas',
      trends: 'Tendencias Maternas',
      babyDev: 'Desarrollo del Bebé',
      mealPlan: 'Plan de Comidas',
      emergencyCard: 'Tarjeta de Emergencia',
      shareDoctor: 'Compartir con Médico',
      postpartum: 'Modo Posparto',
      waterIntake: 'Consumo de Agua',
      medAdherence: 'Adherencia a Medicamentos',
      dietPlan: 'Tipo de Dieta',
      week: 'semanas',
      trimester: 'Trimestre',
      updateProfile: 'Actualizar y Analizar',
      contactDoctor: 'Contacte a su Médico',
      disclaimer: 'Materna AI brinda orientación de bienestar educativo. Siempre consulte con su obstetra.',
      foodsToAvoid: 'Alimentos a Evitar',
      groceryList: 'Lista de Compras'
    }
  },

  t(key) {
    const langDict = this.translations[this.currentLang] || this.translations.en;
    return langDict[key] || this.translations.en[key] || key;
  },

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    this.currentLang = lang;
    const settings = window.StorageEngine?.get(STORAGE_KEYS.SETTINGS, {}) || {};
    settings.language = lang;
    window.StorageEngine?.set(STORAGE_KEYS.SETTINGS, settings);
    this.updateDomTranslations();
  },

  updateDomTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        if (el.tagName === 'INPUT' && el.placeholder) {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });
  }
};

window.I18nEngine = I18nEngine;
