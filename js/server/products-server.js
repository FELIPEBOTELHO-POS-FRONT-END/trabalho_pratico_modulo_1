const BASE_API_URL = "http://localhost:3000";
let products_base = [];

function fetchToJson(url, options) {
  return fetch(url, options)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error(r.statusText);
      }
    })
    .catch((error) => {
      showError("Error loading data", error);
      throw error;
    });
}

async function getProducts(order, filter) {
  if (products_base.length == 0) {
    products_base = await fetchToJson(`${BASE_API_URL}/products`);
    products_base = fixValues(products_base);
  }
  let orderedProducts = sortProducts(products_base, order);
  if (filter) {
    let filteredProducts = [...orderedProducts].filter(
      (x) =>
        (x.name.toLowerCase().includes(filter.name.toLowerCase()) ||
          filter.name == "") &&
        (x.brand.toLowerCase() == filter.brand.toLowerCase() ||
          filter.brand == "") &&
        (x.product_type.toLowerCase() == filter.type.toLowerCase() ||
          filter.type == "")
    );
    return filteredProducts;
  }
  return orderedProducts;
}

function getBrands() {
  let brands = new Set();
  products_base.map((product) => brands.add(product.brand.capitalize()));
  return brands;
}

function getTypes() {
  let types = new Set();
  products_base.map((product) => types.add(product.product_type.capitalize()));
  return types;
}

function fixValues(list) {
  for (let item of list) {
    if (item.price) {
      let floatValue = parseFloat(item.price);
      let brValue = (floatValue * 5.5).toFixed(2);
      item.price = parseFloat(brValue);
      item.brValue = `R$ ${brValue}`.replace(".", ",");
    } else {
      item.price = "0";
      item.brValue = "R$ 0,00";
    }

    item.name = item.name.capitalize().trim();

    if (!item.brand) {
      item.brand = "";
    }
    if (!item.product_type) {
      item.product_type = "";
    }
    if (!item.rating) {
      item.rating = 0;
    }
    if (!item.brand) {
      item.brand = "No brand";
    }
    if (!item.category) {
      item.category = "No category";
    }
  }
  return list;
}

function sortProducts(list, order) {
  const orderValues = setOrderPropertyAndType(order);
  if (orderValues.orderType == "asc") {
    list.sort((a, b) => {
      let fa = a[orderValues.orderProperty],
        fb = b[orderValues.orderProperty];
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  } else {
    list.sort((a, b) => {
      let fa = a[orderValues.orderProperty],
        fb = b[orderValues.orderProperty];
      if (fa > fb) {
        return -1;
      }
      if (fa < fb) {
        return 1;
      }
      return 0;
    });
  }
  return list;
}

function setOrderPropertyAndType(order) {
  let orderType = "";
  let orderProperty = "";

  switch (order) {
    case "descRating":
      orderType = "desc";
      orderProperty = "rating";
      break;
    case "ascPrice":
      orderType = "asc";
      orderProperty = "price";
      break;
    case "descPrice":
      orderType = "desc";
      orderProperty = "price";
      break;
    case "ascName":
      orderType = "asc";
      orderProperty = "name";
      break;
    case "descName":
      orderType = "desc";
      orderProperty = "name";
      break;
    default:
      orderType = "desc";
      orderProperty = "rating";
      break;
  }
  return {
    orderProperty,
    orderType,
  };
}
