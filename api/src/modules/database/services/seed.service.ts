import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportLocalModel } from 'mongoose';
import { ConfigKeys } from '../../../common/constants';
import { RoleType } from '../../../common/roleType';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../users/schema/user.interface';

/**
 * Service used to seed database on app init.
 */
@Injectable()
export class SeedService {
  private readonly logger = new Logger('Database.SeedService');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectModel('User') private readonly userModel: PassportLocalModel<User>,
  ) {
  }

  async onModuleInit(): Promise<void> {
    await this.ensureAdmin();
    await this.ensureManager();
  }

  private async ensureAdmin() {
    const userName = this.configService.get<string>(ConfigKeys.adminUserName);
    const user = await this.userModel.findOne({ userName }).exec();
    if (user) {
      return;
    }

    await this.authService.register({
      userName,
      password: this.configService.get<string>(ConfigKeys.adminPassword),
      firstName: 'admin',
      lastName: 'admin',
    }, ...RoleType.all());

    this.logger.log('Created default admin account.');
  }

  private async ensureManager() {
    const userName = this.configService.get<string>(ConfigKeys.managerUserName);
    const user = await this.userModel.findOne({ userName }).exec();
    if (user) {
      return;
    }

    await this.authService.register({
      userName,
      password: this.configService.get<string>(ConfigKeys.managerPassword),
      firstName: 'manager',
      lastName: 'manager',
    }, RoleType.manager);

    this.logger.log('Created default manager account.');
  }

}
