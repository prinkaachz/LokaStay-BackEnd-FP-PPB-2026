import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ✅ FIX: @Injectable() wajib ada agar NestJS DI bisa inject dependencies
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
