import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Injectable()
export class SpecialtyService {
  constructor(private prisma: PrismaService) {}

  create(createSpecialtyDto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({
      data: createSpecialtyDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.specialty.findMany({
        skip,
        take: limit,
        include: {
          careers: true,
        },
      }),
      this.prisma.specialty.count(),
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
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
      include: {
        careers: true,
      },
    });

    if (!specialty) {
      throw new NotFoundException(`Specialty with ID ${id} not found`);
    }

    return specialty;
  }
}