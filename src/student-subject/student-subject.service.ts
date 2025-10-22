import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prism/prisma.service';
import { CreateStudentSubjectDto } from './dto/create-student-subject.dto';
import { UpdateStudentSubjectDto } from './dto/update-student-subject.dto';

@Injectable()
export class StudentSubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentSubjectDto: CreateStudentSubjectDto) {
    
    const student = await this.prisma.student.findUnique({
      where: { id: createStudentSubjectDto.studentId },
    });

    if (!student) {
      throw new BadRequestException(`Student with ID ${createStudentSubjectDto.studentId} not found`);
    }

    
    const subject = await this.prisma.subject.findUnique({
      where: { id: createStudentSubjectDto.subjectId },
    });

    if (!subject) {
      throw new BadRequestException(`Subject with ID ${createStudentSubjectDto.subjectId} not found`);
    }

    
    const existingRelation = await this.prisma.studentSubject.findUnique({
      where: {
        studentId_subjectId: {
          studentId: createStudentSubjectDto.studentId,
          subjectId: createStudentSubjectDto.subjectId,
        },
      },
    });

    if (existingRelation) {
      throw new ConflictException('Student is already enrolled in this subject');
    }

    return this.prisma.studentSubject.create({
      data: createStudentSubjectDto,
      include: {
        student: {
          include: {
            career: true,
          },
        },
        subject: {
          include: {
            cycle: true,
            career: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.studentSubject.findMany({
        skip,
        take: limit,
        include: {
          student: {
            include: {
              career: true,
            },
          },
          subject: {
            include: {
              cycle: true,
              career: true,
            },
          },
        },
      }),
      this.prisma.studentSubject.count(),
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
    const studentSubject = await this.prisma.studentSubject.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            career: true,
          },
        },
        subject: {
          include: {
            cycle: true,
            career: true,
          },
        },
      },
    });

    if (!studentSubject) {
      throw new NotFoundException(`StudentSubject with ID ${id} not found`);
    }

    return studentSubject;
  }

  async findByStudent(studentId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.studentSubject.findMany({
        where: { studentId },
        skip,
        take: limit,
        include: {
          subject: {
            include: {
              cycle: true,
              career: true,
            },
          },
        },
      }),
      this.prisma.studentSubject.count({
        where: { studentId },
      }),
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

  async findBySubject(subjectId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.studentSubject.findMany({
        where: { subjectId },
        skip,
        take: limit,
        include: {
          student: {
            include: {
              career: true,
            },
          },
        },
      }),
      this.prisma.studentSubject.count({
        where: { subjectId },
      }),
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

  async update(id: number, updateStudentSubjectDto: UpdateStudentSubjectDto) {
    await this.findOne(id);

    return this.prisma.studentSubject.update({
      where: { id },
      data: updateStudentSubjectDto,
      include: {
        student: {
          include: {
            career: true,
          },
        },
        subject: {
          include: {
            cycle: true,
            career: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.studentSubject.delete({
      where: { id },
    });
  }
}