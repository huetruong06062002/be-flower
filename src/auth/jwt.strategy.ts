import { ExtractJwt } from 'passport-jwt';

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { RolesService } from "src/roles/roles.service";
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private configService: ConfigService,
    private roleService: RolesService,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const {_id} = payload;

    const user = await this.userModel
    .findOne({ _id })
    .populate('roleId', 'name') // Populate để lấy role name
    .exec();

    if(!user){
      throw new UnauthorizedException("Bạn chưa login");
    }

    return user

  }
}