import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { DMMFClass } from '@prisma/client/runtime';
import { PrismaClient } from '@prisma/client'

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const DEFAULT_ADMIN = {
	email: 'alexsdraig@gmail.com',
	password: 'password',
  }
  
  const authenticate = async (email: string, password: string) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
	  return Promise.resolve(DEFAULT_ADMIN)
	}
	return null
  }

AdminJS.registerAdapter({ Database, Resource });

@Module({
	imports: [
		AdminModule.createAdminAsync({
			useFactory: () => {

				const prisma = new PrismaClient()

				const dmmf = (prisma as any)._baseDmmf as DMMFClass;

				return {
					adminJsOptions: {
						rootPath: '/admin',
						resources: [
							{
								resource: { model: dmmf.modelMap['User'], client: prisma },
								options: {},
							},
							{
								resource: { model: dmmf.modelMap['NewsCategories'], client: prisma },
								options: {},
							},
							{
								resource: { model: dmmf.modelMap['News'], client: prisma },
								options: {},
							},
							{
								resource: { model: dmmf.modelMap['Comment'], client: prisma },
								options: {},
							},
						],
					},
					auth: {
						authenticate,
						cookieName: 'adminjs',
						cookiePassword: 'secret'
					},
					sessionOptions: {
						resave: true,
						saveUninitialized: true,
						secret: 'secret'
					},
				}
			},
		}),
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