import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '7d'
			},
		}),
		UsersModule,
		AuthModule
	],
	controllers: [],
	providers: [],
})

export class AppModule {}