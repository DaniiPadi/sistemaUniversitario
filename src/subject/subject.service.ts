import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const [career, cycle] = await Promise.all([
      this.prisma.career.findUnique({ where: { id: createSubjectDto.careerId } }),
      this.prisma.cycle.findUnique({ where: { id: createSubjectDto.cycleId } }),
    ]);

    if (!career) {
      throw new BadRequestException(`Career with ID ${createSubjectDto.careerId} not found`);
    }

    if (!cycle) {
      throw new BadRequestException(`Cycle with ID ${createSubjectDto.cycleId} not found`);
    }

    return this.prisma.subject.create({
      data: createSubjectDto,
      include: {
        career: true,
        cycle: true,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.subject.findMany({
        skip,
        take: limit,
        include: {
          career: true,
          cycle: true,
        },
      }),
      this.prisma.subject.count(),
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
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        career: true,
        cycle: true,
        teachers: {
          include: {
            teacher: true,
          },
        },
        students: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }
}