import bcrypt from 'bcrypt';
export class Password {
    static async toHash(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    static async compare(storedPassword, suppliedPassword) {
        return bcrypt.compare(suppliedPassword, storedPassword);
    }
}
