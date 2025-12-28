import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

// Load environment variables from .env file manually (since dotenv might not be installed)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
    const envPath = join(__dirname, '..', '.env')
    const envFile = readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^=:#]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            const value = match[2].trim().replace(/^["']|["']$/g, '')
            if (!process.env[key]) {
                process.env[key] = value
            }
        }
    })
} catch (error) {
    // .env file not found or can't be read, use existing environment variables
    console.warn('Warning: Could not load .env file. Using existing environment variables.')
}

const { Pool } = pg

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Create adapter
const adapter = new PrismaPg(pool)

// Initialize Prisma Client with adapter
const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
})

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function question(query) {
    return new Promise((resolve) => rl.question(query, resolve))
}

async function main() {
    console.log('=== Create Admin User ===\n')

    // Default credentials
    const defaultEmail = 'test@gmail.com'
    const defaultPassword = 'Test@123'

    const emailInput = await question(`Enter admin email (default: ${defaultEmail}): `)
    const passwordInput = await question(`Enter admin password (default: ${defaultPassword}): `)
    const name = await question('Enter admin name (optional): ')

    const email = emailInput.trim() || defaultEmail
    const password = passwordInput.trim() || defaultPassword

    if (!email || !password) {
        console.error('Email and password are required!')
        process.exit(1)
    }

    try {
        // Check if admin already exists
        const existing = await prisma.admin.findUnique({
            where: { email },
        })

        if (existing) {
            console.error('Admin with this email already exists!')
            process.exit(1)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name: name.trim() || null,
            },
        })

        console.log('\n✅ Admin user created successfully!')
        console.log(`Email: ${admin.email}`)
        console.log(`ID: ${admin.id}`)
    } catch (error) {
        console.error('Error creating admin:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
        rl.close()
    }
}

main()

