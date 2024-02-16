import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

class UserController {

    async setUserData(req, res) {
        console.log("dsa")
        const { name, email, sub } = req.body;

        console.log(req.body)
        try {
            if (sub) {

                const exists = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { user_id: sub },
                            { email: email }
                        ]
                    }
                });
                console.log(exists)
                if (!exists) {
                    await prisma.user.create({
                        data: {
                            username: name,
                            email: email,
                            user_id: sub
                        }
                    });
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