import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Designer, DesignerDocument } from './schemas/designer.schema';
import { SysRequest, SysRequestDocument } from './schemas/sysrequest.schema';
import { Model } from 'mongoose';
import { SysRequestDto } from './dto/sys-request.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Designer.name) private designerModel: Model<DesignerDocument>,
    @InjectModel(SysRequest.name)
    private sysRequestModel: Model<SysRequestDocument>,
  ) {}

  getStatus(): string {
    return 'Server is alive!';
  }
  async getRequests(): Promise<SysRequest[]> {
    return this.sysRequestModel
      .aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }])
      .exec();
  }
  async makeRequest(sysRequestDto: SysRequestDto): Promise<SysRequest> {
    const check = await this.sysRequestModel.find(sysRequestDto).count();
    if (check > 0)
      throw new BadRequestException('Duplicate request', {
        cause: new Error(),
        description: 'The database already has such a request',
      });
    const sysRequest = await this.sysRequestModel.create(sysRequestDto);
    return sysRequest;
  }
  async getDesigners(): Promise<Designer[]> {
    return this.designerModel.find().exec();
  }
}
