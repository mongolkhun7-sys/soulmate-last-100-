/****************************************************************************************
 * PRODUCT: DIGITAL ASTROLOGY REPORT GENERATOR (FINANCIAL & WEALTH)
 * VERSION: v3.3 - Financial Master Template (Natural Explanations)
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v3.3-Financial-Natural",
  PRODUCT_NAME: "Таны Санхүүгийн Код & Баяжих Зурхай",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.8, 

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
  // ⚙️ MASTER CONFIGURATION
  // ==================================================================================
  
  AI_SETTINGS: {
    // 1. THE PERSONA
    ROLE: "Professional Financial Astrologer & Wealth Psychologist.",
    
    // 2. THE TONE OF VOICE
    TONE: "Analytical, empowering, strategic, and deeply insightful. Use professional financial terminology mixed with spiritual wisdom. Avoid vague promises; focus on actionable energy analysis.",
    
    // 3. CORE RULES (Apply to all chapters)
    CORE_RULES: `
    1. NO INTRODUCTIONS: Do not say "Hello", "I am Saruulbat", or "Here is your report". Start directly with the Chapter Title.
    2. NO BULLET POINTS: Do not use '*' or '-' for lists. Use full paragraphs or bold subheaders. The text must look like a book, not a PowerPoint slide.
    3. FORMATTING: Use **BOLD** for important subheadings. Separate paragraphs with empty lines.
    4. LANGUAGE PRECISION: Use strong words: "Санхүүгийн урсгал" (Financial flow), "Энергийн түгжээ" (Energy block), "Баялгийн код" (Wealth code). Avoid "Maybe" (Магадгүй).
    5. ADDRESSING: Address the user as "Чи" (You) - intimate and direct.
    6. GENDER NEUTRALITY: If the gender is "Neutral" (e.g., user input was incomplete), avoid gender-specific words like "бүсгүй", "залуу". Use "та", "чи", "хувь хүн".
    7. UNKNOWN TIME LOGIC: If 'Birth Time' is Unknown, do not generate hour-based predictions.
    8. BOLD SAFETY: When using ** for bold titles, you MUST close them (e.g., **Title**).
    `,

    // 4. CHAPTER PROMPTS (Use {{variables}} to insert data)
    PROMPTS: {
      // --- PART 1: IDENTITY & NUMEROLOGY ---
      PART_1: `
      TASK: Write PART 1 (Chapters 1 & 2).
      
      Start with a boxed summary of their financial profile.
      
      **✨ ТАНЫ САНХҮҮГИЙН КОД**
      👤 **Нэр:** {{name}}
      📅 **Төрсөн огноо:** {{dob}}
      🐉 **Монгол жил:** {{yearElement}} {{yearAnimal}}
      ✨ **Өрнийн орд:** {{zodiacElement}} махбодьтой {{zodiacSign}}
      {{timeInfoLine}}
      
      **📖 БҮЛЭГ 1: ТӨРСӨН МӨЧИЙН САНХҮҮГИЙН ЭНЕРГИ**
      - Analyze the financial characteristics of the {{yearAnimal}} year and {{zodiacSign}}.
      - Discuss their innate relationship with money based on {{zodiacElement}} element (e.g., Earth accumulates, Fire spends, Air trades, Water flows).
      - Contrast their outward financial behavior vs. inner desires.
      {{timeAnalysisInstructions}}

      **📖 БҮЛЭГ 2: ТООН ЭНЕРГИЙН МАТРИЦ (NUMEROLOGY)**

      **1️⃣ ХУВЬ ТАВИЛАНГИЙН ТОО: {{destinyNumber}}**
      - Explain that this number comes from {{destinyCalc}}, but write it naturally in the sentence, not as a math equation.
      - Explain how this number shapes their main path to wealth.

      **2️⃣ СҮНСНИЙ ТОО: {{soulNumber}}**
      - Explain that this number comes from {{soulCalc}}, but write it naturally in the sentence.
      - Explain their inner emotional need for security or freedom.

      **3️⃣ ДОТООД ХҮСЛИЙН ТОО: {{innerDesireNumber}}**
      - Explain that this number comes from {{innerDesireCalc}}, but write it naturally in the sentence.
      - What do they secretly crave financially?

      **4️⃣ ЗОРИЛГЫН ТОО: {{goalNumber}}**
      - Explain that this number comes from {{goalCalc}}, but write it naturally in the sentence.
      - Their ultimate financial mission.
      
      (Write in deep, flowing paragraphs. NO BULLETS).
      `,

      // --- PART 2: PSYCHOLOGY & CAREER ---
      PART_2: `
      TASK: Write PART 2 (Chapters 3 & 4).
      CONTEXT: Building on their Numerology ({{destinyNumber}}), focus on psychology and career.

      **📖 БҮЛЭГ 3: САНХҮҮГИЙН ЗАН ТӨЛӨВ & МӨНГӨНИЙ СЭТГЭЛ ЗҮЙ**
      - Analyze their "Money Mindset". Are they a Saver, Spender, Investor, or Giver?

      **⚠️ АНХААР: ТАНЫ САНХҮҮГИЙН "ТҮГЖЭЭ"**
      - Identify potential psychological barriers (e.g., fear of poverty, imposter syndrome) based on their profile.

      **Шийдвэр Гаргалт:**
      - How do they make financial decisions? (Impulsive vs. Analytical).

      **📖 БҮЛЭГ 4: ТОХИРОМЖТОЙ ЧИГЛЭЛ & АМЖИЛТТАЙ САЛБАРУУД**
      - Suggest specific career paths or business models suitable for a {{zodiacSign}} with Life Path {{destinyNumber}}.
      - **1. Төрсөн энерги шууд дэмждэг салбарууд:** (List 3-4 specific industries).
      - **2. Хөгжвөл нээгдэх боломжууд:** (Skills to learn for higher income).
      - **3. Тогтвортой орлогын эх үүсвэр:** (Best way to build long-term wealth).
      
      (Write in deep, flowing paragraphs. NO BULLETS).
      `,

      // --- PART 3: FORECAST & KEYS ---
      PART_3: `
      TASK: Write PART 3 (Chapters 5 & 6).

      **📖 БҮЛЭГ 5: ИРЭЭДҮЙН 3 ЖИЛИЙН САНХҮҮГИЙН УРСГАЛ**
      
      **📅 {{year1}} ОН (ХУВИЙН ЖИЛ {{py1}})**
      - Explain that this personal year comes from {{py1Calc}}, but write it naturally in the sentence.
      - Financial Advice for this specific year.

      **📅 {{year2}} ОН (ХУВИЙН ЖИЛ {{py2}})**
      - Explain that this personal year comes from {{py2Calc}}, but write it naturally in the sentence.
      - What to avoid this year?

      **📅 {{year3}} ОН (ХУВИЙН ЖИЛ {{py3}})**
      - Explain that this personal year comes from {{py3Calc}}, but write it naturally in the sentence.
      - Key opportunities.

      **📖 БҮЛЭГ 6: САНХҮҮГИЙН ЭРХ ЧӨЛӨӨНД ХҮРЭХ ТҮЛХҮҮРҮҮД**
      - **Дотоод түлхүүр:** A mindset shift needed for wealth.
      - **Гаднах түлхүүр:** A practical action to take.
      - **Энергийн түлхүүр:** How to unblock their flow.

      (Write in deep, flowing paragraphs. NO BULLETS. End with an empowering closing statement).
      `
    }
  },

 // ==================================================================================
  // 🧠 STATIC DATA (DO NOT EDIT BELOW THIS LINE)
  // ==================================================================================
  
  TSAGAAN_SAR: {
    1945: "02-13", 1946: "02-02", 1947: "01-22", 1948: "02-10", 1949: "01-29",
    1950: "02-17", 1951: "02-06", 1952: "01-27", 1953: "02-14", 1954: "02-03",
    1955: "02-24", 1956: "02-12", 1957: "01-31", 1958: "02-18", 1959: "02-08",
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
    2015: "02-19", 2016: "02-09", 2017: "02-27", 2018: "02-16", 2019: "02-05",
    2020: "02-24", 2021: "02-12", 2022: "02-02", 2023: "02-21", 2024: "02-10",
    2025: "02-28"
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

  DELIVERY_MESSAGE: `💰 Сайн байна уу, {{NAME}}? \n\nЧиний "Санхүүгийн Код & Баяжих Зурхай" бэлэн боллоо.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
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
        
        // 1. PARSE
        const profile = parseAndCalculateProfile(inputString);
        
        // 2. GENERATE
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

  // Forecast Years
  const now = new Date();
  const currentYear = now.getFullYear();
  const py1 = calculatePersonalYear(year, month, day, currentYear + 1); // 2026
  const py2 = calculatePersonalYear(year, month, day, currentYear + 2); // 2027
  const py3 = calculatePersonalYear(year, month, day, currentYear + 3); // 2028

  return {
    name: name,
    firstName: name === "Та" ? "Та" : name.split(" ")[0],
    dob: dateStr,
    tob: timeStr,
    gender: gender,
    
    yearAnimal: mongolData.animal,
    yearElement: mongolData.element,
    zodiacSign: zodiacData.name,
    zodiacElement: zodiacData.element,
    timeAnimal: timeAnimal,
    
    // Numerology
    destinyNumber: numerology.destiny.val,
    destinyCalc: numerology.destiny.path,
    soulNumber: numerology.soul.val,
    soulCalc: numerology.soul.path,
    innerDesireNumber: numerology.innerDesire.val,
    innerDesireCalc: numerology.innerDesire.path,
    goalNumber: numerology.goal.val,
    goalCalc: numerology.goal.path,
    
    // Forecast
    py1: { year: currentYear + 1, number: py1.val, calc: py1.path },
    py2: { year: currentYear + 2, number: py2.val, calc: py2.path },
    py3: { year: currentYear + 3, number: py3.val, calc: py3.path },
    
    elementRelationship: elementRel
  };
}

function normalizeInputWithAI(raw, model, key) {
  const prompt = `
    TASK: Normalize input.
    INPUT: "${raw}"

    RULES:
    1. Fix typos in Date (e.g. 19996 -> 1996, 83 -> 1983). Range: 1940-2024.
    2. If Name missing -> use "Та".
    3. If Gender missing -> use "Neutral".
    4. Time "Unknown" if missing.

    REQUIRED JSON:
    {
      "name": "String",
      "date": "YYYY.MM.DD", 
      "time": "HH:MM" or "Unknown",
      "gender": "Эрэгтэй" or "Эмэгтэй" or "Neutral"
    }
  `;
  try {
    const result = callGemini(prompt, key); 
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Normalization Failed", e);
    // Fallback if AI fails (basic regex)
    return {
      name: "Та",
      date: "2000.01.01",
      time: "Unknown",
      gender: "Neutral"
    };
  }
}

function getMongolianYearData(year, month, day) {
  const tsDate = CONFIG.TSAGAAN_SAR[year];
  if (!tsDate) {
    // Basic fallback if year out of range
    return { animal: "Хулгана", element: "Төмөр", animalIndex: 0 };
  }
  
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

// --- NEW NUMEROLOGY ENGINE WITH EXPLANATION STRINGS ---
function calculateNumerology(y, m, d) {
  function sumDigits(n) {
    return String(n).split('').reduce((a, b) => a + Number(b), 0);
  }
  
  function reduce(n) {
    if (n === 11 || n === 22 || n === 33) return n; // Master numbers
    if (n < 10) return n;
    return reduce(sumDigits(n));
  }

  // Helper to format: "1+9+8+3+0+1+0+1 = 32 -> 5"
  function getPath(label, rawSum, reduced) {
    return `${label} = ${rawSum} → ${reduced}`;
  }

  // 1. Destiny Number (Life Path)
  // Logic: Sum all digits of DOB
  const dobString = `${y}${m < 10 ? '0'+m : m}${d < 10 ? '0'+d : d}`;
  const rawDestiny = dobString.split('').reduce((a, b) => a + Number(b), 0);
  const destiny = reduce(rawDestiny);
  const destinyPath = `Бодолт: ${y}.${m}.${d} → ${rawDestiny} → ${destiny}`;

  // 2. Soul Number
  // Logic: Sum of Day only
  const soul = reduce(d);
  const soulPath = `Бодолт: Төрсөн өдөр ${d} → ${soul}`;

  // 3. Inner Desire
  // Logic: Sum of Month + Day
  const rawInner = reduce(m) + reduce(d);
  const innerDesire = reduce(rawInner);
  const innerPath = `Бодолт: Сар (${m}) + Өдөр (${d}) = ${rawInner} → ${innerDesire}`;

  // 4. Goal Number
  // Logic: Destiny + Soul
  const rawGoal = destiny + soul;
  const goal = reduce(rawGoal);
  const goalPath = `Бодолт: Хувь тавилан (${destiny}) + Сүнс (${soul}) = ${rawGoal} → ${goal}`;

  return {
    destiny: { val: destiny, path: destinyPath },
    soul: { val: soul, path: soulPath },
    innerDesire: { val: innerDesire, path: innerPath },
    goal: { val: goal, path: goalPath }
  };
}

function calculatePersonalYear(birthY, birthM, birthD, currentYear) {
  function sumDigits(n) {
    return String(n).split('').reduce((a, b) => a + Number(b), 0);
  }
  function reduce(n) {
    if (n < 10) return n;
    return reduce(sumDigits(n));
  }

  // Formula: Current Year + Birth Month + Birth Day
  const rawSum = currentYear + sumDigits(birthM) + sumDigits(birthD);
  const val = reduce(rawSum);
  const path = `Бодолт: ${currentYear} + ${birthM} + ${birthD} = ${rawSum} → ${val}`;

  return { val, path };
}

// (Kept for compatibility)
function calculateTransits(birthIdx) {
  return { gate1: "", gate2: "", gate3: "" };
}

function analyzeElementalConflict(yearEl, zodiacEl) {
  return `${yearEl} vs ${zodiacEl}`;
}

// ==========================================
// 2. GENERATION ENGINE
// ==========================================

function generateFullReport(p, apiKey) {
  
  // 1. Prepare Replacement Variables
  const timeInfoLine = p.timeAnimal !== "Тодорхойгүй" 
    ? `🕰️ **Төрсөн цаг:** ${p.tob} (${p.timeAnimal} цаг)` 
    : "";
    
  const timeAnalysisInstructions = p.timeAnimal !== "Тодорхойгүй"
    ? `- Analyze ${p.timeAnimal} birth hour influence on their hidden financial habits.`
    : "(User does not know birth time, so SILENTLY SKIP birth hour analysis.)";

  // The map of {{variables}} to values
  const replacements = {
    "{{name}}": p.name,
    "{{dob}}": p.dob,
    "{{yearElement}}": p.yearElement,
    "{{yearAnimal}}": p.yearAnimal,
    "{{zodiacElement}}": p.zodiacElement,
    "{{zodiacSign}}": p.zodiacSign,
    "{{tob}}": p.tob,
    "{{timeAnimal}}": p.timeAnimal,
    "{{gender}}": p.gender,

    // Numerology
    "{{destinyNumber}}": p.destinyNumber, "{{destinyCalc}}": p.destinyCalc,
    "{{soulNumber}}": p.soulNumber,       "{{soulCalc}}": p.soulCalc,
    "{{innerDesireNumber}}": p.innerDesireNumber, "{{innerDesireCalc}}": p.innerDesireCalc,
    "{{goalNumber}}": p.goalNumber,       "{{goalCalc}}": p.goalCalc,

    // Forecast
    "{{year1}}": p.py1.year, "{{py1}}": p.py1.number, "{{py1Calc}}": p.py1.calc,
    "{{year2}}": p.py2.year, "{{py2}}": p.py2.number, "{{py2Calc}}": p.py2.calc,
    "{{year3}}": p.py3.year, "{{py3}}": p.py3.number, "{{py3Calc}}": p.py3.calc,

    "{{timeInfoLine}}": timeInfoLine,
    "{{timeAnalysisInstructions}}": timeAnalysisInstructions
  };

  // 2. Build System Prompt
  const systemPrompt = `
    ROLE: ${CONFIG.AI_SETTINGS.ROLE}
    TONE: ${CONFIG.AI_SETTINGS.TONE}
    CORE RULES: ${CONFIG.AI_SETTINGS.CORE_RULES}
    
    USER PROFILE:
    - Name: ${p.name}
    - Gender: ${p.gender}
    - Year: ${p.yearElement} ${p.yearAnimal}
    - Zodiac: ${p.zodiacSign} (${p.zodiacElement})
    - Destiny Number: ${p.destinyNumber}
    - Soul Number: ${p.soulNumber}
  `;

  // 3. Helper to replace placeholders
  const fill = (template) => {
    let result = template;
    for (const [key, val] of Object.entries(replacements)) {
      result = result.split(key).join(val);
    }
    return result;
  };

  // 4. Execute Prompts
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
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Financial Report`);
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
  const folder = DriveApp.getFolderById("1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j"); // Ensure this folder ID is correct or updated
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
