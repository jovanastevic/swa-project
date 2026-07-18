import {IUser, IUserData, IUserLogin, UserData} from "../interface/User";
import {compare, hash} from "bcrypt";
import {DB} from "../middleware/db";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import z from "zod";

export class UserService {

    static async createUser(user: IUser): Promise<boolean> {
        // Check if Username already exists
        const existingUser = await UserService.getByUsername(user.username);

        // Throw conflict if user already exists
        if (existingUser) return false;

        // Proper Hashing of the password
        const hashedPassword = await hash(user.password, 12);

        // Insert user into database
        const [inserted] = await DB.execute<ResultSetHeader>(
            'insert into user(username, password, email, profile_description) values(?, ?, ?, ?)',
                     [user.username, hashedPassword, user.email, user.profile_description]);

        return inserted.affectedRows > 0;
    }

    // Get user by username
    static async getByUsername(username: string): Promise<IUserData | undefined> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select username, email, profile_description from user where username = ?',
                    [username]);

        if (!rows || rows.length === 0) {
                return undefined;
        }
        const parsed = UserData.safeParse(rows[0]);

        // NEU: Wenn die Datenbank kaputte Daten liefert, werfen wir einen Fehler!
        if (!parsed.success) {
            console.error("Zod Validierungsfehler bei getByUsername:", z.treeifyError(parsed.error));
            throw new Error("Datenbank-Einträge entsprechen nicht dem User-Schema");
        }

        return parsed.data;
    }

    // Check if the password is correct for the given username
    static async validatePassword(LoginData: IUserLogin): Promise<boolean> {
        const [rows] = await DB.query<RowDataPacket[]>(
            'select password from user where username = ?',
                    [LoginData.username]);

        if (!rows || rows.length === 0) {
            return false;
        }

        const dataBankPassword = rows[0].password;
        return await compare(LoginData.password, dataBankPassword);
    }
}