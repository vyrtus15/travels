import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Model, MongooseDocument } from 'mongoose';
import { RoleType } from '../../../common/roleType';
import { SchemaNames } from '../../../common/schemas';
import { PageDto } from '../../../dto/page.dto';
import { PageResult } from '../../../interfaces/pageResult.interface';
import { PageSearch } from '../../../interfaces/pageSearch.interface';
import { QueryService } from '../../database/services/query.service';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserDto } from '../dto/user.dto';
import { User } from '../schema/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SchemaNames.User) private readonly userModel: Model<User>,
    private readonly queryService: QueryService,
  ) { }

  async findOne(id: string) {
    return this.serialize(await this.findEntity(id));
  }

  async find(pagination: PageDto, role?: RoleType) {
    if (role) {
      return await this.searchUsers(pagination, { roles: [RoleType.user] });
    }

    return await this.searchUsers(pagination);
  }

  private async searchUsers(pagination: PageDto, condition: any = {}): Promise<PageResult<UserDto>> {
    const filter: PageSearch = {
      ...pagination,
      condition,
    };

    const page = await this.queryService.page(this.userModel, filter);
    return {
      ...page,
      items: page.items.map(u => this.serialize(u)),
    }
  }

  async update(id: string, data: UpdateUserDto) {
    const entity = await this.findEntity(id);

    entity.firstName = data.firstName;
    entity.lastName = data.lastName;

    return this.serialize(await entity.save());
  }

  async delete(id: string) {
    const entity = await this.findEntity(id);
    await entity.remove();
  }

  private async findEntity(id: string) {
    const user = await this.userModel.findOne({ id }).exec();

    if (!user) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private serialize(user: MongooseDocument) {
    return plainToClass(UserDto, user.toJSON());
  }
}
