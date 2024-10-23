import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signUp(signupDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

 
}
