import { PrimaryKey } from "@mikro-orm/core";
import { Entity,  Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class User {

  @Field(() => Int)
  @PrimaryKey()
  id: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({type: 'text', unique: true })
  email!: string;

  @Field(() => String)
  @Property({type: 'text'})
  password!: string;

  @Field(() => String)
  @Property({type: 'text'})
  name!: string;

  @Field(() => String)
  @Property({type: 'text'})
  lastName!: string;
}
