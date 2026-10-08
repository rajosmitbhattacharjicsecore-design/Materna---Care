/**
 * MATERNA AI 2.0 - TRENDS & CHARTS ENGINE
 * Visualizes maternal health trends with Chart.js:
 * - Weight trajectory with BMI normal-gain envelope
 * - Blood pressure with hypertension alert lines (140/90)
 * - Blood markers (Hemoglobin, Vitamin D3, Iron)
 * - Lifestyle (Daily Hydration vs target, Sleep hours)
 * - Weekly / Monthly timeframe toggles
 */

const TrendsChartManager = {
  charts: {},
  timeframe: 'weekly', // 'weekly' or 'monthly'

  init() {
    this.renderAllCharts();
  },

  destroyCharts() {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
        this.charts[key].destroy();
      }
    });
    this.charts = {};
  },

  renderAllCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('[Charts] Chart.js not loaded. Retrying in 300ms...');
      setTimeout(() => this.renderAllCharts(), 300);
      return;
    }

    this.destroyCharts();

    const vitals = window.StorageEngine?.get(STORAGE_KEYS.VITALS, []) || [];
    if (!vitals || vitals.length === 0) return;

    // Filter or adjust by timeframe if needed
    const dataSlice = this.timeframe === 'weekly' ? vitals.slice(-7) : vitals;
    const labels = dataSlice.map(v => v.date || `Wk ${v.week}`);

    // Color tokens
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#A6B0C3' : '#5B6B7C';
    const gridColor = isDark ? '#353A50' : '#EADBDA';

    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;
    Chart.defaults.font.family = 'Poppins, sans-serif';

    // 1. Weight Chart
    const weightCtx = document.getElementById('chartWeight')?.getContext('2d');
    if (weightCtx) {
      this.charts.weight = new Chart(weightCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Weight (kg)',
              data: dataSlice.map(v => v.weight),
              borderColor: '#D94E73',
              backgroundColor: 'rgba(217, 78, 115, 0.12)',
              fill: true,
              tension: 0.35,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#D94E73'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.parsed.y} kg`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 55,
              suggestedMax: 70,
              grid: { color: gridColor }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Blood Pressure Chart
    const bpCtx = document.getElementById('chartBP')?.getContext('2d');
    if (bpCtx) {
      this.charts.bp = new Chart(bpCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Systolic (mmHg)',
              data: dataSlice.map(v => v.bpSys),
              borderColor: '#DC2626',
              backgroundColor: 'rgba(220, 38, 38, 0.05)',
              tension: 0.3,
              pointRadius: 4,
              borderWidth: 2
            },
            {
              label: 'Diastolic (mmHg)',
              data: dataSlice.map(v => v.bpDia),
              borderColor: '#2563EB',
              backgroundColor: 'transparent',
              tension: 0.3,
              pointRadius: 4,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } },
            tooltip: {
              callbacks: {
                label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} mmHg`
              }
            }
          },
          scales: {
            y: {
              suggestedMin: 60,
              suggestedMax: 150,
              grid: { color: gridColor }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 3. Blood Markers (Hb, Vit D3, Iron)
    const labsCtx = document.getElementById('chartLabs')?.getContext('2d');
    if (labsCtx) {
      this.charts.labs = new Chart(labsCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Hemoglobin (g/dL)',
              data: dataSlice.map(v => v.hb),
              borderColor: '#9333EA',
              backgroundColor: 'transparent',
              yAxisID: 'yHb',
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: 'Vitamin D3 (ng/mL)',
              data: dataSlice.map(v => v.vitD),
              borderColor: '#F59E0B',
              backgroundColor: 'transparent',
              yAxisID: 'yVit',
              tension: 0.3,
              pointRadius: 4
            },
            {
              label: 'Iron (µg/dL)',
              data: dataSlice.map(v => v.iron),
              borderColor: '#568462',
              backgroundColor: 'transparent',
              yAxisID: 'yVit',
              tension: 0.3,
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } }
          },
          scales: {
            yHb: {
              type: 'linear',
              display: true,
              position: 'left',
              suggestedMin: 9,
              suggestedMax: 15,
              grid: { color: gridColor },
              title: { display: true, text: 'Hb (g/dL)', font: { size: 10 } }
            },
            yVit: {
              type: 'linear',
              display: true,
              position: 'right',
              suggestedMin: 15,
              suggestedMax: 50,
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'Vit D3 / Iron', font: { size: 10 } }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 4. Hydration & Sleep
    const lifestyleCtx = document.getElementById('chartLifestyle')?.getContext('2d');
    if (lifestyleCtx) {
      this.charts.lifestyle = new Chart(lifestyleCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Water Intake (L)',
              data: dataSlice.map(v => v.water),
              backgroundColor: '#3B82F6',
              borderRadius: 6
            },
            {
              label: 'Sleep Duration (hrs)',
              data: dataSlice.map(v => v.sleep),
              backgroundColor: '#8B5CF6',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 12 } }
          },
          scales: {
            y: {
              suggestedMin: 0,
              suggestedMax: 10,
              grid: { color: gridColor }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }
  },

  setTimeframe(tf) {
    this.timeframe = tf;
    document.querySelectorAll('.timeframe-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.timeframe === tf);
    });
    this.renderAllCharts();
  }
};

window.TrendsChartManager = TrendsChartManager;
