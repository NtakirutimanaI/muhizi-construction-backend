import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from './modules/auth/decorators/public.decorator';
import type { Response } from 'express';

@Controller()
export class AppController {
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
  @Get('favicon.ico')
  @ApiExcludeEndpoint()
  favicon(@Res() res: Response) {
    return res.status(204).end();
  }
}
