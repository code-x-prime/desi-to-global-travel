import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env file
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
    console.warn('Warning: Could not load .env file. Using existing environment variables.')
}

const { Pool } = pg

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Create adapter
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
})

async function main() {
    console.log('🌱 Starting seed...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.packageImage.deleteMany()
    await prisma.tourPackage.deleteMany()
    await prisma.destination.deleteMany()
    await prisma.category.deleteMany()
    await prisma.galleryImage.deleteMany()
    await prisma.inquiry.deleteMany()

    // Create Categories
    console.log('📁 Creating categories...')
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Adventure Tours',
                slug: 'adventure-tours',
                description: 'Thrilling adventure tours for adrenaline seekers',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Beach Holidays',
                slug: 'beach-holidays',
                description: 'Relaxing beach destinations and coastal getaways',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Cultural Tours',
                slug: 'cultural-tours',
                description: 'Immerse yourself in rich cultural experiences',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Hill Stations',
                slug: 'hill-stations',
                description: 'Scenic mountain retreats and hill station tours',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Wildlife Safaris',
                slug: 'wildlife-safaris',
                description: 'Wildlife encounters and jungle safaris',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Pilgrimage Tours',
                slug: 'pilgrimage-tours',
                description: 'Spiritual journeys to sacred destinations',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Luxury Travel',
                slug: 'luxury-travel',
                description: 'Premium luxury travel experiences',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Family Holidays',
                slug: 'family-holidays',
                description: 'Perfect family-friendly vacation packages',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'Honeymoon Packages',
                slug: 'honeymoon-packages',
                description: 'Romantic getaways for couples',
                isActive: true,
            },
        }),
        prisma.category.create({
            data: {
                name: 'International Tours',
                slug: 'international-tours',
                description: 'Explore destinations around the world',
                isActive: true,
            },
        }),
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // Create Destinations
    console.log('🌍 Creating destinations...')
    const destinations = await Promise.all([
        prisma.destination.create({
            data: {
                name: 'Goa',
                slug: 'goa',
                description: 'Famous for its beautiful beaches, vibrant nightlife, and Portuguese heritage. A perfect blend of relaxation and adventure.',
                country: 'India',
                region: 'West India',
                imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
                isActive: true,
                categoryId: categories[1].id, // Beach Holidays
            },
        }),
        prisma.destination.create({
            data: {
                name: 'Manali',
                slug: 'manali',
                description: 'A picturesque hill station in the Himalayas, known for snow-capped mountains, adventure sports, and serene landscapes.',
                country: 'India',
                region: 'North India',
                imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
                isActive: true,
                categoryId: categories[3].id, // Hill Stations
            },
        }),
        prisma.destination.create({
            data: {
                name: 'Kerala',
                slug: 'kerala',
                description: 'God\'s Own Country - famous for backwaters, tea plantations, and rich cultural heritage.',
                country: 'India',
                region: 'South India',
                imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
                isActive: true,
                categoryId: categories[2].id, // Cultural Tours
            },
        }),
        prisma.destination.create({
            data: {
                name: 'Rishikesh',
                slug: 'rishikesh',
                description: 'The Yoga Capital of the World, offering spiritual experiences, adventure sports, and scenic beauty along the Ganges.',
                country: 'India',
                region: 'North India',
                imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
                isActive: true,
                categoryId: categories[0].id, // Adventure Tours
            },
        }),
        prisma.destination.create({
            data: {
                name: 'Rajasthan',
                slug: 'rajasthan',
                description: 'The Land of Kings - experience royal palaces, desert safaris, and vibrant culture.',
                country: 'India',
                region: 'North India',
                imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
                isActive: true,
                categoryId: categories[2].id, // Cultural Tours
            },
        }),
        prisma.destination.create({
            data: {
                name: 'Dubai',
                slug: 'dubai',
                description: 'A modern metropolis in the desert, known for luxury shopping, ultramodern architecture, and vibrant nightlife.',
                country: 'UAE',
                region: 'Middle East',
                imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
                isActive: true,
                categoryId: categories[6].id, // Luxury Travel
            },
        }),
    ])

    console.log(`✅ Created ${destinations.length} destinations`)

    // Create Tour Packages
    console.log('📦 Creating tour packages...')
    const packages = await Promise.all([
        prisma.tourPackage.create({
            data: {
                name: 'Goa Beach Paradise - 5 Days',
                slug: 'goa-beach-paradise-5-days',
                duration: '5 Days / 4 Nights',
                description: '<p>Experience the ultimate beach vacation in Goa! Enjoy pristine beaches, water sports, vibrant nightlife, and delicious seafood. This package includes visits to popular beaches like Calangute, Baga, and Anjuna, along with water sports activities and a sunset cruise.</p>',
                price: '₹25,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Visit famous beaches: Calangute, Baga, Anjuna',
                    'Water sports activities (parasailing, jet skiing)',
                    'Sunset cruise on the Arabian Sea',
                    'Explore Portuguese heritage sites',
                    'Enjoy Goan cuisine and nightlife',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Goa, transfer to hotel. Evening visit to Calangute Beach and enjoy the sunset.</p>',
                    'Day 2': '<p>Full day beach hopping - Baga, Anjuna, and Vagator beaches. Water sports activities included.</p>',
                    'Day 3': '<p>Visit Old Goa churches and Portuguese heritage sites. Evening cruise on the Mandovi River.</p>',
                    'Day 4': '<p>Free day for shopping, spa, or optional activities. Evening at beach shacks.</p>',
                    'Day 5': '<p>Checkout and departure with beautiful memories.</p>',
                },
                isActive: true,
                categoryId: categories[1].id, // Beach Holidays
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
                            alt: 'Goa Beach',
                            isPrimary: true,
                            order: 0,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                            alt: 'Goa Sunset',
                            isPrimary: false,
                            order: 1,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
                            alt: 'Goa Beach Activities',
                            isPrimary: false,
                            order: 2,
                        },
                    ],
                },
            },
        }),
        prisma.tourPackage.create({
            data: {
                name: 'Manali Adventure Escape - 6 Days',
                slug: 'manali-adventure-escape-6-days',
                duration: '6 Days / 5 Nights',
                description: '<p>Thrilling adventure in the Himalayas! Experience paragliding, river rafting, trekking, and snow activities in Manali. Perfect for adventure enthusiasts seeking an adrenaline rush in the mountains.</p>',
                price: '₹35,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Paragliding in Solang Valley',
                    'River rafting in Beas River',
                    'Trekking to Jogini Falls',
                    'Visit Rohtang Pass (seasonal)',
                    'Snow activities and mountain views',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Manali, transfer to hotel. Evening explore Mall Road and local markets.</p>',
                    'Day 2': '<p>Full day adventure - Paragliding in Solang Valley and river rafting in Beas River.</p>',
                    'Day 3': '<p>Trek to Jogini Falls and visit Hadimba Temple. Evening at leisure.</p>',
                    'Day 4': '<p>Excursion to Rohtang Pass (subject to weather) for snow activities and mountain views.</p>',
                    'Day 5': '<p>Visit Vashisht Hot Springs and explore Old Manali. Optional activities available.</p>',
                    'Day 6': '<p>Checkout and departure with unforgettable memories.</p>',
                },
                isActive: true,
                categoryId: categories[0].id, // Adventure Tours
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
                            alt: 'Manali Mountains',
                            isPrimary: true,
                            order: 0,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
                            alt: 'Manali Adventure',
                            isPrimary: false,
                            order: 1,
                        },
                    ],
                },
            },
        }),
        prisma.tourPackage.create({
            data: {
                name: 'Kerala Backwaters & Culture - 7 Days',
                slug: 'kerala-backwaters-culture-7-days',
                duration: '7 Days / 6 Nights',
                description: '<p>Discover the beauty of Kerala with houseboat stays, tea plantations, and cultural experiences. Experience the serene backwaters, visit spice plantations, and enjoy traditional Kathakali performances.</p>',
                price: '₹40,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Houseboat stay in Alleppey backwaters',
                    'Visit Munnar tea plantations',
                    'Spice plantation tour',
                    'Kathakali dance performance',
                    'Ayurvedic spa experience',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Cochin, transfer to hotel. Evening visit to Fort Kochi and Chinese fishing nets.</p>',
                    'Day 2': '<p>Drive to Munnar through tea plantations. Visit tea gardens and spice plantations.</p>',
                    'Day 3': '<p>Explore Munnar - visit Mattupetty Dam, Echo Point, and enjoy mountain views.</p>',
                    'Day 4': '<p>Drive to Alleppey. Evening houseboat check-in for overnight stay in backwaters.</p>',
                    'Day 5': '<p>Houseboat cruise and checkout. Drive to Kumarakom. Evening Kathakali performance.</p>',
                    'Day 6': '<p>Ayurvedic spa session and local sightseeing. Evening at leisure.</p>',
                    'Day 7': '<p>Checkout and departure with peaceful memories.</p>',
                },
                isActive: true,
                categoryId: categories[2].id, // Cultural Tours
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
                            alt: 'Kerala Backwaters',
                            isPrimary: true,
                            order: 0,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
                            alt: 'Kerala Tea Plantations',
                            isPrimary: false,
                            order: 1,
                        },
                    ],
                },
            },
        }),
        prisma.tourPackage.create({
            data: {
                name: 'Rishikesh Yoga & Adventure - 4 Days',
                slug: 'rishikesh-yoga-adventure-4-days',
                duration: '4 Days / 3 Nights',
                description: '<p>Perfect blend of spirituality and adventure in Rishikesh. Experience yoga sessions, river rafting, and visit to ancient temples along the Ganges.</p>',
                price: '₹18,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Yoga and meditation sessions',
                    'River rafting in Ganges',
                    'Visit Laxman Jhula and Ram Jhula',
                    'Ganga Aarti experience',
                    'Trekking to Neer Garh Waterfall',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Rishikesh, transfer to hotel. Evening Ganga Aarti at Triveni Ghat.</p>',
                    'Day 2': '<p>Morning yoga session. Afternoon river rafting adventure. Visit Laxman Jhula.</p>',
                    'Day 3': '<p>Trek to Neer Garh Waterfall. Visit Beatles Ashram. Evening meditation session.</p>',
                    'Day 4': '<p>Morning yoga session. Checkout and departure with renewed energy.</p>',
                },
                isActive: true,
                categoryId: categories[0].id, // Adventure Tours
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
                            alt: 'Rishikesh Ganges',
                            isPrimary: true,
                            order: 0,
                        },
                    ],
                },
            },
        }),
        prisma.tourPackage.create({
            data: {
                name: 'Rajasthan Royal Experience - 8 Days',
                slug: 'rajasthan-royal-experience-8-days',
                duration: '8 Days / 7 Nights',
                description: '<p>Explore the royal heritage of Rajasthan. Visit majestic palaces, experience desert safaris, and witness the vibrant culture of the Land of Kings.</p>',
                price: '₹55,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Visit Jaipur, Udaipur, and Jodhpur',
                    'Desert safari in Jaisalmer',
                    'Palace tours and heritage walks',
                    'Traditional Rajasthani cuisine',
                    'Cultural performances and folk music',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Jaipur. Visit City Palace and Hawa Mahal. Evening at leisure.</p>',
                    'Day 2': '<p>Visit Amber Fort and Jaigarh Fort. Evening explore local markets.</p>',
                    'Day 3': '<p>Drive to Jodhpur. Visit Mehrangarh Fort and Jaswant Thada.</p>',
                    'Day 4': '<p>Drive to Jaisalmer. Evening desert safari with camel ride and cultural show.</p>',
                    'Day 5': '<p>Visit Jaisalmer Fort and Patwon Ki Haveli. Evening at leisure.</p>',
                    'Day 6': '<p>Drive to Udaipur. Visit City Palace and enjoy boat ride on Lake Pichola.</p>',
                    'Day 7': '<p>Explore Udaipur - Jagdish Temple, Saheliyon Ki Bari. Evening cultural show.</p>',
                    'Day 8': '<p>Checkout and departure with royal memories.</p>',
                },
                isActive: true,
                categoryId: categories[2].id, // Cultural Tours
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
                            alt: 'Rajasthan Palace',
                            isPrimary: true,
                            order: 0,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
                            alt: 'Rajasthan Desert',
                            isPrimary: false,
                            order: 1,
                        },
                    ],
                },
            },
        }),
        prisma.tourPackage.create({
            data: {
                name: 'Dubai Luxury Getaway - 5 Days',
                slug: 'dubai-luxury-getaway-5-days',
                duration: '5 Days / 4 Nights',
                description: '<p>Experience the luxury and opulence of Dubai. Visit iconic landmarks, enjoy world-class shopping, and indulge in fine dining experiences.</p>',
                price: '₹85,000 per person',
                whatsappNumber: '+919876543210',
                highlights: [
                    'Visit Burj Khalifa and Dubai Mall',
                    'Desert safari with BBQ dinner',
                    'Palm Jumeirah and Atlantis',
                    'Dubai Marina cruise',
                    'Gold Souk and Spice Souk',
                ],
                itinerary: {
                    'Day 1': '<p>Arrival in Dubai, transfer to hotel. Evening visit to Dubai Marina and JBR Beach.</p>',
                    'Day 2': '<p>Visit Burj Khalifa (124th floor) and explore Dubai Mall. Evening fountain show.</p>',
                    'Day 3': '<p>Desert safari with dune bashing, camel ride, and BBQ dinner with cultural show.</p>',
                    'Day 4': '<p>Visit Palm Jumeirah, Atlantis, and Dubai Marina cruise. Evening at leisure.</p>',
                    'Day 5': '<p>Visit Gold Souk and Spice Souk. Checkout and departure.</p>',
                },
                isActive: true,
                categoryId: categories[6].id, // Luxury Travel
                images: {
                    create: [
                        {
                            url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
                            alt: 'Dubai Skyline',
                            isPrimary: true,
                            order: 0,
                        },
                        {
                            url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                            alt: 'Dubai Burj Khalifa',
                            isPrimary: false,
                            order: 1,
                        },
                    ],
                },
            },
        }),
    ])

    console.log(`✅ Created ${packages.length} tour packages`)

    console.log('🎉 Seed completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - ${categories.length} Categories`)
    console.log(`   - ${destinations.length} Destinations`)
    console.log(`   - ${packages.length} Tour Packages`)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end()
    })

