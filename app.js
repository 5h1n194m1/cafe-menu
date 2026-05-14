const SHEET_ID =
  "1rjAvzY28sZ6QABnztEiUK56NSIzlvYrlYl7E8eGdI7A"

const MENU_SHEET = "Menu"
const BEANS_SHEET = "Beans"

const MENU_API =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${MENU_SHEET}`

const BEANS_API =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${BEANS_SHEET}`



/* =========================
   LOAD MENU
========================= */

async function loadMenu(){

  try{

    /* ======================
       MENU
    ====================== */

    const menuResponse =
      await fetch(MENU_API)

    const menuText =
      await menuResponse.text()

    const menuJson =
      JSON.parse(
        menuText.substring(
          47,
          menuText.length - 2
        )
      )

    const menuRows =
      menuJson.table.rows

    const menuData =
      menuRows.map(row => ({

        /* A */
        id:
          row.c[0]?.v || "",

        /* B */
        category:
          row.c[1]?.v || "",

        /* C */
        name:
          row.c[2]?.v || "",

        /* D */
        price:
          getCellValue(row.c[3]),

        /* E */
        price2:
          getCellValue(row.c[4]),

        /* F */
        available:
          getCellValue(row.c[5]),

        /* G */
        temp:
          getCellValue(row.c[6])

      }))



    /* ======================
       BEANS
    ====================== */

    const beansResponse =
      await fetch(BEANS_API)

    const beansText =
      await beansResponse.text()

    const beansJson =
      JSON.parse(
        beansText.substring(
          47,
          beansText.length - 2
        )
      )

    const beansRows =
      beansJson.table.rows

    const beansData =
      beansRows.map(row => ({

        /* A */
        id:
          row.c[0]?.v || "",

        /* B */
        category:
          row.c[1]?.v || "",

        /* C */
        name:
          row.c[2]?.v || "",

        /* D */
        process:
          getCellValue(row.c[3]),

        /* E */
        origin:
          getCellValue(row.c[4]),

        /* F */
        notes:
          getCellValue(row.c[5]),

        /* G */
        brewPrice:
          getCellValue(row.c[6])

      }))

    renderMenu(menuData, beansData)

  }

  catch(error){

    console.error(error)

    document.getElementById(
      "menu-container"
    ).innerHTML = `

      <div class="loading">
        Failed to load menu.
      </div>

    `

  }

}



/* =========================
   GET CELL VALUE
========================= */

function getCellValue(cell){

  if(!cell) return ""

  if(cell.f) return cell.f

  if(cell.v !== undefined) return cell.v

  return ""

}



/* =========================
   RENDER MENU
========================= */

function renderMenu(data, beans){

  const grouped = {}

  data.forEach(item => {

    if(!grouped[item.category]){
      grouped[item.category] = []
    }

    grouped[item.category].push(item)

  })

  const container =
    document.getElementById("menu-container")

  container.innerHTML = `

    ${renderCategory(
      "Coffee",
      grouped["Coffee"] || []
    )}

    ${renderBeansSection(beans)}

    ${renderCategory(
      "Drink",
      grouped["Drink"] || []
    )}

    ${renderCategory(
      "Food",
      grouped["Food"] || []
    )}

    ${renderCategory(
      "Snack",
      grouped["Snack"] || []
    )}

  `

}



/* =========================
   CATEGORY
========================= */

function renderCategory(title,items){

  return `

    <section class="category">

      <div class="category-title">

        <div class="category-line"></div>

        <div class="category-name">
          ${title}
        </div>

        <div class="category-line"></div>

      </div>

      <div class="menu-list">

        ${items.map(item => renderItem(item)).join("")}

      </div>

    </section>

  `

}



/* =========================
   MENU ITEM
========================= */

function renderItem(item){

  const availableValue =
    String(item.available)
      .trim()
      .toUpperCase()

  const isAvailable =
    availableValue === "TRUE"

  const available =
    !isAvailable
    ? `
      <span class="sold">
        SOLD OUT
      </span>
    `
    : `
      <span class="available">
        AVAILABLE
      </span>
    `

  const temp =
    item.temp &&
    item.temp !== "-"
    ? `
      <span class="temp">
        ${item.temp}
      </span>
    `
    : ""

  return `

    <div class="menu-item">

      <div class="menu-left">

        <div class="menu-name">
          ${item.name}
        </div>

        <div class="menu-meta">

          ${available}

          ${temp}

        </div>

      </div>

      <div class="menu-price">

        ${formatPrice(
          item.price,
          item.price2
        )}

      </div>

    </div>

  `

}



/* =========================
   FORMAT PRICE
========================= */

function formatPrice(price, price2){

  const p1 =
    formatSinglePrice(price)

  const p2 =
    formatSinglePrice(price2)

  if(p1 && p2){

    return `
      <span>${p1}</span>
      <span class="price-separator">/</span>
      <span>${p2}</span>
    `

  }

  if(p1) return p1

  if(p2) return p2

  return "-"

}



function formatSinglePrice(value){

  if(!value) return ""

  const clean =
    String(value).trim()

  /* SUPPORT TEXT */
  if(isNaN(clean)) return clean

  const number =
    Number(clean)

  if(number >= 1000){

    return `${Math.round(number / 1000)}K`

  }

  return clean

}



/* =========================
   BEANS SECTION
========================= */

function renderBeansSection(beans){

  return `

    <section class="beans-section">

      <div class="category-title">

        <div class="category-line"></div>

        <div class="category-name">
          Kumbawali Beans Selection
        </div>

        <div class="category-line"></div>

      </div>

      <div class="beans-subtitle">
        Available for V60 • Japanese • Manual Brew
      </div>

      <div class="beans-grid">

        ${beans.map(bean => `

          <div
            class="bean-card"
            onclick="openBeanModal(
              '${escapeHtml(bean.name)}',
              '${escapeHtml(bean.category)}',
              '${escapeHtml(bean.origin)}',
              '${escapeHtml(bean.process)}',
              '${escapeHtml(bean.notes)}',
              '${escapeHtml(bean.brewPrice)}'
            )"
          >

            <div class="bean-head">

              <div class="bean-category">
                ${bean.category || "-"}
              </div>

              <div class="bean-origin">
                ${bean.origin || "-"}
              </div>

            </div>

            <div class="bean-name">
              ${bean.name}
            </div>

            <div class="bean-price">

              <span>
                For V60 / Japanese
              </span>

              <strong>
                ${formatSinglePrice(bean.brewPrice)}
              </strong>

            </div>

          </div>

        `).join("")}

      </div>

    </section>

  `

}



/* =========================
   INIT
========================= */

loadMenu()

function openBeanModal(
  name,
  category,
  origin,
  process,
  notes,
  price
){

  closeBeanModal()

  const modal =
    document.createElement("div")

  modal.className =
    "bean-modal"

  modal.innerHTML = `

    <div
      class="bean-modal-overlay"
      onclick="closeBeanModal()"
    ></div>

    <div class="bean-modal-content">

      <div class="bean-modal-top">

        <div>

          <div class="bean-modal-category">
            ${category || "-"}
          </div>

          <div class="bean-modal-name">
            ${name || "-"}
          </div>

        </div>

        <div class="bean-modal-origin">
          ${origin || "-"}
        </div>

      </div>

      ${
        process
        ? `
          <div class="bean-modal-section">

            <div class="bean-modal-label">
              PROCESS
            </div>

            <div class="bean-modal-text">
              ${process}
            </div>

          </div>
        `
        : ""
      }

      ${
        notes
        ? `
          <div class="bean-modal-section">

            <div class="bean-modal-label">
              TASTING NOTES
            </div>

            <div class="bean-modal-text">
              ${notes}
            </div>

          </div>
        `
        : ""
      }

      ${
        price
        ? `
          <div class="bean-modal-price">

            <span>
              V60 / Japanese
            </span>

            <strong>
              ${formatSinglePrice(price)}
            </strong>

          </div>
        `
        : ""
      }

      <button
        class="bean-modal-close"
        onclick="closeBeanModal()"
      >
        Close
      </button>

    </div>

  `

  document.body.appendChild(modal)

}



function closeBeanModal(){

  const modal =
    document.querySelector(".bean-modal")

  if(modal){
    modal.remove()
  }

}



function escapeHtml(text){

  if(!text) return ""

  return String(text)
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')

}
