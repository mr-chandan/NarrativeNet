import sql from "../Database/Postgres.js";

class UserController {

    async setUserData(req, res) {
        const { name, email, sub } = req.body;

        try {
            if (sub) {
                const exists = await sql`
                    select exists (
                        select 1 from users where "user_id" = ${sub} or email = ${email}
                    )
                `;
                if (!exists[0].exists) {
                    await sql`
                        insert into users (username, email, user_id) values (${name}, ${email}, ${sub})
                    `;
                    res.status(200).json({ message: "User added successfully" });
                } else {
                    res.status(200).json({ message: "User already exists" });
                }
            } else {
                res.status(400).json({ error: "No user sent" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default UserController;
