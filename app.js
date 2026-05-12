const SPREADSHEET_ID =
  "1rjAvzY28sZ6QABnztEiUK56NSIzlvYrlYl7E8eGdI7A"

const MENU_API =
  `https://opensheet.elk.sh/${SPREADSHEET_ID}/Menu`

const BEANS_API =
  `https://opensheet.elk.sh/${SPREADSHEET_ID}/Beans`



async function fetchJSON(url){

  const response = await fetch(
    `${url}?v=${Date.now()}`
  )

  if(!response.ok){
    throw new Error("Failed fetch")
  }

  return response.json()

}



/* =========================
   MENU RENDER
========================= */

async function renderMenu(){

  try{

    const data = await fetchJSON(MENU_API)

    const container =
      document.getElementById("menu-container")

    const grouped = {}

    data.forEach(item => {

      if(!grouped[item.category]){
        grouped[item.category] = []
      }

      grouped[item.category].push(item)

    })

    const foodItems =
      grouped["Food"] || []

    const snackItems =
      grouped["Snack"] || []

    const coffeeItems =
      grouped["Coffee"] || []

    const drinkItems =
      grouped["Drink"] || []



    container.innerHTML = `

      ${renderFoodPage(foodItems,snackItems)}

      ${renderDrinkPage(coffeeItems,drinkItems)}

    `

  }

  catch(error){

    console.error(error)

    document.getElementById(
      "menu-container"
    ).innerHTML = `

      <div class="error-message">
        Failed to load menu.
      </div>

    `

  }

}



/* =========================
   FOOD PAGE
========================= */

function renderFoodPage(food,snack){

  const paket =
    food.slice(0,10)

  const mie =
    food.slice(10)

  return `

    <section class="menu-sheet">

      <div class="sheet-corner left"></div>
      <div class="sheet-corner right"></div>

      <div class="sheet-header">

        <div class="brand-name">
          Garasi Kumbawali Coffee & Eatery
        </div>

        <div class="sheet-title">
          Food Menu
        </div>

        <div class="sheet-note">
          (NON MSG)
        </div>

        <div class="tagline">
          Kopi adalah Sahabat
        </div>

        <div class="ornament">
          <span></span>
        </div>

      </div>

      <div class="page-grid food-grid">

        <div>

          <div class="section-block">

            <div class="section-title">
              Paket Nasi Kumbawali
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(paket)}

            </div>

          </div>

          <div
            class="section-block"
            style="margin-top:22px"
          >

            <div class="section-title">
              Indomie Kumbawali
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(
                mie.slice(0,2)
              )}

            </div>

          </div>

          <div
            class="section-block"
            style="margin-top:22px"
          >

            <div class="section-title">
              Sayur/Mie Kumbawali
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(
                mie.slice(2)
              )}

            </div>

          </div>

        </div>

        <div>

          <div class="section-block">

            <div class="section-title">
              Snack Kumbawali
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(snack)}

            </div>

          </div>

        </div>

      </div>

      <div class="takeaway-note">
        (Take Away +1.5K)
      </div>

      <div class="sheet-footer">
        Reservasi : 081 225 222 112<br>
        Paingan Trasan Bandongan Magelang<br>
        Instagram : @garasikumbawali_coffee_eatery
      </div>

    </section>

  `

}



/* =========================
   DRINK PAGE
========================= */

function renderDrinkPage(coffee,drink){

  return `

    <section class="menu-sheet">

      <div class="sheet-corner left"></div>
      <div class="sheet-corner right"></div>

      <div class="sheet-header">

        <div class="brand-name">
          Garasi Kumbawali Coffee & Eatery
        </div>

        <div class="sheet-title">
          Drink Menu
        </div>

        <div class="tagline">
          Kopi adalah Sahabat
        </div>

        <div class="ornament">
          <span></span>
        </div>

      </div>

      <div class="page-grid drink-grid">

        <div>

          <div class="section-block">

            <div class="section-title">
              Coffee Kumbawali
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(coffee)}

            </div>

          </div>

        </div>

        <div>

          <div class="section-block">

            <div class="section-title">
              Teh & Jahe
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(
                drink.slice(0,10)
              )}

            </div>

          </div>

          <div
            class="section-block"
            style="margin-top:22px"
          >

            <div class="section-title">
              Kekinian dll
              <span class="section-star">★</span>
            </div>

            <div class="menu-list">

              ${renderItems(
                drink.slice(10)
              )}

            </div>

          </div>

        </div>

      </div>

      <div
        class="section-block wide"
        style="margin-top:28px"
      >

        <div class="section-title">
          Bean (Single Origin & Authentic 100%)
          <span class="section-star">★★★</span>
        </div>

        <div
          id="beans-copy"
          class="beans-copy"
        >
          Memuat beans...
        </div>

      </div>

      <div class="takeaway-note">
        (Take Away +1.5K)
      </div>

      <div class="sheet-footer">
        Reservasi : 081 225 222 112<br>
        Paingan Trasan Bandongan Magelang<br>
        Instagram : @garasikumbawali_coffee_eatery
      </div>

    </section>

  `

}



/* =========================
   MENU ITEMS
========================= */

function renderItems(items){

  return items.map(item => {

    const temp =
      item.temp &&
      item.temp !== "-"
      ? `<span class="item-sub">${item.temp}</span>`
      : ""

    return `

      <div class="menu-row">

        <div class="item-name">
          ${item.name}
          ${temp}
        </div>

        <div class="item-leader"></div>

        <div class="item-price">
          ${formatPrice(item.price)}
        </div>

      </div>

    `

  }).join("")

}



/* =========================
   PRICE FORMAT
========================= */

function formatPrice(price){

  const value =
    Number(price || 0)

  if(value >= 1000){

    return `${Math.floor(value / 1000)}K`

  }

  return value

}



/* =========================
   BEANS
========================= */

async function renderBeans(){

  try{

    const data =
      await fetchJSON(BEANS_API)

    const container =
      document.getElementById("beans-copy")

    if(!container) return

    container.innerHTML = `

      ${data.map((bean,index)=>`

        <div>

          <strong>
            ${index + 1}.
            ${bean.name}
          </strong>

          (${bean.origin}) —
          ${bean.process}

        </div>

      `).join("")}

    `

  }

  catch(error){

    console.error(error)

  }

}



/* =========================
   INIT
========================= */

renderMenu()

setTimeout(() => {

  renderBeans()

}, 300)
