import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { ConfigKeys, ProductionEnvironment } from './common/constants';
import { CustomExceptionsFilter } from './filters/exception.filter';
import { SilentExceptionsFilter } from './filters/silentException.filter';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>(ConfigKeys.nodeEnv) === ProductionEnvironment;
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    validationError: {
      target: false,
    },
  }));

  app.useGlobalFilters(new CustomExceptionsFilter(httpAdapter));
  if (isProduction) {
    // Hide error message details in production.
    app.useGlobalFilters(new SilentExceptionsFilter(httpAdapter));
  }
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  if (!isProduction) {
    // API documentation is not exposed in production environment.
    enableApiDocs(app, 'docs');
  }

  await app.listen(configService.get<string>(ConfigKeys.port));
}

function enableApiDocs(app: INestApplication, path: string) {
  const options = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('The travels API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(path, app, document, {
    customSiteTitle: 'Travels API',
    customCss: '.swagger-ui .topbar { display: none; }'
  });
}

bootstrap();
