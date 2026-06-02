import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { apiPrefix } from "src/src-gate/libs/constants";
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { ClientDomainUrls } from "src/src-gate/libs/constants/enums";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: true
  });
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.enableCors(
    {
      origin: [
        ClientDomainUrls.LOCALHOST
      ], // Replace with your frontend domain
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
      credentials: true, // Allow cookies
    }
  );
  app.setGlobalPrefix(apiPrefix);
  app.use(compression());
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('hbs');

  //Using for dto validation in controllers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(configService.get('SERVER_PORT' as never), () => console.log(`**************Server listens MODE -> ////${process.env.ENVIRONMENT}//// and SERVER PORT IS -> ////${process.env.SERVER_PORT}////***************`));
}
bootstrap();
