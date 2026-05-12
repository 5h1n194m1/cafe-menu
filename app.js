const SPREADSHEET_ID =
  "1rjAvzY28sZ6QABnztEiUK56NSIzlvYrlYl7E8eGdI7A";

const OPEN_SHEET_HOSTS = [
  "https://opensheet.elk.sh",
  "https://opensheet.vercel.app"
];

const FETCH_TIMEOUT_MS = 10000;
const AUTO_REFRESH_MS = 30000;



/* =========================
   HELPERS
========================= */

function escapeHTML(value){

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

function cleanValue(value){

  return String(value ?? "").trim();

}

function isMenuAvailable(value){

  if(typeof value === "boolean"){
    return value;
  }

  return cleanValue(value).toUpperCase() !== "FALSE";

}

function formatPrice(value){

  const number =
    Number(cleanValue(value).replace(/[^\d]/g, ""));

  if(!number){
    return "Rp -";
  }

  return `Rp ${number.toLocaleString("id-ID")}`;

}

function renderMessage(container, message, className = "status-message"){

  if(!container) return;

  container.innerHTML = `

    <div class="${className}">
      ${escapeHTML(message)}
    </div>

  `;

}



/* =========================
   SHEET LOADER
========================= */

async function fetchJSON(url){

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT_MS);

  try{

    const response = await fetch(url, {
      cache:"no-store",
      signal:controller.signal
    });

    if(!response.ok){
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();

  }

  finally{
    clearTimeout(timeoutId);
  }

}

async function loadSheetRows(sheetName){

  const encodedSheet = encodeURIComponent(sheetName);
  const cacheBust = Date.now();
  const errors = [];

  for(const host of OPEN_SHEET_HOSTS){

    try{

      const data = await fetchJSON(
        `${host}/${SPREADSHEET_ID}/${encodedSheet}?v=${cacheBust}`
      );

      if(Array.isArray(data)){
        return data;
      }

      errors.push(`${host} returned invalid data`);

    }

    catch(error){
      errors.push(`${host}: ${error.message}`);
    }

  }

  try{
    return await loadSheetRowsWithGoogle(sheetName);
  }

  catch(error){
    errors.push(`Google Sheets fallback: ${error.message}`);
    throw new Error(errors.join(" | "));
  }

}

function loadSheetRowsWithGoogle(sheetName){

  return new Promise((resolve, reject) => {

    const safeSheetName = sheetName.replace(/[^\w]/g, "");
    const callbackName =
      `sheetCallback_${safeSheetName}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;

    const script = document.createElement("script");

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("request timeout"));
    }, FETCH_TIMEOUT_MS);

    function cleanup(){

      clearTimeout(timeoutId);
      delete window[callbackName];

      if(script.parentNode){
        script.parentNode.removeChild(script);
      }

    }

    window[callbackName] = response => {

      try{
        const rows = parseGoogleSheetResponse(response);
        cleanup();
        resolve(rows);
      }

      catch(error){
        cleanup();
        reject(error);
      }

    };

    script.onerror = () => {
      cleanup();
      reject(new Error("script failed to load"));
    };

    const url = new URL(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`
    );

    url.searchParams.set(
      "tqx",
      `responseHandler:${callbackName};out:json`
    );
    url.searchParams.set("sheet", sheetName);
    url.searchParams.set("v", Date.now());

    script.src = url.toString();
    document.body.appendChild(script);

  });

}

function parseGoogleSheetResponse(response){

  if(!response || response.status !== "ok" || !response.table){
    throw new Error("invalid Google Sheets response");
  }

  const columns = response.table.cols.map((column, index) => {
    return cleanValue(column.label || column.id || `column_${index}`);
  });

  return response.table.rows
    .map(row => {

      const item = {};

      row.c.forEach((cell, index) => {

        const key = columns[index];

        if(!key) return;

        item[key] =
          cell && cell.f != null
          ? cell.f
          : cell && cell.v != null
          ? cell.v
          : "";

      });

      return item;

    })
    .filter(item => {
      return Object.values(item).some(value => cleanValue(value));
    });

}



/* =========================
   LOAD MENU
========================= */

async function loadMenu(){

  const container =
    document.getElementById("menu-container");

  if(!container) return;

  try{

    if(!container.children.length){
      renderMessage(container, "Memuat menu...");
    }

    const data = await loadSheetRows("Menu");
    const grouped = new Map();

    data
      .filter(item => cleanValue(item.name))
      .forEach(item => {

        const category =
          cleanValue(item.category) || "Menu";

        if(!grouped.has(category)){
          grouped.set(category, []);
        }

        grouped.get(category).push(item);

      });

    if(!grouped.size){
      renderMessage(container, "Menu belum tersedia.");
      return;
    }

    container.innerHTML =
      Array.from(grouped.entries())
        .map(([category, items]) => renderMenuCategory(category, items))
        .join("");

  }

  catch(error){

    console.error("Failed to load menu:", error);

    renderMessage(
      container,
      "Menu belum bisa dimuat. Silakan refresh beberapa saat lagi.",
      "error-message"
    );

  }

}

function renderMenuCategory(category, items){

  return `

    <section class="menu-card fade">

      <div class="category-title">

        <div class="category-inner">

          <div class="category-line"></div>

          <h2 class="category-name">
            ${escapeHTML(category)}
          </h2>

        </div>

      </div>

      ${items.map(renderMenuItem).join("")}

    </section>

  `;

}

function renderMenuItem(item){

  const temp = cleanValue(item.temp);
  const available = isMenuAvailable(item.available);

  return `

    <div class="menu-item fade">

      <div class="menu-row">

        <div class="menu-left">

          <div class="menu-name">
            ${escapeHTML(item.name || "-")}
          </div>

          <div class="menu-meta">

            ${
              temp && temp !== "-"
              ? `
                <span class="temp-badge">
                  ${escapeHTML(temp)}
                </span>
              `
              : ``
            }

            ${
              available
              ? `
                <span class="available">
                  Available
                </span>
              `
              : `
                <span class="sold">
                  SOLD OUT
                </span>
              `
            }

          </div>

        </div>

        <div class="price-area">

          <div class="price">
            ${formatPrice(item.price)}
          </div>

          <div class="takeaway-note">
            +1.5K take away
          </div>

        </div>

      </div>

    </div>

  `;

}



/* =========================
   LOAD BEANS
========================= */

async function loadBeans(){

  const container =
    document.getElementById("beans-container");

  if(!container) return;

  try{

    if(!container.children.length){
      renderMessage(container, "Memuat coffee beans...");
    }

    const data = await loadSheetRows("Beans");
    const beans = data.filter(bean => cleanValue(bean.name));

    if(!beans.length){
      renderMessage(container, "Coffee beans belum tersedia.");
      return;
    }

    container.innerHTML =
      beans.map(renderBeanCard).join("");

  }

  catch(error){

    console.error("Failed to load beans:", error);

    renderMessage(
      container,
      "Coffee beans belum bisa dimuat. Silakan refresh beberapa saat lagi.",
      "error-message"
    );

  }

}

function renderBeanCard(bean){

  return `

    <div class="bean-card fade">

      <div class="bean-top">

        <div class="bean-category">
          ${escapeHTML(bean.category || "-")}
        </div>

        <div class="bean-origin">
          ${escapeHTML(bean.origin || "-")}
        </div>

      </div>

      <h3 class="bean-name">
        ${escapeHTML(bean.name || "-")}
      </h3>

      <div class="bean-process">
        ${escapeHTML(bean.process || "-")}
      </div>

      <p class="bean-notes">
        ${escapeHTML(bean.notes || "-")}
      </p>

    </div>

  `;

}



/* =========================
   INIT
========================= */

function init(){

  loadMenu();
  loadBeans();

  setInterval(() => {
    loadMenu();
    loadBeans();
  }, AUTO_REFRESH_MS);

}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
}
else{
  init();
}
