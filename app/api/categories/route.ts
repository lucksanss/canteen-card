import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count(),
    ])

    return NextResponse.json({
      categories,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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

    const category = await prisma.category.create({
      data: body,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
