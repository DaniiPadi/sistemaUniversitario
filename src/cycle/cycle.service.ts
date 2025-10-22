import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  create(createCycleDto: CreateCycleDto) {
    return this.prisma.cycle.create({
      data: createCycleDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.cycle.findMany({
        skip,
        take: limit,
        include: {
          subjects: true,
        },
      }),
      this.prisma.cycle.count(),
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
    const cycle = await this.prisma.cycle.findUnique({
      where: { id },
      include: {
        subjects: true,
      },
    });

    if (!cycle) {
      throw new NotFoundException(`Cycle with ID ${id} not found`);
    }

    return cycle;
  }

  async update(id: number, updateCycleDto: UpdateCycleDto) {
    await this.findOne(id);
    
    return this.prisma.cycle.update({
      where: { id },
      data: updateCycleDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.cycle.delete({
      where: { id },
    });
  }
}