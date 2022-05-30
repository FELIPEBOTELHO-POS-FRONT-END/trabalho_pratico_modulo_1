//CÓDIGO PARA UM PRODUTO
function productItem(product) {
  const item = `<div class="product" data-name="${product.name}" data-brand="${
    product.brand
  }" data-type="${product.dataType}" tabindex="508">
  <figure class="product-figure">
    <img src="${
      product.image_link
    }" width="215" height="215" alt="NYX Mosaic Powder Blush Paradise" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand.capitalize()}</span>
<span class="product-brand background-price">${product.brValue}</span></div>
  </section>
</div>`;
  return item;
}

//CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brValue}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
        </div>
      </div></section>`;
  return details;
}

let selectBrands = document.getElementById("filter-brand");
let selectType = document.getElementById("filter-type");
let inputName = document.getElementById("filter-name");
let sortSelect = document.getElementById("sort-type");

async function Init() {
  let products = await getProducts();
  fillFilters();
  renderProducts(products);
}

function renderProducts(products) {
  let catalog = document.getElementsByClassName("catalog")[0];
  catalog.replaceChildren("");
  for (let product of products) {
    let div = document.createElement("div");
    div.innerHTML = productItem(product);
    div
      .getElementsByClassName("product")[0]
      .insertAdjacentHTML("beforeend", loadDetails(product));
    catalog.append(div);
  }
}

function fillFilters() {
  let types = getTypes();
  let brands = getBrands();

  sortSelect.addEventListener("change", filter);
  selectBrands.addEventListener("change", filter);
  for (let brand of brands) {
    let option = document.createElement("option");
    option.textContent = brand.capitalize();
    option.value = brand;
    selectBrands.append(option);
  }

  selectType.addEventListener("change", filter);
  for (let type of types) {
    let option = document.createElement("option");
    option.textContent = type.capitalize();
    option.value = type;
    selectType.appendChild(option);
  }

  inputName.addEventListener("input", () => setTimeout(filter, 400));
}

async function filter() {
  const filterObj = {
    name: inputName.value,
    brand: selectBrands.value,
    type: selectType.value,
  };
  let filteredProducts = await getProducts(sortSelect.value, filterObj);
  renderProducts(filteredProducts);
}

Init();

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    var separateWord = this.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
      separateWord[i] =
        separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
  },
  enumerable: false,
});
