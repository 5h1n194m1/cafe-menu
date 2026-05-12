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



loadCSV()
