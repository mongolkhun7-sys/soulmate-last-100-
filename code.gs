/****************************************************************************************
 * PRODUCT: DIGITAL ASTROLOGY REPORT GENERATOR (PHONE NUMBER EDITION)
 * VERSION: v4.0 - Phone Numerology
 * AUTHOR: Jules (Refactored for Phone Logic)
 * MODEL: gemini-2.5-flash
 ****************************************************************************************/

const CONFIG = {
  // --- SYSTEM CONFIG ---
  VERSION: "v4.0-PhoneNumerology",
  PRODUCT_NAME: "Утасны Дугаарын Нууц Тайлал",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 3, 
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.7, // Slightly lower for more consistent numerology explanations

  // --- COLUMN MAPPING (0-based) ---
  COLUMNS: {
    NAME: 0,      // A (Not used in report, but kept for sheet structure)
    ID: 1,        // B
    INPUT: 2,     // C (Raw input: "gender - date - phone")
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
    ROLE: "Master Numerologist & Astrologer specializing in Phone Number Energy and Mongolian Astrology.",
    
    TONE: "Professional, mysterious, deeply explanatory, and respectful. Avoid flowery or overly sweet language. Use authoritative but kind mentorship tone.",
    
    CORE_RULES: `
    1. EXPLAIN THE "WHY": Never just state a number. Always explain the calculation logic briefly in the flow of text (e.g., "Your number sums to 32, which reduces to 5...").
    2. NO INTRODUCTIONS/OUTROS: Start directly with Chapter Titles. Do not say "Here is your report".
    3. NO BULLET POINTS: Use full, flowing paragraphs.
    4. MONGOLIAN CONTEXT: Use terms like 'Гаригийн нөлөө' (Planetary influence), 'Амь сүлд' (Life force), 'Энергийн урсгал' (Energy flow).
    5. CONTEXT AWARENESS: You are writing a single cohesive book. Do not repeat yourself.
    6. FORMATTING: Use **BOLD** for subheaders.
    7. ADDRESSING: Use "Та" (You) respectfully or "Чи" (You) if the context implies a close mentorship, but given the request for "40+ audience", a respectful but direct "Та" or neutral voicing is safer. Let's stick to a direct, professional voice.
    `,

    PROMPTS: {
      // --- PART 1: ROOT & WEALTH ---
      PART_1: `
      TASK: Write PART 1 (Summary + Chapters 1 & 2).
      
      **✨ ТАНЫ ЗУРХАЙН ТҮЛХҮҮР ӨГӨГДЛҮҮД**
      📅 **Төрсөн огноо:** {{dob}}
      👤 **Хүйс:** {{gender}}
      📱 **Шинжилж буй дугаар:** {{phoneNumber}}
      🐉 **Монгол жил:** {{yearAnimal}}
      🔢 **Амьдралын тоо (Life Path):** {{lifePath}}
      ⭐️ **Дугаарын Амь Сүлд (Root):** {{rootNumber}} ({{planetName}})
      
      **📖 БҮЛЭГ 1: ТАНЫ ДУГААРЫН АМЬ СҮЛД БА ГАРИГИЙН НӨЛӨӨ**
      - Explain the **Root Number {{rootNumber}}**. Mention it comes from summing the digits ({{rootCalculation}}).
      - Identify the Ruling Planet: **{{planetName}}**.
      - Describe the personality and energy of this number. Is it a leader (1), emotional (2), wealthy (8), etc?
      - Connect it to the user: "As a {{yearAnimal}} born person, this energy affects you by..."

      **📖 БҮЛЭГ 2: ЭД БАЯЛГИЙН ХУРИМТЛАЛ БА ХИШИГ БУЯНЫ УРСГАЛ**
      - **Wealth Codes:** Analyze the presence of the digits 8 (Big Wealth), 6 (Cash/Luxury), and 3 (Growth).
      - **Logic:** {{wealthAnalysisLogic}} (Use this logic to explain the strength of the number).
      - **Warning:** {{zeroWarning}} (If the number ends in 0, explain the "Empty Container" concept gently but firmly).
      - Provide a financial conclusion for this number.
      `,

      // --- PART 2: HARMONY & RELATIONS ---
      PART_2: `
      TASK: Write PART 2 (Chapters 3 & 4).
      CONTEXT: We have analyzed the number's energy. Now we check compatibility.
      
      **📖 БҮЛЭГ 3: ХУВЬ ЗАЯА БА ДУГААРЫН ЗОХИЦОЛ**
      - Compare **Life Path {{lifePath}}** and **Phone Root {{rootNumber}}**.
      - **The Logic:** {{harmonyLogic}} (Explain that we are checking if both are Odd or both are Even).
      - **Result:** {{harmonyVerdict}}
      - Explain what this means for the user's daily life and success. Does the phone support them or challenge them?
      
      **📖 БҮЛЭГ 4: ТАНЫГ ТЭТГЭХ ХҮМҮҮС БА ИВЭЭЛ ЖИЛҮҮД**
      - Based on the user's Year: **{{yearAnimal}}**.
      - Identify the **Trine Allies (Ивээл жилүүд):** {{trineAllies}}.
      - Explain WHY these people are good for the user (Business partners, friends).
      - Suggest that numbers containing 1 or 6 (Water/Metal elements) or numbers related to these allies are beneficial.
      `,

      // --- PART 3: REMEDY ---
      PART_3: `
      TASK: Write PART 3 (Chapter 5 ONLY).
      
      **📖 БҮЛЭГ 5: ЗАСАЛ, ХАРИУЛГА БА ЭНЕРГИЙН ТҮЛХҮҮР**
      - Provide advice based on **Gender: {{gender}}** and **Root Number: {{rootNumber}}**.
      - **Color Therapy:** Suggest colors that balance the {{planetName}} energy.
      - **Behavioral Remedy:** What habits should they adopt? (e.g., If Root 9, control anger. If Root 6, enjoy art).
      - **Mantra/Affirmation:** Give a short Mongolian affirmation statement for success.
      
      (End with a short, wise closing sentence. DO NOT write "Conclusion" as a header).
      `
    }
  },

  // --- STATIC DATA ---
  
  // 1940-2025 Tsagaan Sar Map
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
  
  PLANET_MEANINGS: {
    1: "Наран (Sun) - Удирдагч, Эхлэл",
    2: "Сар (Moon) - Зөөлөн, Харилцаа",
    3: "Бархасбадь (Jupiter) - Өсөлт, Аз хийморь",
    4: "Раху (Rahu) - Тогтвортой, Хөдөлмөрч",
    5: "Буд (Mercury) - Худалдаа, Хурд",
    6: "Сугар (Venus) - Тансаглал, Хайр дурлал",
    7: "Кету (Ketu) - Сүнслэг, Дотогшоо",
    8: "Санчир (Saturn) - Карма, Их мөнгө, Эрх мэдэл",
    9: "Ангараг (Mars) - Тэмцэгч, Гал цог"
  },

  TRINE_ALLIES: {
    "Хулгана": "Луу, Бич", "Үхэр": "Могой, Тахиа", "Бар": "Морь, Нохой", "Туулай": "Гахай, Хонь",
    "Луу": "Хулгана, Бич", "Могой": "Үхэр, Тахиа", "Морь": "Бар, Нохой", "Хонь": "Туулай, Гахай",
    "Бич": "Хулгана, Луу", "Тахиа": "Үхэр, Могой", "Нохой": "Бар, Морь", "Гахай": "Туулай, Хонь"
  },

  DELIVERY_MESSAGE: `🔮 Сайн байна уу? \n\nТаны "Утасны Дугаарын Нууц Тайлал" бэлэн боллоо.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай, линк 7 хоногийн дараа устаж магадгүй)`,
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
        
        // 1. PARSE & CALCULATE
        const profile = parseAndCalculateProfile(inputString);
        
        // 2. GENERATE
        const reportResult = generateFullReport(profile, KEYS.GEMINI);
        
        // 3. CREATE PDF
        const pdfUrl = createPdf(profile.name || "User", reportResult.text, KEYS.TEMPLATE);

        // 4. SEND
        sendManyChat(contactId, pdfUrl, profile.name || "Erhem", KEYS.MANYCHAT);

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
// 1. CORE LOGIC ENGINE (PHONE NUMEROLOGY)
// ==========================================

function parseAndCalculateProfile(rawInput) {
  // 1. Normalize Input (Fix typos, extract DOB, Phone, Gender)
  const normalized = normalizeInputWithAI(rawInput, CONFIG.GEMINI_MODEL, PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"));
  
  const dateStr = normalized.date; 
  const gender = normalized.gender; 
  const phoneNumber = normalized.phone.replace(/\D/g, ""); // Remove non-digits

  if (!dateStr || !phoneNumber) throw new Error("Invalid Input: Missing Date or Phone");

  // 2. Parse Date
  const [year, month, day] = dateStr.split(".").map(Number);
  
  // 3. Core Calculations
  const mongolData = getMongolianYearData(year, month, day);
  const rootInfo = calculateRootNumber(phoneNumber);
  const wealthInfo = analyzeWealth(phoneNumber);
  const lifePath = calculateLifePath(year, month, day);
  const harmony = checkHarmony(lifePath, rootInfo.number);
  const trines = CONFIG.TRINE_ALLIES[mongolData.animal] || "Тодорхойгүй";

  return {
    dob: dateStr,
    gender: gender,
    phoneNumber: phoneNumber,
    
    // Mongolian Year
    yearAnimal: mongolData.animal,
    
    // Numerology
    rootNumber: rootInfo.number,
    planetName: CONFIG.PLANET_MEANINGS[rootInfo.number],
    rootCalculation: rootInfo.calculation, // e.g., "9+9+1+1... = 32 -> 5"

    // Wealth
    wealthAnalysisLogic: wealthInfo.logic, // Text explaining counts of 8, 6, 3
    zeroWarning: wealthInfo.warning,       // Text if ends with 0
    
    // Harmony
    lifePath: lifePath,
    harmonyLogic: harmony.logic,
    harmonyVerdict: harmony.verdict,
    
    // Trines
    trineAllies: trines
  };
}

function normalizeInputWithAI(raw, model, key) {
  const prompt = `
    TASK: Clean and Extract data.
    INPUT: "${raw}"
    INSTRUCTION:
    1. Fix typos in Year (e.g., 19995 -> 1995, 20202 -> 2020).
    2. Extract Gender (Эрэгтэй/Эмэгтэй).
    3. Extract Phone Number (Remove dashes/spaces).
    4. Format Date as YYYY.MM.DD.

    RETURN JSON:
    {
      "date": "YYYY.MM.DD",
      "gender": "Эрэгтэй" or "Эмэгтэй",
      "phone": "DigitsOnly"
    }
  `;
  try {
    const result = callGemini(prompt, key); 
    const cleanJson = result.text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Normalization Failed", e);
    // Fallback parser if AI fails
    const parts = raw.split("-");
    return {
      date: parts[1] ? parts[1].trim() : "2000.01.01",
      gender: "Эмэгтэй",
      phone: parts[2] ? parts[2].replace(/\D/g, "") : "0000"
    };
  }
}

// --- MATH HELPERS ---

function calculateRootNumber(phoneStr) {
  const digits = phoneStr.split("").map(Number);
  const sum1 = digits.reduce((a, b) => a + b, 0);
  
  let finalSum = sum1;
  while (finalSum > 9) {
    finalSum = String(finalSum).split("").map(Number).reduce((a, b) => a + b, 0);
  }

  // Format calculation string for transparency: "9+9...=30 -> 3"
  const calcStr = `(${digits.join("+")} = ${sum1} -> ${finalSum})`;

  return { number: finalSum, calculation: calcStr };
}

function analyzeWealth(phoneStr) {
  const count8 = (phoneStr.match(/8/g) || []).length;
  const count6 = (phoneStr.match(/6/g) || []).length;
  const count3 = (phoneStr.match(/3/g) || []).length;
  
  let logic = `Энэ дугаарт 8-ын тоо ${count8} удаа, 6-гийн тоо ${count6} удаа, 3-ын тоо ${count3} удаа орсон байна. `;

  if (count8 >= 2) logic += "8-ын тоо олон байгаа нь баялгийн маш хүчтэй соронзон орон үүсгэнэ. ";
  if (count6 >= 2) logic += "6-гийн тоо нь бэлэн мөнгөний урсгал болон тансаг хэрэглээг дууддаг. ";
  if (count3 >= 2) logic += "3-ын тоо нь өсөлт дэвшил, үржлийг бэлгэддэг. ";
  if (count8 === 0 && count6 === 0) logic += "Баялгийн шууд тоонууд цөөн тул бусад энергийн дэмжлэг хэрэгтэй. ";

  let warning = "";
  if (phoneStr.endsWith("0")) {
    warning = "Анхаар: Таны дугаар 0-ээр төгссөн байна. Энэ нь 'Савны ёроол цоорхой' мэт нөлөөтэй тул олсон мөнгө тогтохгүй урсах эрсдэлтэй. Засал: Сав дүүргэх бэлгэдэл хэрэглэх.";
  } else {
    warning = "Дугаарын төгсгөл 0 биш байгаа нь сайн хэрэг. Урсгал битүүмжлэгдсэн байна.";
  }
  
  return { logic, warning };
}

function calculateLifePath(y, m, d) {
  function sumDigits(n) {
    return String(n).split('').reduce((a, b) => a + Number(b), 0);
  }
  
  // Standard Life Path: Reduce Year, Month, Day separately, then sum, then reduce.
  // Actually, user said: "Төрсөн он, сар, өдрийн бүх цифрийг нэмж 1 оронтой тоо гаргана."
  // Simple method: Sum everything -> Reduce

  let total = sumDigits(y) + sumDigits(m) + sumDigits(d);
  while (total > 9) {
    total = sumDigits(total);
  }
  return total;
}

function checkHarmony(lifePath, root) {
  const lpEven = lifePath % 2 === 0;
  const rootEven = root % 2 === 0;
  
  let verdict = "";
  let logic = `Таны Амьдралын тоо ${lifePath} (${lpEven ? "Тэгш" : "Сондгой"}), Дугаарын тоо ${root} (${rootEven ? "Тэгш" : "Сондгой"}). `;
  
  if (lpEven === rootEven) {
    verdict = "ТӨГС ЗОХИЦОЛ (Perfect Harmony). Хоёулаа ижил хэмнэлтэй (Тэгш/Тэгш эсвэл Сондгой/Сондгой) тул энерги нь бие биенээ дэмжинэ.";
  } else {
    verdict = "ТЭНЦВЭРЖҮҮЛЭХ ШААРДЛАГАТАЙ (Balancing Needed). Нэг нь Тэгш, нөгөө нь Сондгой тул дотоод зөрчил үүсгэж мэднэ.";
  }

  return { logic, verdict };
}

function getMongolianYearData(year, month, day) {
  const tsDate = CONFIG.TSAGAAN_SAR[year];
  // Simple fallback if year not in map
  if (!tsDate) return { animal: "Тодорхойгүй", element: "" };

  const [tsMonth, tsDay] = tsDate.split("-").map(Number);

  let trueYear = year;
  if (month < tsMonth || (month === tsMonth && day < tsDay)) {
    trueYear = year - 1;
  }

  const animalIndex = (trueYear - 1900) % 12;
  const animal = CONFIG.ANIMALS[animalIndex];

  return { animal, animalIndex };
}

// ==========================================
// 2. GENERATION & UTIL
// ==========================================

function generateFullReport(p, apiKey) {
  // 1. Fill Placeholders
  const replacements = {
    "{{dob}}": p.dob,
    "{{gender}}": p.gender,
    "{{phoneNumber}}": p.phoneNumber,
    "{{yearAnimal}}": p.yearAnimal,
    "{{lifePath}}": p.lifePath,
    "{{rootNumber}}": p.rootNumber,
    "{{planetName}}": p.planetName,
    "{{rootCalculation}}": p.rootCalculation,
    "{{wealthAnalysisLogic}}": p.wealthAnalysisLogic,
    "{{zeroWarning}}": p.zeroWarning,
    "{{harmonyLogic}}": p.harmonyLogic,
    "{{harmonyVerdict}}": p.harmonyVerdict,
    "{{trineAllies}}": p.trineAllies
  };

  const fill = (template) => {
    let result = template;
    for (const [key, val] of Object.entries(replacements)) {
      result = result.split(key).join(val);
    }
    return result;
  };

  // 2. Construct System Prompt
  const systemPrompt = `
    ROLE: ${CONFIG.AI_SETTINGS.ROLE}
    TONE: ${CONFIG.AI_SETTINGS.TONE}
    CORE RULES: ${CONFIG.AI_SETTINGS.CORE_RULES}
    USER DATA:
    - Gender: ${p.gender}
    - Year: ${p.yearAnimal}
    - Phone Root: ${p.rootNumber} (${p.planetName})
  `;

  // 3. Generate Parts
  const r1 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_1), apiKey);
  const r2 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_2), apiKey);
  const r3 = callGemini(systemPrompt + "\n" + fill(CONFIG.AI_SETTINGS.PROMPTS.PART_3), apiKey);

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
  return {
    text: (json.candidates && json.candidates[0].content) ? json.candidates[0].content.parts[0].text : "Error",
    usage: (json.usageMetadata && json.usageMetadata.totalTokenCount) ? json.usageMetadata.totalTokenCount : 0
  };
}

function createPdf(name, content, templateId) {
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Phone Astro Report`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  let cleanText = content
    .replace(/```.*?```/gs, "")
    .replace(/^###\s/gm, "")          
    .replace(/^##\s/gm, "")
    .replace(/^\s*[\*\-]\s+/gm, "") 
    .trim();
  
  body.replaceText("{{NAME}}", name); // Might be empty if no name used
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
