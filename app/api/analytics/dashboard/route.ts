import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Dashboard metrics
    const [totalStudents, totalEmployees, totalRevenue, totalTransactions] =
      await Promise.all([
        prisma.student.count(),
        prisma.employee.count(),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: { transactionType: "DEBIT" },
        }),
        prisma.transaction.count(),
      ])

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        student: { include: { user: true } },
        employee: { include: { user: true } },
        items: true,
      },
    })

    // Revenue by category
    const categoryRevenue = await prisma.transactionItem.groupBy({
      by: ["productId"],
      _sum: { totalPrice: true },
    })

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalEmployees,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalTransactions,
      },
      recentTransactions,
      categoryRevenue,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}
