import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, description, price, image, category, stock } = req.body

    // Validate required fields
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock) || 0,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    console.error('Error adding product:', error)
    res.status(500).json({ error: 'Error adding product' })
  }
} 