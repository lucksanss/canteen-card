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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        include: {
          user: true,
          card: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count(),
    ])

    return NextResponse.json({
      students,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, rollNumber } = body

    const student = await prisma.student.create({
      data: {
        userId,
        rollNumber,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Roll number already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    )
  }
}
