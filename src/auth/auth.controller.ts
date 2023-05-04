import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { authRoutes } from './auth.routes';
import { signInDto } from './dto/sign-in.dto';

@Controller('/auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Post(authRoutes.createToken)
	createToken(@Body() signInDto: signInDto, @Res({ passthrough: true }) response: Response): Promise<{access_token: string, refresh_token: string} | Error>{
		return this.AuthService.createTokens(signInDto, response);
	}

}
