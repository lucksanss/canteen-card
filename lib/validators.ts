import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})

export const studentSchema = z.object({
  userId: z.string(),
  rollNumber: z.string().min(1, "Roll number is required"),
})

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  isAvailable: z.boolean().default(true),
  image: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
})

export const transactionSchema = z.object({
  studentId: z.string(),
  employeeId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
    })
  ),
})

export const rechargeSchema = z.object({
  studentId: z.string(),
  amount: z.number().min(1, "Amount must be at least 1"),
  method: z.enum(["CASH", "CARD", "TRANSFER"]),
  reference: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type StudentInput = z.infer<typeof studentSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type RechargeInput = z.infer<typeof rechargeSchema>
