import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from 'rxjs';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      //토큰이 유효한지 확인하기 위해서
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
