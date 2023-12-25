import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: "Missing id" });
  }

  if (req.method === "POST") {
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: { pokedexId: +id! },
      });
      if (!pokemon) {
        return res.status(404).json({ error: "Pokemon not found." });
      }
      const updatedPokemon = await prisma.pokemon.update({
        where: { pokedexId: +id! },
        data: {
          votes: pokemon.votes + 1,
        },
      });
      res.status(200).json(updatedPokemon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update the pokemon." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
