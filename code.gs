/****************************************************************************************
 * PRODUCT: DIGITAL ASTROLOGY REPORT GENERATOR (ZURHAI AI)
 * VERSION: v2.8 - Final Release (Time Logic, Grammar, Logging & Transits)
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v2.8-AstroMaster",
  PRODUCT_NAME: "Таны Хувь Заяаны Код - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, // Lower batch size for longer generation
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.8, // Slightly creative but grounded in logic

  // --- COLUMN MAPPING (0-based) ---
  // Expected Input Format: "Name - YYYY.MM.DD - HH:MM - Gender"
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
    // Format: Year: "Month-Day" of Tsagaan Sar (Start of Mongolian Year)
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
  
  // Element Cycle (Standard 10-year stems: 0-1 Metal, 2-3 Water, 4-5 Wood, 6-7 Fire, 8-9 Earth)
  // BUT Mongolian years shift. We calculate element based on the year stem.
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

  DELIVERY_MESSAGE: `🔮 Сайн байна уу, {{NAME}}? \n\nЧиний "Хувь Заяаны Код" тайлагдлаа. Энэ бол зүгээр нэг зурхай биш, чиний дотоод ертөнцийн газрын зураг юм.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
};

// --- MAIN FUNCTION ---
function main() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  const START_TIME = new Date().getTime();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  
  // SECRETS
  const KEYS = {
    GEMINI: PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
    MANYCHAT: PropertiesService.getScriptProperties().getProperty("MANYCHAT_API_TOKEN"),
    TEMPLATE: PropertiesService.getScriptProperties().getProperty("TEMPLATE_ID") // Doc Template ID
  };

  let processedCount = 0;
  const TIME_LIMIT = 270000; // 4.5 minutes (Safety Guard)

  try {
    for (let i = 1; i < rows.length; i++) {
      // Time Guard: Stop if running longer than 4.5 minutes
      if (new Date().getTime() - START_TIME > TIME_LIMIT) {
        console.warn("⏳ TIME GUARD: Stopping batch execution to prevent timeout.");
        break; 
      }
      
      if (processedCount >= CONFIG.BATCH_SIZE) break;

      const row = rows[i];
      const status = row[CONFIG.COLUMNS.STATUS];
      
      // Skip logic
      if (status === "DONE" || String(status).includes("ERROR") || !row[CONFIG.COLUMNS.INPUT]) continue;

      // Mark processing
      sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("Processing...");
      SpreadsheetApp.flush();

      try {
        const inputString = String(row[CONFIG.COLUMNS.INPUT]); // "Ariunzul - 1993.04.12 - 02:00 - ЭМ"
        const contactId = row[CONFIG.COLUMNS.ID];
        
        // 1. PARSE & CALCULATE (The Brain)
        const profile = parseAndCalculateProfile(inputString);
        
        // 2. GENERATE CONTENT (The Artist)
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
        sheet.getRange(i + 1, CONFIG.COLUMNS.TOKEN + 1).setValue(reportResult.usage); // Log Tokens
        sheet.getRange(i + 1, CONFIG.COLUMNS.DEBUG + 1).setValue(JSON.stringify(profile));
        sheet.getRange(i + 1, CONFIG.COLUMNS.DATE + 1).setValue(formattedDate);
        sheet.getRange(i + 1, CONFIG.COLUMNS.VER + 1).setValue(CONFIG.VERSION);
        sheet.getRange(i + 1, CONFIG.COLUMNS.ERROR + 1).setValue(""); // Clear error log
        
        processedCount++;

      } catch (err) {
        console.error(err);
        sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("ERROR");
        sheet.getRange(i + 1, CONFIG.COLUMNS.ERROR + 1).setValue(err.message); // Write actual error to J column
      }
    }
  } catch (e) {
    console.error("Critical Error", e);
  } finally {
    lock.releaseLock();
  }
}

// ==========================================
// 1. CORE LOGIC ENGINE (MATH & MAPS)
// ==========================================

function parseAndCalculateProfile(rawInput) {
  // 1. Normalize Input with AI (Handles messy formats, extracting Gender, etc)
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"));
  
  // 2. Parse Normalized Data
  const dateStr = normalized.date; // "YYYY.MM.DD"
  const timeStr = normalized.time; // "HH:MM"
  const gender = normalized.gender; // "Эрэгтэй" or "Эмэгтэй"
  const name = normalized.name;

  const [year, month, day] = dateStr.split(".").map(Number);
  
  // A. MONGOLIAN ANIMAL & ELEMENT
  const mongolData = getMongolianYearData(year, month, day);
  
  // B. WESTERN ZODIAC
  const zodiacData = getWesternZodiac(month, day);
  
  // C. TIME ANIMAL
  const timeAnimal = getTimeAnimal(timeStr);
  
  // D. NUMEROLOGY
  const numerology = calculateNumerology(year, month, day);

  // E. TRANSITS (Future Years)
  const transits = calculateTransits(mongolData.animalIndex);

  // F. ELEMENTAL RELATIONSHIP (Internal Conflict)
  const elementRel = analyzeElementalConflict(mongolData.element, zodiacData.element);

  return {
    name: name,
    firstName: name.split(" ")[0],
    dob: dateStr,
    tob: timeStr,
    gender: gender,
    
    // Calculated
    yearAnimal: mongolData.animal,
    yearElement: mongolData.element,
    zodiacSign: zodiacData.name,
    zodiacElement: zodiacData.element,
    timeAnimal: timeAnimal,
    isDoubleAnimal: mongolData.animal === timeAnimal,
    
    // Numerology
    lifePath: numerology.lifePath,
    birthDayNum: numerology.birthDay,
    
    // Transits
    transit2025: transits.gate1, // Using Gate 1 (2026)
    transit2026: transits.gate2, // Using Gate 2 (2027 or next Trine)
    transit2027: transits.gate3, // Using Gate 3
    
    // Synthesis
    elementRelationship: elementRel
  };
}

function normalizeInputWithAI(raw, model, key) {
  // Simple prompt to standardize any input
  const prompt = `
    TASK: Normalize this input string into JSON.
    INPUT: "${raw}"
    REQUIRED JSON FORMAT:
    {
      "name": "Full Name",
      "date": "YYYY.MM.DD", (e.g. 1993.04.12)
      "time": "HH:MM" OR "Unknown", (If user says "medkv", "unknown", "sanahgu", "todorgu", or empty, return "Unknown". Do not guess.)
      "gender": "Эрэгтэй" or "Эмэгтэй" (Note: "эр" = "Эрэгтэй", "эм" = "Эмэгтэй". Default to "Эмэгтэй" if unknown)
    }
    RETURN ONLY JSON.
  `;
  
  // We use a separate small call here. 
  // Note: We use the shared callGemini helper but need to handle the JSON parsing carefully.
  try {
    const result = callGemini(prompt, key); 
    // Clean markdown code blocks if present
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Normalization Failed", e);
    // Fallback if AI fails (assume standard format)
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
  // 1. Check if born before Tsagaan Sar
  const tsDate = CONFIG.TSAGAAN_SAR[year];
  if (!tsDate) throw new Error(`Year ${year} not in Tsagaan Sar Map`);
  
  const [tsMonth, tsDay] = tsDate.split("-").map(Number);
  
  let trueYear = year;
  // If born before Tsagaan Sar (e.g., Jan 15), they belong to previous year
  if (month < tsMonth || (month === tsMonth && day < tsDay)) {
    trueYear = year - 1;
  }

  // 2. Calculate Animal (Cycle of 12)
  // 1900 = Mouse (Start of a cycle reference). 
  // actually 1900 is Mouse (Metal Mouse). 
  // (trueYear - 1900) % 12 
  // 0=Mouse, 1=Ox, ...
  const animalIndex = (trueYear - 1900) % 12;
  const animal = CONFIG.ANIMALS[animalIndex];

  // 3. Calculate Element (Last digit of year)
  // Mongolian element is usually determined by the Stem (last digit of year)
  // 0-1 Metal, 2-3 Water...
  const lastDigit = trueYear % 10;
  const element = CONFIG.ELEMENTS_BY_LAST_DIGIT[lastDigit];

  return { animal, element, animalIndex, trueYear };
}

function getWesternZodiac(m, d) {
  // Format MM-DD for comparison
  const dateNum = m * 100 + d; // e.g., 412 for April 12
  
  for (let z of CONFIG.ZODIACS) {
    const [startM, startD] = z.start.split("-").map(Number);
    const [endM, endD] = z.end.split("-").map(Number);
    
    // Handle Capricorn (Dec 22 - Jan 19) wrap around
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
  
  // Mongol 12 hours: 23-01 Mouse, 01-03 Ox, etc.
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

  // Life Path
  const total = sumDigits(y) + sumDigits(m) + sumDigits(d);
  const lifePath = reduceToMaster(total); // Recursive reduction respecting masters

  // Birthday Number (for Karmic Debt check, e.g., 13)
  const birthDay = d; // We keep it as is (e.g., 13, 14, 16, 19)

  return { lifePath, birthDay };
}

function calculateTransits(birthIdx) {
  // Dynamic Future Gates Logic: Find the best 3 years starting from Next Year (2026)
  // 2026 is Horse (Index 6 in CONFIG.ANIMALS)
  const startYear = 2026;
  const startAnimalIdx = 6; // Horse
  
  let gates = [];
  
  // Look ahead 12 years to find best matches
  for (let i = 0; i < 12; i++) {
    let currentYear = startYear + i;
    let currentAnimalIdx = (startAnimalIdx + i) % 12;
    let animalName = CONFIG.ANIMALS[currentAnimalIdx];
    
    // Calculate relation
    // We use circular distance for Trine/Clash
    let diff = (currentAnimalIdx - birthIdx + 12) % 12;
    
    let status = "";
    let isGolden = false;

    if (diff === 0) { status = "Өөрийн жил (Jupiter Return)"; isGolden = true; }
    else if (diff === 4 || diff === 8) { status = "Их Ивээл (Алтан Хаалга)"; isGolden = true; }
    else if (diff === 6) { status = "Харш (Сорилт)"; } // Important to know but not a "Golden Gate" usually
    else if (diff === 3) { status = "Түнш (Ивээл)"; isGolden = true; } // Optional "Minor Trine"
    
    if (isGolden || i === 0) { // Always include 2026 (i=0) even if normal
       gates.push({ year: currentYear, animal: animalName, status: status || "Хэвийн (Бэлтгэл үе)" });
    }
  }

  // Return top 3 unique years
  return {
    gate1: gates[0] ? `${gates[0].year} (${gates[0].animal}) - ${gates[0].status}` : "2026 (Морь) - Хэвийн",
    gate2: gates[1] ? `${gates[1].year} (${gates[1].animal}) - ${gates[1].status}` : "2027 (Хонь) - Хэвийн",
    gate3: gates[2] ? `${gates[2].year} (${gates[2].animal}) - ${gates[2].status}` : "2028 (Бич) - Хэвийн"
  };
}

function analyzeElementalConflict(yearEl, zodiacEl) {
  // Simple logic for the "Story"
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

  // Determine "Next Year" logic
  // If today is late 2025 (e.g. Nov/Dec), report should focus on 2026.
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; 
  let forecastYear = currentYear;
  if (currentMonth >= 11) forecastYear = currentYear + 1; // If Nov/Dec, forecast next year
  
  // Hardcoded next year logic for consistency with user request if they are testing for "future"
  // For now, let's just make sure 2026 is the main forecast if we are in late 2025.
  // Actually, let's explicitly pass the years to Gemini so it knows.
  const nextYearAnimal = CONFIG.ANIMALS[(forecastYear - 1900) % 12];
  
  // SYSTEM PROMPT
  const systemPrompt = `
    ROLE: Professional Mongolian Astrologer & Psychologist.
    TONE: Literary, poetic, deep, philosophical. Avoid robotic or dry translated phrases. Write like a wise mentor speaking to a soul.
    LANGUAGE: Mongolian (Cyrillic). Use rich vocabulary.

    CRITICAL RULES:
    1. NO INTRODUCTIONS: Do not say "Hello", "I am Saruulbat", or "Here is your report". Start directly with the Chapter Title.
    2. NO BULLET POINTS: Do not use '*' or '-' for lists. Use full paragraphs or bold subheaders. The text must look like a book, not a PowerPoint slide.
    3. FORMATTING: Use **BOLD** for important subheadings. Separate paragraphs with empty lines.
    4. LANGUAGE PRECISION: Do not use weak words like "Магадгүй" (Maybe). Instead use "Өндөр магадлалтай" (High probability), "Танд тохионо" (Will happen to you), "Одод ингэж зааж байна" (The stars indicate).
    5. ADDRESSING: Always address the user as "Чи" (You) - intimate and direct. Use "Чиний" (Your), "Чамайг" (You - accusative), "Чамд" (to You) naturally. NEVER use "Та" (Formal).
    6. UNKNOWN TIME LOGIC: If 'Birth Time' or 'Ascendant' is "Тодорхойгүй" or "Unknown", DO NOT generate specific predictions based on the hour. Instead, explicitly state that since the birth time is unknown, the 'Hidden Self/Ascendant' reading is general.
    7. BOLD SAFETY: When using ** for bold titles, you MUST close them (e.g., **Title**). NEVER leave them open like (**Title...). This is critical.
    
    USER PROFILE:
    - Name: ${p.name}
    - Gender: ${p.gender} (IMPORTANT: The user is ${p.gender}. Therefore, the "Avatar/Future Partner" must be the OPPOSITE gender. If user is Female, Partner is Male. If user is Male, Partner is Female).
    - Year: ${p.yearElement} ${p.yearAnimal}
    - Zodiac: ${p.zodiacSign} (${p.zodiacElement})
    - Birth Time: ${p.tob} (${p.timeAnimal} hour)
    - Life Path: ${p.lifePath}
    - Birth Day: ${p.birthDayNum}
    - Element Relation: ${p.elementRelationship}
    - Transits: Gate 1: ${p.transit2025} | Gate 2: ${p.transit2026} | Gate 3: ${p.transit2027}
  `;

  // --- REQUEST 1: CHAPTERS 1 & 2 ---
  const prompt1 = `
    ${systemPrompt}
    
    TASK: Write PART 1 (Chapters 1 & 2).
    
    Start with a boxed summary of their astrological profile.
    
    **✨ ТАНЫ ЗУРХАЙН ТҮЛХҮҮР ӨГӨГДЛҮҮД**
    👤 **Нэр:** ${p.name}
    📅 **Төрсөн огноо:** ${p.dob}
    🐉 **Монгол жил:** ${p.yearElement} ${p.yearAnimal}
    ✨ **Өрнийн орд:** ${p.zodiacElement} махбодьтой ${p.zodiacSign}
    ${p.timeAnimal !== "Тодорхойгүй" ? `🕰️ **Төрсөн цаг:** ${p.tob} (${p.timeAnimal} цаг)` : ""}
    🔢 **Амьдралын тоо:** ${p.lifePath}
    
    📖 БҮЛЭГ 1: ЧИНИЙ ДОТООД ЕРТӨНЦ & МӨН ЧАНАР
    - Analyze the mix of ${p.yearAnimal} and ${p.zodiacSign}. Use the concept "${p.elementRelationship}" but write it poetically (e.g., "Fire and Water dance in your soul...").
    - Contrast their outer appearance (Mask) vs inner reality (Truth).
    ${p.timeAnimal !== "Тодорхойгүй" ? `- Analyze ${p.timeAnimal} birth hour influence on their hidden self.` : "(User does not know birth time, so SILENTLY SKIP the birth hour section. Do NOT mention that the time is unknown. Just move to the next topic naturally.)"}
    - Explain Life Path ${p.lifePath} and Birth Day ${p.birthDayNum}.
      * IMPORTANT: Briefly explain HOW this number was calculated (summing digits of ${p.dob}) to build trust. If it is a Master Number (11, 22, 33), explain why we didn't reduce it further. (Mention Karmic Debt if 13, 14, 16, 19).

    📖 БҮЛЭГ 2: ХАЙР ДУРЛАЛЫН ХЭВ МАЯГ
    - What is their "Love Language"? What do they crave?
    - Their Shadow Side: Why do they fail? (e.g., Saviour Complex, too demanding).
    - Compatibility: Who fits them? Who destroys them?
    
    (Write in deep, flowing paragraphs. NO BULLETS).
  `;
  const r1 = callGemini(prompt1, apiKey);

  // --- REQUEST 2: CHAPTERS 3 & 4 ---
  const prompt2 = `
    ${systemPrompt}
    
    TASK: Write PART 2 (Chapters 3 & 4).
    CONTEXT: We already discussed their character (${p.yearAnimal}, ${p.zodiacSign}). Now focus on their Future Partner and Timing.
    
    📖 БҮЛЭГ 3: ИРЭЭДҮЙН ХАНЬ "THE AVATAR"
    - REQUIREMENT: For this chapter ONLY, you MUST use numbered subtitles to separate the sections.
    - TARGET: The partner must be MONGOLIAN (No blue eyes/blonde hair). Describe realistic Mongolian features.
    - GENDER: Remember to describe the OPPOSITE gender of ${p.gender}.
    - Structure:
      **1. Гадаад төрх & Энерги:** (Describe appearance and aura)
      **2. Зан чанар:** (Describe personality)
      **3. Ажил мэргэжил:** (Describe profession using "High probability" language)
    
    📖 БҮЛЭГ 4: УЧРАЛЫН МӨЧЛӨГ & ТОМ ХААЛГУУД
    - Analyze these specific FUTURE "Golden Gates" (Age/Year Cycles):
      * 1-р Хаалга: ${p.transit2025}
      * 2-р Хаалга: ${p.transit2026}
      * 3-р Хаалга: ${p.transit2027}
    - Explain WHY these years are significant (Trine, Jupiter Return, etc) based on the status provided.
    - Provide advice for each period.
    
    (Write in deep, flowing paragraphs. NO BULLETS).
  `;
  const r2 = callGemini(prompt2, apiKey);

  // --- REQUEST 3: CHAPTER 5 ONLY ---
  const prompt3 = `
    ${systemPrompt}
    
    TASK: Write PART 3 (Chapter 5 ONLY).
    CONTEXT: The report continues from the Transits section.
    IMPORTANT: Do NOT write Chapter 6, Rituals, Imago Effect, or Conclusion. These are already pre-written in the template. Just finish Chapter 5.
    
    📖 БҮЛЭГ 5: ИРЭХ ЖИЛИЙН ЕРӨНХИЙ ЗУРХАЙ (${forecastYear} ОН - ${nextYearAnimal.toUpperCase()} ЖИЛ)
    (Context: We are forecasting for ${forecastYear}. If today is late 2025, we focus on 2026).
    - How does the ${nextYearAnimal} Year (${forecastYear}) affect a ${p.yearAnimal}? 
    - General Outlook & Career/Money advice.
    - Provide specific advice for maintaining balance in ${forecastYear}.
    
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
  // 1. Copy Template
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Astro Report`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  // 2. Clean Markdown
  // Remove ```json, ``` blocks, etc. But KEEP ** for Bold Parser.
  let cleanText = content
    .replace(/```.*?```/gs, "")
    .replace(/^###\s/gm, "")          
    .replace(/^##\s/gm, "")
    // Remove standalone bullets if Gemini still generates them
    .replace(/^\s*[\*\-]\s+/gm, "") 
    .trim();
  
  body.replaceText("{{NAME}}", name);
  
  // Try both Uppercase and Lowercase to fix user's issue
  body.replaceText("{{REPORT}}", cleanText);
  body.replaceText("{{report}}", cleanText);
  
  // 3. Apply Bold Styling
  processMarkdownBold(body);

  doc.saveAndClose();
  
  // 3. Convert to PDF
  const pdf = copy.getAs(MimeType.PDF);
  const pdfFile = DriveApp.getFolderById("1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j").createFile(pdf); // Make sure folder ID is correct or passed in config
  
  // 4. Permissions
  pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  // Cleanup
  copy.setTrashed(true);
  
  return pdfFile.getUrl();
}

/**
 * Parses the document body for **bold text**, applies bold styling, 
 * and removes the asterisk markers.
 * (Reverted to Simple/Robust Logic)
 */
function processMarkdownBold(body) {
  var foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  
  while (foundElement != null) {
    var foundText = foundElement.getElement().asText();
    var start = foundElement.getStartOffset();
    var end = foundElement.getEndOffsetInclusive();
    
    // 1. Apply BOLD to the whole range (including **)
    foundText.setBold(start, end, true);
    
    // 2. Remove the first **
    foundText.deleteText(start, start + 1);
    
    // 3. Remove the last ** (indices shifted by -2)
    foundText.deleteText(end - 3, end - 2);

    // Find next match
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
