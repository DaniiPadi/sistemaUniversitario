import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.prisma.teacher.create({
      data: createTeacherDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.teacher.findMany({
        skip,
        take: limit,
        include: {
          subjects: {
            include: {
              subject: true,
            },
          },
        },
      }),
      this.prisma.teacher.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            subject: {
              include: {
                career: true,
                cycle: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }
}