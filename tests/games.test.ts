import supertest from "supertest";
import app from "../src/app";
import prisma from "config/database";
import gameFactory from "./factories/games-factory";
import { faker } from "@faker-js/faker";
import ConsoleFactory from "./factories/consoles-factory";

const api = supertest(app);

beforeEach(async ()=>{
    try{
        await prisma.game.deleteMany({});
        await prisma.console.deleteMany({});
    }catch(e){
        console.log(e);
    }
})

describe("GET/games",()=>{
    it("Deve responder com status 200 e um array com todos os games", async ()=>{

        const createdConsole = await ConsoleFactory.createConsole();
        await gameFactory.createGame(createdConsole.id);

        const result = await api.get("/games");

        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    consoleId: expect.any(Number),
                    Console: { id: expect.any(Number), name: expect.any(String) }
                  })
            ])
        );
    })
    it("Deve responder com status 200 e um array vazio", async ()=>{

        const result = await api.get("/games");
        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.arrayContaining([])
        );
    })
});

describe("GET/games/:id",()=>{
    it("Deve responder com status 200 e objeto do game solicitado", async ()=>{
        const createdConsole = await ConsoleFactory.createConsole();
        const createdGame = await gameFactory.createGame(createdConsole.id);

        const result = await api.get(`/games/${createdGame.id}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(
                expect.objectContaining({
                    id: createdGame.id,
                    title: createdGame.title,
                    consoleId: createdConsole.id
                  })
        );
    })
    it("Deve responder com status 404 quando o gameId nao existe", async ()=>{
        const result = await api.get(`/games/1`);
        expect(result.status).toBe(404);
    })
})

describe ("POST/games",()=>{
    it("Deve responder com status 409 quando tenta criar um game existente", async ()=>{
        const createdConsole = await ConsoleFactory.createConsole();
        const createdGame = await gameFactory.createGame(createdConsole.id);

        const result = await api.post("/games").send({ 
            title: createdGame.title,
            consoleId: createdConsole.id
        })

        expect(result.status).toBe(409);
    })
    it("Deve responder com status 201 quando o objeto game for criado", async ()=>{

        const createdConsole = await ConsoleFactory.createConsole();

        const result = await api.post("/games").send({ 
            title: faker.word.noun(),
            consoleId: createdConsole.id
        })

        expect(result.status).toBe(201);
    })
})


