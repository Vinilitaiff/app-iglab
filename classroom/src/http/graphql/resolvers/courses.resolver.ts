import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { AuthUser, CurrentUser } from '../../auth/current-user';
import { CoursesService } from '../../services/courses.service';
import { EnrollmentsService } from '../../services/enrollments.service';
import { StudentsService } from '../../services/students.service';
import { CreateCoursesInput } from '../inputs/create-course-input';
import { Course } from '../models/course';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(
    private coursesService: CoursesService,
    private studentsService: StudentsService,
    private enrollmentService: EnrollmentsService,
  ) {}

  @Query(() => [Course])
  @UseGuards(AuthorizationGuard)
  courses() {
    return this.coursesService.listAllCourses();
  }

  @Query(() => Course)
  @UseGuards(AuthorizationGuard)
  async course(@Args('id') id: string, @CurrentUser() user: AuthUser) {
    const student = await this.studentsService.getStudentsByAuthUserId(
      user.sub,
    );

    if (!student) {
      throw new Error('Student not found');
    }

    const enrollment = await this.enrollmentService.getByCourseAndStudentId({
      courseId: id,
      studentId: student.id,
    });

    if (!enrollment) {
      throw new UnauthorizedException();
    }

    return this.coursesService.getCoursesById(id);
  }

  @Mutation(() => Course)
  @UseGuards(AuthorizationGuard)
  createCourse(@Args('data') data: CreateCoursesInput) {
    return this.coursesService.createCourse(data);
  }
}
