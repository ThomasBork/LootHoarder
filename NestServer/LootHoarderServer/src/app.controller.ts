import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './services/user-service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}
}
