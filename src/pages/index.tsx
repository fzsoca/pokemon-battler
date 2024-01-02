import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CardPokemon } from '@/lib/types';
import Modal from '@/components/Modal';

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
  const [error, setError] = useState('');
  const [pokemons, setPokemons] = useState<CardPokemon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<CardPokemon | null>(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>{modalData?.height}</p>
        <p>{modalData?.weight}</p>
        <p>{modalData?.type}</p>
      </Modal>
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
                  <span className="text-2xl font-bold text-black">
                    {pokemon.name}
                  </span>
                </div>
                <button
                  className="text-neutral-500 hover:text-neutral-700"
                  onClick={() => {
                    setIsOpen(true);
                    setModalData(pokemon);
                  }}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        )}
      </MainLayout>
    </>
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
