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

describe("GET/consoles",()=>{
    it("Deve responder com status 200 e um array com todos os consoles", async ()=>{

        await ConsoleFactory.createConsole();
        const result = await api.get("/consoles");

        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                  })
            ])
        );
    })
    it("Deve responder com status 200 e um array vazio", async ()=>{

        const result = await api.get("/consoles");
        expect(result.status).toBe(200);
        expect(result.body).toEqual(
            expect.arrayContaining([])
        );
    })
});

describe("GET/consoles/:id",()=>{
    it("Deve responder com status 200 e objeto do console solicitado", async ()=>{
        const createdConsole = await ConsoleFactory.createConsole();

        const result = await api.get(`/consoles/${createdConsole.id}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(
                expect.objectContaining({
                    id: createdConsole.id,
                    name: createdConsole.name,
                  })
        );
    })
    it("Deve responder com status 404 quando o consoleId nao existe", async ()=>{
        const result = await api.get(`/consoles/1`);
        expect(result.status).toBe(404);
    })
})

describe ("POST/consoles",()=>{
    it("Deve responder com status 409 quando tenta criar um console existente", async ()=>{
        const createdConsole = await ConsoleFactory.createConsole();
        
        const result = await api.post("/consoles").send({ 
            name: createdConsole.name,
        })

        expect(result.status).toBe(409);
    })
    it("Deve responder com status 201 quando o objeto console for criado", async ()=>{

        const result = await api.post("/consoles").send({ 
            name: faker.word.noun(),
        })

        expect(result.status).toBe(201);
    })
})


