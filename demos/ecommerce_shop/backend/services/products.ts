import type { Product } from "../models";

const BACKEND_URL = process.env.BACKEND_URL;

export const products: Product[] = [
  {
    id: 1,
    name: "Beetroot and Spinach Salad",
    price: 7.5,
    imageUrl: `${BACKEND_URL}/public/images/beetroot-and-spinach-salad.png`,
  },
  {
    id: 2,
    name: "Sweet Potato and Rocket Salad",
    price: 8.5,
    imageUrl: `${BACKEND_URL}/public/images/sweet-potato-and-rocket-salad.png`,
  },
  {
    id: 3,
    name: "Tofu Stir Fry",
    price: 9.0,
    imageUrl: `${BACKEND_URL}/public/images/tofu-stir-fry.png`,
  },
  {
    id: 4,
    name: "Classic Poke Bowl",
    price: 10.0,
    imageUrl: `${BACKEND_URL}/public/images/classic-poke-bowl.png`,
  },
  {
    id: 5,
    name: "Falafel Summer Bowl",
    price: 8.0,
    imageUrl: `${BACKEND_URL}/public/images/falafel-summer-bowl.png`,
  },
  {
    id: 6,
    name: "Chickpea Curry",
    price: 7.0,
    imageUrl: `${BACKEND_URL}/public/images/chickpea-curry.png`,
  },
  {
    id: 7,
    name: "Raw Poke Bowl",
    price: 9.5,
    imageUrl: `${BACKEND_URL}/public/images/raw-poke-bowl.png`,
  },
  {
    id: 8,
    name: "Spelt Pasta and Roast Veg",
    price: 8.75,
    imageUrl: `${BACKEND_URL}/public/images/spelt-pasta-and-roast-veg.png`,
  },
  {
    id: 9,
    name: "Grilled Tofu Poke Bowl",
    price: 9.25,
    imageUrl: `${BACKEND_URL}/public/images/grilled-tofu-poke-bowl.png`,
  },
];
