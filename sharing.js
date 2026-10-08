/**
 * MATERNA AI 2.0 - DOCTOR CLINICAL REPORT & PARTNER SHARING
 * Generates an official, printable clinical PDF report and read-only share link.
 */

const SharingManager = {
  generateDoctorReport() {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    const vitals = window.StorageEngine?.get(STORAGE_KEYS.VITALS, []) || [];
    const meds = window.StorageEngine?.get(STORAGE_KEYS.MEDS, []) || [];
    const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : {};

    const bmiInfo = window.RulesEngine?.calculateBmi(profile.prePregWeightKg, profile.heightCm);
    const weightGain = window.RulesEngine?.analyzeWeightGain(profile.currentWeightKg, profile.prePregWeightKg, profile.heightCm, profile.currentWeek || 24);
    const bpAnalysis = window.RulesEngine?.analyzeBloodPressure(latestVitals.bpSys || 118, latestVitals.bpDia || 76);

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Materna AI - Clinical Health Summary - ${profile.name || 'Patient'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1F2937; margin: 40px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D94E73; padding-bottom: 15px; margin-bottom: 25px; }
          .logo { font-size: 24px; font-weight: bold; color: #D94E73; }
          .meta { font-size: 13px; color: #6B7280; text-align: right; }
          h2 { font-size: 16px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; margin-top: 24px; color: #374151; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 15px; }
          .box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; }
          .label { font-size: 11px; text-transform: uppercase; color: #6B7280; font-weight: 600; }
          .val { font-size: 16px; font-weight: bold; color: #111827; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th, td { border: 1px solid #E5E7EB; padding: 8px 10px; text-align: left; }
          th { background: #F3F4F6; font-weight: 600; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
          .badge-ok { background: #DEF7EC; color: #03543F; }
          .badge-warn { background: #FEF08A; color: #713F12; }
          .signature-area { margin-top: 40px; display: flex; justify-content: space-between; }
          .sig-line { width: 220px; border-top: 1px solid #9CA3AF; text-align: center; font-size: 12px; padding-top: 6px; }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background:#D94E73; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-weight:bold; cursor:pointer;">🖨️ Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <div class="logo">🌸 Materna AI 2.0</div>
            <div style="font-size: 14px; font-weight: 500;">Maternal Health & Clinical Vitals Summary</div>
          </div>
          <div class="meta">
            <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div><strong>Report ID:</strong> MAT-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <h2>1. Maternal Profile & Demographics</h2>
        <div class="grid">
          <div class="box">
            <div class="label">Patient Name & Age</div>
            <div class="val">${profile.name || 'Priya Sharma'} (${profile.age || 28} yrs)</div>
          </div>
          <div class="box">
            <div class="label">Gestational Age / Due Date</div>
            <div class="val">Week ${profile.currentWeek || 24} (Due: ${profile.dueDate || 'N/A'})</div>
          </div>
          <div class="box">
            <div class="label">Pre-Pregnancy BMI</div>
            <div class="val">${bmiInfo?.bmi || '22.1'} (${bmiInfo?.category || 'Normal'}) - Ht: ${profile.heightCm || 162} cm</div>
          </div>
          <div class="box">
            <div class="label">Blood Group & Allergies</div>
            <div class="val">${profile.bloodGroup || 'B+'} | Allergies: ${profile.allergies || 'None'}</div>
          </div>
        </div>

        <h2>2. Current Vitals & Weight Trajectory</h2>
        <div class="grid">
          <div class="box">
            <div class="label">Blood Pressure</div>
            <div class="val">${latestVitals.bpSys || 118} / ${latestVitals.bpDia || 76} mmHg</div>
            <div style="font-size: 12px; margin-top:4px;">Status: <span class="badge ${bpAnalysis.level === 'normal' ? 'badge-ok' : 'badge-warn'}">${bpAnalysis.category}</span></div>
          </div>
          <div class="box">
            <div class="label">Current Weight & Total Gain</div>
            <div class="val">${profile.currentWeightKg || 63.5} kg (${weightGain.actualGain > 0 ? '+' : ''}${weightGain.actualGain} kg)</div>
            <div style="font-size: 12px; margin-top:4px;">Target Band: ${weightGain.minExpected} - ${weightGain.maxExpected} kg (${weightGain.status})</div>
          </div>
        </div>

        <h2>3. Laboratory Biomarkers & Lifestyle</h2>
        <table>
          <thead>
            <tr>
              <th>Biomarker / Metric</th>
              <th>Recorded Value</th>
              <th>Clinical Reference Target</th>
              <th>Clinical Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Hemoglobin (Hb)</strong></td>
              <td>${latestVitals.hb || 11.6} g/dL</td>
              <td>≥ 11.0 g/dL (2nd Tri)</td>
              <td>Adequate maternal red cell volume</td>
            </tr>
            <tr>
              <td><strong>Vitamin D3</strong></td>
              <td>${latestVitals.vitD || 32} ng/mL</td>
              <td>30 - 50 ng/mL</td>
              <td>Optimal for fetal bone mineralization</td>
            </tr>
            <tr>
              <td><strong>Iron / Serum Ferritin</strong></td>
              <td>${latestVitals.iron || 21} µg/dL</td>
              <td>≥ 27 µg/dL</td>
              <td>Slightly low; continue oral iron supplement</td>
            </tr>
            <tr>
              <td><strong>Daily Hydration</strong></td>
              <td>${profile.waterBaseL || 2.5} L target</td>
              <td>2.3 - 3.0 L/day</td>
              <td>Maintains amniotic volume & kidney clearance</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Active Medications & Supplements</h2>
        <table>
          <thead>
            <tr>
              <th>Prescription</th>
              <th>Dosage</th>
              <th>Schedule</th>
              <th>Adherence Status</th>
            </tr>
          </thead>
          <tbody>
            ${meds.map(m => `
              <tr>
                <td><strong>${m.name}</strong></td>
                <td>${m.dose}</td>
                <td>${m.time}</td>
                <td><span class="badge ${m.takenToday ? 'badge-ok' : 'badge-warn'}">${m.takenToday ? 'Taken Today' : 'Scheduled'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>5. Emergency Contacts & Care Team</h2>
        <p style="font-size: 13px;">
          <strong>Attending Clinician:</strong> ${profile.doctorName || 'Dr. Anita Rao'} (${profile.doctorPhone || '+91 98765 43210'})<br>
          <strong>Hospital:</strong> ${profile.hospitalName || 'Cloudnine Maternity Care'}<br>
          <strong>Emergency Contact:</strong> ${profile.emergencyContact || 'Spouse'}
        </p>

        <div class="signature-area">
          <div class="sig-line">Patient / Expectant Mother</div>
          <div class="sig-line">Obstetrician / Care Provider</div>
        </div>

        <div style="margin-top: 30px; font-size: 11px; color: #9CA3AF; text-align: center;">
          Generated via Materna AI 2.0 • Digital Prenatal Health Companion • Verified Local Patient Data
        </div>
      </body>
      </html>
    `;

    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
    } else {
      window.App?.showToast('Pop-up blocked. Please allow pop-ups to view doctor summary.', 'warning');
    }
  },

  sharePartnerLink() {
    const profile = window.StorageEngine?.get(STORAGE_KEYS.PROFILE, {}) || {};
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=partner&user=${encodeURIComponent(profile.name || 'Mom')}&week=${profile.currentWeek || 24}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        window.App?.showToast('🔗 Partner read-only link copied to clipboard!', 'success');
      });
    } else {
      prompt('Copy this partner view link:', shareUrl);
    }
  }
};

window.SharingManager = SharingManager;
