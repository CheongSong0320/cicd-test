import { AuthModule } from '@hanwha-sbi/nestjs-authorization';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Module({
  imports: [
    AuthModule.forKeys({
      admin: readFileSync(resolve(__dirname, '../public.admin.key'), {
        encoding: 'utf-8',
      }),
    }),
  ],
})
export class AdminModule {}
