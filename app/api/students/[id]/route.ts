import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        card: true,
        transactions: {
          include: {
            items: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        rechargeHistory: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const student = await prisma.student.update({
      where: { id: params.id },
      data: body,
      include: {
        user: true,
        card: true,
      },
    })

    return NextResponse.json(student)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    )
  }
}
