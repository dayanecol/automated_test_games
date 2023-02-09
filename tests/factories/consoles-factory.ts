import { faker } from "@faker-js/faker";
import prisma from "config/database";

async function createConsole() {
    return await prisma.console.create({
        data:{
            name: faker.word.noun(),
        }
    });
}

const ConsoleFactory ={
    createConsole
}

export default ConsoleFactory;