import { faker } from "@faker-js/faker";
import prisma from "config/database";

async function createGame (consoleId:number){
    return await prisma.game.create({
        data:{
            title: faker.word.adjective(),
            consoleId: consoleId,
        }
    });
} 

const gameFactory ={
    createGame,
}

export default gameFactory;