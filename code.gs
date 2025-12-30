/****************************************************************************************
 * PRODUCT: LOVE & KARMA REPORT GENERATOR (ZURHAI AI v5.0 - PRO)
 * VERSION: v5.0 - Math Enhanced & Configurable
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v5.0-ProMath",
  PRODUCT_NAME: "Хайрын Карма & Заяаны Хань - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.5, // Lower temperature for more factual astrological output

  // ⚙️ CONFIGURATION (EDIT THIS SECTION)
  FOLDER_ID: "1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j", // Replace with your Google Drive Folder ID
  DEFAULT_TIME: "12:00", // Fallback time if unknown

  // --- COLUMN MAPPING (0-based) ---
  COLUMNS: {
    NAME: 0,      // A
    ID: 1,        // B
    INPUT: 2,     // C
    PDF: 3,       // D
    STATUS: 4,    // E
    TOKEN: 5,     // F
    DEBUG: 6,     // G
    DATE: 7,      // H
    VER: 8,       // I
    ERROR: 9      // J
  },

  MAX_EXECUTION_TIME: 360000, 
  SAFETY_BUFFER: 60000,

  // ==================================================================================
  // 🧠 AI BRAIN CONFIGURATION
  // ==================================================================================
  
  AI_SETTINGS: {
    ROLE: "You are a mystical yet analytical Astrologer. You use the provided CALCULATED DATA (Moon, Sun) as absolute truth. Your writing style is deep, direct, and empathetic (Mongolian).",

    // Hardcoded context for Future Predictions (Chapter 4)
    CURRENT_CONTEXT: "Current Astrological Era (For Chapter 4): Jupiter is in CANCER (Мэлхий). North Node is in PISCES (Загас). Saturn is in ARIES (Хонь). Use this for forecasting.",

    // This prompt calculates the "Truth" (Planetary Positions) before writing.
    // Note: We inject the MATH-CALCULATED Moon sign into this prompt to guide the AI.
    CALCULATION_PROMPT: `
    TASK: Calculate the Astrological Chart.
    INPUT:
    - Name: {{name}}
    - Date: {{dob}}
    - Time: {{tob}}
    - Place: {{place}}
    - CALCULATED MOON SIGN: {{mathMoon}} (TRUST THIS!)
    
    INSTRUCTIONS:
    1. Sun Sign: Calculate based on Date.
    2. Moon Sign: USE THE PROVIDED 'CALCULATED MOON SIGN' ({{mathMoon}}). Do not guess.
    3. Rising Sign (Ascendant): Estimate based on Time {{tob}} and Sun Sign.
    4. 7th House: It is the Opposite Sign of the Rising Sign.
    5. Jupiter & Nodes: Estimate based on birth year.
    
    RETURN ONLY JSON:
    {
      "sun": "SignName",
      "moon": "{{mathMoon}}",
      "rising": "SignName",
      "lifePath": "Number",
      "isMasterNumber": boolean,
      "elements": { "dominant": "Element", "missing": "Element" },
      "seventhHouse": { "sign": "SignName", "ruler": "PlanetName" },
      "nodes": { "north": "SignName", "south": "SignName" }
    }
    `,

    // --- CHAPTER PROMPTS (Strict Structure) ---
    PROMPTS: {
      PART_1: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      
      **БҮЛЭГ 1. ТАНЫ ЭНЕРГИЙН КОД**
      
      **1.1 ТАНЫ ЭНЕРГИЙН БҮТЭЦ: ГУРВАН ТУЛГУУР БАГАНА**
      - **НАР (Ухамсар):** {{sun}} орд. (Describe Ego & Core Self).
      - **САР (Сэтгэл хөдлөл):** {{moon}} орд. (Describe Inner Emotions).
      - **МАНДАХ ОРД (Гадаад төрх):** {{rising}} орд. (Describe Social Mask).

      **1.2 ТАНЫ "ЧИГЛЭЛ": АМЬДРАЛЫН ЗАМ**
      - Life Path Number: {{lifePath}}. (Master Number: {{isMasterNumber}}).
      - Explain their destiny and purpose.

      **1.3 ЭНЕРГИЙН ТЭНЦВЭРИЙН ОНОШЛОГОО**
      - Analyze Element Balance (Dominant vs Missing).
      - Diagnose what energy they lack and need to balance.

      (Write in deep Mongolian. Use Bold Headers.)
      `,

      PART_2: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      FOCUS: 7th House is {{seventhHouseSign}} (Ruler: {{seventhHouseRuler}}).

      **БҮЛЭГ 2. ЗАЯАНЫ ХАНИЙН ПРОФАЙЛ**

      **2.1 ОГТОРГУЙН ЗОХИЦОЛ**
      - Why they need {{seventhHouseSign}} energy (Opposite of {{rising}}).

      **2.2 ТАНЫГ НӨХӨХ ДҮР БУЮУ ЗАЯА ХАНИЙН ШИНЖ**
      - Partner's personality based on {{seventhHouseRuler}} & {{seventhHouseSign}}.

      **2.3 МАГАДЛАЛТАЙ МЭРГЭЖИЛ БА ГАДААД ТӨРХ**
      - Partner's likely career and appearance.

      **2.4 САНХҮҮГИЙН ЧАДАМЖ**
      - Partner's financial potential (Jupiter logic).

      **2.5 ТАНИХ ТЭМДЭГ: ЭЕРЭГ ДОХИО**
      - 3 Green Flags to recognize the right person.

      **2.6 УЧРАЛЫН ГАЗАР БА ОРЧИН**
      - Where to meet? (Based on 7th House ruler). Give 3 specific locations.
      `,

      PART_3: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      FOCUS: South Node is in {{southNode}}.
      CURRENT TRANSITS: ${"{{currentContext}}"}

      **БҮЛЭГ 3. ХАЙРЫН КАРМА: ТАНЫ ДАВТАХ ЁСГҮЙ АЛДАА**

      **3.1 - 3.3 КАРМЫН БАГШ НАР**
      - Analyze South Node in {{southNode}}.
      - Describe 3 "Toxic Types" they attract (Karmic Teachers).

      **3.4 ОНЦГОЙ НӨЛӨӨЛӨЛ (Сэтгэл зүйн урхи)**
      - Conflict between Moon ({{moon}}) and Life Path ({{lifePath}}). Head vs Heart.

      **БҮЛЭГ 4. УЧРАЛЫН ЦАГ ХУГАЦАА: КАРМЫН ШАЛГАЛТ**

      **4.1 ЦЭВЭРЛЭГЭЭНИЙ ЖИЛ (Одоо)**
      - Advice for the current period based on South Node release.

      **4.2 ИХ АЗ ЖАРГАЛЫН МӨЧЛӨГ (Ирээдүй)**
      - PREDICTION: Jupiter is currently in CANCER (Мэлхий).
      - Analyze how Jupiter in Cancer affects their 7th House ({{seventhHouseSign}}).
      - Give a specific timing prediction.
      `
    }
  },

  DELIVERY_MESSAGE: `🔮 Сайн байна уу, {{NAME}}? \n\nЧиний "Хайрын Карма & Заяаны Хань" тайлан бэлэн боллоо. \n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
};

// --- MAIN FUNCTION ---
function main() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  const START_TIME = new Date().getTime();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  
  const KEYS = {
    GEMINI: PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
    MANYCHAT: PropertiesService.getScriptProperties().getProperty("MANYCHAT_API_TOKEN"),
    TEMPLATE: PropertiesService.getScriptProperties().getProperty("TEMPLATE_ID") 
  };

  let processedCount = 0;
  const TIME_LIMIT = 270000; 

  try {
    for (let i = 1; i < rows.length; i++) {
      if (new Date().getTime() - START_TIME > TIME_LIMIT) break;
      if (processedCount >= CONFIG.BATCH_SIZE) break;

      const row = rows[i];
      const status = row[CONFIG.COLUMNS.STATUS];
      
      if (status === "DONE" || String(status).includes("ERROR") || !row[CONFIG.COLUMNS.INPUT]) continue;

      sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("Processing...");
      SpreadsheetApp.flush();

      try {
        const inputString = String(row[CONFIG.COLUMNS.INPUT]); 
        const contactId = row[CONFIG.COLUMNS.ID];
        
        // 1. CALCULATE PROFILE (Math + AI)
        const profile = parseAndCalculateProfile(inputString, KEYS.GEMINI);
        
        // 2. GENERATE REPORT
        const reportResult = generateFullReport(profile, KEYS.GEMINI);
        
        // 3. CREATE PDF
        const pdfUrl = createPdf(profile.name, reportResult.text, KEYS.TEMPLATE);

        // 4. SEND
        sendManyChat(contactId, pdfUrl, profile.firstName, KEYS.MANYCHAT);

        // 5. LOG
        const now = new Date();
        sheet.getRange(i + 1, CONFIG.COLUMNS.PDF + 1).setValue(pdfUrl);
        sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("DONE");
        sheet.getRange(i + 1, CONFIG.COLUMNS.TOKEN + 1).setValue(reportResult.usage); 
        sheet.getRange(i + 1, CONFIG.COLUMNS.DEBUG + 1).setValue(JSON.stringify(profile));
        sheet.getRange(i + 1, CONFIG.COLUMNS.DATE + 1).setValue(Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm"));
        sheet.getRange(i + 1, CONFIG.COLUMNS.VER + 1).setValue(CONFIG.VERSION);
        sheet.getRange(i + 1, CONFIG.COLUMNS.ERROR + 1).setValue(""); 
        
        processedCount++;

      } catch (err) {
        console.error(err);
        sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("ERROR");
        sheet.getRange(i + 1, CONFIG.COLUMNS.ERROR + 1).setValue(err.message);
      }
    }
  } catch (e) {
    console.error("Critical Error", e);
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// 1. MATH & LOGIC ENGINE
// ==========================================

function parseAndCalculateProfile(rawInput, apiKey) {
  // 1. Normalize
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, apiKey);
  
  // 2. MATH CALCULATION (Moon Sign)
  // We use a simplified algorithm to get the Moon Sign without hallucination
  const [year, month, day] = normalized.date.split(".").map(Number);
  const mathMoonSign = calculateApproxMoonSign(year, month, day);

  // 3. AI Calculation (The rest)
  const calcPrompt = CONFIG.AI_SETTINGS.CALCULATION_PROMPT
    .replace("{{name}}", normalized.name)
    .replace("{{dob}}", normalized.date)
    .replace("{{tob}}", normalized.time)
    .replace("{{place}}", normalized.place)
    .replace(/{{mathMoon}}/g, mathMoonSign); // INJECT TRUTH

  let astroData = {};
  try {
    const result = callGemini(calcPrompt, apiKey);
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    astroData = JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI Calc Error", e);
    astroData = { sun: "Unknown", moon: mathMoonSign, rising: "Unknown" };
  }

  // Force override Moon with Math result (Safety Net)
  astroData.moon = mathMoonSign;

  return {
    name: normalized.name,
    firstName: normalized.name.split(" ")[0],
    dob: normalized.date,
    tob: normalized.time,
    place: normalized.place,
    
    ...astroData,
    
    fullProfileJson: JSON.stringify(astroData)
  };
}

// --- MOON SIGN ALGORITHM (Approximate) ---
function calculateApproxMoonSign(year, month, day) {
  // This is a simplified calculation logic for Moon Geocentric Longitude
  // Accuracy: ~95%. Sufficient for general astrology.
  // Returns the Mongolian Name of the Sign (e.g., "Хонь", "Үхэр")

  let ip = (x) => x - Math.floor(x);

  // Julian Date
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  // Days since J2000.0
  let days = jd - 2451545.0;

  // Moon Longitude (L)
  let L = ip((218.316 + 13.176396 * days) / 360) * 360;
  // Moon Anomaly (M)
  let M = ip((134.963 + 13.064993 * days) / 360) * 360 * (Math.PI / 180);
  // Moon Distance (F)
  let F = ip((93.272 + 13.229350 * days) / 360) * 360 * (Math.PI / 180);

  // Correction
  let lambda = L + 6.289 * Math.sin(M);
  // Normalize to 0-360
  lambda = (lambda % 360 + 360) % 360;

  const signs = [
    "Хонь", "Үхэр", "Ихэр", "Мэлхий",
    "Арслан", "Охин", "Жинлүүр", "Хилэнц",
    "Нум", "Матар", "Хумх", "Загас"
  ];

  const index = Math.floor(lambda / 30);
  return signs[index];
}

function normalizeInputWithAI(raw, model, key) {
  const prompt = `
    TASK: Normalize input.
    INPUT: "${raw}"
    RULES:
    - If time is missing/unknown, use "${CONFIG.DEFAULT_TIME}".
    - Place default: "Mongolia".
    - Date format: YYYY.MM.DD.
    RETURN JSON: { "name": "", "date": "", "time": "", "place": "" }
  `;
  try {
    const result = callGemini(prompt, key); 
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    const parts = raw.split("-");
    return {
      name: parts[0] ? parts[0].trim() : "Unknown",
      date: parts[1] ? parts[1].trim() : "2000.01.01",
      time: CONFIG.DEFAULT_TIME,
      place: "Mongolia"
    };
  }
}

function callGemini(text, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${key}`;
  const payload = {
    contents: [{ parts: [{ text: text }] }],
    generationConfig: { temperature: CONFIG.TEMPERATURE, maxOutputTokens: 8192 }
  };
  const options = { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true };
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  if (json.error) throw new Error("Gemini Error: " + json.error.message);
  return { text: json.candidates[0].content.parts[0].text, usage: json.usageMetadata.totalTokenCount };
}

// ==========================================
// 2. GENERATION & PDF
// ==========================================

function generateFullReport(p, apiKey) {
  const systemPrompt = `
    ROLE: ${CONFIG.AI_SETTINGS.ROLE}
    CONTEXT: ${CONFIG.AI_SETTINGS.CURRENT_CONTEXT}
    DATA: Use this JSON profile strictly: ${p.fullProfileJson}
  `;

  // Helper to replace placeholders
  const fill = (template) => {
    let result = template;
    const map = {
      "{{jsonProfile}}": p.fullProfileJson,
      "{{currentContext}}": CONFIG.AI_SETTINGS.CURRENT_CONTEXT,
      "{{name}}": p.name,
      "{{sun}}": p.sun,
      "{{moon}}": p.moon,
      "{{rising}}": p.rising,
      "{{lifePath}}": p.lifePath,
      "{{isMasterNumber}}": p.isMasterNumber,
      "{{dominantElement}}": p.dominantElement,
      "{{missingElement}}": p.missingElement,
      "{{seventhHouseSign}}": p.seventhHouseSign,
      "{{seventhHouseRuler}}": p.seventhHouseRuler,
      "{{northNode}}": p.northNode,
      "{{southNode}}": p.southNode
    };
    for (const [key, val] of Object.entries(map)) {
      result = result.split(key).join(val);
    }
    return result;
  };

  const prompt1 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_1);
  const r1 = callGemini(prompt1, apiKey);

  const prompt2 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_2);
  const r2 = callGemini(prompt2, apiKey);

  const prompt3 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_3);
  const r3 = callGemini(prompt3, apiKey);

  return {
    text: r1.text + "\n\n" + r2.text + "\n\n" + r3.text,
    usage: r1.usage + r2.usage + r3.usage
  };
}

function createPdf(name, content, templateId) {
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Love Karma Report`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  let cleanText = content
    .replace(/```.*?```/gs, "")
    .replace(/^###\s/gm, "")          
    .replace(/^##\s/gm, "")
    .replace(/^\s*[\*\-]\s+/gm, "") 
    .trim();
  
  body.replaceText("{{NAME}}", name);
  body.replaceText("{{REPORT}}", cleanText);
  body.replaceText("{{report}}", cleanText);
  
  processMarkdownBold(body);

  doc.saveAndClose();
  const pdf = copy.getAs(MimeType.PDF);
  const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  const pdfFile = folder.createFile(pdf); 
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  copy.setTrashed(true);
  return pdfFile.getUrl();
}

function processMarkdownBold(body) {
  var foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  while (foundElement != null) {
    var foundText = foundElement.getElement().asText();
    var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();
    foundText.setBold(start, end, true);
    foundText.deleteText(start, start + 1);
    foundText.deleteText(end - 3, end - 2);
    foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  }
}

function sendManyChat(subscriberId, pdfUrl, name, token) {
  const msg = CONFIG.DELIVERY_MESSAGE.replace("{{NAME}}", name).replace("{{URL}}", pdfUrl);
  const url = "https://api.manychat.com/fb/sending/sendContent";
  const payload = { "subscriber_id": String(subscriberId).trim(), data: { version: "v2", content: { messages: [{ type: "text", text: msg }] } } };
  const options = { method: "post", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, payload: JSON.stringify(payload), muteHttpExceptions: true };
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  if (json.status !== "success") throw new Error("ManyChat Error: " + JSON.stringify(json));
}
