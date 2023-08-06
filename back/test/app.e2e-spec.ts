import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../prisma_module/prisma.service";
import * as pactum from 'pactum';
import { AuthDto } from "../auth/dto";
import { EditUserDto } from "../user/dto";

describe ('App e2e', () => {
  
  let app: INestApplication;
  let prisma: PrismaService;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({whitelist: true}));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {

    const dto: AuthDto = {
      name: 'ben',
      password: '123',
    };

    describe('Signup', () => {

      it('should throw if name empty', () => {
        return (pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400));
      });

      it('should throw if password empty', () => {
        return (pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            name: dto.name,
          })
          .expectStatus(400));
      });

      it('should throw if no body provided', () => {
        return (pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400));
      });

      it('should sign up', () => {
        return (pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201));
      });
   
    });

    describe('Signin', () => {

      it('should throw if name empty', () => {
        return (pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400));
      });

      it('should throw if password empty', () => {
        return (pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            name: dto.name,
          })
          .expectStatus(400));
      });

      it('should throw if no body provided', () => {
        return (pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400));
      });

      it('should sign in', () => {
        return (pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200))
          .stores('userAt', 'access_token');
      });

    });

  });

  describe('User', () => {

    describe('Get me', () => {
      it('should get current user', () => {
        return (pactum
          .spec()
          .get('/users/me/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200));
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          name: 'felix',
          wins: 2,
        };
        return (pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.wins));
      });
    });

  });

})
