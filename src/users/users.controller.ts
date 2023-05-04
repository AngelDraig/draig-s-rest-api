import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { usersRoutes } from './users.routes';
import { AuthGuard } from 'src/auth/auth.guard';
import { userCreateDto } from './dto/user-create.dto';

import { JwtVerifyInt } from 'src/settings/interface';

@Controller('/users')
export class UsersController {
	constructor(private readonly UsersService: UsersService) {}

	@Post(usersRoutes.createUsers)
	createUser(@Body() userCreateDto: userCreateDto): Promise<User | null>{
		return this.UsersService.createUser(userCreateDto);
	}

	@Get(usersRoutes.getUsers)
	@UseGuards(AuthGuard)
	getUsers(): Promise<User[] | null> {
		return this.UsersService.getUsers();
	}

	@Get(usersRoutes.getMe)
	@UseGuards(AuthGuard)
	getMe(@Req() request: JwtVerifyInt): Promise<User | null> {
		return this.UsersService.getMe(request);
	}
}
