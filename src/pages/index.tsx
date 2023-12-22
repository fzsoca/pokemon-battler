import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";

interface Pokemon {
  id: string;
  image: string;
  name: string;
}

interface HomeProps {
  pokemonData: Pokemon[];
}

export default function Home({ pokemonData }: HomeProps) {
  const handleClick = async (id: string) => {
    console.log("clicked", id);
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

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTwoDifferentRandomNumbers(min: number, max: number) {
  let number1 = generateRandomNumber(min, max);
  let number2 = generateRandomNumber(min, max);

  // Ensure that the second number is different from the first one
  while (number2 === number1) {
    number2 = generateRandomNumber(min, max);
  }

  return [number1, number2];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  //Generate random number between 1 and 100
  const [randomNumber1, randomNumber2] = generateTwoDifferentRandomNumbers(
    1,
    100
  );

  const promises = [
    prisma.pokemon.findUnique({
      where: {
        pokedexId: randomNumber1,
      },
      select: {
        id: true,
        imgUrl: true,
        name: true,
      },
    }),
    prisma.pokemon.findUnique({
      where: {
        pokedexId: randomNumber2,
      },
      select: {
        id: true,
        imgUrl: true,
        name: true,
      },
    }),
  ];

  const pokemons = await Promise.all(promises);

  if (!pokemons[0] || !pokemons[1]) {
    throw new Error("Pokemon not found");
  }

  return {
    props: {
      pokemonData: pokemons.map((pokemon: any) => ({
        id: pokemon?.id,
        image: pokemon?.imgUrl,
        name: pokemon?.name,
      })),
    },
  };
};
