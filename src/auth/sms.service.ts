import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(
    private readonly httpService: HttpService
  ) {}

  async sendSMS(phone:string, message:string): Promise<any> {
    const {data} = await firstValueFrom( 
      this.httpService.get('https://sms.ru/sms/send?api_id=FDB0BFE7-DDD8-CB3A-FB2F-93602E33C58F&to='+phone+'&msg='+message+'&json=1')
    ); 
    console.log(data);
  }

  async call(phone:string): Promise<any> {
    const {data} = await firstValueFrom( 
      this.httpService.get('https://sms.ru/code/call?phone='+phone+'&ip=-1&api_id=FDB0BFE7-DDD8-CB3A-FB2F-93602E33C58F')
    );
    console.log(data);
  }

}