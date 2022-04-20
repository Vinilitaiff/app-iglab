import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { AuthUser, CurrentUser } from '../../auth/current-user';
import { EnrollmentsService } from '../../services/enrollments.service';
import { StudentsService } from '../../services/students.service';
import { Student } from '../models/student';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private enrollmentService: EnrollmentsService,
  ) {}

  @Query(() => [Student])
  @UseGuards(AuthorizationGuard)
  students() {
    return this.studentsService.listAllStudents();
  }

  @Query(() => Student)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.studentsService.getStudentsByAuthUserId(user.sub);
  }

  @ResolveField()
  enrollments(@Parent() student: Student) {
    return this.enrollmentService.getEnrollmentsByStudent(student.id);
  }
}
