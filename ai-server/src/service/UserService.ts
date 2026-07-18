import {IUser, IUserData, IUserLogin, UserData} from "../interface/User";
import {compare, hash} from "bcrypt";
import {DB} from "../middleware/db";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export class UserService {

    static async createUser(user: IUser): Promise<'conflict' | 'created' | 'error'> {
        try {
            // Check if Username already exists
            const existingUser = await UserService.getByUsername(user.username);

            // Throw conflict if user already exists
            if (existingUser) return 'conflict';

            // Proper Hashing of the password
            user.password = await hash(user.password, 12);

            // Insert user into database
            const [inserted] = await DB.execute<ResultSetHeader>(
                'insert into user(username, password, email, profile_description) values(?, ?, ?, ?)',
                        [user.username, user.password, user.email, user.profile_description]);

            if (inserted.affectedRows < 1) return 'error';
            return 'created';
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    // Get user by username
    static async getByUsername(username: string): Promise<IUserData | undefined | 'error'> {
        try {
            const [rows] = await DB.query<RowDataPacket[]>(
                'select username, email, profile_description from user where username = ?',
                        [username]);

            if (!rows || rows.length === 0) {
                return undefined;
            }

            return UserData.safeParse(rows[0]).data;
        } catch (e) {
            console.error(e);
            return 'error';
        }
    }

    // Check if the password is correct for the given username
    static async validatePassword(LoginData: IUserLogin): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select password from user where username = ?',
                    [LoginData.username]);

        if (rows && rows.length === 0) {
            return false;
        }

        const dataBankPassword = rows[0].password;
        return await compare(LoginData.password, dataBankPassword);
    }
}