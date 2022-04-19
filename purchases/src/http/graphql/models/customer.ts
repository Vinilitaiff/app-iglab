import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Purchase } from './purchase';

@ObjectType()
export class Customer {
  @Field(() => ID)
  id: string;

  @Field(() => [Purchase])
  purchases: Purchase[];
}
