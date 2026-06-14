import { Controller, Get } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  // GET /api/onboarding
  @Get()
  findAll() {
    return this.onboardingService.findAll();
  }
}
