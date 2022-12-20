import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private users = [
    {
      userId: 1,
      username: 'john cena',
      password: 'changeme',
      email: 'john@gmail.com',
      phone: '88005553535'
    },
    {
      userId: 2,
      username: 'maria',
      email: 'maria@gmail.com',
      password: 'guess',
    },
    {
      userId: 3,
      username: '1',
      email: '1@gmail.com',
      password: '1',
    },
  ];

  async getAll(): Promise<Array<User> | undefined> {
    return this.users;
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === userId);
  }

  async createUser(user: User): Promise<User | undefined> {
    user.userId = 5;
    return this.users.push(user);
  }

  async updateUser(userId: number, newUser:User): Promise<User | undefined> {
    const index = this.users.findIndex(user => user.userId === userId);
    if(!newUser.password){
      newUser.password = this.users[index].password;
    }
    newUser.userId = userId;
    this.users[index] = newUser;
    // console.log("updateUser");
    // console.log("index "+index + " userId "+userId);
    // console.log(this.users[index]);
    return this.users[index];
  }

  async deleteUser(userId: number): Promise<User | undefined> {
    const index = this.users.findIndex(user => user.userId === userId);
    if(index>=0){
      this.users.splice(index, 1);
      return true;
    }else{
      return false;
    }
  }
}