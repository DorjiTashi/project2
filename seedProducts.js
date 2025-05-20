import clientPromise from '../lib/mongodb';

const PRODUCTS = [
  {
    name: 'Eco-Friendly Shampoo Bar',
    category: 'hygiene',
    description: 'A zero-waste shampoo bar that’s gentle on your hair and the environment.',
    price: 'Nu 8.99',
    image: '/products/shampoo.jpg',
  },
  {
    name: 'Reusable Shopping Bag',
    category: 'accessories',
    description: 'A sturdy, foldable bag perfect for groceries or shopping trips.',
    price: 'Nu 12.99',
    image: '/products/rebag.png',
  },
  {
    name: 'Bamboo Toothbrush',
    category: 'hygiene',
    description: 'An eco-friendly alternative to plastic toothbrushes, made from sustainable bamboo.',
    price: 'Nu 4.99',
    image: '/products/bam.jpg',
  },
  {
    name: 'Reusable Water Bottle',
    category: 'accessories',
    description: 'Stay hydrated with this stainless steel reusable water bottle, perfect for reducing plastic waste.',
    price: 'Nu 12.99',
    image: '/products/water.png',
  },
  {
    name: 'Organic Cotton Tote Bag',
    category: 'household',
    description: 'A stylish, durable tote bag made from organic cotton to reduce single-use plastic bags.',
    price: 'Nu 7.99',
    image: '/products/bag.jpg',
  },
  {
    name: 'Reusable Coffee Cup',
    category: 'technology',
    description: 'Take your coffee on the go with this reusable coffee cup, reducing waste from disposable cups.',
    price: 'Nu 10.99',
    image: '/products/coffee.jpg',
  },
  {
    name: 'Solar Powered Lantern',
    category: 'accessories',
    description: 'A solar-powered lantern, perfect for outdoor adventures without the need for disposable batteries.',
    price: 'Nu 18.99',
    image: '/products/solar.jpg',
  },
  {
    name: 'Compostable Trash Bags',
    category: 'household',
    description: 'These compostable trash bags break down quickly, helping reduce landfill waste.',
    price: 'Nu 11.99',
    image: '/products/trash.jpg',
  },
  {
    name: 'Recycled Paper Notebook',
    category: 'stationery',
    description: 'A notebook made from 100% recycled paper, helping reduce waste.',
    price: 'Nu 3.99',
    image: '/products/note.jpg',
  },
];

async function seed() {
  try {
    const client = await clientPromise;
    const db = client.db('eco_db');
    const collection = db.collection('products');
    // Clear existing
    await collection.deleteMany({});
    // Insert new
    const result = await collection.insertMany(PRODUCTS);
    console.log(`${result.insertedCount} products seeded`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
