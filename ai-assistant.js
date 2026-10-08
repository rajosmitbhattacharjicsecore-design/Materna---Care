/**
 * MATERNA AI 2.0 - EMPATHETIC AI ASSISTANT & NLP ENGINE
 * Specialized conversational companion for pregnancy care:
 * - Empathetic emotional counseling (mood swings, anxiety, fatigue)
 * - Free-text health parameter extraction & confirmation dialogs
 * - Trimester-aware nutritional recommendations with scientific sources
 * - Clinical guardrails & emergency red-flag interception
 * - Web Speech API: Voice recognition (STT) and voice speech synthesis (TTS)
 */

const AiAssistant = {
  // Speech synthesis & recognition state
  isListening: false,
  recognition: null,
  isSpeaking: false,

  init() {
    this.setupSpeechRecognition();
  },

  // Speech Recognition Setup (Web Speech API)
  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        const micBtn = document.getElementById('chatMicBtn');
        if (micBtn) {
          micBtn.classList.add('recording');
          micBtn.title = 'Listening... Speak now';
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatInput');
        if (input) {
          input.value = transcript;
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('[SpeechRecognition] Error:', event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    }
  },

  toggleVoiceInput() {
    if (!this.recognition) {
      window.App?.showToast('Voice input is not supported in this browser.', 'warning');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.stopListening();
    } else {
      try {
        const lang = window.StorageEngine?.get(STORAGE_KEYS.SETTINGS)?.language || 'en';
        this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : lang === 'es' ? 'es-ES' : 'en-US';
        this.recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  },

  stopListening() {
    this.isListening = false;
    const micBtn = document.getElementById('chatMicBtn');
    if (micBtn) {
      micBtn.classList.remove('recording');
      micBtn.title = 'Click to speak';
    }
  },

  // Text-to-Speech (TTS)
  speakText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Clean markdown/emojis for smoother vocalization
    const cleanText = text.replace(/[*_#`]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Gentle, soothing cadence
    utterance.pitch = 1.05;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  },

  // Extract structured parameters from free text (Section 1 Feature 2b & Section 3)
  extractHealthParameters(text) {
    const extracted = {};

    // Pregnancy week: "week 24", "24 weeks", "24th week"
    const weekMatch = text.match(/(?:week|wk)\s*(\d{1,2})|(\d{1,2})\s*(?:weeks|wks|th\s+week)/i);
    if (weekMatch) {
      const w = parseInt(weekMatch[1] || weekMatch[2], 10);
      if (w >= 1 && w <= 42) extracted.week = w;
    }

    // Weight: "weight 63kg", "63.5 kg", "63 kilos", "140 lbs"
    const weightMatch = text.match(/(?:weight\s*(?:is|:)?\s*)?(\d{2,3}(?:\.\d)?)\s*(?:kg|kgs|kilos|lbs)/i) ||
                        text.match(/(\d{2,3}(?:\.\d)?)\s*(?:kg|kgs|kilos)/i);
    if (weightMatch) {
      const wt = parseFloat(weightMatch[1]);
      if (wt >= 35 && wt <= 200) extracted.weight = wt;
    }

    // Blood Pressure: "120/80", "118 / 76", "bp 130 85", "bp 140/90"
    const bpMatch = text.match(/(?:bp\s*(?:is|:)?\s*)?(\d{2,3})\s*(?:\/|\s+over\s+|\s+)\s*(\d{2,3})/i);
    if (bpMatch) {
      const sys = parseInt(bpMatch[1], 10);
      const dia = parseInt(bpMatch[2], 10);
      if (sys >= 70 && sys <= 240 && dia >= 40 && dia <= 140) {
        extracted.bp = `${sys}/${dia}`;
        extracted.bpSys = sys;
        extracted.bpDia = dia;
      }
    }

    // Vitamin D3: "d3 32", "vit d 35 ng/ml", "vitamin d3 is 28"
    const d3Match = text.match(/(?:vit(?:amin)?\s*d(?:3)?\s*(?:is|:)?\s*)(\d{1,3})/i);
    if (d3Match) {
      extracted.d3 = parseInt(d3Match[1], 10);
    }

    // Iron / Ferritin: "iron 22", "iron is 45", "ferritin 19"
    const ironMatch = text.match(/(?:iron|ferritin)\s*(?:is|:)?\s*(\d{1,3})/i);
    if (ironMatch) {
      extracted.iron = parseInt(ironMatch[1], 10);
    }

    // Height: "height 162cm", "162 cm", "5ft 4in"
    const heightMatch = text.match(/(?:height\s*(?:is|:)?\s*)?(\d{2,3})\s*(?:cm)/i);
    if (heightMatch) {
      extracted.height = parseInt(heightMatch[1], 10);
    }

    // Diet: "vegetarian", "non-vegetarian", "eggetarian", "vegan"
    if (/non-veg|chicken|fish|meat/i.test(text)) extracted.diet = 'Non-vegetarian';
    else if (/eggetarian|eggs/i.test(text)) extracted.diet = 'Eggetarian';
    else if (/vegan/i.test(text)) extracted.diet = 'Vegan';
    else if (/vegetarian|veg/i.test(text)) extracted.diet = 'Vegetarian';

    // Allergies: "allergic to peanuts", "peanut allergy", "gluten allergy"
    const allergyMatch = text.match(/(?:allergic to|allergy(?:\s+to)?)\s+([a-zA-Z\s]+)/i);
    if (allergyMatch) {
      extracted.allergies = allergyMatch[1].trim().split(/,|\sand\s/)[0];
    }

    return Object.keys(extracted).length > 0 ? extracted : null;
  },

  // Main response generator
  generateResponse(userMessage, profile) {
    const lower = userMessage.toLowerCase();

    // 1. Check for RED-FLAG EMERGENCY SYMPTOMS first!
    const redFlagCheck = RulesEngine.evaluateSymptoms([lower]);
    if (redFlagCheck.hasRedFlag) {
      return {
        text: `🚨 **IMPORTANT SAFETY ALERT: PLEASE SEEK IMMEDIATE MEDICAL CARE**\n\nI hear you, mama, and I want to keep you and your baby safe. What you just described (**${redFlagCheck.detectedFlags.join(', ')}**) is a potential red-flag symptom that needs immediate assessment by a qualified doctor.\n\n**Immediate Steps:**\n1. Stop what you are doing and sit or lie comfortably on your left side.\n2. **Call your obstetrician or hospital emergency helpline immediately.**\n3. Do not attempt to drive yourself.\n\n*Emergency Contact: ${profile.doctorName || 'Obstetrician'} (${profile.doctorPhone || 'Emergency Hospital'})*`,
        isEmergency: true,
        extracted: null
      };
    }

    // 2. Extract potential health parameters
    const extracted = this.extractHealthParameters(userMessage);

    // 3. Empathetic Pregnancy Support Scenarios:

    // A. Mood Swings & Hormonal Fluctuations
    if (/mood\s*swing|crying|anxious|overwhelm|feeling low|emotional|stress|hormon/i.test(lower)) {
      return {
        text: `I hear you so deeply, dear mama. 🌸 First, take a slow, gentle breath. What you are experiencing right now is completely normal and valid.

During pregnancy—especially with rapid shifts in progesterone and estrogen—the body's neurotransmitters are working overtime. Your brain and body are undergoing a monumental transformation.

**Comforting steps you can take right now:**
- **Give yourself permission to pause:** You do not have to have everything figured out today.
- **Try our 4-7-8 Breathing exercise** in the Tools menu (just 3 minutes helps soothe the parasympathetic nervous system).
- **Gentle nourishing sip:** Warm chamomile tea or a small glass of warm almond milk with saffron.
- **Share without pressure:** Let your partner or loved one know you just need a comforting hug, no solutions needed.

Would you like to try a 2-minute guided relaxation with me right now?`,
        extracted
      };
    }

    // B. Blood Pressure Query
    if (/bp|blood pressure|hypertension/i.test(lower)) {
      const bpAnalysis = RulesEngine.analyzeBloodPressure(profile.bpSys || 118, profile.bpDia || 76);
      return {
        text: `Let's look at your blood pressure, mama. 🩺

Your last recorded reading is **${profile.bpSys || 118}/${profile.bpDia || 76} mmHg**.
**Status:** ${bpAnalysis.category}
${bpAnalysis.message}

*Clinical reference: The American College of Obstetricians and Gynecologists (ACOG) defines normal prenatal BP as <120/<80 mmHg. Any reading ≥140/90 mmHg should be reported to your healthcare provider promptly.*

Would you like to record a fresh blood pressure reading right now?`,
        extracted
      };
    }

    // C. Nutrition / What should I eat?
    if (/what should i eat|food|diet|nutrition|eat today|craving|meal/i.test(lower)) {
      const tri = RulesEngine.getTrimester(profile.currentWeek || 24);
      const targets = RulesEngine.getNutrientTargets(profile.currentWeek || 24, profile.dietType || 'Vegetarian');
      return {
        text: `Here is nourishing guidance for you in **${tri.name}**, tailored to your **${profile.dietType || 'Vegetarian'}** preferences! 🥗

**Your Daily Nutritional Focus:**
- **Protein (${targets.protein.target}g target):** ${targets.protein.focus}.
- **Iron (${targets.iron.target}mg target):** Pair with Vitamin C (lemon squeeze or amla) to boost absorption by up to 300%. Avoid tea/coffee within 1 hour of meals.
- **Calcium (${targets.calcium.target}mg target):** Keeps maternal bone density protected as baby builds tooth buds and skeleton.
- **Hydration:** Aim for 2.3 to 2.8 Liters of pure water and coconut water daily.

Check out your **Meal Planner** tab for your full day's menu and grocery checklist!`,
        extracted
      };
    }

    // D. Nausea & Morning Sickness
    if (/nausea|morning sickness|vomit|queasy|throw up/i.test(lower)) {
      return {
        text: `Morning sickness can be so exhausting, mama. 💛 Even though it's called 'morning' sickness, it can strike at any hour due to elevated hCG and relaxed stomach sphincters.

**Gentle clinical self-care tips:**
- **Dry crackers or toast:** Keep a small bite by your bedside and nibble before your feet touch the floor.
- **Ginger infusion:** Sip fresh ginger water with lemon or chew on candied dry ginger.
- **Cold foods:** Often produce fewer aromatic triggers than hot, steamy dishes.
- **P6 Acupressure:** Press the inner wrist three finger-widths below the crease.

*Note: If you are unable to keep any fluids down for over 24 hours, contact your doctor for antiemetic support.*`,
        extracted
      };
    }

    // E. Heartburn & Acid Reflux
    if (/heartburn|acid|reflux|burning|chest burning/i.test(lower)) {
      return {
        text: `Heartburn is very common during the 2nd and 3rd trimesters because the hormone progesterone relaxes the esophageal valve, and baby's growing bump gently compresses the stomach.

**How to get relief naturally:**
- Eat **smaller, frequent meals** (5-6 mini meals) rather than 2-3 large plates.
- Sip cold milk or coconut water slowly when burning occurs.
- Avoid lying flat immediately after eating—keep your torso elevated with 2 pillows.
- Refrain from deep-fried, heavy spicy foods in the evening.`,
        extracted
      };
    }

    // F. Leg Cramps / Swelling
    if (/cramp|leg cramp|calf|swelling|feet hurt/i.test(lower)) {
      return {
        text: `Leg cramps, especially waking up in the middle of the night, are often tied to circulation pressure and calcium/magnesium balance.

**Immediate relief tips:**
- When a calf cramp hits: **Flex your foot upwards** (pull toes toward your shin), never point them down!
- Elevate your feet on a cushion when resting to promote venous return.
- Stay well-hydrated throughout the day and include a potassium-rich banana or handful of soaked almonds.
- Do a gentle 5-minute calf stretch against a wall before turning off the lights.`,
        extracted
      };
    }

    // G. Kick Counter & Baby Movements
    if (/kick|movement|baby moving|count kicks/i.test(lower)) {
      return {
        text: `Baby movements are the sweetest reassurance of fetal well-being! 👣

From Week 28 onwards, obstetricians recommend doing a **Kick Count** once or twice daily during baby's active window (often in the evening or after dinner):
- Lie quietly on your left side.
- Count until you reach **10 distinct movements** (kicks, rolls, flutters).
- Typically, you will feel 10 movements within 30 to 120 minutes.

You can use the **Kick Counter tool** in the Tools menu right now to log this!`,
        extracted
      };
    }

    // H. Safe Exercise / Yoga
    if (/exercise|walk|yoga|asana|workout|stretch/i.test(lower)) {
      return {
        text: `Movement during pregnancy improves stamina, lifts mood, and prepares the pelvic floor for birth! 🧘‍♀️

**Doctor-Approved Movements for Week ${profile.currentWeek || 24}:**
- **Gentle 30-min Walking:** The gold standard of prenatal cardiovascular health.
- **Cat-Cow (Marjaryasana-Bitilasana):** Excellent for releasing lumbar pressure and pelvic positioning.
- **Supported Bound Angle (Baddha Konasana):** Relieves groin tension with cushions.
- *Safety Rule: Avoid hot yoga, deep twists, lying flat on your back after 16 weeks, or anything with fall risks.*`,
        extracted
      };
    }

    // I. Default Warm Conversational Response with Parameter confirmation
    let fallbackText = `Thank you for sharing that with me, ${profile.name || 'mama'}. 🌸

Every step of pregnancy is unique, and I am right here by your side. `;

    if (extracted) {
      fallbackText += `I noticed some specific health details in your message. I have summarized them below so you can sync them to your wellness dashboard with one tap!`;
    } else {
      fallbackText += `How are your energy levels today? You can tell me about what you ate, log your medication, ask about safe pregnancy exercises, or describe any symptom you are experiencing.`;
    }

    return {
      text: fallbackText,
      extracted
    };
  }
};

window.AiAssistant = AiAssistant;
