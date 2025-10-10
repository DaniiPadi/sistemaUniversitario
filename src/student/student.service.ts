import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const career = await this.prisma.career.findUnique({
      where: { id: createStudentDto.careerId },
    });

    if (!career) {
      throw new BadRequestException(`Career with ID ${createStudentDto.careerId} not found`);
    }

    return this.prisma.student.create({
      data: createStudentDto,
      include: {
        career: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        skip,
        take: limit,
        include: {
          career: {
            include: {
              specialty: true,
            },
          },
        },
      }),
      this.prisma.student.count(),
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
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        career: {
          include: {
            specialty: true,
          },
        },
        subjects: {
          include: {
            subject: {
              include: {
                cycle: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }
}