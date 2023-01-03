import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token ='';
  let code='4321';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/user/all (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/user/all')
  //     .expect(200)
  //     .then(response => {
  //       console.log({request:'/user/all (GET)',response:response.body});
  //     });
  // });

  it('/user (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        "nickname": "exstarzii",
        "phone": "+79302710862"
      })
      .expect(201)
      .then(response => {
        console.log({request:'/user (POST)',response:response.body});
      });
  });

  it('/user/phoneVerify (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/user/phoneVerify')
      .send({
        "nickname": "exstarzii"
      })
      .expect(201)
      .then(response => {
        console.log({request:'/user/phoneVerify (POST)',response:response.body});
      });
  });

  it('/user/login (POST) 201', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send({
        "nickname": "exstarzii",
        "code": code
      })
      .expect(201)
      .then(response => {
        token = response.body.access_token;
        console.log({request:'/user/login (POST)',response:response.body});
      });
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', 'Bearer '+token)
      .expect(200)
      .then(response => {
        console.log({request:'/user (GET)',response:response.body});
      });
  });


  it('/user (PUT) 200', () => {
    return request(app.getHttpServer())
      .put('/user')
      .set('Authorization', 'Bearer '+token)
      .send({
        "nickname": "exstarzii",
        "phone": "+79302710862",
        "sex":"man",
        "age":21
      })
      .expect(200)
      .then(response => {
        console.log({request:'/user (PUT)',response:response.body});
      });
  });

  it('/user (DELETE) 200', () => {
    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', 'Bearer '+token)
      .expect(200)
      .then(response => {
        console.log({request:'/user (DELETE)',response:response.body});
      });
  });

  it('/user/all (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/user/all')
      .expect(200)
      .then(response => {
        console.log({request:'/user/all (GET)',response:response.body});
      });
  });

  it('/user/login (POST) 401', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send({
        "nickname": "exstarzii",
        "code": code
      })
      .expect(401)
      .then(response => {
        console.log({request:'/user/login (POST)',response:response.body});
      });
  });
});
