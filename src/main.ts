import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";

async function start() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("NEST_F_P")
    .setDescription("Pravoslavnie endpointi")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  // таким образом можно использовать гварды / пайпы глобально (для всех ендпоинтов)

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`sever is working on port ${PORT}`));
}

start();
