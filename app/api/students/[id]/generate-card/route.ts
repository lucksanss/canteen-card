import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { generateQRCodeDataURL } from "@/lib/qr"
import { CardStatus } from "@prisma/client"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if student already has a card
    const existingCard = await prisma.studentCard.findUnique({
      where: { studentId: params.id },
    })

    if (existingCard) {
      return NextResponse.json(
        { error: "Student already has a card" },
        { status: 400 }
      )
    }

    const cardNumber = `CC${Date.now()}${Math.random().toString(36).substring(2, 8)}`.toUpperCase()
    const qrCode = await generateQRCodeDataURL(cardNumber)

    const card = await prisma.studentCard.create({
      data: {
        cardNumber,
        studentId: params.id,
        qrCode,
        status: CardStatus.ACTIVE,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate card" },
      { status: 500 }
    )
  }
}
