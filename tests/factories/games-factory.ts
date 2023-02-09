import { faker } from "@faker-js/faker";
import prisma from "config/database";
import consolesRepository from "repositories/consoles-repository";

async function createGame (consoleId:number){
    return await prisma.game.create({
        data:{
            title: faker.word.adjective(),
            consoleId: consoleId,
        }
    });
} 

async function createConsole() {
    return await prisma.console.create({
        data:{
            name: faker.word.noun(),
        }
    });
}

const gameFactory ={
    createGame,
    createConsole
}

export default gameFactory;