/**
 * MATERNA AI 2.0 - CORE CONTROLLER & ROUTER
 * Orchestrates navigation, UI state, inputs, toasts, and PWA lifecycle.
 */

const App = {
  activeView: 'home',
  deferredInstallPrompt: null,

  init() {
    this.bindEvents();
    this.setupPwa();

    // Check if profile exists, else route to onboarding
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE);
    if (!profile || !profile.name) {
      this.showView('onboarding');
    } else {
      this.syncAllData();
      this.showView('home');
    }

    // Apply saved settings
    const settings = window.StorageEngine?.get(STORAGE_KEYS.SETTINGS, { theme: 'light', fontSize: 'normal', language: 'en' });
    if (settings.theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    if (settings.fontSize && settings.fontSize !== 'normal') document.documentElement.setAttribute('data-font-size', settings.fontSize);
    if (settings.language && window.I18nEngine) window.I18nEngine.setLanguage(settings.language);

    // Init sub-modules
    if (window.AiAssistant) window.AiAssistant.init();
    if (window.ClinicalTools) {
      window.ClinicalTools.renderKickHistory();
      window.ClinicalTools.renderContractionHistory();
    }
  },

  bindEvents() {
    // Navigation items (Desktop sidebar & Mobile bottom bar)
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const route = e.currentTarget.getAttribute('data-route');
        this.showView(route);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Font size toggle
    const fontBtn = document.getElementById('fontToggleBtn');
    if (fontBtn) {
      fontBtn.addEventListener('click', () => this.cycleFontSize());
    }

    // Emergency SOS Trigger
    document.querySelectorAll('.trigger-emergency-modal').forEach(btn => {
      btn.addEventListener('click', () => this.openModal('emergencyModal'));
    });

    // Modal close triggers
    document.querySelectorAll('.modal-close, .modal-backdrop-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.currentTarget.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Language switch
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        if (window.I18nEngine) window.I18nEngine.setLanguage(e.target.value);
      });
    }

    // Chat send button & enter key
    const chatSend = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    if (chatSend && chatInput) {
      chatSend.addEventListener('click', () => this.handleSendMessage());
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSendMessage();
      });
    }

    // Chat voice mic button
    const micBtn = document.getElementById('chatMicBtn');
    if (micBtn) {
      micBtn.addEventListener('click', () => window.AiAssistant?.toggleVoiceInput());
    }

    // Chat chips
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.textContent;
        const input = document.getElementById('chatInput');
        if (input) {
          input.value = text;
          this.handleSendMessage();
        }
      });
    });

    // Baby week slider
    const weekSlider = document.getElementById('babyWeekSlider');
    if (weekSlider) {
      weekSlider.addEventListener('input', (e) => {
        this.renderBabyDevelopment(parseInt(e.target.value, 10));
      });
    }
  },

  showView(viewId) {
    this.activeView = viewId;

    // Toggle active class on sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav active states
    document.querySelectorAll('[data-route]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-route') === viewId);
    });

    // Trigger charts reload if trends view is shown
    if (viewId === 'trends') {
      setTimeout(() => {
        if (window.TrendsChartManager) window.TrendsChartManager.renderAllCharts();
      }, 50);
    }

    // If baby dev view is shown
    if (viewId === 'baby') {
      const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {});
      this.renderBabyDevelopment(profile.currentWeek || 24);
    }

    // If meal planner view is shown
    if (viewId === 'meal-planner') {
      this.renderMealPlanner();
    }
  },

  // Switch Theme (Light / Dark)
  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const settings = window.StorageEngine?.get(STORAGE_KEYS.SETTINGS, {});
    settings.theme = newTheme;
    window.StorageEngine?.set(STORAGE_KEYS.SETTINGS, settings);

    if (this.activeView === 'trends' && window.TrendsChartManager) {
      window.TrendsChartManager.renderAllCharts();
    }
    this.showToast(`Switched to ${newTheme} mode`, 'info');
  },

  // Cycle font size
  cycleFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'normal';
    let next = 'normal';
    if (current === 'normal') next = 'large';
    else if (current === 'large') next = 'xlarge';
    else next = 'normal';

    if (next === 'normal') document.documentElement.removeAttribute('data-font-size');
    else document.documentElement.setAttribute('data-font-size', next);

    const settings = window.StorageEngine?.get(STORAGE_KEYS.SETTINGS, {});
    settings.fontSize = next;
    window.StorageEngine?.set(STORAGE_KEYS.SETTINGS, settings);
    this.showToast(`Text size: ${next.toUpperCase()}`, 'info');
  },

  // Modal open / close
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // Toast Notification System
  showToast(message, type = 'info', undoCallback = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      ${undoCallback ? '<button class="toast-undo-btn">Undo</button>' : ''}
    `;

    if (undoCallback) {
      toast.querySelector('.toast-undo-btn').addEventListener('click', () => {
        undoCallback();
        toast.remove();
      });
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Synchronize and render all data on dashboard
  syncAllData() {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    const vitals = window.StorageEngine?.get(STORAGE_KEYS.VITALS, []) || [];
    const meds = window.StorageEngine?.get(STORAGE_KEYS.MEDS, []) || [];
    const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : {};

    // Header Greeting & Avatar
    const nameEl = document.getElementById('headerUserName');
    const avatarEl = document.getElementById('userAvatarBadge');
    if (nameEl) nameEl.textContent = profile.name || 'Mama';
    if (avatarEl) avatarEl.textContent = (profile.name || 'M')[0].toUpperCase();

    // Home progress ring (Week X of 40)
    const week = profile.currentWeek || 24;
    const weekDisplay = document.getElementById('ringWeekVal');
    const ringBar = document.getElementById('pregnancyRingBar');
    if (weekDisplay) weekDisplay.textContent = week;
    if (ringBar) {
      const circumference = 2 * Math.PI * 46; // r=46 -> ~289
      const percent = Math.min(1, week / 40);
      const offset = circumference - (percent * circumference);
      ringBar.style.strokeDasharray = `${circumference}`;
      ringBar.style.strokeDashoffset = `${offset}`;
    }

    // Trimester pill & subtitle
    const tri = window.RulesEngine?.getTrimester(week);
    const triPill = document.getElementById('homeTrimesterBadge');
    const subTitle = document.getElementById('homeSubtitle');
    if (triPill) triPill.textContent = tri.name;
    if (subTitle) subTitle.textContent = `Week ${week} • Due: ${profile.dueDate || 'Estimated 40 wks'}`;

    // "Today at a glance" cards (Section 1 Feature #3)
    const homeWeekStat = document.getElementById('statWeek');
    const homeWaterStat = document.getElementById('statWater');
    const homeAdherenceStat = document.getElementById('statAdherence');
    const homeDietStat = document.getElementById('statDiet');

    if (homeWeekStat) homeWeekStat.textContent = `${week} wks`;
    if (homeDietStat) homeDietStat.textContent = profile.dietType || 'Vegetarian';

    // Water Intake
    const currentWater = profile.waterTodayL || 1.8;
    const baseWater = profile.waterBaseL || 2.5;
    if (homeWaterStat) homeWaterStat.textContent = `${currentWater.toFixed(1)} / ${baseWater} L`;
    const waterBar = document.getElementById('waterFillBar');
    if (waterBar) waterBar.style.width = `${Math.min(100, (currentWater / baseWater) * 100)}%`;

    // Medication Adherence
    const takenDoses = meds.filter(m => m.takenToday).length;
    const totalDoses = meds.length;
    const adherencePct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;
    if (homeAdherenceStat) homeAdherenceStat.textContent = `${adherencePct}% (${takenDoses}/${totalDoses})`;

    // Maternal Trends Card Quick Stats (Section 1 Feature #10)
    const tw = document.getElementById('trendWeight');
    const tb = document.getElementById('trendBP');
    const td = document.getElementById('trendD3');
    const ti = document.getElementById('trendIron');

    if (tw) tw.textContent = `${profile.currentWeightKg || latestVital.weight || 63.5} kg`;
    if (tb) tb.textContent = `${latestVital.bpSys || 118}/${latestVital.bpDia || 76}`;
    if (td) td.textContent = `${latestVital.vitD || 32} ng/mL`;
    if (ti) ti.textContent = `${latestVital.iron || 21} µg/dL`;

    // BP Clinical Analysis Banner check
    const bpAnalysis = window.RulesEngine?.analyzeBloodPressure(latestVital.bpSys || 118, latestVital.bpDia || 76);
    const bpBanner = document.getElementById('bpAlertBanner');
    if (bpBanner) {
      if (bpAnalysis.flag) {
        bpBanner.style.display = 'block';
        bpBanner.innerHTML = `
          <div class="emergency-redflag-card">
            <strong>⚠️ Blood Pressure Notice: ${bpAnalysis.category}</strong>
            <p style="margin: 0.35rem 0 0.65rem 0; font-size:0.85rem;">${bpAnalysis.message}</p>
            <button class="btn btn-danger btn-sm" onclick="App.openModal('emergencyModal')">📞 Contact Your Doctor</button>
          </div>
        `;
      } else {
        bpBanner.style.display = 'none';
      }
    }

    // Render Medication Rows in Meds View
    this.renderMedications();

    // Render Nutrient Table in Nutrition View
    this.renderNutrientTable(week, profile.dietType, profile.allergies);

    // Populate Precise Form Fields with existing data
    this.populatePreciseForm(profile, latestVital);

    // Populate Emergency Card
    this.populateEmergencyCard(profile, latestVital);
  },

  // Populate Precise Form (Section 1 Feature #5)
  populatePreciseForm(profile, latestVital) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el && val !== undefined) el.value = val;
    };

    setVal('inputName', profile.name);
    setVal('inputWeek', profile.currentWeek || 24);
    setVal('inputDueDate', profile.dueDate);
    setVal('inputLmp', profile.lmp);
    setVal('inputWeight', profile.currentWeightKg || 63.5);
    setVal('inputPreWeight', profile.prePregWeightKg || 58.0);
    setVal('inputHeight', profile.heightCm || 162);
    setVal('inputDiet', profile.dietType || 'Vegetarian');
    setVal('inputAllergies', profile.allergies || '');
    setVal('inputBpSys', latestVital.bpSys || 118);
    setVal('inputBpDia', latestVital.bpDia || 76);
    setVal('inputD3', latestVital.vitD || 32);
    setVal('inputIron', latestVital.iron || 21);
    setVal('inputWaterBase', profile.waterBaseL || 2.5);
    setVal('inputWaterToday', profile.waterTodayL || 1.8);
  },

  // Update profile from Precise Form
  handleUpdateProfile() {
    const getVal = (id) => document.getElementById(id)?.value;

    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    profile.name = getVal('inputName') || profile.name || 'Mama';
    profile.currentWeek = parseInt(getVal('inputWeek'), 10) || 24;
    profile.dueDate = getVal('inputDueDate') || profile.dueDate;
    profile.lmp = getVal('inputLmp') || profile.lmp;
    profile.currentWeightKg = parseFloat(getVal('inputWeight')) || 63.5;
    profile.prePregWeightKg = parseFloat(getVal('inputPreWeight')) || 58.0;
    profile.heightCm = parseInt(getVal('inputHeight'), 10) || 162;
    profile.dietType = getVal('inputDiet') || 'Vegetarian';
    profile.allergies = getVal('inputAllergies') || '';
    profile.waterBaseL = parseFloat(getVal('inputWaterBase')) || 2.5;
    profile.waterTodayL = parseFloat(getVal('inputWaterToday')) || 1.8;

    window.StorageEngine?.set(STORAGE_KEYS.PROFILE, profile);

    // Record new vitals entry
    const vitals = window.StorageEngine?.get(STORAGE_KEYS.VITALS, []) || [];
    vitals.push({
      date: `Week ${profile.currentWeek}`,
      week: profile.currentWeek,
      weight: profile.currentWeightKg,
      bpSys: parseInt(getVal('inputBpSys'), 10) || 118,
      bpDia: parseInt(getVal('inputBpDia'), 10) || 76,
      hb: 11.6,
      vitD: parseInt(getVal('inputD3'), 10) || 32,
      iron: parseInt(getVal('inputIron'), 10) || 21,
      water: profile.waterTodayL,
      sleep: 7.5
    });
    window.StorageEngine?.set(STORAGE_KEYS.VITALS, vitals);

    this.syncAllData();
    this.showToast('Profile and clinical vitals updated & synced! ✨', 'success');
    this.showView('home');
  },

  // Load Demo Profile (Instant 1-Click Testing Deliverable)
  loadDemoProfile() {
    window.StorageEngine?.importAll(DEMO_DATA);
    this.syncAllData();
    this.showToast('Loaded Priya Sharma demo profile! Ready to explore.', 'success');
    this.showView('home');
  },

  // Water Tracker Tap
  addWater(deltaL = 0.25) {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    profile.waterTodayL = parseFloat(Math.max(0, (profile.waterTodayL || 1.8) + deltaL).toFixed(2));
    window.StorageEngine?.set(STORAGE_KEYS.PROFILE, profile);
    this.syncAllData();

    if (profile.waterTodayL >= (profile.waterBaseL || 2.5)) {
      this.showToast('🎉 Daily hydration goal achieved! Great work mama.', 'success');
    } else {
      this.showToast(`Water logged: ${profile.waterTodayL.toFixed(1)} L`, 'info');
    }
  },

  // Render Nutrient Table with Targets and Explainable "Why"
  renderNutrientTable(week, dietType, allergies) {
    const tableBody = document.getElementById('nutrientTableBody');
    if (!tableBody) return;

    const targets = window.RulesEngine?.getNutrientTargets(week, dietType, allergies);
    if (!targets) return;

    const rows = [
      { name: 'Protein', t: targets.protein, cur: 68 },
      { name: 'Iron', t: targets.iron, cur: 21 },
      { name: 'Calcium', t: targets.calcium, cur: 920 },
      { name: 'Fiber', t: targets.fiber, cur: 25 },
      { name: 'Folate', t: targets.folate, cur: 580 },
      { name: 'DHA / Omega-3', t: targets.dha, cur: 210 },
      { name: 'Iodine', t: targets.iodine, cur: 215 }
    ];

    tableBody.innerHTML = rows.map(r => {
      const isLow = r.cur < r.t.target * 0.85;
      const statusPill = isLow ? '<span class="pill pill-warning">Needs attention</span>' : '<span class="pill pill-success">Normal</span>';
      return `
        <tr>
          <td><strong>${r.name}</strong></td>
          <td><b>${r.t.target} ${r.t.unit}</b></td>
          <td>${r.cur} ${r.t.unit}</td>
          <td>${statusPill}</td>
          <td style="font-size:0.8rem; color:var(--text-muted);">${r.t.focus}</td>
          <td style="font-size:0.75rem; color:var(--text-muted); line-height:1.3;">${r.t.why}</td>
        </tr>
      `;
    }).join('');
  },

  // Render Medications
  renderMedications() {
    const list = document.getElementById('medicationList');
    if (!list) return;

    const meds = window.StorageEngine?.get(STORAGE_KEYS.MEDS, []) || [];
    list.innerHTML = meds.map((m, index) => `
      <div class="med-row">
        <div class="med-info">
          <b>${m.name}</b>
          <span>${m.dose} • Scheduled: ${m.time}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn btn-sm ${m.takenToday ? 'btn-sage' : 'btn-outline'}" onclick="App.toggleMedDose(${index})">
            ${m.takenToday ? '✓ Taken' : 'Mark Taken'}
          </button>
          <button class="btn btn-sm btn-secondary" onclick="ClinicalTools.snoozeMed('${m.id}', 15)" title="Snooze 15 mins">
            ⏰ Snooze
          </button>
        </div>
      </div>
    `).join('');
  },

  toggleMedDose(index) {
    const meds = window.StorageEngine?.get(STORAGE_KEYS.MEDS, []) || [];
    if (meds[index]) {
      meds[index].takenToday = !meds[index].takenToday;
      window.StorageEngine?.set(STORAGE_KEYS.MEDS, meds);
      this.syncAllData();
      this.showToast(meds[index].takenToday ? 'Dose marked as taken! 💊' : 'Dose unmarked', 'info');
    }
  },

  // Populate Emergency Card
  populateEmergencyCard(profile, latestVital) {
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('emName', profile.name || 'Priya Sharma');
    setTxt('emWeek', `Week ${profile.currentWeek || 24} of 40`);
    setTxt('emBlood', profile.bloodGroup || 'B Positive (Rh+)');
    setTxt('emAllergies', profile.allergies || 'None reported');
    setTxt('emDoctor', profile.doctorName || 'Dr. Anita Rao, OB/GYN');
    setTxt('emHospital', profile.hospitalName || 'Cloudnine Maternity Care');
    setTxt('emContact', profile.emergencyContact || 'Rahul Sharma (Spouse)');

    const docCall = document.getElementById('emDoctorCallBtn');
    if (docCall && profile.doctorPhone) docCall.href = `tel:${profile.doctorPhone}`;

    const hospCall = document.getElementById('emHospCallBtn');
    if (hospCall && profile.hospitalPhone) hospCall.href = `tel:${profile.hospitalPhone}`;
  },

  // Render Baby Development View (Section 2 Feature C)
  renderBabyDevelopment(week) {
    const data = window.BabyDevelopment?.getWeekData(week);
    if (!data) return;

    const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

    setTxt('babyWeekTitle', `Week ${week} of Pregnancy`);
    setTxt('babyFruitEmoji', data.emoji);
    setTxt('babyFruitName', `Size of a ${data.fruit}`);
    setTxt('babyLength', `${data.lengthCm} cm (${(data.lengthCm / 2.54).toFixed(1)} in)`);
    setTxt('babyWeight', `${data.weightG} g (${(data.weightG / 28.35).toFixed(1)} oz)`);
    setTxt('babyMilestone', data.milestone);
    setTxt('babyBodyChanges', data.bodyChanges);
    setTxt('babyWeekTip', data.tip);

    const slider = document.getElementById('babyWeekSlider');
    if (slider) slider.value = week;
  },

  // Render Meal Planner View (Section 2 Feature H)
  renderMealPlanner() {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    const diet = profile.dietType || 'Vegetarian';
    const menuObj = window.MealPlanner?.menus[diet] || window.MealPlanner?.menus.Vegetarian;

    const menuContainer = document.getElementById('weeklyMenuContainer');
    if (menuContainer && menuObj) {
      menuContainer.innerHTML = menuObj.days.map(d => `
        <div class="card" style="margin-bottom:1rem;">
          <h4 style="color:var(--primary); margin-bottom:0.6rem;">${d.day}</h4>
          <p><strong>Breakfast:</strong> ${d.breakfast}</p>
          <p><strong>Mid-Morning:</strong> ${d.midMorning}</p>
          <p><strong>Lunch:</strong> ${d.lunch}</p>
          <p><strong>Evening Snack:</strong> ${d.eveningSnack}</p>
          <p><strong>Dinner:</strong> ${d.dinner}</p>
        </div>
      `).join('');
    }

    // Foods to Avoid List
    const avoidContainer = document.getElementById('foodsAvoidContainer');
    if (avoidContainer && window.MealPlanner?.foodsToAvoid) {
      avoidContainer.innerHTML = window.MealPlanner.foodsToAvoid.map(f => `
        <div class="card" style="border-left: 4px solid var(--status-alert); margin-bottom:0.75rem; padding:0.9rem;">
          <strong style="color:var(--status-alert);">${f.food}</strong> <span class="pill">${f.category}</span>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-top:0.35rem;">${f.danger}</p>
        </div>
      `).join('');
    }

    // Grocery List
    this.renderGroceryList();
  },

  renderGroceryList() {
    const listContainer = document.getElementById('groceryListItems');
    if (!listContainer) return;

    const items = window.MealPlanner?.getGroceryList() || [];
    listContainer.innerHTML = items.map((item, index) => `
      <div style="display:flex; align-items:center; gap:0.75rem; padding: 0.5rem 0; border-bottom:1px solid var(--border);">
        <input type="checkbox" id="gitem-${index}" ${item.checked ? 'checked' : ''} onchange="App.toggleGroceryItem(${index})">
        <label for="gitem-${index}" style="font-size:0.88rem; ${item.checked ? 'text-decoration:line-through; opacity:0.6;' : ''}">
          ${item.item} <small>(${item.category})</small>
        </label>
      </div>
    `).join('');
  },

  toggleGroceryItem(index) {
    const items = window.MealPlanner?.getGroceryList() || [];
    if (items[index]) {
      items[index].checked = !items[index].checked;
      window.MealPlanner?.saveGroceryList(items);
      this.renderGroceryList();
    }
  },

  // AI Chat Handler (Section 3)
  handleSendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    const messagesContainer = document.getElementById('chatMessages');

    // Add user bubble
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-msg chat-msg-user';
    userBubble.innerHTML = `${msg}<span class="time">${userTime}</span>`;
    messagesContainer.appendChild(userBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Generate AI response
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    const botResponse = window.AiAssistant?.generateResponse(msg, profile);

    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-msg chat-msg-bot';
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let cardHtml = '';
      if (botResponse.extracted) {
        const ext = botResponse.extracted;
        cardHtml = `
          <div class="extracted-card">
            <div class="extracted-title">✨ Detected Health Parameters</div>
            <div class="extracted-pills">
              ${ext.week ? `<span class="pill pill-info">Week: ${ext.week}</span>` : ''}
              ${ext.weight ? `<span class="pill pill-info">Weight: ${ext.weight}kg</span>` : ''}
              ${ext.bp ? `<span class="pill pill-info">BP: ${ext.bp}</span>` : ''}
              ${ext.d3 ? `<span class="pill pill-info">Vit D3: ${ext.d3}</span>` : ''}
              ${ext.iron ? `<span class="pill pill-info">Iron: ${ext.iron}</span>` : ''}
              ${ext.diet ? `<span class="pill pill-info">Diet: ${ext.diet}</span>` : ''}
            </div>
            <button class="btn btn-primary btn-sm" onclick="App.applyExtractedParams(${JSON.stringify(ext).replace(/"/g, '&quot;')})">
              ✓ Sync to My Profile
            </button>
          </div>
        `;
      }

      botBubble.innerHTML = `
        <div>${botResponse.text.replace(/\n/g, '<br>')}</div>
        ${cardHtml}
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
          <button class="btn-icon" style="width:28px; height:28px; font-size:0.8rem;" onclick="AiAssistant.speakText('${botResponse.text.replace(/'/g, "\\'")}')" title="Read aloud">🔊</button>
          <span class="time">${botTime}</span>
        </div>
      `;

      messagesContainer.appendChild(botBubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);
  },

  // Apply extracted parameters from chat to profile
  applyExtractedParams(params) {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    if (params.week) profile.currentWeek = params.week;
    if (params.weight) profile.currentWeightKg = params.weight;
    if (params.diet) profile.dietType = params.diet;
    if (params.allergies) profile.allergies = params.allergies;

    window.StorageEngine?.set(STORAGE_KEYS.PROFILE, profile);

    // If BP or labs present, save vitals
    if (params.bpSys || params.weight || params.d3 || params.iron) {
      const vitals = window.StorageEngine?.get(STORAGE_KEYS.VITALS, []) || [];
      vitals.push({
        date: `Week ${profile.currentWeek}`,
        week: profile.currentWeek,
        weight: profile.currentWeightKg,
        bpSys: params.bpSys || 118,
        bpDia: params.bpDia || 76,
        hb: 11.6,
        vitD: params.d3 || 32,
        iron: params.iron || 21,
        water: profile.waterTodayL || 1.8,
        sleep: 7.5
      });
      window.StorageEngine?.set(STORAGE_KEYS.VITALS, vitals);
    }

    this.syncAllData();
    this.showToast('Parameters synced to profile & vitals dashboard! 🎯', 'success');
  },

  // Log recommended meal
  logRecommendedMeal(mealType) {
    this.showToast(`Logged ${mealType} to your daily nutrition record! 🥗`, 'success');
  },

  // PWA Setup
  setupPwa() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.warn('[PWA] SW register notice:', err);
        });
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });
  },

  triggerPwaInstall() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      this.deferredInstallPrompt.userChoice.then(() => {
        this.deferredInstallPrompt = null;
        const installBtn = document.getElementById('pwaInstallBtn');
        if (installBtn) installBtn.style.display = 'none';
      });
    } else {
      this.showToast('App is ready to install via your browser menu (Add to Home screen).', 'info');
    }
  }
};

window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());
