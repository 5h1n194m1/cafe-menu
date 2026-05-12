const SPREADSHEET_ID =
  "1rjAvzY28sZ6QABnztEiUK56NSIzlvYrlYl7E8eGdI7A"

const MENU_API =
  `https://opensheet.elk.sh/${SPREADSHEET_ID}/Menu`

const BEANS_API =
  `https://opensheet.elk.sh/${SPREADSHEET_ID}/Beans`



/* =========================
   LOAD MENU
========================= */

async function loadMenu(){

  try{

    const response = await fetch(
      `${MENU_API}?v=${Date.now()}`
    )

    const data = await response.json()

    const container =
      document.getElementById("menu-container")

    const grouped = {}

    data.forEach(item => {

      if(!grouped[item.category]){
        grouped[item.category] = []
      }

      grouped[item.category].push(item)

    })

    container.innerHTML = ""

    Object.keys(grouped).forEach(category => {

      let itemsHTML = ""

      grouped[category].forEach(item => {

        const isDrink =
          category === "Drink" ||
          category === "Coffee"

        itemsHTML += `

          <div class="menu-item fade">

            <div class="menu-row">

              <div class="menu-left">

                <div class="menu-name">
                  ${item.name}
                </div>

                <div class="menu-meta">

                  ${
                    item.temp &&
                    item.temp !== "-"
                    ? `
                      <span class="temp-badge">
                        ${item.temp}
                      </span>
                    `
                    : ``
                  }

                  ${
                    item.available === "FALSE"
                    ? `
                      <span class="sold">
                        SOLD OUT
                      </span>
                    `
                    : `
                      <span class="available">
                        Available
                      </span>
                    `
                  }

                </div>

              </div>

              <div class="price-area">

                <div class="price">
                  Rp ${Number(item.price)
                    .toLocaleString("id-ID")}
                </div>

                <div class="takeaway-note">
                  +1.5K take away
                </div>

              </div>

            </div>

          </div>

        `

      })

      container.innerHTML += `

        <section class="menu-card fade">

          <div class="category-title">

            <div class="category-inner">

              <div class="category-line"></div>

              <h2 class="category-name">
                ${category}
              </h2>

            </div>

          </div>

          ${itemsHTML}

        </section>

      `

    })

  }

  catch(error){

    console.error(error)

    document.getElementById(
      "menu-container"
    ).innerHTML = `

      <div
        style="
          text-align:center;
          padding:80px 20px;
          color:#ff5c5c;
        "
      >
        Failed to load menu.
      </div>

    `

  }

}



/* =========================
   LOAD BEANS
========================= */

async function loadBeans(){

  try{

    const response = await fetch(
      `${BEANS_API}?v=${Date.now()}`
    )

    const data = await response.json()

    const container =
      document.getElementById("beans-container")

    if(!container) return

    let html = ""

    data.forEach(bean => {

      html += `

        <div class="bean-card fade">

          <div class="bean-top">

            <div class="bean-category">
              ${bean.category}
            </div>

            <div class="bean-origin">
              ${bean.origin}
            </div>

          </div>

          <h3 class="bean-name">
            ${bean.name}
          </h3>

          <div class="bean-process">
            ${bean.process}
          </div>

          <p class="bean-notes">
            ${bean.notes}
          </p>

        </div>

      `

    })

    container.innerHTML = html

  }

  catch(error){

    console.error(error)

  }

}



/* =========================
   INIT
========================= */

loadMenu()
loadBeans()



/* =========================
   AUTO REFRESH
========================= */

setInterval(() => {

  loadMenu()

}, 30000)