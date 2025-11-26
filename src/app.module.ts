import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpecialtyModule } from './specialty/specialty.module';
import { CareerModule } from './career/career.module';
import { CycleModule } from './cycle/cycle.module';
import { SubjectModule } from './subject/subject.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prism/prisma.module';
import { TeacherSubjectModule } from './teacher-subject/teacher-subject.module';
import { StudentSubjectModule } from './student-subject/student-subject.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [PrismaModule, SpecialtyModule, CareerModule, CycleModule, SubjectModule, TeacherModule, StudentModule, UserModule, TeacherSubjectModule, StudentSubjectModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
