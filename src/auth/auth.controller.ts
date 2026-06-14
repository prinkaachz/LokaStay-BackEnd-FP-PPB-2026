import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // POST /api/auth/login → 200 (bukan 201 default POST)
  @Post('login')
  @HttpCode(HttpStatus.OK) // ✅ FIX: login harus 200 bukan 201
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
