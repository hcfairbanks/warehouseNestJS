import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { response } from 'express';
import * as user from '../src/auth/user.repository';
import { async } from 'rxjs/internal/scheduler/async';

describe('AppController (e2e)', () => {
  let app;
  let userUtils = new user.UserRepository();

  // const rage = userUtils.signUp({email: 'something@something.com', username: 'Joe', password: 'Password123' });
  // Logger.verbose(JSON.stringify(rage))

  beforeAll( async()=>{
    await userUtils.signUp({email: 'something@something.com', username: 'Joe', password: 'Password123' });
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    //Logger.verbose('---Here I am----');
    app = moduleFixture.createNestApplication();
    await app.init();

  });

//  describe('Items', () => {
    let AccessToken = '';


    it('/auth/signin (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({email: 'something@something.com', password: 'Password123'})
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect( (res) => {
            //Logger.verbose(`----${res.body.accessToken}`);
            AccessToken = res.body.accessToken;
            return true;
        } )
        .expect(201);
//        .end();
    });

    it('/items/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/items?page=1')
        .set('Accept', '*/*')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Cookie', `jwt=${AccessToken}`)
        .expect(()=>{
          Logger.verbose(`--- here is your token: ${AccessToken}`)
          return true
        })
        .expect((res)=>{
          const items = JSON.parse(res.text);
          Logger.verbose('-----------------------------------------------------')
          Logger.verbose(items['items'][0].name);
          Logger.verbose(items['items'].length.toString());
          Logger.verbose('-----------------------------------------------------')
          return true;
        })
        .expect(200);
        //.end();
    });

// });
// afterAll(async () => {
//   await app.close();
// });

afterEach(async () => {
  await app.close();
});
 
});
