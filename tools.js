/**
 * MATERNA AI 2.0 - CLINICAL TOOLS & LOGGERS
 * - Kick Counter (Cardiff Count-to-10 Protocol)
 * - Contraction Timer with 5-1-1 Hospital Alert
 * - 4-7-8 Guided Relaxation Breathing Widget
 * - Medication Reminder Notifications & Snooze
 * - Clinical Appointment Scheduler & Document Uploader
 */

const ClinicalTools = {
  // 1. KICK COUNTER (Third Trimester Cardiff Method)
  kickSession: {
    active: false,
    count: 0,
    startTime: null,
    timerInterval: null,
    elapsedSeconds: 0
  },

  startKickSession() {
    this.kickSession.active = true;
    this.kickSession.count = 0;
    this.kickSession.startTime = Date.now();
    this.kickSession.elapsedSeconds = 0;

    clearInterval(this.kickSession.timerInterval);
    this.kickSession.timerInterval = setInterval(() => {
      this.kickSession.elapsedSeconds++;
      this.updateKickUI();
    }, 1000);

    this.updateKickUI();
    window.App?.showToast('Kick counter started. Lie on your left side and relax! 🦶', 'info');
  },

  recordKick() {
    if (!this.kickSession.active) {
      this.startKickSession();
    }
    this.kickSession.count++;
    this.updateKickUI();

    // Haptic feedback if supported on mobile
    if ('vibrate' in navigator) navigator.vibrate(50);

    if (this.kickSession.count >= 10) {
      this.finishKickSession(true);
    }
  },

  finishKickSession(reachedTen = false) {
    clearInterval(this.kickSession.timerInterval);
    const durationMin = Math.round(this.kickSession.elapsedSeconds / 60);
    const count = this.kickSession.count;

    // Save to storage
    const kicks = window.StorageEngine?.get(STORAGE_KEYS.KICKS, []) || [];
    kicks.unshift({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      count,
      durationMin: Math.max(1, durationMin),
      completedGoal: reachedTen
    });
    window.StorageEngine?.set(STORAGE_KEYS.KICKS, kicks.slice(0, 30));

    this.kickSession.active = false;
    this.updateKickUI();

    if (reachedTen) {
      window.App?.showToast(`🎉 Goal achieved! 10 kicks recorded in ${durationMin} minutes. Great baby vitality!`, 'success');
    } else {
      window.App?.showToast(`Kick session saved (${count} kicks in ${durationMin} min).`, 'info');
    }
    this.renderKickHistory();
  },

  resetKickSession() {
    clearInterval(this.kickSession.timerInterval);
    this.kickSession.active = false;
    this.kickSession.count = 0;
    this.kickSession.elapsedSeconds = 0;
    this.updateKickUI();
  },

  updateKickUI() {
    const countEl = document.getElementById('kickCountVal');
    const timerEl = document.getElementById('kickTimerVal');
    const kickBtn = document.getElementById('recordKickBtn');
    if (countEl) countEl.textContent = this.kickSession.count;
    if (timerEl) {
      const mins = Math.floor(this.kickSession.elapsedSeconds / 60).toString().padStart(2, '0');
      const secs = (this.kickSession.elapsedSeconds % 60).toString().padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }
    if (kickBtn) {
      kickBtn.textContent = this.kickSession.active ? `Tap Kick (${this.kickSession.count}/10)` : 'Start & Tap Kick';
    }
  },

  renderKickHistory() {
    const listEl = document.getElementById('kickHistoryList');
    if (!listEl) return;
    const kicks = window.StorageEngine?.get(STORAGE_KEYS.KICKS, []) || [];
    if (kicks.length === 0) {
      listEl.innerHTML = '<p class="form-hint" style="text-align:center; padding: 1rem;">No kick sessions recorded yet.</p>';
      return;
    }
    listEl.innerHTML = kicks.map(k => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.65rem; border-bottom: 1px solid var(--border); font-size:0.85rem;">
        <div>
          <b>${k.count} kicks</b> in ${k.durationMin} min
          <div style="font-size:0.75rem; color:var(--text-muted);">${k.date}</div>
        </div>
        <span class="pill ${k.completedGoal ? 'pill-success' : 'pill-info'}">${k.completedGoal ? '✓ 10 Reached' : 'Partial'}</span>
      </div>
    `).join('');
  },

  // 2. CONTRACTION TIMER & 5-1-1 RULE ALERT
  contractionState: {
    active: false,
    startTime: null,
    intervalTimer: null,
    elapsedSeconds: 0
  },

  toggleContraction() {
    if (!this.contractionState.active) {
      // Start contraction
      this.contractionState.active = true;
      this.contractionState.startTime = Date.now();
      this.contractionState.elapsedSeconds = 0;
      clearInterval(this.contractionState.intervalTimer);
      this.contractionState.intervalTimer = setInterval(() => {
        this.contractionState.elapsedSeconds++;
        const timerEl = document.getElementById('contractionTimerDisplay');
        if (timerEl) {
          const s = this.contractionState.elapsedSeconds;
          timerEl.textContent = `${Math.floor(s/60)}m ${s%60}s`;
        }
      }, 1000);

      const btn = document.getElementById('toggleContractionBtn');
      if (btn) {
        btn.textContent = '⏹ Stop Contraction';
        btn.className = 'btn btn-danger btn-block';
      }
    } else {
      // Stop contraction
      clearInterval(this.contractionState.intervalTimer);
      const durationSec = this.contractionState.elapsedSeconds;
      const now = Date.now();
      const contractions = window.StorageEngine?.get(STORAGE_KEYS.CONTRACTIONS, []) || [];

      // Calculate interval from previous contraction
      let intervalMin = null;
      if (contractions.length > 0) {
        const prevStart = new Date(contractions[0].timestamp).getTime();
        intervalMin = parseFloat(((this.contractionState.startTime - prevStart) / (1000 * 60)).toFixed(1));
      }

      contractions.unshift({
        timestamp: new Date(this.contractionState.startTime).toISOString(),
        timeStr: new Date(this.contractionState.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationSec,
        intervalMin
      });

      window.StorageEngine?.set(STORAGE_KEYS.CONTRACTIONS, contractions.slice(0, 30));

      this.contractionState.active = false;
      this.contractionState.elapsedSeconds = 0;

      const btn = document.getElementById('toggleContractionBtn');
      if (btn) {
        btn.textContent = '▶ Contraction Started';
        btn.className = 'btn btn-primary btn-block';
      }
      const timerEl = document.getElementById('contractionTimerDisplay');
      if (timerEl) timerEl.textContent = '0m 00s';

      this.renderContractionHistory();
      this.check511Rule(contractions);
    }
  },

  check511Rule(contractions) {
    if (contractions.length < 3) return;
    // Check if recent contractions are ~5 min apart and ~60s long
    const recent = contractions.slice(0, 3);
    const avgDuration = recent.reduce((sum, c) => sum + c.durationSec, 0) / recent.length;
    const avgInterval = recent.reduce((sum, c) => sum + (c.intervalMin || 5), 0) / recent.length;

    const alertBanner = document.getElementById('contractionAlertBanner');
    if (!alertBanner) return;

    if (avgInterval <= 5.5 && avgDuration >= 45) {
      alertBanner.style.display = 'block';
      alertBanner.innerHTML = `
        <div class="emergency-redflag-card" style="margin-top:1rem;">
          <strong>🚨 5-1-1 Rule Alert: Active Labor Pattern Detected!</strong>
          <p style="margin: 0.35rem 0 0.75rem 0; font-size:0.85rem;">
            Your contractions are approximately 5 minutes apart and lasting nearly 1 minute.
            It is likely time to contact your hospital maternity ward and head in!
          </p>
          <a href="tel:${window.StorageEngine?.get(STORAGE_KEYS.PROFILE)?.doctorPhone || '108'}" class="btn btn-danger btn-sm">📞 Call Maternity Triage</a>
        </div>
      `;
    } else {
      alertBanner.style.display = 'none';
    }
  },

  renderContractionHistory() {
    const listEl = document.getElementById('contractionHistoryList');
    if (!listEl) return;
    const contractions = window.StorageEngine?.get(STORAGE_KEYS.CONTRACTIONS, []) || [];
    if (contractions.length === 0) {
      listEl.innerHTML = '<p class="form-hint" style="text-align:center; padding: 1rem;">No contractions recorded yet.</p>';
      return;
    }
    listEl.innerHTML = contractions.slice(0, 8).map(c => `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 0.65rem; border-bottom: 1px solid var(--border); font-size:0.85rem;">
        <div>
          <b>${c.timeStr}</b>
          <div style="font-size:0.75rem; color:var(--text-muted);">Duration: ${c.durationSec}s</div>
        </div>
        <span class="pill pill-info">${c.intervalMin ? `${c.intervalMin}m apart` : 'First'}</span>
      </div>
    `).join('');
  },

  // 3. 4-7-8 GUIDED BREATHING WIDGET
  breathing: {
    active: false,
    phase: 'idle', // 'inhale' (4s), 'hold' (7s), 'exhale' (8s)
    timer: null,
    countdown: 0
  },

  toggleBreathing() {
    const btn = document.getElementById('breathingToggleBtn');
    if (this.breathing.active) {
      this.stopBreathing();
      if (btn) btn.textContent = 'Start Guided Breathing';
    } else {
      this.startBreathing();
      if (btn) btn.textContent = 'Stop Breathing Exercise';
    }
  },

  startBreathing() {
    this.breathing.active = true;
    this.runBreathingCycle();
  },

  runBreathingCycle() {
    if (!this.breathing.active) return;
    const circle = document.getElementById('breathingCircle');
    const label = document.getElementById('breathingInstruction');

    // 1. Inhale (4 seconds)
    this.breathing.phase = 'inhale';
    if (circle) {
      circle.className = 'breathing-circle inhale';
      circle.style.transition = 'transform 4s ease-out';
    }
    if (label) label.textContent = 'Breathe in gently through your nose (4s)... 🌿';

    this.breathing.timer = setTimeout(() => {
      if (!this.breathing.active) return;

      // 2. Hold (7 seconds)
      this.breathing.phase = 'hold';
      if (circle) {
        circle.className = 'breathing-circle hold';
        circle.style.transition = 'none';
      }
      if (label) label.textContent = 'Hold your breath gently, relaxing shoulders (7s)... ✨';

      this.breathing.timer = setTimeout(() => {
        if (!this.breathing.active) return;

        // 3. Exhale (8 seconds)
        this.breathing.phase = 'exhale';
        if (circle) {
          circle.className = 'breathing-circle exhale';
          circle.style.transition = 'transform 8s ease-in-out';
        }
        if (label) label.textContent = 'Slowly exhale through your mouth with a soft whoosh (8s)... 💨';

        this.breathing.timer = setTimeout(() => {
          if (this.breathing.active) this.runBreathingCycle();
        }, 8000);
      }, 7000);
    }, 4000);
  },

  stopBreathing() {
    this.breathing.active = false;
    clearTimeout(this.breathing.timer);
    const circle = document.getElementById('breathingCircle');
    const label = document.getElementById('breathingInstruction');
    if (circle) circle.className = 'breathing-circle';
    if (label) label.textContent = 'Ready to relax. Press Start.';
  },

  // 4. MEDICATION REMINDERS & NOTIFICATIONS
  requestNotificationPermission() {
    if (!('Notification' in window)) {
      window.App?.showToast('Browser notifications not supported on this device.', 'warning');
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        window.App?.showToast('Medication reminders enabled! 🔔', 'success');
        new Notification('Materna AI Reminders Active', {
          body: 'We will gently remind you of your daily prenatal vitamins and hydration.',
          icon: './icons/favicon.svg'
        });
      }
    });
  },

  snoozeMed(medId, minutes = 15) {
    window.App?.showToast(`Medication reminder snoozed for ${minutes} minutes. ⏰`, 'info');
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Medication Reminder (Snooze)', {
          body: 'Time to take your scheduled dose.',
          icon: './icons/favicon.svg'
        });
      }
    }, minutes * 60 * 1000);
  },

  // 5. APPOINTMENT SCHEDULER & DOCUMENT UPLOAD
  addAppointment(apt) {
    const appointments = window.StorageEngine?.get(STORAGE_KEYS.APPOINTMENTS, []) || [];
    appointments.push({
      id: 'apt-' + Date.now(),
      title: apt.title,
      doctor: apt.doctor,
      date: apt.date,
      status: 'upcoming',
      notes: apt.notes || '',
      docFile: apt.docFile || null
    });
    window.StorageEngine?.set(STORAGE_KEYS.APPOINTMENTS, appointments);
    window.App?.showToast('Appointment added to schedule! 📅', 'success');
  }
};

window.ClinicalTools = ClinicalTools;
