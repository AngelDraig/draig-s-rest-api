import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from 'prisma/prisma.service';
import { FilesModule } from 'src/files/files.module';

@Module({
    imports: [
        FilesModule
    ],
	controllers: [
		PostsController
	],
	providers: [
		PostsService,
        PrismaService
	],
})
export class PostsModule {}