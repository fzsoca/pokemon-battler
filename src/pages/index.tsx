import Image from "next/image";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { useEffect, useState } from "react";

interface ClientPokemon {
  pokedexId: string;
  imgUrl: string;
  name: string;
}

export default function Home() {
  const fetchPokemons = async () => {
    setLoading(true);
    const [randomNumber1, randomNumber2] = generateTwoDifferentRandomNumbers(
      1,
      100
    );
    const promises = [
      axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pokemons/${randomNumber1}`
      ),
      axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pokemons/${randomNumber2}`
      ),
    ];
    try {
      const pokemons = await Promise.all(promises);
      setPokemons(pokemons.map((axiosResp) => axiosResp.data));
    } catch (error) {
      setError(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id: string) => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/pokemons/${id}/vote`
      );
    } catch (error) {
      setError(`${error}`);
    }
    await fetchPokemons();
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pokemons, setPokemons] = useState<ClientPokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <MainLayout error={error}>
      <h2 className="text-2xl text-center">Choose your favorite!</h2>
      <h4 className="text-center text-neutral-500">
        Vote by clicking the picture of the pokemon
      </h4>
      {loading ? (
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-500"></div>
        </div>
      ) : (
        <div className="flex mt-6">
          {pokemons.map((pokemon) => (
            <div key={pokemon.pokedexId} className="w-1/2 p-4">
              <div
                className="bg-white p-4 rounded-lg shadow-lg flex justify-center flex-col items-center cursor-pointer hover:shadow-lg hover:shadow-neutral-50"
                onClick={() => handleClick(pokemon.pokedexId.toString())}
              >
                <Image
                  src={pokemon.imgUrl}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                />
                <p className="text-xl font-bold text-black">{pokemon.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
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
