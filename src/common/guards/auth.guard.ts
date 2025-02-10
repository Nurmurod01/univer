import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../service/config.service';
import { AdminService } from 'src/admin/admin.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new BadRequestException('Kalit berilmagan');
    }

    try {
      const secret = this.configService.get('JWT_SECRET'); 
      if (!secret) {
        throw new Error(
          'JWT_SECRET is not defined in the environment variables',
        );
      }

      const result = jwt.verify(token, secret) as { username: string };
      console.log(result);

      const user = await this.adminService.findAdminByUsername(result.username);
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }

      request.user = user;
      return true;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Kalit eskirgan yoki noto‘g‘ri');
    }
  }
}
