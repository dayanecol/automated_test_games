import { Request, Response } from "express";
import httpStatus from "http-status";

import gamesService, { GameInput } from "../services/games-service";

export async function getGames(req: Request, res: Response) {
  try {
    const games = await gamesService.getGames();
    res.send(games);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
  
}

export async function getSpecificGame(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  try {
    const game = await gamesService.getSpecificGame(id);
    res.send(game);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createGame(req: Request, res: Response) {
  const game = req.body as GameInput;
  try {
    await gamesService.createGame(game);
    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    console.log(error);
    res.sendStatus(httpStatus.CONFLICT);
  }
}