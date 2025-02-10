import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ConfigService {
  get(name: string): string | undefined {
    return process.env[name];
  }
}
