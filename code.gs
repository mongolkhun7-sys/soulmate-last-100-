/****************************************************************************************
 * PRODUCT: DIGITAL ASTROLOGY REPORT GENERATOR + UNIVERSAL AI AGENT
 * VERSION: v5.0 - Ultimate Edition (Payment + AI Chat + Report)
 * UPDATED: 2025-06-24
 ****************************************************************************************/

const CONFIG = {
  // --- 1. PRODUCT SETTINGS ---
  PRODUCT_NAME: "Таны Санхүүгийн Код & Баяжих Зурхай",
  BYL_PRODUCT_ID: "1511",

  // --- 2. SYSTEM CONFIG ---
  VERSION: "v5.0-Ultimate",
  SHEET_NAME: "Sheet1",
  BATCH_SIZE: 5,
  GEMINI_MODEL: "gemini-2.5-flash", 
  TEMPERATURE: 0.8, 

  // --- 3. COLUMN MAPPING ---
  COLUMNS: {
    NAME: 0, ID: 1, INPUT: 2, PDF: 3, STATUS: 4,
    TOKEN: 5, DEBUG: 6, DATE: 7, VER: 8, ERROR: 9
  },

  // --- 4. AI PERSONA FOR REPORT WRITING ---
  AI_SETTINGS: {
    ROLE: "Professional Financial Astrologer & Wealth Psychologist.",
    TONE: "Analytical, empowering, strategic, and deeply insightful.",
    CORE_RULES: `1. NO INTRODUCTIONS. 2. NO BULLET POINTS. 3. FORMATTING: Use **BOLD** for subheadings. 4. ADDRESSING: Address user as "Чи" (You).`,
    PROMPTS: {
      PART_1: `TASK: Write PART 1 (Identity & Numerology). Context: {{name}}, {{dob}}, {{yearAnimal}} year, {{zodiacSign}}. Focus on Financial Character.`,
      PART_2: `TASK: Write PART 2 (Psychology & Career). Context: Destiny {{destinyNumber}}. Focus on Money Mindset and Career Paths.`,
      PART_3: `TASK: Write PART 3 (Forecast). Context: Personal Years {{py1}}, {{py2}}, {{py3}}. Focus on 3-Year Financial Forecast.`
    }
  },

  // --- 5. STATIC DATA ---
  TSAGAAN_SAR: { 1940:"02-08", 1980:"02-16", 1981:"02-05", 1982:"02-24", 1983:"02-13", 1984:"02-02", 1985:"02-20", 1986:"02-09", 1987:"01-29", 1988:"02-17", 1989:"02-06", 1990:"02-27", 1991:"02-15", 1992:"02-04", 1993:"02-23", 1994:"02-10", 1995:"01-31", 1996:"02-19", 1997:"02-07", 1998:"02-28", 1999:"02-16", 2000:"02-05", 2001:"02-24", 2002:"02-12", 2003:"02-01", 2004:"02-22", 2005:"02-09", 2006:"01-29", 2007:"02-18", 2008:"02-07", 2009:"02-25", 2010:"02-14", 2011:"02-03", 2012:"02-22", 2013:"02-11", 2014:"01-31", 2015:"02-19", 2016:"02-09", 2017:"02-27", 2018:"02-16", 2019:"02-05", 2020:"02-24", 2021:"02-12", 2022:"02-02", 2023:"02-21", 2024:"02-10", 2025:"02-28" },
  ANIMALS: ["Хулгана", "Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь", "Бич", "Тахиа", "Нохой", "Гахай"],
  ELEMENTS_BY_LAST_DIGIT: { 0: "Төмөр", 1: "Төмөр", 2: "Усан", 3: "Усан", 4: "Модон", 5: "Модон", 6: "Гал", 7: "Гал", 8: "Шороон", 9: "Шороон" },
  ZODIACS: [
    { name: "Матар", element: "Газар", start: "12-22", end: "01-19" }, { name: "Хумх", element: "Агаар", start: "01-20", end: "02-18" }, { name: "Загас", element: "Ус", start: "02-19", end: "03-20" }, { name: "Хонь", element: "Гал", start: "03-21", end: "04-19" },
    { name: "Үхэр", element: "Газар", start: "04-20", end: "05-20" }, { name: "Ихэр", element: "Агаар", start: "05-21", end: "06-20" }, { name: "Мэлхий", element: "Ус", start: "06-21", end: "07-22" }, { name: "Арслан", element: "Гал", start: "07-23", end: "08-22" },
    { name: "Охин", element: "Газар", start: "08-23", end: "09-22" }, { name: "Жинлүүр", element: "Агаар", start: "09-23", end: "10-22" }, { name: "Хилэнц", element: "Ус", start: "10-23", end: "11-21" }, { name: "Нум", element: "Гал", start: "11-22", end: "12-21" }
  ],
  DELIVERY_MESSAGE: `💰 Сайн байна уу, {{NAME}}? \n\nЧиний "Санхүүгийн Код" бэлэн боллоо.\n\nФайл: {{URL}}\n\n(Татаж аваад хадгалаарай)`,
};

// ==================================================================================
// 💳 PART 1: UNIVERSAL CONTROLLER (Web App)
// ==================================================================================

function doGet(e) { return doPost(e); }

function doPost(e) {
  if (!e) return ContentService.createTextOutput("System Active.");

  const params = e.parameter || {};
  let postBody = {};
  
  try {
    if (e.postData && e.postData.contents) {
      postBody = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    // Ignore JSON parse errors for non-JSON requests
  }

  // 1. ROUTE: AI Agent Chat (From ManyChat)
  // Check if "action" is "ai_chat" in either params or body
  if (params.action === "ai_chat" || postBody.action === "ai_chat") {
    return handleAIChat(postBody);
  }

  // 2. ROUTE: Create Payment Link (From ManyChat)
  if (params.action === "create_link") {
    return handleCreateLink(params.user_id);
  }

  // 3. ROUTE: Webhook (From Byl.mn)
  // Check for Byl specific event type
  if (postBody.type === "checkout.completed") {
    return handleWebhook(postBody);
  }

  return ContentService.createTextOutput("Unknown Action");
}

// --- CONTROLLER FUNCTIONS ---

function handleAIChat(data) {
  const userInput = data.user_input || "";
  const productInfo = data.product_info || "Product info missing";
  const history = data.history || "";

  // RULE 1: If user sends an IMAGE (URL), Approve immediately
  if (String(userInput).match(/^https?:\/\/.*(jpg|jpeg|png|webp|gif)/i) || String(userInput).includes("cdn.manychat")) {
    return responseJSON({ status: "approved", message: "Баримт хүлээн авлаа. Төлбөр баталгаажлаа! ✅" });
  }

  // RULE 2: If TEXT, let Gemini handle it
  try {
    const aiResponse = callGeminiAgent(userInput, productInfo, history);
    if (aiResponse.includes("[APPROVED]")) {
      const cleanMessage = aiResponse.replace("[APPROVED]", "").trim();
      return responseJSON({ status: "approved", message: cleanMessage || "Төлбөр баталгаажлаа." });
    } else {
      return responseJSON({ status: "reply", message: aiResponse });
    }
  } catch (err) {
    return responseJSON({ status: "reply", message: "Уучлаарай, системд алдаа гарлаа. Та дахин бичнэ үү." });
  }
}

function handleCreateLink(userId) {
  if (!userId) return responseJSON({ error: "Missing user_id" });
  try {
    const url = createBylCheckout(userId);
    return responseJSON({ url: url });
  } catch (err) {
    return responseJSON({ error: err.message });
  }
}

function handleWebhook(data) {
  try {
    const object = data.data.object;
    const manychatId = object.client_reference_id;
    if (manychatId) {
      triggerManyChatPaymentSuccess(manychatId);
      return ContentService.createTextOutput("Success");
    }
    return ContentService.createTextOutput("Ignored");
  } catch (err) {
    return ContentService.createTextOutput("Webhook Error");
  }
}

// --- HELPER FUNCTIONS ---

function callGeminiAgent(input, productInfo, history) {
  const props = PropertiesService.getScriptProperties();
  const API_KEY = props.getProperty("GEMINI_API_KEY");
  
  const PROMPT = `
  ROLE: You are the Smart Admin for "${productInfo}".
  GOAL: Verify payment based on user chat.

  RULES:
  1. If user says they paid but didn't send a photo:
     - Ask: "Гүйлгээний утга (Description) дээр юу бичсэн бэ?"
     - Then Ask: "Хэдэн цагт шилжүүлсэн бэ?"
  2. If they answer honestly or give a Transaction ID/Phone number, reply with the tag [APPROVED] at the end.
  3. If they ask about the product, answer briefly.

  USER INPUT: ${input}
  HISTORY: ${history}
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  const payload = { contents: [{ parts: [{ text: PROMPT }] }] };
  const res = UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
  const json = JSON.parse(res.getContentText());

  if (json.candidates && json.candidates[0]) return json.candidates[0].content.parts[0].text;
  return "Ойлгомжгүй байна.";
}

function createBylCheckout(userId) {
  const props = PropertiesService.getScriptProperties();
  const TOKEN = props.getProperty("BYL_API_TOKEN");
  const PID = props.getProperty("BYL_PROJECT_ID");
  const PRICE = CONFIG.BYL_PRODUCT_ID; // Use ID from CONFIG (1511)

  const url = `https://byl.mn/api/v1/projects/${PID}/checkouts`;
  const payload = {
    client_reference_id: String(userId),
    customer_email: "guest@byl.mn",
    items: [{ price_id: Number(PRICE), quantity: 1, adjustable_quantity: { enabled: false } }]
  };

  const res = UrlFetchApp.fetch(url, { method: "post", headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json", "Accept": "application/json" }, payload: JSON.stringify(payload), muteHttpExceptions: true });
  const json = JSON.parse(res.getContentText());
  if (json.data && json.data.url) return json.data.url;
  throw new Error("Byl API Error: " + JSON.stringify(json));
}

function triggerManyChatPaymentSuccess(userId) {
  const props = PropertiesService.getScriptProperties();
  const MC_TOKEN = props.getProperty("MANYCHAT_API_TOKEN");
  // If payment succeeds via Byl, we can trigger the "Payment OK" flow OR just send a message.
  // Here we use a Flow ID if saved, or just assume the user will be handled by the next step.
  // Note: For this setup, we usually trigger a specific Flow.
  // Ensure PAYMENT_SUCCESS_FLOW_ID is in Script Properties.
  const FLOW_ID = props.getProperty("PAYMENT_SUCCESS_FLOW_ID");
  if(!FLOW_ID) return;

  UrlFetchApp.fetch("https://api.manychat.com/fb/sending/sendFlow", {
    method: "post",
    headers: { "Authorization": `Bearer ${MC_TOKEN}`, "Content-Type": "application/json" },
    payload: JSON.stringify({ subscriber_id: userId, flow_ns: FLOW_ID }),
    muteHttpExceptions: true
  });
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// ==================================================================================
// 🔮 PART 2: REPORT GENERATOR (Time Trigger)
// ==================================================================================

function main() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;
  
  const rows = sheet.getDataRange().getValues();
  const KEYS = {
    GEMINI: PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"),
    MANYCHAT: PropertiesService.getScriptProperties().getProperty("MANYCHAT_API_TOKEN"),
    TEMPLATE: PropertiesService.getScriptProperties().getProperty("TEMPLATE_ID") 
  };

  let processedCount = 0;
  const TIME_LIMIT = 270000; 
  const START_TIME = new Date().getTime();

  try {
    for (let i = 1; i < rows.length; i++) {
      if (new Date().getTime() - START_TIME > TIME_LIMIT) break;
      if (processedCount >= CONFIG.BATCH_SIZE) break;

      const row = rows[i];
      if (row[CONFIG.COLUMNS.STATUS] === "DONE" || String(row[CONFIG.COLUMNS.STATUS]).includes("ERROR") || !row[CONFIG.COLUMNS.INPUT]) continue;

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
        sheet.getRange(i + 1, CONFIG.COLUMNS.PDF + 1).setValue(pdfUrl);
        sheet.getRange(i + 1, CONFIG.COLUMNS.STATUS + 1).setValue("DONE");
        sheet.getRange(i + 1, CONFIG.COLUMNS.TOKEN + 1).setValue(reportResult.usage); 
        sheet.getRange(i + 1, CONFIG.COLUMNS.DATE + 1).setValue(Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm"));
        sheet.getRange(i + 1, CONFIG.COLUMNS.VER + 1).setValue(CONFIG.VERSION);
        sheet.getRange(i + 1, CONFIG.COLUMNS.ERROR + 1).setValue(""); 
        
        processedCount++;
      } catch (err) {
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

// --- HELPER FUNCTIONS FOR ASTROLOGY ---

function parseAndCalculateProfile(rawInput) {
  const normalized = normalizeInputWithAI(rawInput);
  const [year, month, day] = normalized.date.split(".").map(Number);
  
  const mongolData = getMongolianYearData(year, month, day);
  const zodiacData = getWesternZodiac(month, day);
  const timeAnimal = getTimeAnimal(normalized.time);
  const numerology = calculateNumerology(year, month, day);
  const now = new Date();
  const currentYear = now.getFullYear();
  const py1 = calculatePersonalYear(year, month, day, currentYear + 1);
  const py2 = calculatePersonalYear(year, month, day, currentYear + 2);
  const py3 = calculatePersonalYear(year, month, day, currentYear + 3);

  return {
    name: normalized.name, firstName: normalized.name === "Та" ? "Та" : normalized.name.split(" ")[0], dob: normalized.date, tob: normalized.time, gender: normalized.gender,
    yearAnimal: mongolData.animal, yearElement: mongolData.element, zodiacSign: zodiacData.name, zodiacElement: zodiacData.element, timeAnimal: timeAnimal,
    destinyNumber: numerology.destiny.val, destinyCalc: numerology.destiny.path,
    soulNumber: numerology.soul.val, soulCalc: numerology.soul.path,
    innerDesireNumber: numerology.innerDesire.val, innerDesireCalc: numerology.innerDesire.path,
    goalNumber: numerology.goal.val, goalCalc: numerology.goal.path,
    py1: { year: currentYear + 1, number: py1.val, calc: py1.path },
    py2: { year: currentYear + 2, number: py2.val, calc: py2.path },
    py3: { year: currentYear + 3, number: py3.val, calc: py3.path }
  };
}

function normalizeInputWithAI(raw) {
  const prompt = `TASK: Normalize. INPUT: "${raw}". RULES: Fix typos (1940-2024), Name default "Та", Gender default "Neutral", Time "Unknown" if missing. JSON: {name, date(YYYY.MM.DD), time(HH:MM), gender}`;
  try {
    const res = callGemini(prompt, PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY"));
    return JSON.parse(res.text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (e) { return { name: "Та", date: "2000.01.01", time: "Unknown", gender: "Neutral" }; }
}

function getMongolianYearData(year, month, day) {
  const tsDate = CONFIG.TSAGAAN_SAR[year];
  if (!tsDate) return { animal: "Хулгана", element: "Төмөр", animalIndex: 0 };
  const [tsMonth, tsDay] = tsDate.split("-").map(Number);
  let trueYear = (month < tsMonth || (month === tsMonth && day < tsDay)) ? year - 1 : year;
  const animalIndex = (trueYear - 1900) % 12;
  return { animal: CONFIG.ANIMALS[animalIndex], element: CONFIG.ELEMENTS_BY_LAST_DIGIT[trueYear % 10], animalIndex, trueYear };
}

function getWesternZodiac(m, d) {
  const dateNum = m * 100 + d; 
  for (let z of CONFIG.ZODIACS) {
    const [sm, sd] = z.start.split("-").map(Number);
    const [em, ed] = z.end.split("-").map(Number);
    const s = sm * 100 + sd, e = em * 100 + ed;
    if (z.name === "Матар") { if (dateNum >= 1222 || dateNum <= 119) return z; }
    else { if (dateNum >= s && dateNum <= e) return z; }
  }
  return { name: "Тодорхойгүй", element: "Тодорхойгүй" };
}

function getTimeAnimal(timeStr) {
  if (!timeStr || timeStr.toLowerCase().includes("unknown") || timeStr === "Тодорхойгүй") return "Тодорхойгүй";
  const hour = parseInt(timeStr.split(":")[0], 10);
  if (hour >= 23 || hour < 1) return "Хулгана";
  return ["Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь", "Бич", "Тахиа", "Нохой", "Гахай"][Math.floor((hour - 1) / 2)] || "Хулгана";
}

function calculateNumerology(y, m, d) {
  function sum(n) { return String(n).split('').reduce((a, b) => a + Number(b), 0); }
  function red(n) { if (isNaN(n)) return 0; if (n === 11 || n === 22 || n === 33 || n < 10) return n; return red(sum(n)); }
  const dob = `${y}${m < 10 ? '0'+m : m}${d < 10 ? '0'+d : d}`;
  const des = red(dob.split('').reduce((a, b) => a + Number(b), 0));
  const soul = red(d);
  const inn = red(red(m) + red(d));
  const goal = red(des + soul);
  return {
    destiny: { val: des, path: `(${y}.${m}.${d} -> ${des})` },
    soul: { val: soul, path: `(${d} -> ${soul})` },
    innerDesire: { val: inn, path: `(${m}+${d} -> ${inn})` },
    goal: { val: goal, path: `(${des}+${soul} -> ${goal})` }
  };
}

function calculatePersonalYear(y, m, d, cy) {
  function sum(n) { return String(n).split('').reduce((a, b) => a + Number(b), 0); }
  function red(n) { if (isNaN(n)) return 0; if (n < 10) return n; return red(sum(n)); }
  const raw = cy + sum(m) + sum(d);
  return { val: red(raw), path: `(${cy}+${m}+${d} -> ${red(raw)})` };
}

function generateFullReport(p, apiKey) {
  const tpl = CONFIG.AI_SETTINGS.PROMPTS;
  const f = (t) => {
    let r = t;
    const map = {
      "{{name}}": p.name, "{{dob}}": p.dob, "{{yearAnimal}}": p.yearAnimal, "{{zodiacSign}}": p.zodiacSign,
      "{{destinyNumber}}": p.destinyNumber, "{{destinyCalc}}": p.destinyCalc, "{{py1}}": p.py1.number, "{{py1Calc}}": p.py1.calc,
      "{{soulNumber}}": p.soulNumber, "{{soulCalc}}": p.soulCalc, "{{innerDesireNumber}}": p.innerDesireNumber, "{{innerDesireCalc}}": p.innerDesireCalc,
      "{{goalNumber}}": p.goalNumber, "{{goalCalc}}": p.goalCalc,
      "{{year2}}": p.py2.year, "{{py2}}": p.py2.number, "{{py2Calc}}": p.py2.calc,
      "{{year3}}": p.py3.year, "{{py3}}": p.py3.number, "{{py3Calc}}": p.py3.calc,
      "{{timeInfoLine}}": p.timeAnimal !== "Тодорхойгүй" ? `🕰️ **Төрсөн цаг:** ${p.tob} (${p.timeAnimal} цаг)` : "",
      "{{timeAnalysisInstructions}}": p.timeAnimal !== "Тодорхойгүй" ? `- Analyze ${p.timeAnimal} birth hour.` : "(Skip time analysis)."
    };
    for (const [k,v] of Object.entries(map)) r = r.split(k).join(v);
    return r;
  };

  const sys = `ROLE: ${CONFIG.AI_SETTINGS.ROLE}\nUSER: ${JSON.stringify(p)}`;
  const r1 = callGemini(sys + f(tpl.PART_1), apiKey);
  const r2 = callGemini(sys + f(tpl.PART_2), apiKey);
  const r3 = callGemini(sys + f(tpl.PART_3), apiKey);
  return { text: r1.text + "\n\n" + r2.text + "\n\n" + r3.text, usage: r1.usage + r2.usage + r3.usage };
}

function callGemini(text, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${key}`;
  const payload = { contents: [{ parts: [{ text: text }] }] };
  const res = UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
  const json = JSON.parse(res.getContentText());
  if (json.error) return { text: "Error", usage: 0 };
  return { text: json.candidates[0].content.parts[0].text, usage: json.usageMetadata ? json.usageMetadata.totalTokenCount : 0 };
}

function createPdf(name, content, templateId) {
  const copy = DriveApp.getFileById(templateId).makeCopy(`${name} - Report`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  let clean = content.replace(/```.*?```/gs, "").replace(/^\s*[\*\-]\s+/gm, "").trim();
  body.replaceText("{{NAME}}", name); body.replaceText("{{REPORT}}", clean);
  
  // Bold formatting
  let foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  while (foundElement != null) {
    let foundText = foundElement.getElement().asText();
    let start = foundElement.getStartOffset();
    let end = foundElement.getEndOffsetInclusive();
    foundText.setBold(start, end, true);
    foundText.deleteText(start, start + 1);
    foundText.deleteText(end - 3, end - 2);
    foundElement = body.findText("\\*\\*(.*?)\\*\\*");
  }

  doc.saveAndClose();
  const pdf = copy.getAs(MimeType.PDF);
  // NOTE: Replace this ID with your actual folder ID
  const folder = DriveApp.getFolderById("1Rfy1Pwk5kF_BmY2nLwFpj9Yss5B1Dq3j");
  const file = folder.createFile(pdf);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  copy.setTrashed(true);
  return file.getUrl();
}

function sendManyChat(subscriberId, pdfUrl, name, token) {
  const msg = CONFIG.DELIVERY_MESSAGE.replace("{{NAME}}", name).replace("{{URL}}", pdfUrl);
  const url = "https://api.manychat.com/fb/sending/sendContent";
  const payload = { subscriber_id: String(subscriberId).trim(), data: { version: "v2", content: { messages: [{ type: "text", text: msg }] } } };
  UrlFetchApp.fetch(url, { method: "post", headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" }, payload: JSON.stringify(payload) });
}
