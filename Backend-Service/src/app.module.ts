import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import envFile from "src/src-gate/libs/security/env.config";
import { MongooseConfigService } from "src/src-gate/libs/security/db.config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from "./src-gate/modules/auth/auth.module";
import { UsersModule } from "./src-gate/modules/users/users.module";
import { TasksModule } from "./src-gate/modules/tasks/tasks.module";
import { RolesGuard } from "src/src-gate/libs/security/RBAC/RBAC.guard";
@Module({
  imports: [
    AuthModule,
    UsersModule,
    TasksModule,
    ConfigModule.forRoot({
      envFilePath: `environments/${envFile}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
