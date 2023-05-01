import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { PrismaService } from 'prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(cookieParser());
  app.enableCors({credentials: true, origin: 'http://localhost:3000'});
  app.setGlobalPrefix('/api');

  await app.listen(5000);
}
bootstrap();
