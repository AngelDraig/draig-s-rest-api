import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { usersRoutes } from './users.routes';
import { userCreateDto } from './dto/user-create.dto';



@Controller('/users')
export class UsersController {
	constructor(private readonly UsersService: UsersService) {}

	@Post(usersRoutes.createUsers)
	createUser(@Body() userCreateDto: userCreateDto): Promise<User | null>{
		return this.UsersService.createUser(userCreateDto);
	}

	@Get(usersRoutes.getUsers)
	getUsers(): Promise<User[] | null> {
		return this.UsersService.getUsers();
	}
}
