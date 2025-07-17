<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon, NamedAPIResource, PokemonListResponse, GenerationListResponse } from '$lib';
	
	let pokemonData: NamedAPIResource[] = [];
	let searchTerm = '';
	let isLoading = true;
	let randomPokemon: Pokemon | null = null;
    let generations: any[] = [];

	onMount(async () => {
		try {
			const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
			const data: PokemonListResponse = await response.json();
			pokemonData = data.results.filter(pokemon => pokemon.name.split('-').length === 1); // Filter out Pokémon with hyphens in their names
			
			const randomIndex = Math.floor(Math.random() * pokemonData.length);
			const randomResponse = await fetch(pokemonData[randomIndex].url);
			randomPokemon = await randomResponse.json() as Pokemon;

            const generationResponse = await fetch('https://pokeapi.co/api/v2/generation?limit=50');
            const generationData: GenerationListResponse = await generationResponse.json();
            generations = generationData.results;

			isLoading = false;
		} catch (error) {
			console.error('Failed to fetch Pokemon data:', error);
			isLoading = false;
		}
	});

	$: filteredPokemon = pokemonData.filter((pokemon: NamedAPIResource) =>
		pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<header class="text-center mb-12">
			<h1 class="text-6xl font-bold text-white mb-4 drop-shadow-lg">
				🔴 PokéWiki ⚪
			</h1>
			<p class="text-xl text-white/90 max-w-2xl mx-auto">
				Discover the world of Pokémon! Search through the original 151 Pokémon and learn about their stats, abilities, and more.
			</p>
		</header>

		<!-- Featured Pokemon Card -->
		{#if isLoading}
			<div class="flex justify-center mb-12">
				<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 text-center">
					<div class="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto"></div>
					<p class="text-white mt-4">Loading your featured Pokémon...</p>
				</div>
			</div>
		{:else if randomPokemon}
			<div class="mb-12 flex justify-center">
				<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl hover:scale-105 transition-transform duration-300">
					<h2 class="text-2xl font-bold text-white mb-4 text-center">Featured Pokémon</h2>
                    <a href="/pokemon/{randomPokemon.name}">
                        <div class="text-center">
                            <img 
                                src={randomPokemon.sprites.other?.['official-artwork']?.front_default || randomPokemon.sprites.front_default} 
                                alt={randomPokemon.name}
                                class="w-48 h-48 mx-auto mb-4 drop-shadow-lg"
                            />
                            <h3 class="text-3xl font-bold text-white capitalize mb-2">{randomPokemon.name}</h3>
                            <p class="text-white/80 mb-4">#{randomPokemon.id.toString().padStart(3, '0')}</p>
                            <div class="flex justify-center gap-2 mb-4">
                                {#each randomPokemon.types as type}
                                    <span class="px-3 py-1 bg-white/30 rounded-full text-white text-sm font-medium capitalize">
                                        {type.type.name}
                                    </span>
                                {/each}
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm text-white/90">
                                <div>
                                    <span class="font-semibold">Height:</span> {randomPokemon.height / 10}m
                                </div>
                                <div>
                                    <span class="font-semibold">Weight:</span> {randomPokemon.weight / 10}kg
                                </div>
                            </div>
                        </div>
                    </a>
				</div>
			</div>
		{/if}

		<!-- Search Section -->
		<div class="mb-12">
			<div class="max-w-md mx-auto">
				<div class="relative">
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Search Pokémon..."
						class="w-full px-6 py-4 rounded-full text-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/50 transition-all duration-300"
					/>
					<div class="absolute right-4 top-1/2 transform -translate-y-1/2">
						<svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<div class="mb-8 flex justify-between">
			{#each generations as generation}
				{@const generationNameArr = generation.name.split('-')}
				<a href="{generation.url.split('v2')[1]}" class="flex-1 mx-2">
					<div class="flex flex-col bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center hover:scale-105 hover:bg-white/30 transition-all duration-300">
						<span class="font-bold text-white">{generationNameArr[0]}</span>
						<span class="text-white/80">{generationNameArr[1]}</span>
					</div>
				</a>
			{/each}
		</div>
		<!-- Quick Stats -->
		<div class="grid md:grid-cols-3 gap-6 mb-12">
			<div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-colors duration-300">
				<div class="text-4xl font-bold text-white">{pokemonData.length}</div>
				<div class="text-white/80">Total Pokémon</div>
			</div>
			<div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-colors duration-300">
				<div class="text-4xl font-bold text-white">{filteredPokemon.length}</div>
				<div class="text-white/80">Search Results</div>
			</div>
			<div class="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/30 transition-colors duration-300">
				<div class="text-4xl font-bold text-white">18</div>
				<div class="text-white/80">Pokémon Types</div>
			</div>
		</div>

		<!-- Pokemon Grid Preview -->
		{#if searchTerm && filteredPokemon.length > 0}
			<div class="bg-white/10 backdrop-blur-md rounded-3xl p-8">
				<h2 class="text-2xl font-bold text-white mb-6">Search Results</h2>
				<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{#each filteredPokemon.slice(0, 12) as pokemon}
						<a href="/pokemon/{pokemon.name}" class="bg-white/20 rounded-xl p-4 text-center hover:bg-white/30 transition-colors duration-300 cursor-pointer hover:scale-105 transform">
							<div class="text-lg font-semibold text-white capitalize">{pokemon.name}</div>
						</a>
					{/each}
				</div>
				{#if filteredPokemon.length > 12}
					<p class="text-white/80 text-center mt-4">
						And {filteredPokemon.length - 12} more...
					</p>
				{/if}
			</div>
		{/if}

		<!-- Call to Action -->
		<div class="text-center mt-12">
			<button class="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:scale-105 transition-all duration-300">
				🔍 Explore All Pokémon
			</button>
		</div>
	</div>
</div>
