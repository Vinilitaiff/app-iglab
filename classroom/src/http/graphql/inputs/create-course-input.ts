import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCoursesInput {
  @Field()
  title: string;
}
