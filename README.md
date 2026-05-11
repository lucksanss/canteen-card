# CanteenCard - Smart Hostel Canteen Billing Website

A modern, responsive website for hostel canteen smart-card billing system built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### For Students
- Prepaid smart cards with QR codes
- Balance tracking
- Transaction history
- Card management

### For Employees (POS System)
- Fast, touch-friendly billing interface
- Product search and selection
- Student card scanning via QR code
- Real-time balance updates
- Printable receipts
- Daily sales tracking
- Transaction history

### For Administrators
- Student account management
- Card generation and blocking
- Balance recharge system
- Product & category management
- Employee management
- Revenue analytics
- Detailed transaction logs
- Comprehensive reports

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **QR Code**: qrcode.react, jsqr
- **State Management**: React Hooks
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/lucksanss/canteen-card.git
cd canteen-card
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database URL and other configurations:
```
DATABASE_URL="postgresql://user:password@localhost:5432/canteen_card"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
```

### 4. Setup database
```bash
npm run db:push
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Setup

### Build and run with Docker Compose
```bash
npm run docker:up
```

The application will be available at `http://localhost:3000`.

To stop:
```bash
npm run docker:down
```

## 📚 Project Structure

```
canteen-card/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── admin/               # Admin dashboard
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── employees/
│   │   ├── recharge/
│   │   ├── transactions/
│   │   ├── analytics/
│   │   └── settings/
│   ├── employee/            # Employee POS
│   │   ├── pos/
│   │   ├── checkout/
│   │   ├── sales/
│   │   └── history/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── students/
│   │   ├── products/
│   │   ├── transactions/
│   │   ├── recharge/
│   │   └── analytics/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── shared/              # Shared components
│   ├── admin/               # Admin-specific components
│   ├── employee/            # Employee-specific components
│   ├── forms/               # Form components
│   ├── charts/              # Chart components
│   └── modals/              # Modal components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Database utilities
│   ├── utils.ts             # Utility functions
│   ├── validators.ts        # Zod validators
│   └── qr.ts                # QR code utilities
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── other custom hooks
├── styles/
│   └── globals.css
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
└── public/
    └── assets/
```

## 🔐 Authentication

- Users login with email and password
- NextAuth.js handles session management
- Role-based access control (ADMIN, EMPLOYEE, STUDENT)
- Protected routes based on user role

### Test Credentials

After running the seed script:

- **Admin**: admin@canteen.com / admin123
- **Employee**: employee1@canteen.com / emp123
- **Student**: student1@hostel.com / student123

## 💳 Smart Card System

### Card Generation
- Each student gets a unique card with:
  - Card number
  - QR code (base64 encoded)
  - Expiry date
  - Student information

### QR Code
- Generated using qrcode library
- Encodes card number
- Scannable via web camera
- Stored as base64 for database compatibility

## 🛒 POS (Point of Sale) System

The employee billing interface features:

- **Product Display**: Large, clickable product cards with images
- **Shopping Cart**: Real-time cart with quantity adjustments
- **Student Search**: Fast student lookup and card scanning
- **QR Scanner**: Camera-based QR code scanning
- **Balance Check**: Real-time balance preview
- **Quick Checkout**: Streamlined transaction process
- **Receipt**: Printable transaction receipt
- **Keyboard Shortcuts**: Fast navigation
- **Touch Friendly**: Optimized for touchscreen devices

## 💰 Balance Management

### Deductions
- Automatic balance deduction on transaction
- Negative balance prevention
- Transaction rollback on insufficient balance

### Recharge
- Multiple recharge methods (Cash, Card, Transfer)
- Instant balance updates
- Recharge history tracking
- Transaction reference support

## 📊 Analytics & Reporting

### Admin Dashboard
- Total revenue
- Active users
- Daily transactions
- Top products
- Revenue trends
- Student statistics

### Reports
- Daily sales reports
- Monthly revenue reports
- Student transaction history
- Product popularity
- Employee performance

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Logout

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student
- `PUT /api/students/:id` - Update student

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get transaction

### Recharge
- `POST /api/recharge` - Recharge student balance
- `GET /api/recharge/history/:studentId` - Get recharge history

### Analytics
- `GET /api/analytics/dashboard` - Dashboard analytics
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/products` - Product analytics

## 🎨 UI/UX Features

- **Glassmorphism**: Modern glass effect design
- **Dark Mode**: Built-in dark mode support
- **Animations**: Smooth Framer Motion animations
- **Responsive**: Mobile, tablet, and desktop optimized
- **Skeleton Loaders**: Loading states
- **Toast Notifications**: User feedback
- **Empty States**: Helpful empty state designs
- **Charts**: Interactive Recharts visualizations

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
# Environment variables needed:
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
```

### Docker

```bash
# Build image
npm run docker:build

# Run container
docker run -p 3000:3000 canteen-card
```

### Traditional Hosting

```bash
# Build
npm run build

# Start
npm start
```

## 📝 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npm run db:push

# Open Prisma Studio
npm run db:studio

# Reset database (development only)
npm run db:reset
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📱 Responsive Design

- **Desktop**: Full-featured interface
- **Tablet**: Optimized touch interface
- **Mobile**: Responsive design (Student card viewing)

## 🔒 Security Features

- Password hashing with bcryptjs
- NextAuth.js authentication
- Role-based access control
- CSRF protection
- SQL injection prevention with Prisma
- Environment variable protection
- Secure session management

## 🐛 Known Limitations

- QR code scanning requires HTTPS in production (for camera access)
- Browser QR scanning has better support on modern browsers
- Print receipt feature works best on Chrome and Firefox

## 🔄 Development Workflow

```bash
# Start development
npm run dev

# Database changes
npm run db:push

# Code quality
npm run type-check
npm run lint
npm run format
```

## 📦 Building for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to GitHub
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📞 Support

For issues, questions, or suggestions, please create an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS/Email notifications
- [ ] Loyalty rewards system
- [ ] Integration with hostel management system
- [ ] Advanced analytics and reporting
- [ ] Multiple canteen support
- [ ] Offline mode for POS
- [ ] Biometric authentication

## 🙏 Acknowledgments

- Built with Next.js
- UI components from shadcn/ui
- Inspired by modern SaaS design patterns

---

**Made with ❤️ by lucksanss**
