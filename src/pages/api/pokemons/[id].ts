import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../path/to/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'POST') {
    // Update the pokemon via Prisma
    try {
      const updatedPokemon = await prisma.pokemon.update({
        where: { id: Number(id) },
        data: {
          /* Update data here */
        },
      });
      res.status(200).json(updatedPokemon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the pokemon.' });
    }
  } else if (req.method === 'GET') {
    // Return the pokemon by id
    try {
      const pokemon = await prisma.pokemon.findUnique({
        where: { id: Number(id) },
      });
      res.status(200).json(pokemon);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch the pokemon.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
