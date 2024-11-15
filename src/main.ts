import * as cookieParser from 'cookie-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as process from "process";
import * as express from 'express';

import { ValidationPipe, VersioningType } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const server = app.getHttpServer();
  const io = new Server(server);

  app.use('/public', express.static(join(__dirname, '..', 'public')));

  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  //config cookies
  app.use(cookieParser());

  //config cors
  app.enableCors({
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  //config versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'], //v1, v2
  });

  //config helmet
  app.use(helmet());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('Nestjs Backend Flower-Seller Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const document = () => SwaggerModule.createDocument(app, config);

  //Lưu accesstoken  khi refresh
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  });

  io.on('connection', (socket) => {
    socket.on('send_message', (message) => {
      socket.broadcast.emit('receive_message', message); // Phát tin nhắn đến tất cả client
    });
  });

  await app.listen(configService.get<string>("PORT") || 8000, "0.0.0.0");
}
bootstrap();
