import { GetServerSideProps } from "next";
import MainLayout from "@/components/MainLayout";
import { prisma } from "@/lib/prisma";

interface LeaderboardPokemon {
  id: string;
  name: string;
  votes: number;
}

interface LeaderboardProps {
  pokemons: LeaderboardPokemon[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ pokemons }) => {
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Pokémon Leaderboard</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Votes</th>
            </tr>
          </thead>
          <tbody>
            {pokemons.map((pokemon) => (
              <tr key={pokemon.id}>
                <td className="border px-4 py-2">{pokemon.name}</td>
                <td className="border px-4 py-2">{pokemon.votes}</td>
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
  const pokemons = await prisma.pokemon.findMany({
    select: {
      id: true,
      name: true,
      votes: true,
    },
    orderBy: {
      votes: "desc",
    },
    take: 10,
  });

  return {
    props: {
      pokemons,
    },
  };
};

export default Leaderboard;
