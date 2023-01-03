import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: function (req) {
        var token = null;
        if (req && req.handshake) {
          token = req.handshake.headers.authorization;
        } else {
          token = req.headers.authorization;
        }
        return token.split(' ')[1];
      },
      ignoreExpiration: true,
      secretOrKey: process.env.JWTSecretKey,
      usernameField: 'email',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getUser(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    } else return { userId: payload.sub };
  }
}
