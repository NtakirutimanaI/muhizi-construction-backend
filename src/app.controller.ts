import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';
import type { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './modules/auth/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Public()
  @Get()
  root(@Res() res: Response) {
    return res.json({
      name: 'MUHIZI CONSTRUCTION API',
      version: '1.0',
      status: 'running',
      endpoints: {
        auth: '/auth',
        profile: '/profile',
        projects: '/projects',
        docs: '/api/docs',
      },
    });
  }

  @Public()
  @Post('debug/login')
  @ApiExcludeEndpoint()
  async debugLogin(@Body() body: any, @Res() res: Response) {
    try {
      const bcrypt = require('bcryptjs');
      const user = await this.userRepo.findOne({ where: { email: body.email } });
      if (!user) return res.json({ step: 'findUser', found: false });
      if (!user.password) return res.json({ step: 'passwordCheck', hasPassword: false });
      const valid = await bcrypt.compare(body.password, user.password);
      return res.json({ step: 'compare', valid, userId: user.id, role: user.role });
    } catch (err: any) {
      return res.json({ error: err.message, stack: err.stack?.substring(0, 500) });
    }
  }

  @Public()
  @Get('debug/env')
  @ApiExcludeEndpoint()
  debugEnv(@Res() res: Response) {
    return res.json({
      nodeEnv: process.env.NODE_ENV,
      hasJwt: !!process.env.JWT_SECRET,
      hasDbUrl: !!process.env.DATABASE_URL,
      hasDbHost: !!process.env.DB_HOST,
      vercelRegion: process.env.VERCEL_REGION || 'not-vercel',
    });
  }

  @Public()
  @Get('favicon.ico')
  @ApiExcludeEndpoint()
  favicon(@Res() res: Response) {
    return res.status(204).end();
  }
}
