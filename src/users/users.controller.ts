import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { usersRoutes } from './users.routes';

@Controller('/api')
export class UsersController {
	constructor(private readonly UsersService: UsersService) {}

	@Get(usersRoutes.getUsers)
	getUsers(): Promise<User[] | null> {
		return this.UsersService.getUsers();
	}
}
