import { PrismaClient, Role, CardStatus, TransactionType } from "@prisma/client"
import bcrypt from "bcryptjs"
import QRCode from "qrcode"

const prisma = new PrismaClient()

async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text)
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

async function main() {
  console.log("🌱 Starting database seed...")

  // Clean existing data
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.rechargeHistory.deleteMany()
  await prisma.studentCard.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.student.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.create({
    data: {
      email: "admin@canteen.com",
      password: adminPassword,
      name: "Admin User",
      role: Role.ADMIN,
      phone: "+91-9876543210",
    },
  })
  console.log("✅ Admin created:", admin.email)

  // Create employee users
  const employeePassword = await bcrypt.hash("emp123", 10)
  const employees = []
  for (let i = 1; i <= 3; i++) {
    const empUser = await prisma.user.create({
      data: {
        email: `employee${i}@canteen.com`,
        password: employeePassword,
        name: `Employee ${i}`,
        role: Role.EMPLOYEE,
        phone: `+91-9876543${i}0${i}`,
      },
    })

    const emp = await prisma.employee.create({
      data: {
        userId: empUser.id,
        employeeId: `EMP${String(i).padStart(3, "0")}`,
        department: "Canteen",
      },
    })
    employees.push(emp)
  }
  console.log("✅ Employees created:", employees.length)

  // Create student users and cards
  const studentPassword = await bcrypt.hash("student123", 10)
  const students = []
  for (let i = 1; i <= 10; i++) {
    const studentUser = await prisma.user.create({
      data: {
        email: `student${i}@hostel.com`,
        password: studentPassword,
        name: `Student ${i}`,
        role: Role.STUDENT,
        phone: `+91-987654${String(i).padStart(4, "0")}`,
      },
    })

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        rollNumber: `STU${String(i).padStart(4, "0")}`,
        balance: 5000 + i * 500,
      },
    })

    const cardNumber = `CC${Date.now()}${String(i).padStart(3, "0")}`
    const qrCode = await generateQRCode(cardNumber)

    const card = await prisma.studentCard.create({
      data: {
        cardNumber,
        studentId: student.id,
        qrCode,
        status: CardStatus.ACTIVE,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })
    students.push(student)
  }
  console.log("✅ Students and cards created:", students.length)

  // Create categories
  const categories = [
    { name: "Breakfast", icon: "🍳", color: "#FF9500" },
    { name: "Lunch", icon: "🍛", color: "#34C759" },
    { name: "Dinner", icon: "🍲", color: "#FF3B30" },
    { name: "Snacks", icon: "🍿", color: "#FFD60A" },
    { name: "Beverages", icon: "☕", color: "#5AC8FA" },
    { name: "Desserts", icon: "🍰", color: "#FF2D55" },
  ]

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.create({
        data: cat,
      })
    )
  )
  console.log("✅ Categories created:", createdCategories.length)

  // Create products
  const products = [
    // Breakfast
    {
      name: "Idli",
      description: "Steamed rice cakes",
      price: 40,
      categoryId: createdCategories[0].id,
      stock: 50,
    },
    {
      name: "Dosa",
      description: "Crispy rice pancake",
      price: 60,
      categoryId: createdCategories[0].id,
      stock: 45,
    },
    {
      name: "Upma",
      description: "Savory semolina dish",
      price: 35,
      categoryId: createdCategories[0].id,
      stock: 40,
    },
    // Lunch
    {
      name: "Biryani",
      description: "Fragrant rice dish",
      price: 120,
      categoryId: createdCategories[1].id,
      stock: 30,
    },
    {
      name: "Curry Rice",
      description: "Rice with vegetable curry",
      price: 80,
      categoryId: createdCategories[1].id,
      stock: 50,
    },
    {
      name: "Chole Bhature",
      description: "Chickpea curry with bread",
      price: 70,
      categoryId: createdCategories[1].id,
      stock: 35,
    },
    // Dinner
    {
      name: "Dal Rice",
      description: "Rice with lentil soup",
      price: 60,
      categoryId: createdCategories[2].id,
      stock: 60,
    },
    {
      name: "Roti Sabzi",
      description: "Bread with vegetable",
      price: 50,
      categoryId: createdCategories[2].id,
      stock: 55,
    },
    // Snacks
    {
      name: "Samosa",
      description: "Crispy pastry",
      price: 20,
      categoryId: createdCategories[3].id,
      stock: 100,
    },
    {
      name: "Pakora",
      description: "Fried vegetable fritters",
      price: 25,
      categoryId: createdCategories[3].id,
      stock: 80,
    },
    {
      name: "Biscuits",
      description: "Crispy biscuits",
      price: 10,
      categoryId: createdCategories[3].id,
      stock: 200,
    },
    // Beverages
    {
      name: "Coffee",
      description: "Hot coffee",
      price: 30,
      categoryId: createdCategories[4].id,
      stock: 80,
    },
    {
      name: "Tea",
      description: "Hot tea",
      price: 20,
      categoryId: createdCategories[4].id,
      stock: 100,
    },
    {
      name: "Milk Shake",
      description: "Chilled milk shake",
      price: 50,
      categoryId: createdCategories[4].id,
      stock: 60,
    },
    // Desserts
    {
      name: "Gulab Jamun",
      description: "Sweet milk solids",
      price: 40,
      categoryId: createdCategories[5].id,
      stock: 40,
    },
    {
      name: "Kheer",
      description: "Rice pudding",
      price: 45,
      categoryId: createdCategories[5].id,
      stock: 35,
    },
  ]

  const createdProducts = await Promise.all(
    products.map((prod) =>
      prisma.product.create({
        data: prod,
      })
    )
  )
  console.log("✅ Products created:", createdProducts.length)

  // Create sample transactions
  const transaction = await prisma.transaction.create({
    data: {
      studentId: students[0].id,
      employeeId: employees[0].id,
      transactionType: TransactionType.DEBIT,
      amount: 150,
      balanceBefore: 5500,
      balanceAfter: 5350,
    },
  })

  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: transaction.id,
        productId: createdProducts[0].id,
        quantity: 2,
        unitPrice: 60,
        totalPrice: 120,
      },
      {
        transactionId: transaction.id,
        productId: createdProducts[12].id,
        quantity: 1,
        unitPrice: 30,
        totalPrice: 30,
      },
    ],
  })

  console.log("✅ Sample transactions created")

  // Create sample recharge
  await prisma.rechargeHistory.create({
    data: {
      studentId: students[1].id,
      amount: 1000,
      previousBalance: 5500,
      newBalance: 6500,
      method: "CASH",
    },
  })

  console.log("✅ Sample recharge created")
  console.log("\n✨ Database seed completed successfully!")
  console.log("\n📝 Test Credentials:")
  console.log("Admin: admin@canteen.com / admin123")
  console.log("Employee: employee1@canteen.com / emp123")
  console.log("Student: student1@hostel.com / student123")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
