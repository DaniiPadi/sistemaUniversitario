import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

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

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id);
    
    if (updateSubjectDto.careerId) {
      const career = await this.prisma.career.findUnique({
        where: { id: updateSubjectDto.careerId },
      });

      if (!career) {
        throw new BadRequestException(`Career with ID ${updateSubjectDto.careerId} not found`);
      }
    }

    if (updateSubjectDto.cycleId) {
      const cycle = await this.prisma.cycle.findUnique({
        where: { id: updateSubjectDto.cycleId },
      });

      if (!cycle) {
        throw new BadRequestException(`Cycle with ID ${updateSubjectDto.cycleId} not found`);
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
      include: {
        career: true,
        cycle: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.subject.delete({
      where: { id },
    });
  }
}