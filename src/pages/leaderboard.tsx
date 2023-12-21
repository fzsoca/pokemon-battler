import { GetServerSideProps } from 'next';
import axios from 'axios';
import MainLayout from '@/components/MainLayout';

interface Pokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  votes: number;
}

interface LeaderboardProps {
  pokemons: Pokemon[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ pokemons }) => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Pokémon Leaderboard</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Level</th>
            </tr>
          </thead>
          <tbody>
            {pokemons.map((pokemon) => (
              <tr key={pokemon.id}>
                <td className="border px-4 py-2">{pokemon.id}</td>
                <td className="border px-4 py-2">{pokemon.name}</td>
                <td className="border px-4 py-2">{pokemon.type}</td>
                <td className="border px-4 py-2">{pokemon.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  LeaderboardProps
> = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon');

  const pokemons: Pokemon[] = response.data.results;
  return {
    props: {
      pokemons,
    },
  };
};

export default Leaderboard;
