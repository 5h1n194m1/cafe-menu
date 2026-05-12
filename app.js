const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vStOot55lakMCkwmYBzwFrl8SDUTbLYPQq8iIDd915bhYK1HdJrGPdLnC-Z98nLbOMwlF9o-Z_tlZTz/pub?output=csv"



async function loadCSV(){

  try{

    const response = await fetch(
      `${CSV_URL}&t=${Date.now()}`
    )

    const csv = await response.text()

    const data = parseCSV(csv)

    renderMenu(data)

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



function parseCSV(csv){

  const lines =
    csv.trim().split("\n")

  const headers =
    lines[0]
    .split(",")
    .map(h => h.trim())

  return lines.slice(1).map(line => {

    const values =
      line.split(",")

    const obj = {}

    headers.forEach((header,index)=>{

      obj[header] =
        values[index]
        ? values[index].trim()
        : ""

    })

    return obj

  })

}



function renderMenu(data){

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

    ${renderBeansSection()}

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
    item.available === "FALSE"
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

  const value =
    Number(price || 0)

  return `Rp ${value.toLocaleString("id-ID")}`

}



/* =========================
   COFFEE BEANS
========================= */

function renderBeansSection(){

  return `

    <section class="beans-section">

      <div class="category-title">

        <div class="category-line"></div>

        <div class="category-name">
          Coffee Beans
        </div>

        <div class="category-line"></div>

      </div>

      <div class="beans-subtitle">
        Single Origin • House Blend • Specialty
      </div>

      <div class="beans-grid">

        <div class="bean-card">

          <div class="bean-top">

            <div class="bean-origin">
              Bandung
            </div>

            <div class="bean-badge">
              Fruity
            </div>

          </div>

          <div class="bean-name">
            Halu Banana
          </div>

          <div class="bean-note">
            Sweet banana aroma with smooth
            body and soft acidity.
          </div>

        </div>

        <div class="bean-card">

          <div class="bean-top">

            <div class="bean-origin">
              Aceh
            </div>

            <div class="bean-badge">
              Winey
            </div>

          </div>

          <div class="bean-name">
            Blueberry Wine
          </div>

          <div class="bean-note">
            Berry-forward profile with
            winey finish and floral aroma.
          </div>

        </div>

        <div class="bean-card">

          <div class="bean-top">

            <div class="bean-origin">
              Temanggung
            </div>

            <div class="bean-badge">
              Bold
            </div>

          </div>

          <div class="bean-name">
            Robusta Temanggung
          </div>

          <div class="bean-note">
            Thick body, dark chocolate
            notes, and intense character.
          </div>

        </div>

        <div class="bean-card">

          <div class="bean-top">

            <div class="bean-origin">
              Ethiopia
            </div>

            <div class="bean-badge">
              Floral
            </div>

          </div>

          <div class="bean-name">
            Ethiopia Natural
          </div>

          <div class="bean-note">
            Tea-like mouthfeel with floral
            fragrance and citrus finish.
          </div>

        </div>

      </div>

    </section>

  `

}



loadCSV()
