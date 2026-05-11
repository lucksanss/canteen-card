import QRCode from "qrcode"

export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

export async function generateQRCodeCanvas(
  text: string
): Promise<HTMLCanvasElement> {
  try {
    const canvas = document.createElement("canvas")
    await QRCode.toCanvas(canvas, text, {
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return canvas
  } catch (error) {
    console.error("Error generating QR code canvas:", error)
    throw error
  }
}
