import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Criando usuários
  const ana = await prisma.user.create({
    data: {
      nickname: 'Ana',
      username: 'ana123',
      email: 'ana@example.com',
      password: 'senha123',
      phone: '11999999999',
      photoProfile: 'https://example.com/foto-ana.jpg',
      description: 'Amante da natureza',
    },
  });

  const bruno = await prisma.user.create({
    data: {
      nickname: 'Bruno',
      username: 'bruno_rock',
      email: 'bruno@example.com',
      password: 'senha456',
      phone: '11888888888',
      photoProfile: 'https://example.com/foto-bruno.jpg',
      description: 'Aventureiro e mochileiro',
    },
  });

  // Conexão entre usuários
  await prisma.connection.create({
    data: {
      followUserId: ana.id,
      followingUserId: bruno.id,
      state: 'accepted',
    },
  });

  // Criando tags
  const natureza = await prisma.tag.create({ data: { name: 'natureza' } });
  const aventura = await prisma.tag.create({ data: { name: 'aventura' } });

  // Criando local
  const manaus = await prisma.location.create({
    data: {
      country: 'Brasil',
      region: 'Norte',
      city: 'Manaus',
      description: 'Reserva natural incrível',
    },
  });

  // Criando post de Ana
  const post = await prisma.post.create({
    data: {
      description: 'Mais uma viagem repleta de emoções',
      privacity: false,
      likeNumber: 0,
      user: {
        connect: { id: ana.id },
      },
      postComponents: {
        create: [
          {
            order: 1,
            text: {
              create: {
                content: 'Para todos que desejam um lugar completo de aventura, envolto na natureza, aqui é esse lugar!'
              }
            }
          },
          {
            order: 2,
            photo: {
              create: {
                url: 'https://example.com/imagem.png',
                caption: 'Reserva Florestal'
              }
            }
          }
        ]
      },
      postTags: {
        create: [
          { tag: { connect: { id: natureza.id } } },
          { tag: { connect: { id: aventura.id } } },
        ]
      },
      locations: {
        create: {
          location: {
            connect: { id: manaus.id },
          },
        }
      },
    },
  });

  // Comentário de Bruno no post de Ana
  await prisma.comment.create({
    data: {
      content: 'Esse lugar parece incrível!',
      userId: bruno.id,
      postId: post.id,
    },
  });
}

main()
  .then(() => console.log('Seed concluído'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
