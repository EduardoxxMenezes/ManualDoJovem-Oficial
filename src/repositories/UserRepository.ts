import AppDataSource from "../dataBase/dataSource";
import { User } from "../Model/User";

export class UserRepository {
  private reposit = AppDataSource.getRepository(User);

  async createUser(name: string, email: string, password: string, profilePicture: string) {
    const newUser = new User(name, email, password, profilePicture);
    
    return await this.reposit.save(newUser);
  }

  async findUserByEmail(email: string) {
    return await this.reposit.findOneBy({ userEmail: email });
  }

  async findUserById(id: number) {
    return await this.reposit.findOne({ where: { id } });
  }

  async updateUser(id: number, fields: Partial<User>) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) return null;

    Object.assign(existingUser, fields);
    return await this.reposit.save(existingUser);
  }

  async deleteUser(id: number) {
    const existingUser = await this.findUserById(id);
    if (!existingUser) return null;
    return await this.reposit.remove(existingUser);
  }

  async findAllUsers() {
    return await this.reposit.find();
  }
}
