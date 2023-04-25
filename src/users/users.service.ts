import { Injectable } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {

	constructor(private prisma: PrismaService) {}
	
	async getUsers(): Promise<User[] | null> {
		return this.prisma.user.findMany();
	}
}
