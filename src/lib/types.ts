export type CardPokemon = {
  pokedexId: string;
  imgUrl: string;
  name: string;
  type: string;
  height: number;
  weight: number;
};

export type LeaderboardPokemon = {
  id: string;
  name: string;
  votes: number;
};
