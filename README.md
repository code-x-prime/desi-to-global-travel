# Desi To Global Travel

Premium travel website with admin panel for managing tour packages, gallery, and inquiries.

## Features

- 🎨 Premium luxury travel UI with brand colors
- 📱 Fully responsive design
- 🔐 Admin-only authentication
- 📦 Tour Package Management (CRUD)
- 🖼️ Gallery Management with image upload
- 📧 Contact form with email notifications
- 📱 WhatsApp integration
- 🔍 SEO optimized pages

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Image Storage:** Cloudflare R2
- **Email:** Nodemailer + Brevo SMTP

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudflare R2 account (for image storage)
- Brevo account (for email)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd desi-to-global-travel
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory. See `ENV_TEMPLATE.md` for the complete template, or use:

```env
# =============================================
# DATABASE CONFIGURATION
# =============================================
DATABASE_URL="postgresql://postgres:Ritesh123@localhost:5432/trade"

# =============================================
# SESSION SECRET
# =============================================
SESSION_SECRET="your-secret-key-change-in-production"

# =============================================
# JWT TOKENS (Optional - for future use)
# =============================================
ACCESS_JWT_SECRET=ad6481bb145c7899817fe41d
ACCESS_TOKEN_LIFE=7d
REFRESH_TOKEN_SECRET=ecca78ba210aee66a77bc84e0d5fa6864dc
REFRESH_TOKEN_LIFE=30d
ADMIN_JWT_SECRET=ecca78ba210aee66a77bc84e0d5fa68
ADMIN_TOKEN_LIFE=12h

# =============================================
# EMAIL SERVICE (NODEMAILER & Brevo)
# =============================================
FROM_EMAIL="codesho07@gmail.com"
SMTP_HOST="smtp-relay.brevo.com"
SMTP_USER="7a38@smtp-brevo.com"
SMTP_PASSWORD="xsmtpsib-ef7c10
ADMIN_EMAIL="codeshort07@gmail.com"

# =============================================
# CLOUDFLARE R2 STORAGE
# =============================================
R2_ACCOUNT_ID=7aa78f39585a0
R2_ACCESS_KEY_ID=d649a0
R2_SECRET_ACCESS_KEY=a6c7e07546e2e
R2_BUCKET_NAME="trade"
R2_PUBLIC_URL=https://pub-67f953
UPLOAD_FOLDER="ing"

# =============================================
# WHATSAPP CONFIGURATION
# =============================================
NEXT_PUBLIC_WHATSAPP_NUMBER="919650509356"
```

4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Create initial admin user
# You can create a script to do this or use Prisma Studio
npx prisma studio
```

5. Create initial admin user

You'll need to create an admin user in the database. You can do this via Prisma Studio or by creating a script:

```javascript
// scripts/create-admin.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("your-admin-password", 10);

  await prisma.admin.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("Admin user created!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── page.js        # Home page
│   │   ├── about/
│   │   ├── destinations/
│   │   ├── packages/
│   │   ├── gallery/
│   │   └── contact/
│   ├── (admin)/           # Admin panel pages
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── packages/
│   │   ├── gallery/
│   │   └── inquiries/
│   └── api/               # API routes
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── admin/             # Admin components
│   └── contact/           # Contact form
└── lib/                   # Utilities
    ├── prisma.js          # Prisma client
    ├── auth.js            # Authentication
    ├── email.js           # Email service
    └── r2.js              # R2 configuration
```

## Cloudflare R2 Setup

1. Create an R2 bucket in Cloudflare Dashboard
2. Generate API tokens with read/write permissions
3. Set up a custom domain or use the R2.dev URL
4. Update environment variables with your R2 credentials

**Note:** R2 upload is fully implemented using `@aws-sdk/client-s3`. Images are automatically uploaded to the configured R2 bucket and folder.

## Email Setup (Brevo)

1. Sign up for a Brevo account
2. Create an SMTP key in your Brevo dashboard
3. Update the email environment variables
4. Test email sending

## Deployment

### Build for production

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set all environment variables in your production environment.

### Database Migrations

Run migrations in production:

```bash
npx prisma migrate deploy
```

## Brand Colors

- **Dark Blue:** `#0d3980`
- **Light Blue:** `#33baea`
- **Yellow:** `#f9c701`
- **White:** `#ffffff`

## License

Private project - All rights reserved
