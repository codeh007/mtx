"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { pokemonOptions } from "./pokemon";

export function PokemonInfo() {
  const { data } = useSuspenseQuery(pokemonOptions);

  return (
    <div>
      <figure>
        <img src={data.sprites.front_shiny} height={200} alt={data.name} />
        <h2>I'm {data.name}</h2>
      </figure>
    </div>
  );
}