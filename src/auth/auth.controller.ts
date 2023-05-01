import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { authRoutes } from './auth.routes';
import { signInDto } from './dto/sign-in.dto';

@Controller('/auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}

	@Post(authRoutes.createToken)
	createToken(@Body() signInDto: signInDto, @Res({ passthrough: true }) response: Response): Promise<{auth_token: string, refresh_token: string} | Error>{
		return this.AuthService.createTokens(signInDto, response);
	}

}
