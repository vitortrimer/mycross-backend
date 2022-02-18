import { Resolver, Mutation, Arg, InputType, Field, Ctx, ObjectType, Query } from "type-graphql";
import { MyContext } from "../types";
import { User } from '../entities/user'
import argon2 from 'argon2'

@InputType()
class RegisterInput {
  @Field()
  email: string

  @Field()
  password: string

  @Field()
  name: string

  @Field()
  lastName: string
}

@InputType()
class UsernamePasswordInput {
  @Field()
  email: string
  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[]

  @Field(() => User, {nullable:true})
  user?: User
}


@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {req, em}: MyContext
  ) {
    //not logged in
    if(!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, {id: req.session.userId})
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() {em}: MyContext
  ): Promise<UserResponse> {
    if(options.email.length < 2) {
      return {
        errors: [{
          field: "email",
          message: "Length must be greater than 2"
        }]
      }
    }

    if(options.password.length < 3) {
      return {
        errors: [{
          field: "password",
          message: "Length must be greater than 3"
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, 
      {
        email: options.email,
        password: hashedPassword,
        name: options.name,
        lastName: options.lastName
      })
    try {
      await em.persistAndFlush(user)
    } catch(err) {
      //ALREADY EXISTS
      if(err.code === '23505' || err?.detail?.includes("already exists")) {
        return {
          errors: [{
            field: "email",
            message: "Your email is already in use"
          }]
        }
      }
    }

    //auto login user when register
    // req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ): Promise<UserResponse> {


    const user = await em.findOne(User, {email: options.email})

    //FIND USER VALIDATION
    if(!user) {
      return {
        errors: [{
          field: "email",
          message: "That username doesn't exists"
        }]
      }
    }

    const valid = await argon2.verify(user.password, options.password)

    //PASSWORD VALIDATION
    if(!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password"
          }
        ]
      }
    }

    req.session.userId = user.id

    return {
      user
    }
  }
}