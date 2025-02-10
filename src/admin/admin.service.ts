import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from 'src/common/service/config.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private AdminModel: typeof Admin,
    private readonly configService: ConfigService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const admin = await this.AdminModel.create({
      ...createAdminDto,
      password: hashedPassword,
    });
    return admin;
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.findAdminByEmail(email);
    if (admin && (await bcrypt.compare(password, admin.password))) {
      return admin;
    }
    return null;
  }

  async login(admin: Admin) {
    const payload = { username: admin.username, sub: admin.id };
    const secret = this.configService.get('JWT_SECRET'); // ✅ `ConfigService` orqali secretni oldik

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    return {
      access_token: jwt.sign(payload, secret, { expiresIn: '1h' }),
    };
  }

  findAdminByEmail(email: string) {
    return this.AdminModel.findOne({ where: { email } });
  }

  findAdminByUsername(username: string) {
    return this.AdminModel.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.AdminModel.findByPk(id);
  }
  findAll() {
    return this.AdminModel.findAll();
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.findOne(id);
    if (admin) {
      if (updateAdminDto.password) {
        updateAdminDto.password = await bcrypt.hash(
          updateAdminDto.password,
          10,
        );
      }
      await admin.update(updateAdminDto);
      return admin;
    }
    return null;
  }

  async remove(id: number) {
    const admin = await this.findOne(id);
    if (admin) {
      await admin.destroy();
      return admin;
    }
    return null;
  }
}
