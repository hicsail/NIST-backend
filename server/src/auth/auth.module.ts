import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermissions, UserPermissionsSchema } from './user-permissions.model';
import { UserPermissionsService } from './user-permissions.service';
import { OrganizationModule } from '../organization/organization.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserPermissions.name, schema: UserPermissionsSchema }]),
    PassportModule,
    OrganizationModule,
    JwtModule.registerAsync({
      imports: [forwardRef(() => AuthModule)],
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        const options: JwtModuleOptions = {
          publicKey: await authService.getPublicKey(),
          signOptions: {
            algorithm: 'RS256',
          }
        };
        return options;
      }
    })
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtAuthGuard,
    UserPermissionsService,
    {
      provide: JwtStrategy,
      inject: [AuthService],
      useFactory: async (authService: AuthService) => {
        const key = await authService.getPublicKey();
        return new JwtStrategy(key);
      }
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
