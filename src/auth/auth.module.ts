import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTSecretKey,
      signOptions: { expiresIn: '360s' },
    }),
    HttpModule
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, SmsService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}