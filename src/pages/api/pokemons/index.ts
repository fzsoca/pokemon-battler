import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
//import prisma from '../../../prisma'; // Assuming you have a Prisma client instance

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pokemon = await prisma.pokemon.findMany(); // Fetch all Pokemon from the database

    res.status(200).json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
