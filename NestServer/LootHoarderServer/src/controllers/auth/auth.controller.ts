import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { CreateUserInput } from './create-user-input';
import { Login } from './login';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user-service';
import { ContractUserWithAuthToken } from 'src/loot-hoarder-contract/contract-user-with-auth-token';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  public async postLogin(@Body() loginModel: Login): Promise<ContractUserWithAuthToken> {
    const userWithAuthToken = await this.authService.login(loginModel.userName, loginModel.password);
    return userWithAuthToken;
  }

  @Post('createUser')
  public async createUser(@Body() user: CreateUserInput): Promise<{ userId: number }> {
    const userId = await this.userService.createNewUser(user.userName, user.password, user.email);
    return { userId };
  }
}
