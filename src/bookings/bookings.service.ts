import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // POST /api/bookings
  async create(userId: number, dto: CreateBookingDto) {
    const villa = await this.prisma.villa.findUnique({
      where: { id: dto.villa_id },
    });
    if (!villa) throw new NotFoundException('Villa tidak ditemukan');

    const checkIn = new Date(dto.check_in);
    const checkOut = new Date(dto.check_out);

    // Validasi logika tanggal
    if (checkIn >= checkOut)
      throw new BadRequestException('check_out harus setelah check_in');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkIn < today)
      throw new BadRequestException('check_in tidak boleh tanggal yang sudah lewat');

    // Validasi kapasitas
    if (dto.guest_count > villa.capacity)
      throw new BadRequestException(
        `Villa hanya muat ${villa.capacity} tamu. Kamu request ${dto.guest_count}`,
      );

    // ✅ Cek ketersediaan — tidak boleh double booking tanggal sama
    const conflict = await this.prisma.booking.findFirst({
      where: {
        villaId: dto.villa_id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });
    if (conflict)
      throw new ConflictException(
        'Villa tidak tersedia untuk tanggal yang dipilih. Silakan pilih tanggal lain.',
      );

    // Hitung total harga
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalPrice = villa.price * nights;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        villaId: dto.villa_id,
        checkIn,
        checkOut,
        guestCount: dto.guest_count,
        totalPrice,
        status: 'PENDING',
      },
      include: { villa: { include: { images: { take: 1 } } } },
    });

    return {
      message: 'Booking berhasil dibuat',
      data: {
        id: booking.id,
        villa_id: booking.villaId,
        villa_name: booking.villa.name,
        villa_location: booking.villa.location,
        image_url: booking.villa.images[0]?.imageUrl ?? null,
        check_in: booking.checkIn,
        check_out: booking.checkOut,
        guest_count: booking.guestCount,
        nights,
        price_per_night: villa.price,
        total_price: booking.totalPrice,
        status: booking.status,
        created_at: booking.createdAt,
      },
    };
  }

  // GET /api/bookings/history
  async findHistory(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { villa: { include: { images: { take: 1 } } } },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => {
      const nights = Math.ceil(
        (b.checkOut.getTime() - b.checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        id: b.id,
        villa_id: b.villaId,
        villa_name: b.villa.name,
        villa_location: b.villa.location,
        image_url: b.villa.images[0]?.imageUrl ?? null,
        check_in: b.checkIn,
        check_out: b.checkOut,
        guest_count: b.guestCount,
        nights,
        total_price: b.totalPrice,
        status: b.status,
        created_at: b.createdAt,
      };
    });
  }
}
