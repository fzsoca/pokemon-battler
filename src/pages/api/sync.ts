import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../path/to/prisma'; // Replace with the actual path to your Prisma client
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch the first 100 Pokémon from PokeAPI.co
    const response = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=100'
    );
    const data = response.data;
    const pokemonList = data.results;

    // Store the Pokémon in the database using Prisma
    for (const pokemon of pokemonList) {
      await prisma.pokemon.create({
        data: {
          name: pokemon.name,
          url: pokemon.url,
        },
      });
    }

    res.status(200).json({ message: 'Pokémon synced successfully' });
  } catch (error) {
    console.error('Error syncing Pokémon:', error);
    res.status(500).json({ message: 'Failed to sync Pokémon' });
  }
};

export default handler;
