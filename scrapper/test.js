//read product list from file
import fs from 'fs';
const products = JSON.parse(fs.readFileSync('products.json'));
console.log(products.flat().length);