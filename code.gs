/****************************************************************************************
 * PRODUCT: LIFE CODE: Personal Data Report
 * VERSION: v3.1 - Relationship Data Edition
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v3.1-LifeCode-Love",
  PRODUCT_NAME: "LIFE CODE: Personal Data Report",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3,
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.6, // Analytical & Precise

  // --- COLUMN MAPPING (0-based) ---
  COLUMNS: {
    NAME: 0,      // A: Name
    ID: 1,        // B: ManyChat ID
    INPUT: 2,     // C: Raw Input String
    PDF: 3,       // D: PDF URL
    STATUS: 4,    // E: Status
    TOKEN: 5,     // F: Token Usage
    DEBUG: 6,     // G: Debug Info
    DATE: 7,      // H: Processed Date
    VER: 8,       // I: Version
    ERROR: 9      // J: Error Log
  },

  MAX_EXECUTION_TIME: 360000, 
  SAFETY_BUFFER: 60000,
  
  // --- STATIC DATA MAPS (The "Brain") ---
  TSAGAAN_SAR: {
    1960: "02-27", 1961: "02-15", 1962: "02-05", 1963: "02-25", 1964: "02-13",
    1965: "02-02", 1966: "02-21", 1967: "02-09", 1968: "01-30", 1969: "02-17",
    1970: "02-06", 1971: "02-27", 1972: "02-15", 1973: "02-06", 1974: "02-23",
    1975: "02-11", 1976: "01-31", 1977: "02-18", 1978: "02-07", 1979: "02-28",
    1980: "02-16", 1981: "02-05", 1982: "02-24", 1983: "02-13", 1984: "02-02",
    1985: "02-20", 1986: "02-09", 1987: "01-29", 1988: "02-17", 1989: "02-06",
    1990: "02-27", 1991: "02-15", 1992: "02-04", 1993: "02-23", 1994: "02-10",
    1995: "01-31", 1996: "02-19", 1997: "02-07", 1998: "02-28", 1999: "02-16",
    2000: "02-05", 2001: "02-24", 2002: "02-12", 2003: "02-01", 2004: "02-22",
    2005: "02-09", 2006: "01-29", 2007: "02-18", 2008: "02-07", 2009: "02-25",
    2010: "02-14", 2011: "02-03", 2012: "02-22", 2013: "02-11", 2014: "01-31",
    2015: "02-19"
  },

  ANIMALS: ["Хулгана", "Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь", "Бич", "Тахиа", "Нохой", "Гахай"],
  
  ELEMENTS_BY_LAST_DIGIT: {
    0: "Төмөр", 1: "Төмөр", 2: "Усан", 3: "Усан", 4: "Модон", 5: "Модон", 6: "Гал", 7: "Гал", 8: "Шороон", 9: "Шороон"
  },

  ZODIACS: [
    { name: "Матар", element: "Газар", start: "12-22", end: "01-19" },
    { name: "Хумх", element: "Агаар", start: "01-20", end: "02-18" },
    { name: "Загас", element: "Ус", start: "02-19", end: "03-20" },
    { name: "Хонь", element: "Гал", start: "03-21", end: "04-19" },
    { name: "Үхэр", element: "Газар", start: "04-20", end: "05-20" },
    { name: "Ихэр", element: "Агаар", start: "05-21", end: "06-20" },
    { name: "Мэлхий", element: "Ус", start: "06-21", end: "07-22" },
    { name: "Арслан", element: "Гал", start: "07-23", end: "08-22" },
    { name: "Охин", element: "Газар", start: "08-23", end: "09-22" },
    { name: "Жинлүүр", element: "Агаар", start: "09-23", end: "10-22" },
    { name: "Хилэнц", element: "Ус", start: "10-23", end: "11-21" },
    { name: "Нум", element: "Гал", start: "11-22", end: "12-21" }
  ],

  DELIVERY_MESSAGE: `🔮 Сайн байна уу, {{NAME}}? \n\nЧиний "Life Code" тайлагдлаа. Энэ бол зүгээр нэг зурхай биш, чиний өгөгдлийн шинжилгээ юм.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
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
        console.warn("⏳ TIME GUARD: Stopping batch execution to prevent timeout.");
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
        
        const profile = parseAndCalculateProfile(inputString);
        const reportResult = generateFullReport(profile, KEYS.GEMINI);
        const pdfUrl = createPdf(profile.name, reportResult.text, KEYS.TEMPLATE);
        sendManyChat(contactId, pdfUrl, profile.firstName, KEYS.MANYCHAT);

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
// 1. CORE LOGIC ENGINE
// ==========================================

function parseAndCalculateProfile(rawInput) {
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"));
  
  const dateStr = normalized.date;
  const timeStr = normalized.time;
  const gender = normalized.gender;
  const name = normalized.name;

  const [year, month, day] = dateStr.split(".").map(Number);
  
  const mongolData = getMongolianYearData(year, month, day);
  const zodiacData = getWesternZodiac(month, day);
  const timeAnimal = getTimeAnimal(timeStr);
  const numerology = calculateNumerology(year, month, day);
  const transits = calculateTransits(mongolData.animalIndex);
  const elementRel = analyzeElementalConflict(mongolData.element, zodiacData.element);

  return {
    name: name,
    firstName: name.split(" ")[0],
    dob: dateStr,
    tob: timeStr,
    gender: gender,
    
    yearAnimal: mongolData.animal,
    yearElement: mongolData.element,
    zodiacSign: zodiacData.name,
    zodiacElement: zodiacData.element,
    timeAnimal: timeAnimal,
    isDoubleAnimal: mongolData.animal === timeAnimal,
    
    lifePath: numerology.lifePath,
    birthDayNum: numerology.birthDay,
    
    transit2025: transits.gate1,
    transit2026: transits.gate2,
    transit2027: transits.gate3,
    
    elementRelationship: elementRel
  };
}

function normalizeInputWithAI(raw, model, key) {
  const prompt = `
    TASK: Normalize this input string into JSON.
    INPUT: "${raw}"
    REQUIRED JSON FORMAT:
    {
      "name": "Full Name",
      "date": "YYYY.MM.DD",
      "time": "HH:MM" OR "Unknown",
      "gender": "Эрэгтэй" or "Эмэгтэй" (Note: "эр" = "Эрэгтэй", "эм" = "Эмэгтэй". Default to "Эмэгтэй" if unknown)
    }
    RETURN ONLY JSON.
  `;
  
  try {
    const result = callGemini(prompt, key); 
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Normalization Failed", e);
    const parts = raw.split("-");
    return {
      name: parts[0] ? parts[0].trim() : "Unknown",
      date: parts[1] ? parts[1].trim() : "2000.01.01",
      time: parts[2] ? parts[2].trim() : "Unknown",
      gender: parts[3] ? parts[3].trim() : "Эмэгтэй"
    };
  }
}

function getMongolianYearData(year, month, day) {
  const tsDate = CONFIG.TSAGAAN_SAR[year];
  if (!tsDate) throw new Error(`Year ${year} not in Tsagaan Sar Map`);
  
  const [tsMonth, tsDay] = tsDate.split("-").map(Number);
  
  let trueYear = year;
  if (month < tsMonth || (month === tsMonth && day < tsDay)) {
    trueYear = year - 1;
  }

  const animalIndex = (trueYear - 1900) % 12;
  const animal = CONFIG.ANIMALS[animalIndex];
  const lastDigit = trueYear % 10;
  const element = CONFIG.ELEMENTS_BY_LAST_DIGIT[lastDigit];

  return { animal, element, animalIndex, trueYear };
}

function getWesternZodiac(m, d) {
  const dateNum = m * 100 + d;
  
  for (let z of CONFIG.ZODIACS) {
    const [startM, startD] = z.start.split("-").map(Number);
    const [endM, endD] = z.end.split("-").map(Number);
    
    if (z.name === "Матар") {
      if (dateNum >= 1222 || dateNum <= 119) return z;
    } else {
      const start = startM * 100 + startD;
      const end = endM * 100 + endD;
      if (dateNum >= start && dateNum <= end) return z;
    }
  }
  return { name: "Тодорхойгүй", element: "Тодорхойгүй" };
}

function getTimeAnimal(timeStr) {
  if (!timeStr || timeStr.toLowerCase().includes("unknown") || timeStr === "Тодорхойгүй") return "Тодорхойгүй";
  const hour = parseInt(timeStr.split(":")[0], 10);
  
  if (hour >= 23 || hour < 1) return "Хулгана";
  if (hour >= 1 && hour < 3) return "Үхэр";
  if (hour >= 3 && hour < 5) return "Бар";
  if (hour >= 5 && hour < 7) return "Туулай";
  if (hour >= 7 && hour < 9) return "Луу";
  if (hour >= 9 && hour < 11) return "Могой";
  if (hour >= 11 && hour < 13) return "Морь";
  if (hour >= 13 && hour < 15) return "Хонь";
  if (hour >= 15 && hour < 17) return "Бич";
  if (hour >= 17 && hour < 19) return "Тахиа";
  if (hour >= 19 && hour < 21) return "Нохой";
  if (hour >= 21 && hour < 23) return "Гахай";
  return "Тодорхойгүй";
}

function calculateNumerology(y, m, d) {
  function sumDigits(n) {
    return String(n).split('').reduce((a, b) => a + Number(b), 0);
  }
  
  function reduceToMaster(n) {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n < 10) return n;
    return reduceToMaster(sumDigits(n));
  }

  const total = sumDigits(y) + sumDigits(m) + sumDigits(d);
  const lifePath = reduceToMaster(total);

  const birthDay = d;

  return { lifePath, birthDay };
}

function calculateTransits(birthIdx) {
  // Logic: Find the best 3 years starting from Next Year (2026)
  const startYear = 2026;
  const startAnimalIdx = 6; // Horse
  
  let gates = [];
  
  for (let i = 0; i < 12; i++) {
    let currentYear = startYear + i;
    let currentAnimalIdx = (startAnimalIdx + i) % 12;
    let animalName = CONFIG.ANIMALS[currentAnimalIdx];
    
    let diff = (currentAnimalIdx - birthIdx + 12) % 12;
    
    let status = "";
    let isGolden = false;

    if (diff === 0) { status = "Өөрийн жил (Jupiter Return)"; isGolden = true; }
    else if (diff === 4 || diff === 8) { status = "Их Ивээл (Алтан Хаалга)"; isGolden = true; }
    else if (diff === 6) { status = "Харш (Сорилт)"; }
    else if (diff === 3) { status = "Түнш (Ивээл)"; isGolden = true; }
    
    if (isGolden || i === 0) {
       gates.push({ year: currentYear, animal: animalName, status: status || "Хэвийн (Бэлтгэл үе)" });
    }
  }

  return {
    gate1: gates[0] ? `${gates[0].year} (${gates[0].animal}) - ${gates[0].status}` : "2026 (Морь) - Хэвийн",
    gate2: gates[1] ? `${gates[1].year} (${gates[1].animal}) - ${gates[1].status}` : "2027 (Хонь) - Хэвийн",
    gate3: gates[2] ? `${gates[2].year} (${gates[2].animal}) - ${gates[2].status}` : "2028 (Бич) - Хэвийн"
  };
}

function analyzeElementalConflict(yearEl, zodiacEl) {
  if (yearEl === "Усан" && zodiacEl === "Гал") return "Ус Гал хоёрын тэмцэл (Буцалж буй Ус)";
  if (yearEl === "Гал" && zodiacEl === "Ус") return "Гал Ус хоёрын тэмцэл (Унтарсан Цог)";
  if (yearEl === zodiacEl) return "Давхар хүч (Тэнцвэртэй)";
  if ((yearEl === "Модон" && zodiacEl === "Гал") || (yearEl === "Гал" && zodiacEl === "Модон")) return "Гал дээр тос (Дүрэлзсэн Энерги)";
  return "Холимог Энерги";
}

// ==========================================
// 2. GENERATION ENGINE (GEMINI PROMPTS)
// ==========================================

function generateFullReport(p, apiKey) {
  const model = CONFIG.GEMINI_MODEL;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; 
  let forecastYear = currentYear;
  if (currentMonth >= 11) forecastYear = currentYear + 1;
  
  const nextYearAnimal = CONFIG.ANIMALS[(forecastYear - 1900) % 12];
  
  // SYSTEM PROMPT (NEW: RELATIONSHIP DATA ANALYST)
  const systemPrompt = `
    ROLE: "Life Code" Relationship Strategist & Data Scientist.
    TONE: Analytical, Direct, Modern. Use data metaphors (e.g., 'Love Algorithms', 'Emotional Capital', 'Sync Rate').
    LANGUAGE: Mongolian (Cyrillic).

    CRITICAL RULES:
    1. FOCUS: 100% on LOVE, RELATIONSHIPS, and FAMILY. Do not give general business/career advice unless it relates to financial stability for a family.
    2. NO FLUFF: Avoid overly poetic or superstitious language. Focus on "Patterns" and "Strategy".
    3. NO INTRODUCTIONS: Start directly with the Chapter Title.
    4. NO BULLET POINTS: Use full paragraphs or bold subheaders.
    5. FORMATTING: Use **BOLD** for important insights.
    6. ADDRESSING: Address the user as "Чи" (You).
    7. BOLD SAFETY: Always close bold tags (e.g., **Title**).
    
    USER PROFILE:
    - Name: ${p.name}
    - Gender: ${p.gender} (IMPORTANT: Partner is OPPOSITE gender).
    - Year: ${p.yearElement} ${p.yearAnimal}
    - Zodiac: ${p.zodiacSign} (${p.zodiacElement})
    - Birth Time: ${p.tob} (${p.timeAnimal} hour)
    - Life Path: ${p.lifePath}
    - Transits: ${p.transit2025}, ${p.transit2026}, ${p.transit2027}
  `;

  // --- REQUEST 1: CHAPTERS 1 & 2 ---
  const prompt1 = `
    ${systemPrompt}
    
    TASK: Write PART 1 (Chapters 1 & 2).
    
    Start with this Data File:
    
    **🆔 PERSONAL DATA FILE: #${String(Math.floor(Math.random()*10000)).padStart(4, '0')}**
    -----------------------------------
    👤 **Identity:** ${p.name}
    📅 **Manufactured:** ${p.dob}
    🧬 **Genetic Code:** ${p.yearElement} ${p.yearAnimal}
    🌌 **Cosmic Sign:** ${p.zodiacElement} махбодьтой ${p.zodiacSign}
    ⚙️ **System Version:** Life Path ${p.lifePath}
    -----------------------------------
    
    **📊 БҮЛЭГ 1: ҮНДСЭН ӨГӨГДЛИЙН ШИНЖИЛГЭЭ**
    - Analyze the user's personality as a "System Architecture" for relationships.
    - How does their ${p.yearAnimal} and ${p.zodiacSign} mix affect their ability to love and connect?
    - Inner Self (Source Code) vs Outer Mask (User Interface).
    - Element Analysis: ${p.elementRelationship}.

    **❤️ БҮЛЭГ 2: ХАРИЛЦААНЫ АЛГОРИТМ БА НИЙЦЭЛ**
    - What is their "Love Language"?
    - "System Bugs" in love: Why do they fail in relationships? (Shadow Side).
    - Compatibility: Who is the best match? Who causes a "System Crash"?
    
    (Write in deep, flowing paragraphs. NO BULLETS).
  `;
  const r1 = callGemini(prompt1, apiKey);

  // --- REQUEST 2: CHAPTERS 3 & 4 ---
  const prompt2 = `
    ${systemPrompt}
    
    TASK: Write PART 2 (Chapters 3 & 4).
    
    **👤 БҮЛЭГ 3: ТОХИРОХ ХҮНИЙ ТӨРХ БА ШИНЖ ЧАНАР**
    - REQUIREMENT: Use numbered subtitles for this chapter ONLY.
    - TARGET: The partner must be MONGOLIAN.
    - GENDER: Describe the OPPOSITE gender of ${p.gender}.
    - Structure:
      **1. Гадаад төрх (Visual Data):** (Face, Body, Aura).
      **2. Зан чанар (Personality Metrics):** (Inner qualities, Family values).
      **3. Нийгэм & Санхүү (Socio-Economic Profile):** (Likely profession, FINANCIAL STATUS/WEALTH POTENTIAL - important!).
    
    **⏳ БҮЛЭГ 4: ХУВЬ ЗАЯАНЫ ЭРГЭЛТИЙН ЦЭГҮҮД**
    - Focus ONLY on LOVE/MARRIAGE windows.
    - Analyze:
      * 1-р Цонх: ${p.transit2025}
      * 2-р Цонх: ${p.transit2026}
      * 3-р Цонх: ${p.transit2027}
    - Explain if these years are good for meeting someone, getting married, or having children.
    
    (Write in deep, flowing paragraphs. NO BULLETS).
  `;
  const r2 = callGemini(prompt2, apiKey);

  // --- REQUEST 3: CHAPTER 5 ONLY ---
  const prompt3 = `
    ${systemPrompt}
    
    TASK: Write PART 3 (Chapter 5 ONLY).
    
    **📈 БҮЛЭГ 5: ИРЭХ ЖИЛИЙН ТӨЛӨВ БА СТРАТЕГИ (${forecastYear} ОН - ${nextYearAnimal.toUpperCase()} ЖИЛ)**
    - How does ${forecastYear} affect ${p.yearAnimal}'s LOVE LIFE and FAMILY?
    - "Relationship Status Forecast": Will they be single, dating, or stable?
    - "Emotional Investment Advice": How to maintain balance in the relationship?
    - DO NOT talk about Career/Business unless it supports the family.
    
    (Write in deep, flowing paragraphs. NO BULLETS. STOP immediately after Chapter 5).
  `;
  const r3 = callGemini(prompt3, apiKey);

  return {
    text: r1.text + "\n\n" + r2.text + "\n\n" + r3.text,
    usage: r1.usage + r2.usage + r3.usage
  };
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
// 3. PDF & DELIVERY
// ==========================================

function createPdf(name, content, templateId) {
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Life Code Report`);
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
  const pdfFile = DriveApp.getFolderById("1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j").createFile(pdf);
  
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
      content: {
        messages: [
          { type: "text", text: msg }
        ]
      }
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
