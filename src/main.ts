import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors({origin: serverConfig.origin.development, credentials: true});
  } else if (process.env.NODE_ENV === 'production') {
    app.enableCors({origin: serverConfig.origin.production, credentials: true});
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
