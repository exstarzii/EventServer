import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/designers', () => {
    return request(app.getHttpServer())
      .get('/designers')
      .expect(200)
      .expect([
        { _id: 0, fio: 'Username1' },
        { _id: 1, fio: 'Username2' },
      ]);
  });

  it('/requests', () => {
    return request(app.getHttpServer())
      .get('/requests')
      .expect(200)
      .expect([
        { count: 1, name: 'ISO 1' },
        { count: 1, name: 'ISO 2' },
      ]);
  });

  it('/requests', function (done) {
    return request(app.getHttpServer())
      .post('/requests')
      .send({ name: 'ISO 3' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ name: 'ISO 3' })
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
