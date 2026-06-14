import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Gunakan adapter yg sama dengan PrismaService
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Memulai seeding Loka Stay...\n');

  // ── ONBOARDING ───────────────────────────────────────────
  await prisma.onboarding.deleteMany();
  await prisma.onboarding.createMany({
    data: [
      {
        title: 'Temukan Villa Impian Kamu',
        description: 'Jelajahi ratusan villa premium di seluruh Indonesia dengan harga terbaik dan ulasan terpercaya.',
        imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
        stepOrder: 1,
      },
      {
        title: 'Booking Mudah & Cepat',
        description: 'Pesan villa favoritmu dalam beberapa langkah. Konfirmasi instan tanpa ribet.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        stepOrder: 2,
      },
      {
        title: 'Nikmati Liburanmu',
        description: 'Dapatkan pengalaman menginap tak terlupakan bersama orang-orang tersayang.',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        stepOrder: 3,
      },
    ],
  });
  console.log('✅ Onboarding seeded (3 steps)');

  // ── FACILITIES ────────────────────────────────────────────
  await prisma.villaFacility.deleteMany();
  await prisma.facility.deleteMany();
  const facilitiesData = [
    { name: 'WiFi', icon: 'wifi' },
    { name: 'Kolam Renang', icon: 'pool' },
    { name: 'Parkir Gratis', icon: 'parking' },
    { name: 'Dapur Lengkap', icon: 'kitchen' },
    { name: 'AC', icon: 'air_conditioning' },
    { name: 'Area BBQ', icon: 'bbq' },
    { name: 'Smart TV', icon: 'tv' },
    { name: 'Gym', icon: 'gym' },
  ];
  const facilities: any[] = [];
  for (const f of facilitiesData) {
    facilities.push(await prisma.facility.create({ data: f }));
  }
  console.log(`✅ Facilities seeded (${facilities.length} items)`);

  // ── VILLAS ────────────────────────────────────────────────
  await prisma.villaImage.deleteMany();
  await prisma.villa.deleteMany();

  const villasData = [
    {
      name: 'Villa Bukit Hijau',
      location: 'Ubud, Bali',
      description: 'Villa mewah di perbukitan Ubud dengan pemandangan sawah yang menakjubkan. Dilengkapi kolam renang infinity pribadi dan fasilitas premium.',
      price: 1500000, capacity: 6, rating: 4.9,
      facilityIdx: [0, 1, 2, 3, 4, 5],
      images: [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
        'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800',
      ],
    },
    {
      name: 'Villa Pantai Indah',
      location: 'Seminyak, Bali',
      description: 'Villa tepi pantai eksklusif dengan akses langsung ke pasir putih Seminyak. Ideal untuk bulan madu dan keluarga.',
      price: 2500000, capacity: 8, rating: 4.8,
      facilityIdx: [0, 1, 2, 3, 4, 6],
      images: [
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
      ],
    },
    {
      name: 'Villa Puncak Sejuk',
      location: 'Puncak, Jawa Barat',
      description: 'Villa nyaman di kawasan Puncak dengan udara segar pegunungan dan pemandangan kebun teh hijau. Cocok untuk retreat keluarga.',
      price: 800000, capacity: 10, rating: 4.7,
      facilityIdx: [0, 2, 3, 4, 5, 6],
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      ],
    },
    {
      name: 'Villa Jogja Heritage',
      location: 'Sleman, Yogyakarta',
      description: 'Villa bergaya Jawa klasik dekat Candi Prambanan. Arsitektur tradisional bertemu kenyamanan modern.',
      price: 600000, capacity: 4, rating: 4.6,
      facilityIdx: [0, 2, 3, 4, 6],
      images: [
        'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      ],
    },
    {
      name: 'Villa Lombok Sunset',
      location: 'Senggigi, Lombok',
      description: 'Villa romantis menghadap laut dengan pemandangan matahari terbenam terbaik di Lombok. Dekat Gili Islands.',
      price: 1200000, capacity: 4, rating: 4.8,
      facilityIdx: [0, 1, 2, 3, 4, 5],
      images: [
        'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800',
      ],
    },
    {
      name: 'Villa Tropical Canggu',
      location: 'Canggu, Bali',
      description: 'Villa modern bergaya tropis di kawasan Canggu. Dekat pantai, cafe hits, dan area surfing favorit.',
      price: 1800000, capacity: 6, rating: 4.7,
      facilityIdx: [0, 1, 2, 3, 4, 7],
      images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1602002418082-dd4a3f5b4d01?w=800',
      ],
    },
  ];

  for (const v of villasData) {
    const { facilityIdx, images, ...data } = v;
    const villa = await prisma.villa.create({ data });
    await prisma.villaImage.createMany({
      data: images.map((url) => ({ villaId: villa.id, imageUrl: url })),
    });
    await prisma.villaFacility.createMany({
      data: facilityIdx.map((fi) => ({ villaId: villa.id, facilityId: facilities[fi].id })),
    });
    console.log(`   🏡 ${villa.name} — Rp${villa.price.toLocaleString('id')}/malam`);
  }
  console.log(`✅ Villas seeded (${villasData.length} villas)`);

  // ── DEMO USER ─────────────────────────────────────────────
  await prisma.user.deleteMany({ where: { email: 'demo@lokastay.com' } });
  const hashed = await bcrypt.hash('demo123456', 10);
  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@lokastay.com',
      phoneNumber: '08123456789',
      password: hashed,
    },
  });
  console.log('✅ Demo user seeded');
  console.log('   📧 Email   : demo@lokastay.com');
  console.log('   🔑 Password: demo123456');
  console.log('\n🎉 Seeding selesai! Database siap digunakan.\n');
}

main()
  .catch((e) => { console.error('❌ Seeding error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
