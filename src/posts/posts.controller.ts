import { Controller, Post, Get, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Post as PostItem } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { postsRoutes } from './posts.routes';
import { createPostDto } from './dto/create-post.dto';

@Controller('/posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post(postsRoutes.createPost)
    @UseInterceptors(FileInterceptor("image"))
	createPost(@Body() createPostDto: createPostDto, @UploadedFile() image ): Promise<PostItem | null> {
		return this.postsService.createPost(createPostDto, image);
	}

    @Get(postsRoutes.createPost + ':id')
    getPost(@Param() params: any){
        return this.postsService.getPost(params.id);
    }
}