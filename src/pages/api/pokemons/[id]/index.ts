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

  if (req.method === "GET") {
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: { pokedexId: +id! },
        select: {
          name: true,
          imgUrl: true,
          pokedexId: true,
        },
      });
      res.status(200).json(pokemon);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch the pokemon." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
