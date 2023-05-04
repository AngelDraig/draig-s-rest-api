import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthGuard } from 'src/auth/auth.guard';


@Module({
	imports: [],
	controllers: [
		UsersController
	],
	providers: [
		UsersService, 
		PrismaService,
		AuthGuard
	],
})
export class UsersModule {}