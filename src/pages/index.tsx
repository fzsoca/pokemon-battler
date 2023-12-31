import Image from 'next/image';
import MainLayout from '@/components/MainLayout';
import axios, { AxiosError } from 'axios';
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
      if (
        axios.isAxiosError(error) &&
        (error as AxiosError)?.response?.status === 404
      ) {
        setError('No pokemons found');
      } else {
        setError('Something went wrong');
      }
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
      if (axios.isAxiosError(error)) {
        setError(error?.response?.data?.error || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
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
        <div className="flex gap-6 flex-col items-center bg-white text-black min-w- min-w-64">
          <h1 className="text-3xl font-bold">Details</h1>
          <div className="flex flex-col items-start w-full">
            <p className=" text-xl">
              <span className="font-bold">Name: </span>
              {modalData?.name}
            </p>
            <p className=" text-xl">
              <span className="font-bold">Height:</span> {modalData?.height}
            </p>
            <p className=" text-xl">
              <span className="font-bold">Weight:</span> {modalData?.weight}
            </p>
            <p className="text-xl">
              <span className="font-bold">Types:</span> {modalData?.type}
            </p>
          </div>
        </div>
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
          <div className="flex flex-col items-center sm:flex-row mt-6">
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
