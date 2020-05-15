import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, email } = authCredentialsDto;
    const user = new User();
    user.email = email;
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
       // duplicate email
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(signInCredentialsDto: SignInCredentialsDto): Promise<User> {
    const { email, password } = signInCredentialsDto;
    const user = await this.findOne({ email });
    if (user && await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  async getUsers(
    filterDto: GetUsersFilterDto,
    user: User,
  ): Promise<object> {
    const { page,
            username,
            id } = filterDto;

    const likeFields = [{username}];
    const equalsFields = [{ id }];

    const pageNumber = Number(page);
    const usersPerPage = 10;
    const offset = usersPerPage * ( pageNumber - 1 );
    const query = this.createQueryBuilder('user');

    query.select(['user.id', 'user.username', 'user.email']);
    equalsFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key => {
        const value = {};
        value[key] = `${thisField[key]}`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`user.${key} = :${key}`, value);
        }
      });
    });

    likeFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key => {
        const value = {};
        value[key] = `%${thisField[key]}%`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`user.${key} ILIKE :${key}`, value);
        }
      });
    });

    // TODO Try Catch here
    const usersCount = await query.getCount();
    const pageCount = Math.ceil(usersCount / usersPerPage);

    query.offset(offset);
    query.limit(usersPerPage);

    try {
      const users = await query.getMany();
      return {users, pagination_details: { current_page: pageNumber,
                                           page_count: pageCount }};
    } catch (error) {
      this.logger.error(`Failed to get users for user "${user.username}".` +
                        `Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
