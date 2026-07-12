import {IUser, IUserData, IUserLogin, UserData} from "../interface/User";
import {compare, hash} from "bcrypt";
import {DB} from "../middleware/db";
import {ResultSetHeader, RowDataPacket} from "mysql2";

// TODO: Kommentare schreiben
export class UserService {
    static async createUser(user: IUser): Promise<'conflict' | 'created' | 'error'> {
        const existingUser = await UserService.getByUsername(user.username);

        if (existingUser) return 'conflict';

        // TODO: Da gehört noch richtiges Hashing rein
        user.password = await hash(user.password, 10);

        try {
            const [inserted] = await DB.execute<ResultSetHeader>('insert into user(username, password, email, profileDescription) values(?, ?, ?, ?)', [user.username, user.password, user.email, user.profile_description]);

            if (inserted.affectedRows < 1) return 'error';
            return 'created';
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    static async getByUsername(username: string): Promise<IUserData | undefined | 'error'> {
        try {
            const [rows] = await DB.query<RowDataPacket[]>('select username, email, profileDescription from user where username = ?', [username]);

            if (!rows || rows.length === 0) {
                return undefined;
            }

            return UserData.safeParse(rows[0]).data;
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    static async validatePassword(data: IUserLogin): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>('select password from user where username = ?', [data.username]);

        if (rows && rows.length === 0) {
            return false;
        }

        const oldPasswordHash = rows[0].password;
        return await compare(data.password, oldPasswordHash);
    }
}