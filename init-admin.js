const { PrismaClient } = require('../lib/generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('Meto1433', 10)
    const admin = await prisma.admin.upsert({
      where: { username: 'dorji783' },
      update: {},
      create: {
        username: 'dorji783',
        password: hashedPassword,
      },
    })
    console.log('Admin user created:', admin)

    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'This is a test product',
        price: 99.99,
        image: 'https://example.com/test-product.jpg',
        category: 'Test',
        stock: 10,
      },
    })
    console.log('Test product created:', product)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 