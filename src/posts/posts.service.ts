import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { Post } from '@prisma/client';

import { PrismaService } from 'prisma/prisma.service';
import { createPostDto } from './dto/create-post.dto';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class PostsService {

    constructor(private prisma: PrismaService, private filesService: FilesService) {}

	async createPost(createPostDto: createPostDto, image: any): Promise<Post | null>{

		const uploadImage = await this.filesService.createFile(image);

		if (!uploadImage){
			throw new BadRequestException("Error!");
		}

        try {
			const post = this.prisma.post.create({
				data: {
                    slug: createPostDto.slug,
                    title: createPostDto.title,
                    description: createPostDto.description,
                    image: uploadImage,
                    short_description: createPostDto.short_description
				}
			});

			return post;
		}
		catch (error) {
			throw new BadRequestException("Error!", error);
		}
    }

	async getPost(id: string): Promise<Post | null>{
		try {
			const post = await this.prisma.post.findUnique({
				where: {
					slug: id
				}
			})

			if (!post){
				throw new BadRequestException("Error!", "Post not found!");
			}
			console.log(post);

			return post;
		}
		catch (error) {
			throw new BadRequestException("Error!", error);
		}
	}
}