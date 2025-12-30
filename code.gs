/****************************************************************************************
 * PRODUCT: LOVE & KARMA REPORT GENERATOR (ZURHAI AI v6.0 - FINAL POLISHED)
 * VERSION: v6.0 - Math Nodes, Natural Language, & Educational Intros
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v6.0-FinalPolished",
  PRODUCT_NAME: "Хайрын Карма & Заяаны Хань - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.6, // Slightly higher for more natural, non-robotic flow

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
    ROLE: `
    You are an expert Mongolian Astrologer and Psychologist.
    Your goal is to write a deeply personal, accurate, and educational report.

    CRITICAL RULES:
    1. **VOCABULARY:** NEVER use 'Знак' (Znak), 'Харваач' (Harvaach), 'Асцендент'.
       - USE: 'Орд' (Ord), 'Нум' (Num), 'Мандах орд' (Rising).
       - Always translate planet names: Jupiter -> Бархасбадь, Venus -> Сугар, Mars -> Ангараг, Mercury -> Буд, Saturn -> Санчир.
    2. **TONE:** Avoid robotic/translated phrases like "Сэтгэл санаа өргөн цар хүрээтэй".
       - USE Natural Mongolian: "Сэтгэл санаа уужуу тайван", "Алитыг том зургаар хардаг".
    3. **TRUTH:** Use the provided CALCULATED DATA (Moon, Nodes) as absolute fact. Do not recalculate.
    `,

    // This prompt calculates the "Truth" (Planetary Positions) before writing.
    CALCULATION_PROMPT: `
    TASK: Calculate the Astrological Chart.
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

    // --- CHAPTER PROMPTS ---
    PROMPTS: {
      PART_1: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      
      **БҮЛЭГ 1. ТАНЫ ЭНЕРГИЙН КОД**
      
      **1.1 ТАНЫ ЭНЕРГИЙН БҮТЭЦ: ГУРВАН ТУЛГУУР БАГАНА**

      **НАР (Ухамсар): {{sun}} Орд**
      *Боловсрол:* Нар бол таны мөн чанар, "Би хэн бэ?" гэдгийг тодорхойлогч гол эрхэс юм. Энэ нь таны амьдралын зорилго, ертөнцийг үзэх үзлийн суурийг тавьдаг.
      *Тайлбар:* Таны Нар {{sun}} ордод байрласан тул... (Describe Ego).

      **САР (Сэтгэл хөдлөл): {{moon}} Орд**
      *Боловсрол:* Сар бол таны далд ертөнц, сэтгэл хөдлөл, хүмүүст тэр бүр харагддаггүй дотоод хэрэгцээг илэрхийлдэг.
      *Тайлбар:* Таны Сар {{moon}} ордод байрласнаар... (Describe Inner Emotions naturally).

      **МАНДАХ ОРД (Гадаад төрх): {{rising}} Орд**
      *Боловсрол:* Мандах орд бол таны "Нийгмийн баг" буюу бусдад анх харагдах төрх, биеийн хэлэмж юм.
      *Тайлбар:* Таныг төрөх үед тэнгэрийн хаяанд {{rising}} орд мандаж байсан тул... (Describe Persona).

      **1.2 ТАНЫ "ЧИГЛЭЛ": АМЬДРАЛЫН ЗАМ**
      *Боловсрол:* Нумерологийн ухаанд "Амьдралын зам" нь таны энэ амьдралд биелүүлэх ёстой үүрэг, хувь тавиланг заадаг.
      *Тайлбар:* Таны тоо бол {{lifePath}}. (Master Number: {{isMasterNumber}}). (Explain destiny).

      **1.3 ЭНЕРГИЙН ТЭНЦВЭРИЙН ОНОШЛОГОО**
      - Analyze Element Balance. What energy do they lack? Give practical advice on how to balance it.

      (Write in natural, flowing Mongolian. No robotic lists.)
      `,

      PART_2: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      FOCUS: 7th House is {{seventhHouseSign}} (Ruler: {{seventhHouseRuler}}).

      **БҮЛЭГ 2. ЗАЯАНЫ ХАНИЙН ПРОФАЙЛ**

      **2.1 ОГТОРГУЙН ЗОХИЦОЛ**
      *Боловсрол:* Зурхайн 7-р гэр нь "Бид" буюу хосын харилцааг илэрхийлдэг. Энэ гэр нь таны Мандах ордны яг эсрэг талд байрладаг тул танд дутагдаж буй энергийг нөхөх хүнийг заадаг.
      *Тайлбар:* Таны 7-р гэр {{seventhHouseSign}} ордод байгаа тул танд... (Explain opposite energy need).

      **2.2 ТАНЫГ НӨХӨХ ДҮР БУЮУ ЗАЯА ХАНИЙН ШИНЖ**
      - Describe the partner based on {{seventhHouseRuler}} & {{seventhHouseSign}}. (Soft vs Strong, Intellectual vs Emotional).

      **2.3 МАГАДЛАЛТАЙ МЭРГЭЖИЛ БА ГАДААД ТӨРХ**
      - Career and Appearance prediction.

      **2.4 САНХҮҮГИЙН ЧАДАМЖ**
      - Financial potential analysis.

      **2.5 ТАНИХ ТЭМДЭГ: ЭЕРЭГ ДОХИО**
      - 3 Green Flags.

      **2.6 УЧРАЛЫН ГАЗАР БА ОРЧИН**
      - 3 Specific locations based on 7th House Ruler.
      `,

      PART_3: `
      CONTEXT: Use this DATA: {{jsonProfile}}
      FOCUS: South Node is in {{southNode}}. North Node is in {{northNode}}.
      CURRENT YEAR: {{currentYear}}
      NEXT YEAR: {{nextYear}}

      **БҮЛЭГ 3. ХАЙРЫН КАРМА: ТАНЫ ДАВТАХ ЁСГҮЙ АЛДАА**

      **3.1 - 3.3 КАРМЫН БАГШ НАР**
      *Боловсрол:* Сарны Өмнөд Зангилаа (South Node) нь таны өнгөрсөн амьдралын дадал зуршил, тав тухтай бүсийг илэрхийлдэг. Бид ихэвчлэн эндээ гацаж, буруу хүмүүсийг татдаг.
      *Тайлбар:* Таны Өмнөд Зангилаа {{southNode}} ордод байрладаг. Та яагаад дандаа... (Describe toxic patterns).
      - Describe 3 "Karmic Teachers" (Toxic Types).

      **3.4 ОНЦГОЙ НӨЛӨӨЛӨЛ (Сэтгэл зүйн урхи)**
      - Conflict between Moon ({{moon}}) and Life Path ({{lifePath}}).

      **БҮЛЭГ 4. УЧРАЛЫН ЦАГ ХУГАЦАА: КАРМЫН ШАЛГАЛТ**

      **4.1 ЦЭВЭРЛЭГЭЭНИЙ ЖИЛ ({{currentYear}} он)**
      *Боловсрол:* Шинэ зүйл хүлээж авахын тулд хуучнаа цэвэрлэх ёстой.
      *Тайлбар:* Энэ онд та... (Preparation advice).

      **4.2 ИХ АЗ ЖАРГАЛЫН МӨЧЛӨГ ({{nextYear}} он)**
      *Боловсрол:* Бархасбадь гараг нь "Их Аз Жаргал"-ыг бэлгэддэг бөгөөд 12 жилд нэг удаа таныг ивээдэг.
      *Тайлбар:* {{nextYear}} онд Бархасбадь Мэлхий (Cancer) ордод байрлах (эсвэл шилжих) үед... (Prediction for {{seventhHouseSign}}).
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
  const [year, month, day] = normalized.date.split(".").map(Number);

  // 2. MATH CALCULATION (Moon & Nodes)
  const mathMoonSign = calculateApproxMoonSign(year, month, day);
  const mathNodes = calculateApproxNodes(year, month, day);

  // 3. DATE LOGIC
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

  // 4. AI Calculation (The rest)
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
    console.error("AI Calc Error", e);
    astroData = { sun: "Unknown", moon: mathMoonSign, rising: "Unknown" };
  }

  // Force override with Math results (Safety Net)
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

// --- MOON SIGN ALGORITHM (Approximate) ---
function calculateApproxMoonSign(year, month, day) {
  let ip = (x) => x - Math.floor(x);
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  let days = jd - 2451545.0;
  let L = ip((218.316 + 13.176396 * days) / 360) * 360;
  let M = ip((134.963 + 13.064993 * days) / 360) * 360 * (Math.PI / 180);
  let lambda = L + 6.289 * Math.sin(M);
  lambda = (lambda % 360 + 360) % 360;
  const signs = ["Хонь", "Үхэр", "Ихэр", "Мэлхий", "Арслан", "Охин", "Жинлүүр", "Хилэнц", "Нум", "Матар", "Хумх", "Загас"];
  return signs[Math.floor(lambda / 30)];
}

// --- NODE ALGORITHM (Approximate) ---
function calculateApproxNodes(year, month, day) {
  // Mean Node Cycle: ~18.6 years (Retrograde)
  // Base date: Jan 11 2024 (North Node in Aries ~20 deg)
  // 2024.03 = 2460320 JD
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  // Formula for Mean Longitude of Ascending Node (Omega)
  let T = (jd - 2451545.0) / 36525;
  let omega = 125.04452 - 1934.136261 * T;

  omega = (omega % 360 + 360) % 360;

  const signs = ["Хонь", "Үхэр", "Ихэр", "Мэлхий", "Арслан", "Охин", "Жинлүүр", "Хилэнц", "Нум", "Матар", "Хумх", "Загас"];
  // Nodes move backward, so logic is inverted or handled by standard degree mapping (0 Aries, 30 Taurus...)
  // But wait, 0-30 is Aries? No. 0 is First Point of Aries.
  // Standard Zodiac: 0-30 Aries, 30-60 Taurus.
  // Example: Omega = 10 deg -> Aries. Omega = 350 deg -> Pisces.

  const index = Math.floor(omega / 30);
  // South Node is always exactly opposite (180 deg away)
  const southIndex = (index + 6) % 12;

  return {
    north: signs[index],
    south: signs[southIndex]
  };
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
    DATA: Use this JSON profile strictly: ${p.fullProfileJson}
  `;

  // Helper to replace placeholders
  const fill = (template) => {
    let result = template;
    const map = {
      "{{jsonProfile}}": p.fullProfileJson,
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
