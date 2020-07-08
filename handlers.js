const { stock, customers } = require("./data/promo");
const e = require("express");

const validate = (req, res) => {
  const { givenName, surname, email, address, country} = req.body;
  if (missingData(req.body)) {
    res.json({
      "status": "error",
      "error": "missing-data"
    });
  }
  else if (!reduceStock(req.body)) {
    res.json({
      "status": "error",
      "error": "unavailable"
    });
  }
  else if (!isInCanada(country)) {
    res.json({
      "status": "error",
      "error": "undeliverable"
    });
  }
  else if (!isNewCustomer(givenName+surname, email, address)) {
    res.json({
      "status": "error",
      "error": "repeat-customer"
    })
  }
  else {
    res.json({ "status": "success" });
    customers.push(req.body);
  }
}

const missingData = (data) => {
  return Object.values(data).includes("undefined")
}

const reduceStock = (product) => {
  let inStock = true;
  if (product.order === 'shirt' && stock.shirt[product.size] > 0) {
    stock.shirt[product.size]--;
  }
  else if (stock[product.order] > 0) {
    stock[product.order]--;
  }
  else {
    inStock = false;
  }
  return inStock;
}

const isNewCustomer = (...custInfo) => {
  let newCustomer = true;
  customers.forEach((info) => {
    if (custInfo.includes(info.email)
    || custInfo.includes(info.address)
    || custInfo.includes(info.firstName+info.surname)) {
      newCustomer = false;
    }
  })
  return newCustomer;
}

const isInCanada = (country) => {
  return (country === 'Canada')
}

module.exports = { validate };