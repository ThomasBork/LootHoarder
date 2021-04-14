import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './services/user-service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  public async getHello(): Promise<string> {
    // const randomName = Math.floor(Math.random() * 100000);
    // const userId = await this.userService.createNewUser('Thomas' + randomName, 'PWord', 'email');
    return 'TODO: Serve Angular application here.';
  }
}
