import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "@/lib/prisma";

type ApiPokemonList = {
  name: string;
  url: string;
};

type ApiPokemonDetails = {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
};

const apiEntityToDbEntity = (pokemon: ApiPokemonDetails) => ({
  name: pokemon.name,
  imgUrl: pokemon.sprites.other["official-artwork"].front_default,
  height: pokemon.height,
  weight: pokemon.weight,
  type: pokemon.types.map((typeObj) => typeObj.type.name).join(", "),
  pokedexId: pokemon.id,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch the first 100 Pokémon from PokeAPI.co
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=100"
    );
    const data = response.data;
    const pokemonList = data.results;
    const promises = pokemonList.map((pokemon: ApiPokemonList) => {
      return axios.get(pokemon.url);
    });

    const pokemonDataRaw = await Promise.all(promises);
    const pokemonData = pokemonDataRaw.map((pokemon) => pokemon.data);

    const prismaPromises = pokemonData.map((pokemon: ApiPokemonDetails) => {
      return prisma.pokemon.create({
        data: apiEntityToDbEntity(pokemon),
      });
    });

    const prismaData = await Promise.all(prismaPromises);

    console.log(pokemonData);

    res.status(200).json({ message: "Pokémon synced successfully" });
  } catch (error) {
    console.error("Error syncing Pokémon:", error);
    res.status(500).json({ message: "Failed to sync Pokémon" });
  }
};

export default handler;
