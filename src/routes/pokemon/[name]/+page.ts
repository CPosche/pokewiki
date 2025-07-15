import type { PageLoad } from './$types';
import type { Pokemon, PokemonSpecies, EvolutionChain } from '$lib';

export const load: PageLoad = async ({ params, fetch }) => {
	const { name } = params;
	
	try {
		// Fetch basic Pokemon data
		const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
		if (!pokemonResponse.ok) {
			throw new Error(`Pokemon ${name} not found`);
		}
		const pokemon: Pokemon = await pokemonResponse.json();
		
		// Fetch species data for additional info like description
		const speciesResponse = await fetch(pokemon.species.url);
		const species: PokemonSpecies = await speciesResponse.json();
		
		// Fetch evolution chain data
		const evolutionResponse = await fetch(species.evolution_chain.url);
		const evolutionChain: EvolutionChain = await evolutionResponse.json();
		
		return {
			pokemon,
			species,
			evolutionChain
		};
	} catch (error) {
		throw new Error(`Failed to load Pokemon: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};