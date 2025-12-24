/****************************************************************************************
 * PRODUCT: DIGITAL ASTROLOGY REPORT GENERATOR (ZURHAI AI)
 * VERSION: v3.3 - SOULMATE PRO (Consistent Logic & Clean Format)
 * AUTHOR: Saruulbat System (Refactored by Jules)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v3.3-SoulmatePro",
  PRODUCT_NAME: "Таны Хувь Заяаны Код - Дэлгэрэнгүй Тайлан",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3,
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.7, // Lowered slightly for better consistency

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
    ROLE: "Professional Mongolian Astrologer & Psychologist specializing in Synastry (Relationship Astrology) and Karmic Astrology.",

    // 2. THE TONE OF VOICE
    TONE: "Deep, empathetic, spiritual, and empowering. Use Mongolian cultural nuances. Speak directly to the user (Using 'Чи').",

    // 3. CORE RULES (STRICT CONSISTENCY)
    CORE_RULES: `
    1. **CONSISTENCY IS KING**: Calculate planetary positions (Venus, Mars, Juno, Moon) ONCE based on the DOB. Store these in your 'memory' and use the SAME signs for Chapter 1 and Chapter 5. Do NOT change a sign halfway through the report.
    2. **INTERNAL LOGIC**: The instructions provided in "Context" are for YOUR reasoning only. Do NOT print the calculation method or the "Why" unless asked. Only print the insight.
    3. **NO DASHES**: Do NOT use '---' for separators. Use emojis like ✨, 🌿, or nothing at all.
    4. **FORMATTING**: Use **BOLD** for subheadings. No bullet points (*). Use full, flowing paragraphs.
    5. **LANGUAGE**: Mongolian Cyrillic. Warm, personal tone.
    `,

    // 4. CHAPTER PROMPTS (DUAL SYSTEM)
    PROMPTS: {

      // --- A. TIME UNKNOWN (Numerology & General Planets) ---
      TIME_UNKNOWN: `
      TASK: Write the Full Report using the "TIME UNKNOWN" Template.

      USER DATA:
      Name: {{name}} | DOB: {{dob}} | Gender: {{gender}}
      Life Path Number: {{lifePath}}

      **INTERNAL INSTRUCTION**:
      1. Calculate Venus Sign and Moon Sign for {{dob}}. Remember them.
      2. Calculate Juno and Mars Signs. Remember them.
      3. Use Life Path {{lifePath}} for location predictions.

      **БҮЛЭГ 1: ЧИНИЙ ХАЙР ДУРЛАЛЫН КОД**
      - **ТҮЛХҮҮР 1: ТАНЫ ХАЙРЫН ХЭЛЭМЖ (СУГАР ГАРАГ)**: Identify the Venus sign you calculated. Explain love style (Direct/Shy/Logical) based on this sign.
      - **ТҮЛХҮҮР 2: ТАНЫ СЭТГЭЛ ЗҮРХНИЙ ХЭРЭГЦЭЭ (САР)**: Identify the Moon sign. Explain emotional needs.
      - **ДҮГНЭЛТ**: Synthesis of Venus and Moon.

      **БҮЛЭГ 2: ЗАЯАНЫ ХАНИЙН ДҮР ТӨРХ**
      - **ТҮЛХҮҮР 3: ГЭРЛЭЛТИЙН БУРХАН (ЮНО)**: Identify Juno sign. Describe the long-term partner's character (The one they marry, not just date).
      - **ТҮЛХҮҮР 4: ТАНЫ МӨРӨӨДЛИЙН ЗАЛУУ (АНГАРАГ ГАРАГ)**: Identify Mars sign. Describe the ideal protector qualities.
      - **ТҮЛХҮҮР 5: ГАДААД ТӨРХ БА НИЙГМИЙН БАЙР СУУРЬ**: Combine Juno and Mars to describe look and job.
      - **ДҮГНЭЛТ**: Partner Archetype.

      **БҮЛЭГ 3: УЧРАХ НӨХЦӨЛ БА ГАЗАР (ТООН ЗУРХАЙ)**
      - **ТАНЫ ХУВЬ ЗАЯАНЫ ТОО**: Mention Life Path {{lifePath}}.
      - **ТҮҮНТЭЙ ХААНА ТАНИЛЦАХ ВЭ?**: Use Numerology logic:
        * If 11/22/33/7/9: Spiritual places, libraries, volunteering.
        * If 1/5/8: Work, business, travel.
        * If 2/4/6: Home gatherings, through friends.
      - **АНХНЫ УЧРАЛ ЯМАР БАЙХ ВЭ?**: Describe the karmic feeling.

      **БҮЛЭГ 4: ХУГАЦААНЫ ТААМАГЛАЛ**
      - **ТҮЛХҮҮР 6: АЗ ХИЙМОРИЙН ТОМ МӨЧЛӨГ**: Analyze Jupiter's current transit relative to their Sun Sign {{zodiacSign}}.
      - **ОНЦЛОХ ӨДРҮҮД**: Mention high-energy months in 2026.
      - **ТҮЛХҮҮР 7: АНХААРАХ ӨДРҮҮД**: Warn about Mercury Retrograde in 2026 (Feb/Mar, Jun/Jul, Oct/Nov).

      **БҮЛЭГ 5: ЗӨВЛӨГӨӨ БА ТАРНИ**
      - **IMPORTANT**: Recall the Venus and Mars signs from Chapter 1 and 2. Ensure advice matches those signs. Do NOT contradict Chapter 1.
      - Provide 3 advice points balancing their elemental energies.
      - **ТАНЫ ХАЙРЫН ТАРНИ**: A spiritual affirmation.
      `,

      // --- B. TIME KNOWN (Houses & Ascendant) ---
      TIME_KNOWN: `
      TASK: Write the Full Report using the "TIME KNOWN" Template.

      USER DATA:
      Name: {{name}} | DOB: {{dob}} | TIME: {{tob}} | Gender: {{gender}}

      **INTERNAL INSTRUCTION**:
      1. Calculate Ascendant (Rising Sign) based on {{tob}}.
      2. Determine 7th House (Descendant) = Opposite of Ascendant.
      3. Determine 12th House Sign.
      4. Calculate Venus, Moon, Mars positions.

      **БҮЛЭГ 1: ЧИНИЙ ХАЙР ДУРЛАЛЫН КОД**
      - **ТҮЛХҮҮР 1: ТАНЫ ХАЙРЫН ХЭЛЭМЖ (СУГАР ГАРАГ)**: Identify Venus sign. Explain love style.
      - **ТҮЛХҮҮР 2: ТАНЫ СЭТГЭЛ ЗҮРХНИЙ ХЭРЭГЦЭЭ (САР)**: Identify Moon sign. Explain emotional needs.
      - **ДҮГНЭЛТ**: Synthesis.

      **БҮЛЭГ 2: ЗАЯАНЫ ХАНИЙН ДҮР ТӨРХ**
      - **ТҮЛХҮҮР 3: ТАНЫ ХАНИЙН ГЭР (7-Р ГЭР)**: Identify the Sign on the 7th House cusp. This is the MAIN partner indicator. Explain "Opposites Attract" logic.
      - **ТҮЛХҮҮР 4: ТАНЫ МӨРӨӨДЛИЙН ЗАЛУУ (АНГАРАГ ГАРАГ)**: Identify Mars sign.
      - **ТҮЛХҮҮР 5: ГАДААД ТӨРХ БА НИЙГМИЙН БАЙР СУУРЬ**: Describe look/job based on the 7th House Ruler's nature.
      - **ДҮГНЭЛТ**: Partner Archetype (e.g., "The Gentle Protector").

      **БҮЛЭГ 3: УЧРАХ НӨХЦӨЛ БА ГАЗАР**
      - **ТҮЛХҮҮР 6: АЛСЫН ЗАЙ БА НУУЦЛАГ ЕРТӨНЦ**: Analyze where the Ruler of the 7th House is located (or use 12th House/Moon placement if ruler calc is ambiguous). Mention specific settings (Foreign lands, Online, Work, etc).
      - **ТҮЛХҮҮР 7: АНХНЫ МЭДРЭМЖ**: Describe the vibe (Deja-vu, instant spark, slow burn) based on the House.

      **БҮЛЭГ 4: ХУГАЦААНЫ ТААМАГЛАЛ**
      - **ТҮЛХҮҮР 8: АЗ ХИЙМОРИЙН ГАРАГИЙН НӨЛӨӨ**: Analyze when Jupiter transits the 7th House or trines it in 2025-2026.
      - **ТҮЛХҮҮР 9: АНХААРАХ ӨДРҮҮД**: Mercury Retrograde warnings for 2026.

      **БҮЛЭГ 5: ЗӨВЛӨГӨӨ БА ТАРНИ**
      - **IMPORTANT**: Review Ascendant (Self) vs 7th House (Partner) dynamic calculated in Ch 2. Advice must focus on balancing these two.
      - Provide 3 specific advice points.
      - **ТАНЫ ХАЙРЫН ТАРНИ**: Affirmation.
      `
    }
  },

  // ==================================================================================
  // 🧠 STATIC DATA (DO NOT EDIT BELOW THIS LINE)
  // ==================================================================================
  
  TSAGAAN_SAR: {
    // 1940s
    1945: "02-13", 1946: "02-02", 1947: "01-22", 1948: "02-10", 1949: "01-29",
    // 1950s
    1950: "02-17", 1951: "02-06", 1952: "01-27", 1953: "02-14", 1954: "02-03",
    1955: "02-24", 1956: "02-12", 1957: "01-31", 1958: "02-18", 1959: "02-08",
    // 1960s
    1960: "02-27", 1961: "02-15", 1962: "02-05", 1963: "02-25", 1964: "02-13",
    1965: "02-02", 1966: "02-21", 1967: "02-09", 1968: "01-30", 1969: "02-17",
    // 1970s
    1970: "02-06", 1971: "02-27", 1972: "02-15", 1973: "02-06", 1974: "02-23",
    1975: "02-11", 1976: "01-31", 1977: "02-18", 1978: "02-07", 1979: "02-28",
    // 1980s
    1980: "02-16", 1981: "02-05", 1982: "02-24", 1983: "02-13", 1984: "02-02",
    1985: "02-20", 1986: "02-09", 1987: "01-29", 1988: "02-17", 1989: "02-06",
    // 1990s
    1990: "02-27", 1991: "02-15", 1992: "02-04", 1993: "02-23", 1994: "02-10",
    1995: "01-31", 1996: "02-19", 1997: "02-07", 1998: "02-28", 1999: "02-16",
    // 2000s
    2000: "02-05", 2001: "02-24", 2002: "02-12", 2003: "02-01", 2004: "02-22",
    2005: "02-09", 2006: "01-29", 2007: "02-18", 2008: "02-07", 2009: "02-25",
    // 2010s
    2010: "02-14", 2011: "02-03", 2012: "02-22", 2013: "02-11", 2014: "01-31",
    2015: "02-19", 2016: "02-09", 2017: "02-27", 2018: "02-16", 2019: "02-05",
    // 2020s
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

  DELIVERY_MESSAGE: `🔮 Сайн байна уу, {{NAME}}? \n\nЧиний "Хувь Заяаны Код" тайлагдлаа. Энэ бол зүгээр нэг зурхай биш, чиний дотоод ертөнцийн газрын зураг юм.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
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
      "gender": "Эрэгтэй" or "Эмэгтэй"
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
// 2. GENERATION ENGINE (CONFIG DRIVEN)
// ==========================================

function generateFullReport(p, apiKey) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; 
  let forecastYear = currentYear;
  if (currentMonth >= 11) forecastYear = currentYear + 1;
  const nextYearAnimal = CONFIG.ANIMALS[(forecastYear - 1900) % 12].toUpperCase();
  
  // 1. Prepare Replacement Variables
  const timeInfoLine = p.timeAnimal !== "Тодорхойгүй"
    ? `🕰️ **Төрсөн цаг:** ${p.tob} (${p.timeAnimal} цаг)`
    : "";

  const timeAnalysisInstructions = p.timeAnimal !== "Тодорхойгүй"
    ? `- Analyze ${p.timeAnimal} birth hour influence on their hidden self.`
    : "(User does not know birth time, so SILENTLY SKIP the birth hour section.)";

  const replacements = {
    "{{name}}": p.name,
    "{{dob}}": p.dob,
    "{{yearElement}}": p.yearElement,
    "{{yearAnimal}}": p.yearAnimal,
    "{{zodiacElement}}": p.zodiacElement,
    "{{zodiacSign}}": p.zodiacSign,
    "{{tob}}": p.tob,
    "{{timeAnimal}}": p.timeAnimal,
    "{{lifePath}}": p.lifePath,
    "{{birthDayNum}}": p.birthDayNum,
    "{{elementRelationship}}": p.elementRelationship,
    "{{gender}}": p.gender,
    "{{transit1}}": p.transit2025,
    "{{transit2}}": p.transit2026,
    "{{transit3}}": p.transit2027,
    "{{forecastYear}}": forecastYear,
    "{{nextYearAnimal}}": nextYearAnimal,
    "{{timeInfoLine}}": timeInfoLine,
    "{{timeAnalysisInstructions}}": timeAnalysisInstructions
  };

  // 2. Build System Prompt
  const systemPrompt = `
    ROLE: ${CONFIG.AI_SETTINGS.ROLE}
    TONE: ${CONFIG.AI_SETTINGS.TONE}

    CORE RULES:
    ${CONFIG.AI_SETTINGS.CORE_RULES}
    
    USER PROFILE:
    - Name: ${p.name}
    - Gender: ${p.gender}
    - Year: ${p.yearElement} ${p.yearAnimal}
    - Zodiac: ${p.zodiacSign} (${p.zodiacElement})
    - Birth Time: ${p.tob} (${p.timeAnimal})
    - Life Path: ${p.lifePath}
    - Transits: ${p.transit2025} | ${p.transit2026}
  `;

  // 3. Select Template based on Time Knowledge
  const isTimeKnown = p.timeAnimal !== "Тодорхойгүй";
  const selectedTemplate = isTimeKnown ? CONFIG.AI_SETTINGS.PROMPTS.TIME_KNOWN : CONFIG.AI_SETTINGS.PROMPTS.TIME_UNKNOWN;

  // 4. Fill Helper
  const fill = (template) => {
    let result = template;
    for (const [key, val] of Object.entries(replacements)) {
      result = result.split(key).join(val);
    }
    return result;
  };

  // 5. Execute Prompt (Single Full Call or Split)
  // For this Pro version, we can do it in one big context or split.
  // Let's split into 2 parts to ensure length and quality.

  const filledTemplate = fill(selectedTemplate);

  // We actually need to execute the filled template.
  // Since the user provided the FULL text in one go, we can send it as one task,
  // OR split it if it's too long. Given 8192 tokens, one shot is risky for detailed output.
  // Let's split it by Chapters for safety.

  const prompt1 = systemPrompt + "\n" + "TASK: Write Chapters 1, 2, and 3 based on this template:\n" + filledTemplate.split("**БҮЛЭГ 4:")[0];
  const r1 = callGemini(prompt1, apiKey);

  const prompt2 = systemPrompt + "\n" + "TASK: Write Chapters 4 and 5 based on this template:\n" + "**БҮЛЭГ 4:" + filledTemplate.split("**БҮЛЭГ 4:")[1];
  const r2 = callGemini(prompt2, apiKey);

  return {
    text: r1.text + "\n\n" + r2.text,
    usage: r1.usage + r2.usage
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
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Astro Report`);
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
  const folder = DriveApp.getFolderById("1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j");
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
```