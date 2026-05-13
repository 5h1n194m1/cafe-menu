const SHEET_ID =
  "1rjAvzY28sZ6QABnztEiUK56NSIzlvYrlYl7E8eGdI7A"

const MENU_SHEET = "Menu"
const BEANS_SHEET = "Beans"

const MENU_API =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${MENU_SHEET}`

const BEANS_API =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${BEANS_SHEET}`



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

        id:
          row.c[0]?.v || "",

        category:
          row.c[1]?.v || "",

        name:
          row.c[2]?.v || "",

        price:
          row.c[3]?.v || 0,

        available:
          row.c[4]?.v || "",

        temp:
          row.c[5]?.v || "-"

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

        id:
          row.c[0]?.v || "",

        category:
          row.c[1]?.v || "",

        name:
          row.c[2]?.v || "",

        process:
          row.c[3]?.v || "",

        origin:
          row.c[4]?.v || "",

        notes:
          row.c[5]?.v || ""

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
      "Food",
      grouped["Food"] || []
    )}

    ${renderCategory(
      "Snack",
      grouped["Snack"] || []
    )}

    ${renderCategory(
      "Coffee",
      grouped["Coffee"] || []
    )}

    ${renderCategory(
      "Drink",
      grouped["Drink"] || []
    )}

    ${renderBeansSection(beans)}

  `

}



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



function renderItem(item){

  const available =
    item.available === false
    ? `
      <span class="sold">
        Sold Out
      </span>
    `
    : `
      <span class="available">
        Available
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
        ${formatPrice(item.price)}
      </div>

    </div>

  `

}



function formatPrice(price){

  return `Rp ${Number(price)
    .toLocaleString("id-ID")}`

}



/* =========================
   BEANS
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
        Single Origin • House Blend • Specialty
      </div>

      <div class="beans-grid">

        ${beans.map(bean => `

          <div class="bean-card">

            <div class="bean-top">

              <div class="bean-origin">
                ${bean.origin}
              </div>

              <div class="bean-badge">
                ${bean.process}
              </div>

            </div>

            <div class="bean-name">
              ${bean.name}
            </div>

            <div class="bean-note">
              ${bean.notes}
            </div>

          </div>

        `).join("")}

      </div>

    </section>

  `

}


loadMenu()
