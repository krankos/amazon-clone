import { data } from "./mongodb";

export const getProducts = async() => {
    const products = await (await data()).find({}).toArray();
    return products;
};

// export const createProducts = async(prod) => {
//     const product = await (await Users()).insert(prod);
//     return product;
// };