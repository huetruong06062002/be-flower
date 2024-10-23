import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from '@nestjs/passport';


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


  @UseGuards(AuthGuard('jwt'))
  @Post('/create-profile')
  async CreateProfile(@Body() profileDto: ProfileDto , @Req() req) {
    return this.authService.createProfile(profileDto,  req.user);
  }
 
}
