import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, price, category, image } = req.body;
      console.log('Received product data:', req.body);

      // Validate required fields
      if (!name || !description || !price || !category || !image) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Create product using Prisma
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          category,
          image,
          stock: 0 // Default stock value
        }
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
