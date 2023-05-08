//read product list from file
import fs from 'fs';
const products = JSON.parse(fs.readFileSync('products2.json'));
// for each product, replace the price with an object containing the price as a float and the currency
products.forEach(product => {
    
    product.price = {
        // price : $10.25
        value: product.price?parseFloat(product.price.replace('$', '')):null,
        currency: 'USD'
    }
    console.log(product.price);
}
);
// write the products to a new file
fs.writeFileSync('products3.json', JSON.stringify(products, null, 2));