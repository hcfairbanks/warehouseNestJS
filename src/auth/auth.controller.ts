import { Controller, Post, Get, Query, Body, ValidationPipe, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('/signup')
  @UseGuards(AuthGuard())
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInCredentialsDto);
  }

  @Get('/users')
  @UseGuards(AuthGuard())
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    @GetUser() user: User,
  ): Promise<object> {
    return this.authService.getUsers(filterDto, user);
  }

}
