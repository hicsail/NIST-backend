import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from './user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(publicKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
