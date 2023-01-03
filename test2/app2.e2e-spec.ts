import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import Client, { io, Socket } from "socket.io-client";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token ='';
  let code='4321';
  let clientSocket: Socket;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // app.enableCors();
    // app.listen(3000);
    clientSocket =await io(`http://localhost:3000`, {
      extraHeaders: {
        Authorization: token,
      },
    });
  });

  // it('/user (POST) 201', () => {
  //   return request(app.getHttpServer())
  //     .post('/user')
  //     .send({
  //       "nickname": "exstarzii",
  //       "phone": "+79302710862"
  //     })
  //     .expect(201)
  //     .then(response => {
  //       console.log({request:'/user (POST)',response:response.body});
  //     });
  // });

  // it('/user/phoneVerify (POST) 201', () => {
  //   return request(app.getHttpServer())
  //     .post('/user/phoneVerify')
  //     .send({
  //       "nickname": "exstarzii"
  //     })
  //     .expect(201)
  //     .then(response => {
  //       console.log({request:'/user/phoneVerify (POST)',response:response.body});
  //     });
  // });


  // it('/user/login (POST) 201', () => {
  //   return request(app.getHttpServer())
  //     .post('/user/login')
  //     .send({
  //       "nickname": "exstarzii",
  //       "code": code
  //     })
  //     .expect(201)
  //     .then(response => {
  //       token = response.body.access_token;
  //       console.log({request:'/user/login (POST)',response:response.body});
  //     });
  // });

  // it('/user (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/user')
  //     .set('Authorization', 'Bearer '+token)
  //     .expect(200)
  //     .then(response => {
  //       console.log({request:'/user (GET)',response:response.body});
  //     });
  // });

  // clientSocket =io(`http://localhost:3000`, {
  //   extraHeaders: {
  //     Authorization: token,
  //   },
  // });

  test("should work ", (done) => {
    clientSocket.emit("test", (arg) => {
      expect(arg).toBe("success");
      done();
    });
  },10000);
});
