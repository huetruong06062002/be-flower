import { JwtModule } from '@nestjs/jwt';

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schema/user.schema';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    RolesModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({

      inject: [ConfigService],
      useFactory:  (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_EXPIRES')
          },
        }
      },
    }),
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
  
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
