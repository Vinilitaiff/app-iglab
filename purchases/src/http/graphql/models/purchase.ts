import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql';
import { Product } from './product';

enum ProductStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
  description: 'Available purchase statuses',
});

@ObjectType()
export class Purchase {
  @Field(() => ID)
  id: string;

  @Field(() => ProductStatus)
  status: ProductStatus;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Product)
  product: Product;

  productId: string;
}
