import axios from 'axios'
import { IUser } from './IUser'
import { IProfile } from './IProfile'

export class HabboApi {
    public static async getUserByName(name: string): Promise<IUser> {
        let response = await axios.get<IUser>("https://www.habbo.es/api/public/users?name="+name);
        return response.data;
    }

    public static async getProfile(id: string): Promise<IProfile> {
        let response = await axios.get<IProfile>("https://www.habbo.es/api/public/users/"+ id +"/profile");
        return response.data;
    }
}