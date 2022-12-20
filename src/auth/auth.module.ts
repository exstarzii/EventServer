import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Designer, DesignerSchema } from '../schemas/designer.schema';
import { SysRequest, SysRequestSchema } from '../schemas/sysrequest.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Designer.name, schema: DesignerSchema },
      { name: SysRequest.name, schema: SysRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '360s' },
    }),
    HttpModule
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, SmsService],
  exports: [AuthService],
})
export class AuthModule {}