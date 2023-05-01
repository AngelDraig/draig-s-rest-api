import { Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from 'prisma/prisma.service';
import { signInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
	constructor(
		private JwtService: JwtService,
		private PrismaService: PrismaService
	) {}

	async createTokens(
		signInDto: signInDto,
		response: Response
	): Promise<{ auth_token: string; refresh_token: string } | Error> {
		const user = await this.PrismaService.user.findUnique({
			where: {
				email: signInDto.email,
			},
			select: {
				email: true,
				password: true,
				id: true,
			},
		});

		const comparePassword = await bcrypt.compare(
			signInDto.password,
			user.password
		);

		if (user && comparePassword) {
			const jti = uuidv4();
			const accessToken = await this.generateAccessToken(user.id);
			const refreshToken = await this.generateRefreshToken(user.id, jti);
			response.cookie('refresh', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'none',
				maxAge: 24 * 60 * 60 * 1000 * 30,
			});
			return {
				auth_token: accessToken,
				refresh_token: refreshToken,
			};
		} else {
			throw new UnauthorizedException('Error!', {
				description: 'Unauthorized!',
			});
		}
	}

	private async generateAccessToken(id: string) {
		const jwtToken = await this.JwtService.sign(
			{ id: id },
			{ expiresIn: process.env.TOKEN_EXPIRES }
		);
		return jwtToken;
	}

	private async generateRefreshToken(id: string, jti: string) {
		const jwtToken = await this.JwtService.sign(
			{ id: id },
			{ expiresIn: process.env.TOKEN_EXPIRES, jwtid: jti }
		);
		return jwtToken;
	}
}
