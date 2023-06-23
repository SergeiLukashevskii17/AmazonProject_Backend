import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';
import { getRandomNumber } from 'src/utils/random-number';

dotenv.config();

const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let index = 0; index < quantity; index++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(10, 999, 2, '$'),
        slug: generateSlug(productName),
        images: Array.from({ length: getRandomNumber(2, 6) }).map(
          () => faker.image.url.name
        ),
        category: {
          create: {
            name: categoryName,
            slug: generateSlug(categoryName)
          }
        },
        reviews: {
          create: [
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1
                }
              }
            },
            {
              rating: getRandomNumber(1, 5),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1
                }
              }
            }
          ]
        }
      }
    });

    products.push(product);
  }

  console.log(`Created ${products.length} products`);
};

const main = async () => {
  console.log('Start seeding...');
  await createProducts(10);
};

main()
  .catch(error => console.log(error))
  .finally(async () => await prisma.$disconnect());
