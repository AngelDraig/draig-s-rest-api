import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private JwtService: JwtService,
	) {}

    canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const auth = request.headers.authorization;
            const header = auth.split(' ')[0];
            const token = auth.split(' ')[1];

            if (header !== "Token" || !token){
                throw new UnauthorizedException({
                    description: 'Unauthorized!'
                });
            }

            const user = this.JwtService.verify(token);
            request.user = user;

            return true;
        }
        catch (error) {
            throw new UnauthorizedException(error, {
                description: 'Unauthorized!'
            });
        }
    }
}