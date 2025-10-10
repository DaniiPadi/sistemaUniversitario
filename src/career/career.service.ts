import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateCareerDto } from './dto/create-career.dto';

@Injectable()
export class CareerService {
  constructor(private prisma: PrismaService) {}

  async create(createCareerDto: CreateCareerDto) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { id: createCareerDto.specialtyId },
    });

    if (!specialty) {
      throw new BadRequestException(
        `Specialty with ID ${createCareerDto.specialtyId} not found`
      );
    }

    return this.prisma.career.create({
      data: createCareerDto,
      include: {
        specialty: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.career.findMany({
        skip,
        take: limit,
        include: {
          specialty: true,
        },
      }),
      this.prisma.career.count(),
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
    const career = await this.prisma.career.findUnique({
      where: { id },
      include: {
        specialty: true,
        students: true,
        subjects: true,
      },
    });

    if (!career) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }

    return career;
  }
}