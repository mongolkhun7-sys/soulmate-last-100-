/****************************************************************************************
 * PRODUCT: LOVE & KARMA REPORT GENERATOR (ZURHAI AI v7.0 - MASTER CONTEXT)
 * VERSION: v7.0 - Context Chaining & Deep Karma Analysis
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v7.0-MasterContext",
  PRODUCT_NAME: "Хайрын Карма & Заяаны Хань - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.6,

  // ⚙️ CONFIGURATION
  FOLDER_ID: "1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j",
  DEFAULT_TIME: "12:00",

  // --- COLUMN MAPPING ---
  COLUMNS: {
    NAME: 0, ID: 1, INPUT: 2, PDF: 3, STATUS: 4, TOKEN: 5, DEBUG: 6, DATE: 7, VER: 8, ERROR: 9
  },

  MAX_EXECUTION_TIME: 360000, 
  SAFETY_BUFFER: 60000,

  // ==================================================================================
  // 🧠 AI BRAIN CONFIGURATION
  // ==================================================================================
  
  AI_SETTINGS: {
    ROLE: `
    You are an expert Mongolian Astrologer. Write a deep, connected, book-like report.

    STRICT RULES:
    1. **NO META-TALK:** Never say "Here is Part 2", "Continuing...", "Understood". Just write the report content.
    2. **VOCABULARY:** Use 'Орд' (Ord), 'Нум' (Num), 'Мандах орд'. NO 'Знак', 'Харваач'.
    3. **CONNECTION:** Reference the user's previous chapters to ensure flow.
    4. **TONE:** Professional, empathetic, direct. No flowery greetings like "Dear brother".
    `,

    // Calculation Prompt (Unchanged)
    CALCULATION_PROMPT: `
    TASK: Calculate Astrological Chart.
    INPUT: Name:{{name}}, Date:{{dob}}, Time:{{tob}}, Place:{{place}}, Moon:{{mathMoon}}, Nodes:{{mathNorthNode}}/{{mathSouthNode}}
    INSTRUCTIONS: Use provided Moon/Nodes as truth. Calculate Sun, Rising, 7th House.
    RETURN JSON: { "sun": "Sign", "moon": "Sign", "rising": "Sign", "lifePath": "Num", "isMasterNumber": bool, "elements": {"dominant": "El", "missing": "El"}, "seventhHouse": {"sign": "Sign", "ruler": "Planet"}, "nodes": {"north": "Sign", "south": "Sign"} }
    `,

    // --- CHAPTER PROMPTS (With Context Injection) ---
    PROMPTS: {
      PART_1: `
      CONTEXT: Use DATA: {{jsonProfile}}
      
      **БҮЛЭГ 1. ТАНЫ ЭНЕРГИЙН КОД**
      
      **1.1 ТАНЫ ЭНЕРГИЙН БҮТЭЦ: ГУРВАН ТУЛГУУР БАГАНА**

      **НАР (Ухамсар): {{sun}} Орд**
      *Нар бол таны мөн чанар, "Би хэн бэ?" гэдгийг тодорхойлогч гол эрхэс юм.*
      Таны Нар {{sun}} ордод байрласан тул... (Explain Ego/Core).

      **САР (Сэтгэл хөдлөл): {{moon}} Орд**
      *Сар бол таны далд ертөнц, сэтгэл хөдлөл, дотоод хэрэгцээг илэрхийлдэг.*
      Таны Сар {{moon}} ордод байрласнаар... (Explain Emotions).

      **МАНДАХ ОРД (Гадаад төрх): {{rising}} Орд**
      *Мандах орд бол таны "Нийгмийн баг" буюу бусдад харагдах төрх юм.*
      Таныг төрөх үед {{rising}} орд мандаж байсан тул... (Explain Mask).

      **1.2 ТАНЫ "ЧИГЛЭЛ": АМЬДРАЛЫН ЗАМ**
      *Амьдралын зам нь таны энэ амьдралд биелүүлэх үүрэг, хувь тавиланг заадаг.*
      Таны тоо бол {{lifePath}}. (Master Number: {{isMasterNumber}}). (Explain Destiny).

      **1.3 ЭНЕРГИЙН ТЭНЦВЭРИЙН ОНОШЛОГОО**
      - Analyze Element Balance. Give practical advice.
      `,

      PART_2: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}

      **БҮЛЭГ 2. ЗАЯАНЫ ХАНИЙН ПРОФАЙЛ**

      **2.1 ОГТОРГУЙН ЗОХИЦОЛ**
      *Зурхайн 7-р гэр нь таныг нөхөх энергийг заадаг.*
      Таны Мандах орд {{rising}} тул 7-р гэр тань {{seventhHouseSign}}-д байна. Энэ нь... (Explain opposite energy need).

      **2.2 ТАНЫГ НӨХӨХ ДҮР БУЮУ ЗАЯА ХАНИЙН ШИНЖ**
      - Describe partner ({{seventhHouseRuler}} & {{seventhHouseSign}}).

      **2.3 МАГАДЛАЛТАЙ МЭРГЭЖИЛ БА ГАДААД ТӨРХ**
      - Career and Appearance.

      **2.4 САНХҮҮГИЙН ЧАДАМЖ**
      - Financial potential.

      **2.5 ТАНИХ ТЭМДЭГ: ЭЕРЭГ ДОХИО**
      - 3 Green Flags.

      **2.6 УЧРАЛЫН ГАЗАР БА ОРЧИН**
      - 3 Specific locations based on 7th House Ruler.
      `,

      PART_3: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}
      FOCUS: South Node is {{southNode}}.

      **БҮЛЭГ 3. ХАЙРЫН КАРМА: ТАНЫ ДАВТАХ ЁСГҮЙ АЛДАА**

      **3.1 - 3.3 КАРМЫН БАГШ НАР**
      *Сарны Өмнөд Зангилаа ({{southNode}}) нь таны өнгөрсөн амьдралын дадал зуршил, гацдаг цэгийг харуулна.*
      Таны амьдралд давтагддаг "Кармын Багш" нар буюу зайлсхийх ёстой 3 төрлийн хүн:

      1. **[Type Name]:** (Description of trait).
         - **Нөлөө:** (How they hurt/manipulate you specifically. e.g., "They leave you without closure", "They make you feel small").
         - **Сургамж:** (What you must learn).

      2. **[Type Name]:** ...
      3. **[Type Name]:** ...

      **3.4 ОНЦГОЙ НӨЛӨӨЛӨЛ (Сэтгэл зүйн урхи)**
      - Conflict between Moon ({{moon}}) and Life Path ({{lifePath}}). Head vs Heart.
      `,

      PART_4: `
      CONTEXT: Use DATA: {{jsonProfile}}
      PREVIOUS CHAPTER (For Flow): {{prevText}}
      YEARS: {{currentYear}}, {{nextYear}}

      **БҮЛЭГ 4. УЧРАЛЫН ЦАГ ХУГАЦАА: КАРМЫН ШАЛГАЛТ**

      **4.1 ЦЭВЭРЛЭГЭЭНИЙ ЖИЛ ({{currentYear}} он)**
      - Advice for {{currentYear}}. How to prepare?

      **4.2 ИХ АЗ ЖАРГАЛЫН МӨЧЛӨГ ({{nextYear}} он)**
      *Бархасбадь гараг нь 12 жилд нэг удаа таны хайрын гэрийг ивээдэг.*
      - Prediction for {{nextYear}} when Jupiter enters/transits {{seventhHouseSign}} (or relevant aspect).
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
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, apiKey);
  const [year, month, day] = normalized.date.split(".").map(Number);

  const mathMoonSign = calculateApproxMoonSign(year, month, day);
  const mathNodes = calculateApproxNodes(year, month, day);

  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

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
  let ip = (x) => x - Math.floor(x);
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100), b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  let days = jd - 2451545.0;
  let L = ip((218.316 + 13.176396 * days) / 360) * 360;
  let M = ip((134.963 + 13.064993 * days) / 360) * 360 * (Math.PI / 180);
  let lambda = (L + 6.289 * Math.sin(M)) % 360;
  if (lambda < 0) lambda += 360;
  const signs = ["Хонь", "Үхэр", "Ихэр", "Мэлхий", "Арслан", "Охин", "Жинлүүр", "Хилэнц", "Нум", "Матар", "Хумх", "Загас"];
  return signs[Math.floor(lambda / 30)];
}

function calculateApproxNodes(year, month, day) {
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  let a = Math.floor(y / 100), b = 2 - a + Math.floor(a / 4);
  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  let T = (jd - 2451545.0) / 36525;
  let omega = (125.04452 - 1934.136261 * T) % 360;
  if (omega < 0) omega += 360;
  const signs = ["Хонь", "Үхэр", "Ихэр", "Мэлхий", "Арслан", "Охин", "Жинлүүр", "Хилэнц", "Нум", "Матар", "Хумх", "Загас"];
  const index = Math.floor(omega / 30);
  const southIndex = (index + 6) % 12;
  return { north: signs[index], south: signs[southIndex] };
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
  const payload = { contents: [{ parts: [{ text: text }] }], generationConfig: { temperature: CONFIG.TEMPERATURE, maxOutputTokens: 8192 } };
  const options = { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true };
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

  // CHAINING REQUESTS (Sending Previous Text)
  const prompt1 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_1, "");
  const r1 = callGemini(prompt1, apiKey);

  const prompt2 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_2, r1.text);
  const r2 = callGemini(prompt2, apiKey);

  const prompt3 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_3, r2.text);
  const r3 = callGemini(prompt3, apiKey);

  const prompt4 = systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_4, r3.text);
  const r4 = callGemini(prompt4, apiKey);

  return {
    text: r1.text + "\n\n" + r2.text + "\n\n" + r3.text + "\n\n" + r4.text,
    usage: r1.usage + r2.usage + r3.usage + r4.usage
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
