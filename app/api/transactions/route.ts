import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransactionType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, items } = body

    // Get student and employee info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Calculate total
    let total = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (product) {
        total += product.price * item.quantity
      }
    }

    // Check balance
    if (student.balance < total) {
      return NextResponse.json(
        { error: "Insufficient balance", required: total, balance: student.balance },
        { status: 400 }
      )
    }

    // Create transaction with items
    const transaction = await prisma.transaction.create({
      data: {
        studentId,
        employeeId: session.user?.employeeId || "",
        transactionType: TransactionType.DEBIT,
        amount: total,
        balanceBefore: student.balance,
        balanceAfter: student.balance - total,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        student: true,
        employee: true,
      },
    })

    // Update student balance
    await prisma.student.update({
      where: { id: studentId },
      data: {
        balance: student.balance - total,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    )
  }
}
