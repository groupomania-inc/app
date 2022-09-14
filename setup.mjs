import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";
import inquirer from "inquirer";
import z from "zod";

const prisma = new PrismaClient();

const signUpSchema = z
    .object({
        email: z
            .string()
            .min(1, "Le champ email est requis")
            .email("Le champ email doit être au format user@domain.com"),
        password: z
            .string()
            .min(1, "Le champ mot de passe est requis")
            .min(4, "Le mot de passe doit faire minimum 4 caractères")
            .max(16, "Le mot de passe doit faire maximum 16 caractères"),
        confirm: z.string().min(1, "Le champ confirmation mot de passe est requis"),
    })
    .refine((x) => x.password === x.confirm, {
        message: "Les mots de passes ne correspondent pas",
        path: ["confirm"],
    });

const checkAdminExists = async () => {
    const admin = await prisma.user.findFirst({
        where: {
            permissions: 1,
        },
    });

    if (admin) {
        if (process.argv[2] === "--force") {
            console.log(
                `⚠️ Attention! Un compte admin existe déjà avec l'email <${admin.email}> (CTRL+C pour annuler)`,
            );
        } else {
            console.log(
                "Un compte administrateur a été trouvé. Pour en créer un nouveau, lancer le programme avec `node setup.mjs --force`",
            );
            process.exit(0);
        }
    }
};

const askPrompt = () =>
    inquirer.prompt([
        {
            name: "email",
            message: "Entrez l'adresse email:",
            type: "input",
        },
        {
            name: "password",
            message: "Entrez le mot de passe:",
            type: "password",
        },
        {
            name: "confirm",
            message: "Confirmez le mot de passe:",
            type: "password",
        },
    ]);

const promptCallback = async (data) => {
    const result = signUpSchema.safeParse(data);
    if (result.error) {
        console.log("❌ Erreurs:");
        for (const error of result.error.issues) {
            console.log(error.message);
        }
        process.exit(1);
    }

    try {
        const hashedPassword = await hash(data.password);

        await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                permissions: 1,
            },
        });

        console.log("✅ Le compte administrateur a été créé");
    } catch (e) {
        if (e.code === "P2002") console.error("Un utilisateur avec cet email existe déjà");

        console.error("Impossible de créer l'utilisateur");
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

const main = async () => {
    await prisma.$connect();

    await checkAdminExists();

    console.log("🆕 Création d'un compte administrateur");
    askPrompt().then(promptCallback);
};

main();
