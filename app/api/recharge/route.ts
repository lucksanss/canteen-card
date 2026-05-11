import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { TransactionType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { studentId, amount, method, reference } = body

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const newBalance = student.balance + amount

    // Create recharge record and update balance in transaction
    const recharge = await prisma.rechargeHistory.create({
      data: {
        studentId,
        amount,
        previousBalance: student.balance,
        newBalance,
        method,
        reference,
      },
    })

    // Update student balance
    await prisma.student.update({
      where: { id: studentId },
      data: { balance: newBalance },
    })

    return NextResponse.json(recharge, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process recharge" },
      { status: 500 }
    )
  }
}
