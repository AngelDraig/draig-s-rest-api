import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";

import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { userCreateDto } from './dto/user-create.dto';

import { JwtVerifyInt } from 'src/settings/interface';

@Injectable()
export class UsersService {

	constructor(private prisma: PrismaService) {}

	async createUser(userCreateDto: userCreateDto): Promise<User | null>{

		const saltHashPassword = await bcrypt.hash(userCreateDto.password, 12);

		const userCreatedByEmail = await this.prisma.user.findUnique({
			where: {email: userCreateDto.email}
		});

		if (userCreatedByEmail){
			throw new BadRequestException("Bastard!", {description: "This email is already taken!"});
		}

		try {
			const user = this.prisma.user.create({
				data: {
					email: userCreateDto.email,
					password: saltHashPassword,
					first_name: userCreateDto.first_name,
					last_name: userCreateDto.last_name,
				}
			});
			return user;
		}
		catch (error) {
			throw new BadRequestException("Error!");
		}

	}

	async getMe(request: JwtVerifyInt): Promise<User | null>{
		try {
			return this.prisma.user.findUnique({
				where: {
					id: request.user.id
				}
			});
		}
		catch (error) {
			throw new BadRequestException({description: "Error"});
		}
	}
	
	async getUsers(): Promise<User[] | null> {
		return this.prisma.user.findMany();
	}
}
