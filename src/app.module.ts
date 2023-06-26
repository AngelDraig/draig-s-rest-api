import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
import { DMMFClass } from '@prisma/client/runtime';
import { PrismaClient } from '@prisma/client';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as path from 'path';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';

const DEFAULT_ADMIN = {
	email: 'draig',
	password: 'password',
};

const authenticate = async (email: string, password: string) => {
	if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
		return Promise.resolve(DEFAULT_ADMIN);
	}
	return null;
};

AdminJS.registerAdapter({ Database, Resource });

@Module({
	imports: [
		AdminModule.createAdminAsync({
			useFactory: () => {
				const prisma = new PrismaClient();

				const dmmf = (prisma as any)._baseDmmf as DMMFClass;

				return {
					adminJsOptions: {
						rootPath: '/admin',
						locale: {
							language: 'ru',
							localeDetection: true,
							translations: {
								labels: {
									User: 'Пользователи',
									navigation: 'Навигация',
									Post: 'Записи',
									admin: 'Главная',
								},
								buttons: {
									filter: 'Фильтр',
								},
								actions: {
									'new': 'Создать'
								},
							},
						},
						resources: [
							{
								resource: {
									model: dmmf.modelMap['User'],
									client: prisma,
								},
								options: {},
							},
							{
								resource: {
									model: dmmf.modelMap['Post'],
									client: prisma,
								},
								options: {},
							},
							// {
							// 	resource: {
							// 		model: dmmf.modelMap['NewsCategories'],
							// 		client: prisma,
							// 	},
							// 	options: {},
							// },
							// {
							// 	resource: {
							// 		model: dmmf.modelMap['News'],
							// 		client: prisma,
							// 	},
							// 	options: {},
							// },
							// {
							// 	resource: {
							// 		model: dmmf.modelMap['Comment'],
							// 		client: prisma,
							// 	},
							// 	options: {},
							// },
						],
					},
					// auth: {
					// 	authenticate,
					// 	cookieName: 'adminjs',
					// 	cookiePassword: 'secret',
					// },
					// sessionOptions: {
					// 	resave: true,
					// 	saveUninitialized: true,
					// 	secret: 'secret',
					// },
				};
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: path.resolve(__dirname, 'static'),
		}),
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		JwtModule.register({
			global: true,
			secret: process.env.SECRET_KEY,
			signOptions: {
				expiresIn: '7d',
			},
		}),
		UsersModule,
		AuthModule,
		PostsModule
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}	  
	],
})
export class AppModule {}
