import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import { GetServerSideProps } from 'next';
import axios from 'axios';

interface Pokemon {
  id: number;
  image: string;
  name: string;
  description: string;
}

interface HomeProps {
  pokemonData: Pokemon[];
}

export default function Home({ pokemonData }: HomeProps) {
  const handleClick = async (id: string) => {
    console.log('clicked', id);
  };

  return (
    <MainLayout>
      <h2 className="text-2xl text-center">Choose your favorite!</h2>
      <h4 className="text-center text-neutral-500">
        Vote by clicking the picture of the pokemon
      </h4>
      <div className="flex mt-6">
        {pokemonData.map((pokemon) => (
          <div key={pokemon.id} className="w-1/2 p-4">
            <div
              className="bg-white p-4 rounded-lg shadow-lg flex justify-center flex-col items-center cursor-pointer hover:shadow-lg hover:shadow-neutral-50"
              onClick={() => handleClick(pokemon.id.toString())}
            >
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={200}
                height={200}
              />
              <p className="text-xl font-bold text-black">{pokemon.name}</p>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const pokemon1 = await axios.get('https://pokeapi.co/api/v2/pokemon/1');
  const pokemon2 = await axios.get('https://pokeapi.co/api/v2/pokemon/2');

  const pokemons: Pokemon[] = [pokemon1.data, pokemon2.data].map((pokemon) => {
    return {
      id: pokemon.id,
      image: pokemon.sprites.other['official-artwork'].front_default,
      name: pokemon.name,
      description: pokemon.species.url,
    };
  });
  return {
    props: {
      pokemonData: pokemons,
    },
  };
};
