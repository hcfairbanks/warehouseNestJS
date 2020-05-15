import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { User } from '../auth/user.entity';

import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
    const { email } = signInCredentialsDto;
    const user = await this.userRepository.validateUserPassword(signInCredentialsDto);
    if (!user.username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // TODO allow for sign up to have role.
    const role = 'admin';
    const payload: JwtPayload = { username: user.username, email, role, id: user.id};
    const accessToken = await this.jwtService.sign(payload);
    // this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);
    return { accessToken };
  }

  async getUsers(
    filterDto: GetUsersFilterDto,
    user: User,
  ): Promise<object> {
    return this.userRepository.getUsers(filterDto, user);
  }
}
