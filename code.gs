/****************************************************************************************
 * PRODUCT: LOVE & KARMA REPORT GENERATOR (ZURHAI AI v10.1 - EXPANDED)
 * VERSION: v10.1 - Full Features, Rich Prompts, Expanded Formatting
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIGURATION ---
  VERSION: "v10.1-Expanded",
  PRODUCT_NAME: "Хайрын Карма & Заяаны Хань - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.6, // Balanced creativity and accuracy

  // ⚙️ USER CONFIGURATION
  FOLDER_ID: "1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j", // Google Drive Folder ID for PDFs
  DEFAULT_TIME: "12:00", // Default time if user input is missing

  // --- COLUMN MAPPING (0-based index) ---
  COLUMNS: {
    NAME: 0,      // A: Name
    ID: 1,        // B: User ID
    INPUT: 2,     // C: Raw Input String
    PDF: 3,       // D: PDF URL Output
    STATUS: 4,    // E: Processing Status
    TOKEN: 5,     // F: Token Usage
    DEBUG: 6,     // G: Debug Data
    DATE: 7,      // H: Date
    VER: 8,       // I: Version
    ERROR: 9      // J: Error Message
  },

  MAX_EXECUTION_TIME: 360000, // 6 Minutes
  SAFETY_BUFFER: 60000,

  // ==================================================================================
  // 🧠 AI SETTINGS & PROMPTS
  // ==================================================================================
  
  AI_SETTINGS: {
    ROLE: `
    You are an expert Mongolian Astrologer and Psychologist.
    Your goal is to write a deeply personal, accurate, and educational report.

    CRITICAL RULES:
    1. **VOCABULARY:** Use 'Орд' (Ord), 'Нум' (Num), 'Мандах орд' (Rising). NEVER use 'Знак' or English names.
    2. **NO META-TALK:** Never say "Here is the next part". Just write the report content.
    3. **CONNECTION:** Read the 'PREVIOUS CHAPTER' text to ensure smooth flow.
    4. **TONE:** Professional, empathetic, direct.
    `,

    // This prompt calculates the "Truth" (Planetary Positions) before writing.
    CALCULATION_PROMPT: `
    TASK: Calculate Astrological Chart.
    INPUT:
    - Name: {{name}}
    - Date: {{dob}}
    - Time: {{tob}}
    - Place: {{place}}
    - CALCULATED MOON SIGN: {{mathMoon}} (TRUST THIS!)
    - CALCULATED NODES: North={{mathNorthNode}}, South={{mathSouthNode}} (TRUST THIS!)

    INSTRUCTIONS:
    1. Sun Sign: Calculate based on Date.
    2. Moon Sign: USE THE PROVIDED 'CALCULATED MOON SIGN'.
    3. Rising Sign (Ascendant): Estimate based on Time {{tob}} and Sun Sign.
    4. 7th House: Opposite of Rising Sign.
    5. Nodes: USE THE PROVIDED 'CALCULATED NODES'.

    RETURN ONLY JSON:
    {
      "sun": "SignName",
      "moon": "{{mathMoon}}",
      "rising": "SignName",
      "lifePath": "Number",
      "isMasterNumber": boolean,
      "elements": { "dominant": "Element", "missing": "Element" },
      "seventhHouse": { "sign": "SignName", "ruler": "PlanetName" },
      "nodes": { "north": "{{mathNorthNode}}", "south": "{{mathSouthNode}}" }
    }
    `,

    // --- DETAILED CHAPTER PROMPTS (RESTORED FROM V8) ---
    PROMPTS: {
      PART_1: `
      CONTEXT: Use DATA: {{jsonProfile}}
      
      **🔮 БҮЛЭГ 1. ТАНЫ ЭНЕРГИЙН КОД**
      
      **✨ 1.1 ТАНЫ ЭНЕРГИЙН БҮТЭЦ: ГУРВАН ТУЛГУУР БАГАНА**

      **☀️ НАР (Ухамсар): {{sun}} Орд**
      *Нар бол таны мөн чанар, "Би хэн бэ?" гэдгийг тодорхойлогч гол эрхэс юм.*
      Таны Нар {{sun}} ордод байрласан тул... (Write a detailed paragraph about their Ego and Core Self).

      **🌙 САР (Сэтгэл хөдлөл): {{moon}} Орд**
      *Сар бол таны далд ертөнц, сэтгэл хөдлөл, дотоод хэрэгцээг илэрхийлдэг.*
      Таны Сар {{moon}} ордод байрласнаар... (Write a detailed paragraph about their Inner Emotions).

      **🌅 МАНДАХ ОРД (Гадаад төрх): {{rising}} Орд**
      *Мандах орд бол таны "Нийгмийн баг" буюу бусдад харагдах төрх юм.*
      Таныг төрөх үед {{rising}} орд мандаж байсан тул... (Write a detailed paragraph about their Social Mask).

      **🔢 1.2 ТАНЫ "ЧИГЛЭЛ": АМЬДРАЛЫН ЗАМ**
      *Амьдралын зам нь таны энэ амьдралд биелүүлэх үүрэг, хувь тавиланг заадаг.*
      Таны тоо бол {{lifePath}}. (Master Number: {{isMasterNumber}}). (Explain their Destiny and Purpose in detail).

      **⚖️ 1.3 ЭНЕРГИЙН ТЭНЦВЭРИЙН ОНОШЛОГОО**
      - Analyze the Element Balance based on their signs.
      - Diagnose what energy they lack and give practical advice on how to balance it.
      `,

      PART_2: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}

      **💞 БҮЛЭГ 2. ЗАЯАНЫ ХАНИЙН ПРОФАЙЛ**

      **🌌 2.1 ОГТОРГУЙН ЗОХИЦОЛ**
      *Зурхайн 7-р гэр нь таныг нөхөх энергийг заадаг.*
      Таны Мандах орд {{rising}} тул 7-р гэр тань {{seventhHouseSign}}-д байна. Энэ нь... (Explain why they need this specific opposite energy).

      **👤 2.2 ТАНЫГ НӨХӨХ ДҮР БУЮУ ЗАЯА ХАНИЙН ШИНЖ**
      - TASK: Describe the personality of the future partner in detail. Use the 7th House Ruler ({{seventhHouseRuler}}) and Sign ({{seventhHouseSign}}) characteristics. Are they soft, strong, intellectual, or emotional?

      **💼 2.3 МАГАДЛАЛТАЙ МЭРГЭЖИЛ БА ГАДААД ТӨРХ**
      - TASK: Predict the partner's likely career field and physical appearance/vibe based on the 7th House.

      **💰 2.4 САНХҮҮГИЙН ЧАДАМЖ**
      - TASK: Analyze the partner's financial potential and attitude towards money.

      **✅ 2.5 ТАНИХ ТЭМДЭГ: ЭЕРЭГ ДОХИО**
      - List 3 specific "Green Flags" or signs that confirm "This is the right person".

      **📍 2.6 УЧРАЛЫН ГАЗАР БА ОРЧИН**
      - TASK: Suggest 3 specific locations where they are most likely to meet, based on the 7th House Ruler's nature.
      `,

      PART_3: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}
      FOCUS: South Node is {{southNode}}.

      **⚠️ БҮЛЭГ 3. ХАЙРЫН КАРМА: ТАНЫ ДАВТАХ ЁСГҮЙ АЛДАА**

      **🚫 3.1 - 3.3 КАРМЫН БАГШ НАР**
      *Сарны Өмнөд Зангилаа ({{southNode}}) нь таны өнгөрсөн амьдралын дадал зуршил, гацдаг цэгийг харуулна.*
      Таны амьдралд давтагддаг "Кармын Багш" нар (Зайлсхийх 3 төрлийн хүн). For each type, explain:

      1. **[Type Name]:** (Description of the toxic trait).
         - **Нөлөө:** (How they specifically hurt or manipulate you).
         - **Сургамж:** (What you must learn to stop this pattern).

      2. **[Type Name]:** ...
      3. **[Type Name]:** ...

      **🌀 3.4 ОНЦГОЙ НӨЛӨӨЛӨЛ (Сэтгэл зүйн урхи)**
      - Analyze the conflict between their Moon ({{moon}}) and Life Path ({{lifePath}}). Do they follow their Head or their Heart?
      `,

      PART_4: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}
      YEARS: {{currentYear}}, {{nextYear}}

      **⏳ БҮЛЭГ 4. УЧРАЛЫН ЦАГ ХУГАЦАА: КАРМЫН ШАЛГАЛТ**

      **🧹 4.1 ЦЭВЭРЛЭГЭЭНИЙ ЖИЛ ({{currentYear}} он)**
      - Provide advice for the current year. What should they let go of to prepare for love?

      **🍀 4.2 ИХ АЗ ЖАРГАЛЫН МӨЧЛӨГ ({{nextYear}} он)**
      *Бархасбадь гараг нь 12 жилд нэг удаа таны хайрын гэрийг ивээдэг.*
      - Prediction for {{nextYear}}. Explain that Jupiter (Is now in Cancer/Gemini context) will affect their 7th House ({{seventhHouseSign}}). Give hope and specific timing advice.
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
        
        // 1. CALCULATE PROFILE
        const profile = parseAndCalculateProfile(inputString, KEYS.GEMINI);
        
        // 2. GENERATE REPORT (Chained)
        const reportResult = generateFullReport(profile, KEYS.GEMINI);
        
        // 3. CREATE PDF (With Translation & Formatting)
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
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, apiKey);
  const [year, month, day] = normalized.date.split(".").map(Number);

  // Calculate Accurate Moon & Nodes using Math
  const mathMoonSign = calculateApproxMoonSign(year, month, day);
  const mathNodes = calculateApproxNodes(year, month, day);

  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

  // Prepare Prompt for AI Calculation
  const calcPrompt = CONFIG.AI_SETTINGS.CALCULATION_PROMPT
    .replace("{{name}}", normalized.name)
    .replace("{{dob}}", normalized.date)
    .replace("{{tob}}", normalized.time)
    .replace("{{place}}", normalized.place)
    .replace(/{{mathMoon}}/g, mathMoonSign)
    .replace(/{{mathNorthNode}}/g, mathNodes.north)
    .replace(/{{mathSouthNode}}/g, mathNodes.south);

  let astroData = {};
  try {
    const result = callGemini(calcPrompt, apiKey);
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    astroData = JSON.parse(cleanJson);
  } catch (e) {
    astroData = { sun: "Unknown", moon: mathMoonSign, rising: "Unknown" };
  }

  // Override AI with Math (Single Source of Truth)
  astroData.moon = mathMoonSign;
  astroData.nodes = { north: mathNodes.north, south: mathNodes.south };

  return {
    name: normalized.name,
    firstName: normalized.name.split(" ")[0],
    dob: normalized.date,
    tob: normalized.time,
    place: normalized.place,
    currentYear: currentYear,
    nextYear: nextYear,
    ...astroData,
    fullProfileJson: JSON.stringify(astroData)
  };
}

// --- MATH FUNCTIONS ---

function calculateApproxMoonSign(year, month, day) {
  // Simplified Trigonometric Calculation for Moon Position
  let ip = (x) => x - Math.floor(x);

  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  let days = jd - 2451545.0;
  let L = ip((218.316 + 13.176396 * days) / 360) * 360;
  let M = ip((134.963 + 13.064993 * days) / 360) * 360 * (Math.PI / 180);

  let lambda = (L + 6.289 * Math.sin(M)) % 360;
  if (lambda < 0) lambda += 360;

  const signs = [
    "Хонь", "Үхэр", "Ихэр", "Мэлхий",
    "Арслан", "Охин", "Жинлүүр", "Хилэнц",
    "Нум", "Матар", "Хумх", "Загас"
  ];

  return signs[Math.floor(lambda / 30)];
}

function calculateApproxNodes(year, month, day) {
  // Calculation for Lunar Nodes (North/South)
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  let T = (jd - 2451545.0) / 36525;
  let omega = (125.04452 - 1934.136261 * T) % 360;
  if (omega < 0) omega += 360;

  const signs = [
    "Хонь", "Үхэр", "Ихэр", "Мэлхий",
    "Арслан", "Охин", "Жинлүүр", "Хилэнц",
    "Нум", "Матар", "Хумх", "Загас"
  ];

  const index = Math.floor(omega / 30);
  const southIndex = (index + 6) % 12; // South Node is opposite

  return {
    north: signs[index],
    south: signs[southIndex]
  };
}

function normalizeInputWithAI(raw, model, key) {
  const prompt = `
    TASK: Normalize input.
    INPUT: "${raw}"
    RULES: If time unknown use "${CONFIG.DEFAULT_TIME}". Default Place: "Mongolia". Date: YYYY.MM.DD.
    RETURN JSON: { "name": "", "date": "", "time": "", "place": "" }
  `;
  try {
    const result = callGemini(prompt, key);
    return JSON.parse(result.text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (e) {
    const parts = raw.split("-");
    return { name: parts[0] ? parts[0].trim() : "Unknown", date: parts[1] ? parts[1].trim() : "2000.01.01", time: CONFIG.DEFAULT_TIME, place: "Mongolia" };
  }
}

function callGemini(text, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${key}`;
  const payload = {
    contents: [{ parts: [{ text: text }] }],
    generationConfig: { temperature: CONFIG.TEMPERATURE, maxOutputTokens: 8192 }
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  if (json.error) throw new Error("Gemini Error: " + json.error.message);
  return { text: json.candidates[0].content.parts[0].text, usage: json.usageMetadata.totalTokenCount };
}

// ==========================================
// 2. GENERATION (CHAINED CONTEXT)
// ==========================================

function generateFullReport(p, apiKey) {
  const systemPrompt = `ROLE: ${CONFIG.AI_SETTINGS.ROLE} DATA: ${p.fullProfileJson}`;

  const fill = (template, prevText) => {
    let result = template;
    const map = {
      "{{jsonProfile}}": p.fullProfileJson,
      "{{prevText}}": prevText || "None",
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
      "{{southNode}}": p.southNode,
      "{{currentYear}}": p.currentYear,
      "{{nextYear}}": p.nextYear
    };
    for (const [key, val] of Object.entries(map)) result = result.split(key).join(val);
    return result;
  };

  // CHAINING REQUESTS (Sending Previous Text for Continuity)
  const r1 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_1, ""), apiKey);
  const r2 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_2, r1.text), apiKey);
  const r3 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_3, r2.text), apiKey);
  const r4 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_4, r3.text), apiKey);

  return {
    text: r1.text + "\n\n" + r2.text + "\n\n" + r3.text + "\n\n" + r4.text,
    usage: r1.usage + r2.usage + r3.usage + r4.usage
  };
}

function createPdf(name, content, templateId) {
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Love Karma Report`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  // 1. TRANSLATE TO MONGOLIAN (Post-Processing)
  let processedText = translateAstrologyTerms(content);

  let cleanText = processedText
    .replace(/```.*?```/gs, "")
    .replace(/^###\s/gm, "")          
    .replace(/^##\s/gm, "")
    .replace(/^\s*[\*\-]\s+/gm, "") 
    .trim();
  
  body.replaceText("{{NAME}}", name);
  body.replaceText("{{REPORT}}", cleanText);
  body.replaceText("{{report}}", cleanText);
  
  // 2. PERFECT BOLD LOGIC
  processMarkdownBold(body);

  doc.saveAndClose();
  const pdf = copy.getAs(MimeType.PDF);
  const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  const pdfFile = folder.createFile(pdf); 
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  copy.setTrashed(true);
  return pdfFile.getUrl();
}

function translateAstrologyTerms(text) {
  // Dictionary for translating any leftover English terms
  const dict = {
    "Aries": "Хонь",
    "Taurus": "Үхэр",
    "Gemini": "Ихэр",
    "Cancer": "Мэлхий",
    "Leo": "Арслан",
    "Virgo": "Охин",
    "Libra": "Жинлүүр",
    "Scorpio": "Хилэнц",
    "Sagittarius": "Нум",
    "Capricorn": "Матар",
    "Aquarius": "Хумх",
    "Pisces": "Загас",
    "Sun": "Нар",
    "Moon": "Сар",
    "Jupiter": "Бархасбадь",
    "Venus": "Сугар",
    "Mars": "Ангараг",
    "Mercury": "Буд",
    "Saturn": "Санчир"
  };

  let translated = text;
  for (const [eng, mon] of Object.entries(dict)) {
    translated = translated.replace(new RegExp(`\\b${eng}\\b`, "gi"), mon);
  }
  return translated;
}

function processMarkdownBold(body) {
  var foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  while (foundElement != null) {
    var foundText = foundElement.getElement().asText();
    var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();

    // Bold logic
    foundText.setBold(start, end, true);

    // Clean artifacts
    foundText.deleteText(end - 1, end);
    foundText.deleteText(start, start + 1);

    foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  }
}

function sendManyChat(subscriberId, pdfUrl, name, token) {
  const msg = CONFIG.DELIVERY_MESSAGE.replace("{{NAME}}", name).replace("{{URL}}", pdfUrl);
  const url = "https://api.manychat.com/fb/sending/sendContent";
  const payload = {
    "subscriber_id": String(subscriberId).trim(),
    data: {
      version: "v2",
      content: { messages: [{ type: "text", text: msg }] }
    }
  };
  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  if (json.status !== "success") throw new Error("ManyChat Error: " + JSON.stringify(json));
}
