/****************************************************************************************
 * PRODUCT: LOVE & KARMA REPORT GENERATOR (ZURHAI AI v4.0)
 * VERSION: v4.0 - Configurable Master Template
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v4.0-LoveKarma",
  PRODUCT_NAME: "Хайрын Карма & Заяаны Хань - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.7,

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
    ROLE: "You are a mystical yet analytical Astrologer and Karmic Healer. Your tone is deep, direct, and empathetic. You explain complex karmic patterns in simple, touching Mongolian.",

    TONE: "Professional, slightly mystical, but grounded in psychology. Use 'Чи' (You) to address the user. Avoid flowery or cheesy language. Be direct about negative traits (shadow sides).",

    // This prompt calculates the "Truth" (Planetary Positions) before writing.
    CALCULATION_PROMPT: `
    TASK: Calculate the Astrological Chart for this person.
    INPUT:
    - Name: {{name}}
    - Date: {{dob}}
    - Time: {{tob}} (If "Unknown", assume 12:00 PM)
    - Place: {{place}}
    
    INSTRUCTIONS:
    1. Calculate Sun, Moon, Rising (Ascendant) signs.
    2. Calculate the "Life Path Number" (Numerology) from the date. Check if it is a Master Number (11, 22, 33).
    3. Identify the 7th House Sign (Opposite of Rising) and its Ruler Planet.
    4. Locate the North Node (Rahu) and South Node (Ketu) signs.
    5. Determine the element balance (Fire, Water, Air, Earth).
    
    RETURN ONLY JSON:
    {
      "sun": "SignName",
      "moon": "SignName",
      "rising": "SignName",
      "lifePath": "Number",
      "isMasterNumber": boolean,
      "elements": { "dominant": "Element", "missing": "Element" },
      "seventhHouse": { "sign": "SignName", "ruler": "PlanetName", "rulerPosition": "SignName" },
      "nodes": { "north": "SignName", "south": "SignName" },
      "jupiter": { "sign": "SignName" }
    }
    `,

    // --- CHAPTER PROMPTS ---
    PROMPTS: {
      PART_1: `
      CONTEXT: Use this CALCULATED DATA to write the report: {{jsonProfile}}
      
      **БҮЛЭГ 1. ТАНЫ ЭНЕРГИЙН КОД**
      
      **1.1 ТАНЫ ЭНЕРГИЙН БҮТЭЦ: ГУРВАН ТУЛГУУР БАГАНА**
      - **НАР (Ухамсар):** Explain their Sun Sign ({{sun}}). This is their "Ego" and "Outer Self".
      - **САР (Сэтгэл хөдлөл):** Explain their Moon Sign ({{moon}}). This is their "Inner Self" and emotional needs.
      - **МАНДАХ ОРД (Гадаад төрх):** Explain their Rising Sign ({{rising}}). This is their "Mask" and how others see them.
      - *Synthesis:* How do these three mix? (e.g., Fire Sun + Water Moon).

      **1.2 ТАНЫ "ЧИГЛЭЛ": АМЬДРАЛЫН ЗАМ**
      - Explain their Life Path Number ({{lifePath}}).
      - If {{isMasterNumber}} is true, emphasize the "Master Number" power and burden.
      - What is their destiny and core purpose?

      **1.3 ЭНЕРГИЙН ТЭНЦВЭРИЙН ОНОШЛОГОО**
      - Based on the element balance (Dominant: {{dominantElement}}, Missing: {{missingElement}}).
      - Diagnose what they lack (e.g., "You lack Earth, so you are unstable").
      - Advice on how to balance this.

      (Write in deep, flowing Mongolian paragraphs. Use bold headers.)
      `,

      PART_2: `
      CONTEXT: Use this CALCULATED DATA: {{jsonProfile}}
      FOCUS: The 7th House is {{seventhHouseSign}} (Ruler: {{seventhHouseRuler}}).

      **БҮЛЭГ 2. ЗАЯАНЫ ХАНИЙН ПРОФАЙЛ**

      **2.1 ОГТОРГУЙН ЗОХИЦОЛ**
      - Explain why they need a partner with {{seventhHouseSign}} energy (Opposite of their Rising {{rising}}).
      - Why is this "Opposite" energy necessary for their balance?

      **2.2 ТАНЫГ НӨХӨХ ДҮР БУЮУ ЗАЯА ХАНИЙН ШИНЖ**
      - Describe the personality of the future partner based on {{seventhHouseRuler}}.
      - Keywords: Characteristics, Temperament (Soft vs Strong).

      **2.3 МАГАДЛАЛТАЙ МЭРГЭЖИЛ БА ГАДААД ТӨРХ**
      - Predict the partner's career field and physical appearance/vibe based on the 7th House.

      **2.4 САНХҮҮГИЙН ЧАДАМЖ**
      - Analyze the partner's financial potential (Jupiter connection to 7th house logic).
      - How will they handle money? (Generous vs Stingy).

      **2.5 ТАНИХ ТЭМДЭГ: ЭЕРЭГ ДОХИО**
      - List 3 specific "Green Flags" or signs that confirm "This is the right person".

      **2.6 УЧРАЛЫН ГАЗАР БА ОРЧИН**
      - Where are they most likely to meet? (Based on 7th House Ruler position).
      - Give 3 specific locations (e.g., Work, Travel, Social Event).

      (Write in deep, flowing Mongolian paragraphs. Use bold headers.)
      `,

      PART_3: `
      CONTEXT: Use this CALCULATED DATA: {{jsonProfile}}
      FOCUS: South Node is in {{southNode}}. North Node is in {{northNode}}.

      **БҮЛЭГ 3. ХАЙРЫН КАРМА: ТАНЫ ДАВТАХ ЁСГҮЙ АЛДАА**

      **3.1 - 3.3 КАРМЫН БАГШ НАР**
      - Analyze the South Node in {{southNode}}.
      - **The Trap:** Why do they keep attracting "Toxic" partners with {{southNode}} traits?
      - Describe 3 Types of "Karmic Teachers" (Wrong partners) they attract (give them creative names).

      **3.4 ОНЦГОЙ НӨЛӨӨЛӨЛ (Сэтгэл зүйн урхи)**
      - Analyze the conflict between their Moon ({{moon}}) and their Life Path ({{lifePath}}).
      - Do they follow their Head or their Heart? What is their biggest self-sabotage pattern in love?

      **БҮЛЭГ 4. УЧРАЛЫН ЦАГ ХУГАЦАА: КАРМЫН ШАЛГАЛТ**

      **4.1 ЦЭВЭРЛЭГЭЭНИЙ ЖИЛ (Present)**
      - Advice for the current year. What do they need to let go of? (Old habits, ex-partners).
      - The theme is "Preparation".

      **4.2 ИХ АЗ ЖАРГАЛЫН МӨЧЛӨГ (Future)**
      - Predict when Jupiter (or a major transit) hits their 7th House ({{seventhHouseSign}}).
      - Give a timeframe (e.g., "Next year" or "When Jupiter enters {{seventhHouseSign}}").
      - Closing Advice: "Stop thinking, start trusting."

      (Write in deep, flowing Mongolian paragraphs. Use bold headers. STOP after Chapter 4.)
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
      if (new Date().getTime() - START_TIME > TIME_LIMIT) {
        console.warn("⏳ TIME GUARD: Stopping batch execution.");
        break; 
      }
      
      if (processedCount >= CONFIG.BATCH_SIZE) break;

      const row = rows[i];
      const status = row[CONFIG.COLUMNS.STATUS];
      
      if (status === "DONE" || String(status).includes("ERROR") || !row[CONFIG.COLUMNS.INPUT]) continue;

      sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("Processing...");
      SpreadsheetApp.flush();

      try {
        const inputString = String(row[CONFIG.COLUMNS.INPUT]); 
        const contactId = row[CONFIG.COLUMNS.ID];
        
        // 1. PARSE & CALCULATE (THE BRAIN)
        const profile = parseAndCalculateProfile(inputString, KEYS.GEMINI);
        
        // 2. GENERATE CONTENT (THE WRITER)
        const reportResult = generateFullReport(profile, KEYS.GEMINI);
        
        // 3. CREATE PDF
        const pdfUrl = createPdf(profile.name, reportResult.text, KEYS.TEMPLATE);

        // 4. SEND
        sendManyChat(contactId, pdfUrl, profile.firstName, KEYS.MANYCHAT);

        // 5. LOG
        const now = new Date();
        const formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
        
        sheet.getRange(i + 1, CONFIG.COLUMNS.PDF + 1).setValue(pdfUrl);
        sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("DONE");
        sheet.getRange(i + 1, CONFIG.COLUMNS.TOKEN + 1).setValue(reportResult.usage); 
        sheet.getRange(i + 1, CONFIG.COLUMNS.DEBUG + 1).setValue(JSON.stringify(profile));
        sheet.getRange(i + 1, CONFIG.COLUMNS.DATE + 1).setValue(formattedDate);
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
// 1. CORE LOGIC ENGINE (AI-POWERED)
// ==========================================

function parseAndCalculateProfile(rawInput, apiKey) {
  // Step 1: Normalize Input
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, apiKey);
  
  // Step 2: AI Calculation (The "Ephemeris" Step)
  // We ask Gemini to act as the calculator and return JSON data.
  const calcPrompt = CONFIG.AI_SETTINGS.CALCULATION_PROMPT
    .replace("{{name}}", normalized.name)
    .replace("{{dob}}", normalized.date)
    .replace("{{tob}}", normalized.time)
    .replace("{{place}}", normalized.place);

  let astroData = {};
  try {
    const result = callGemini(calcPrompt, apiKey);
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    astroData = JSON.parse(cleanJson);
  } catch (e) {
    console.error("Calculation Error, falling back to basic data", e);
    astroData = { sun: "Unknown", moon: "Unknown", rising: "Unknown" }; // Fallback
  }

  return {
    name: normalized.name,
    firstName: normalized.name.split(" ")[0],
    dob: normalized.date,
    tob: normalized.time,
    place: normalized.place,
    
    // Astrological Data from AI
    sun: astroData.sun || "Unknown",
    moon: astroData.moon || "Unknown",
    rising: astroData.rising || "Unknown",
    lifePath: astroData.lifePath || "Unknown",
    isMasterNumber: astroData.isMasterNumber || false,
    dominantElement: astroData.elements?.dominant || "Unknown",
    missingElement: astroData.elements?.missing || "Unknown",
    seventhHouseSign: astroData.seventhHouse?.sign || "Unknown",
    seventhHouseRuler: astroData.seventhHouse?.ruler || "Unknown",
    northNode: astroData.nodes?.north || "Unknown",
    southNode: astroData.nodes?.south || "Unknown",
    
    fullProfileJson: JSON.stringify(astroData) // Keep raw data for injection
  };
}

function normalizeInputWithAI(raw, model, key) {
  // Enhanced normalization to handle Place and Default Time
  const prompt = `
    TASK: Normalize this input string into JSON.
    INPUT: "${raw}"
    RULES:
    - If time is missing or "Unknown", set time to "${CONFIG.DEFAULT_TIME}".
    - If place is missing, set place to "Mongolia".
    - Standardize Date to YYYY.MM.DD.

    REQUIRED JSON FORMAT:
    {
      "name": "Full Name",
      "date": "YYYY.MM.DD", 
      "time": "HH:MM",
      "place": "City, Country"
    }
    RETURN ONLY JSON.
  `;
  try {
    const result = callGemini(prompt, key); 
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Normalization Failed", e);
    // Basic Fallback
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
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const res = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(res.getContentText());
  
  if (json.error) throw new Error("Gemini Error: " + json.error.message);
  
  const content = (json.candidates && json.candidates[0].content) ? json.candidates[0].content.parts[0].text : "Error generating text.";
  const usage = (json.usageMetadata && json.usageMetadata.totalTokenCount) ? json.usageMetadata.totalTokenCount : 0;

  return { text: content, usage: usage };
}

// ==========================================
// 2. GENERATION ENGINE (CONSISTENT)
// ==========================================

function generateFullReport(p, apiKey) {
  // The system prompt now enforces the ROLE
  const systemPrompt = `
    ROLE: ${CONFIG.AI_SETTINGS.ROLE}
    TONE: ${CONFIG.AI_SETTINGS.TONE}
    
    IMPORTANT: You must use the CALCULATED DATA provided in the context. Do not recalculate. Consistency is key.
  `;

  // Helper to replace placeholders
  const fill = (template) => {
    let result = template;
    const map = {
      "{{jsonProfile}}": p.fullProfileJson, // THE TRUTH SOURCE
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

  // Execute Prompts (Sequential)
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

// ==========================================
// 3. PDF & DELIVERY (Unchanged Logic)
// ==========================================

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
  // Use Configured Folder ID
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
