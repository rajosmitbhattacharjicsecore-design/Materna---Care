# Materna AI 2.0 - Clinical Safety Rules & Guardrails

This document outlines the clinical safety protocols, triage rules, red-flag triggers, and ethical AI boundaries embedded within **Materna AI 2.0**.

---

## 1. Ethical & Non-Diagnostic Boundary

1. **Non-Diagnostic Policy**: Materna AI 2.0 **never** provides medical diagnoses or drug prescriptions. All insights are educational wellness guidance designed to support, not replace, obstetric clinicians.
2. **Clinical Confirmation Requirement**: Every recommendation states that clinical targets must be confirmed with an OB/GYN or qualified midwife.
3. **Calm, Non-Alarming Tone**: Communication is crafted to prevent maternal anxiety and panicking while maintaining unwavering clinical vigilance.

---

## 2. Red-Flag Symptoms Watchlist & Emergency Interception

If any of the following symptoms appear in free-text chat, symptom logs, or verbal dictation, the AI assistant **immediately suspends standard conversation** and presents the **Emergency SOS Protocol**:

| Red-Flag Symptom | Clinical Concern | Immediate Action |
| :--- | :--- | :--- |
| **Vaginal Bleeding / Spotting** | Placenta previa, placental abruption, threatened preterm labor | Stop movement, lie on left side, call OB/GYN or triage immediately. |
| **Severe Headache + Visual Changes** (aura, floaters, blurred vision) | Preeclampsia / Central Nervous System irritability | Check blood pressure; urgent obstetric evaluation needed. |
| **Decreased or Absent Fetal Movement** (<10 kicks in 2 hours in 3rd Tri) | Fetal distress, placental insufficiency | Fetal kick count check, immediate clinical cardiotocography (NST). |
| **Sudden Swelling of Face / Hands / Eyes** | Preeclampsia / pathological fluid retention | Clinical assessment of urine protein and blood pressure. |
| **Severe Epigastric / Right Upper Quadrant Pain** | HELLP syndrome, liver capsule distension | Immediate emergency hospital admission. |
| **Fluid Leakage / Gush of Water** | Premature Rupture of Membranes (PPROM) | Avoid inserting anything vaginally; contact maternity hospital. |
| **High Fever (> 100.4°F / 38°C) + Chills** | Chorioamnionitis or systemic maternal infection | Urgent antibiotic and fetal evaluation. |

---

## 3. Blood Pressure Triage Rules (ACOG / AHA Aligned)

| Blood Pressure Category | Systolic / Diastolic | App Status | Action / Message |
| :--- | :--- | :--- | :--- |
| **Optimal & Healthy** | `< 120` and `< 80` mmHg | Normal (Green) | Ideal circulation and placental perfusion. |
| **Elevated Systolic** | `120 - 129` and `< 80` mmHg | Attention (Yellow) | Encourage hydration, low sodium, and restful sleep. |
| **Stage 1 / Borderline** | `130 - 139` or `80 - 89` mmHg | Warning (Orange) | Recheck in 2 hours; discuss at next prenatal visit. |
| **Gestational Hypertension Threshold** | `≥ 140` or `≥ 90` mmHg | Alert Flag (Red) | Calm notification + prominent **"Contact Your Doctor"** button. |
| **Severe Hypertensive Urgency** | `≥ 160` or `≥ 110` mmHg | Emergency (Critical) | Immediate emergency triage; risk of eclampsia/stroke. |

---

## 4. Labor Contraction 5-1-1 Alert Rule

- **5**: Contractions are **5 minutes apart** (or closer).
- **1**: Each contraction lasts for at least **1 minute (60 seconds)**.
- **1**: This rhythmic pattern has continued consistently for **1 hour**.
- **Action**: When the Contraction Timer logs this frequency and duration, a prominent banner alerts the mother: *"Active Labor Pattern Detected: Contact your hospital maternity triage and head in."*

---

## 5. Food Safety & Pregnancy Contraindications

| Food Item | Medical Hazard | App Guidance |
| :--- | :--- | :--- |
| **Raw / Semi-ripe Papaya** | High papain and latex content stimulating prostaglandin release and uterine contractions. | Strictly avoid; choose sweet oranges, pomegranates, apples, and bananas. |
| **Unpasteurized Dairy / Soft Cheeses** | *Listeria monocytogenes* contamination, crossing placenta to cause fetal loss. | Consume only pasteurized milk, curd, and cooked paneer. |
| **High-Mercury Seafood** (Shark, King Mackerel) | Neurotoxic methylmercury impairing fetal brain development. | Replace with low-mercury cooked salmon, freshwater fish, or algae DHA. |
| **Raw Sprouts & Uncooked Eggs** | *Salmonella* and *Toxoplasma gondii* infections. | Thoroughly cook eggs until yolk is firm; steam or sauté all sprouts. |
| **High Caffeine (>200 mg/day)** | Impaired fetal growth and vasoconstriction. | Cap at 1 cup coffee/tea daily; substitute with herbal warm milk or coconut water. |

---

## 6. Physical Activity & Asana Safety Disclaimers

- **Zero Compression**: Never perform closed abdominal twists or prone postures that place pressure on the uterus.
- **Vena Cava Protection**: Avoid lying flat on your back (supine) for prolonged periods after 16 weeks to prevent supine hypotensive syndrome.
- **Pelvic Stability**: Avoid over-stretching due to relaxin hormone softening pelvic ligaments.
- **Discontinue Criteria**: Cease movement immediately if experiencing dizziness, shortness of breath, chest pain, calf swelling, vaginal fluid, or contractions.

---

## 7. Data Privacy & Local-First Security

- **Local-First Storage**: All health inputs, chat transcripts, and documents reside inside the user's browser `localStorage` / `IndexedDB`.
- **Zero Third-Party Tracking**: No health metrics or private data are transmitted to unverified external trackers.
- **Export & Delete Rights**: Users retain complete control to export full JSON backups or delete all records with a single click.
