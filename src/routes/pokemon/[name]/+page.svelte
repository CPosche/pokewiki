<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: pokemon = data.pokemon;
	$: species = data.species;
	$: evolutionChain = data.evolutionChain;
	
	// Get the English flavor text
	$: flavorText = species.flavor_text_entries
		.find(entry => entry.language.name === 'en')
		?.flavor_text.replace(/\f/g, ' ') || 'No description available.';

	// Evolution chain functionality
	interface EvolutionStage {
		name: string;
		id: number;
		sprite: string;
		evolutionDetails?: string;
	}

	// Flatten the evolution chain into a linear array
	const flattenEvolutionChain = (chain: any): EvolutionStage[] => {
		const stages: EvolutionStage[] = [];
		
		const traverse = (link: any, evolutionDetails?: string) => {
			// Extract ID from species URL
			const urlParts = link.species.url.split('/');
			const id = parseInt(urlParts[urlParts.length - 2]);
			
			stages.push({
				name: link.species.name,
				id,
				sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
				evolutionDetails
			});
			
			// Process all evolution paths
			link.evolves_to.forEach((evolution: any) => {
				let details = '';
				if (evolution.evolution_details.length > 0) {
					const detail = evolution.evolution_details[0];
					if (detail.min_level) {
						details = `Level ${detail.min_level}`;
					} else if (detail.item) {
						details = detail.item.name.replace('-', ' ');
					} else if (detail.trigger.name === 'trade') {
						details = 'Trade';
					} else {
						details = detail.trigger.name.replace('-', ' ');
					}
				}
				traverse(evolution, details);
			});
		};
		
		traverse(evolutionChain.chain);
		return stages;
	};

	$: evolutionStages = flattenEvolutionChain(evolutionChain);
	$: currentPokemonIndex = evolutionStages.findIndex(stage => stage.name === pokemon.name);
	
	// Get type colors for styling
	const typeColors: Record<string, string> = {
		normal: 'bg-gray-400',
		fire: 'bg-red-500',
		water: 'bg-blue-500',
		electric: 'bg-yellow-400',
		grass: 'bg-green-500',
		ice: 'bg-blue-300',
		fighting: 'bg-red-700',
		poison: 'bg-purple-500',
		ground: 'bg-yellow-600',
		flying: 'bg-indigo-400',
		psychic: 'bg-pink-500',
		bug: 'bg-green-400',
		rock: 'bg-yellow-800',
		ghost: 'bg-purple-700',
		dragon: 'bg-indigo-700',
		dark: 'bg-gray-800',
		steel: 'bg-gray-500',
		fairy: 'bg-pink-300'
	};
	
	// Calculate stat percentage for visual display
	const getStatPercentage = (baseStat: number) => Math.min((baseStat / 200) * 100, 100);
	
	// Get stat color based on value
	const getStatColor = (baseStat: number) => {
		if (baseStat >= 120) return 'bg-green-500';
		if (baseStat >= 80) return 'bg-yellow-500';
		if (baseStat >= 50) return 'bg-orange-500';
		return 'bg-red-500';
	};
</script>

<svelte:head>
	<title>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pok�Wiki</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
	<div class="container mx-auto px-4 py-8">
		<!-- Back Button -->
		<div class="mb-6">
			<a href="/" class="inline-flex items-center text-white hover:text-yellow-300 transition-colors duration-300">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				Back to Pok�Wiki
			</a>
		</div>

		<!-- Main Pokemon Card -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl">
			<div class="grid md:grid-cols-2 gap-8 items-center">
				<!-- Pokemon Image -->
				<div class="text-center">
					<div class="relative">
						<img 
							src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
							alt={pokemon.name}
							class="w-80 h-80 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
						/>
						{#if species.is_legendary}
							<div class="absolute top-4 right-4 bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
								P Legendary
							</div>
						{/if}
						{#if species.is_mythical}
							<div class="absolute top-4 right-4 bg-purple-400 text-white px-3 py-1 rounded-full text-sm font-bold">
								( Mythical
							</div>
						{/if}
					</div>
                    <div>
                        <h2 class="text-2xl font-bold text-white text-center">Evolution Chain</h2>
                        <div class="flex items-center justify-center gap-4 overflow-x-auto py-2">
                            {#if evolutionStages.length === 1}
                                <div class="text-white/60 text-xs text-center px-2 py-1 bg-white/10 rounded-full">
                                    No Evolutions
                                </div>
                                {:else}
                                    {#each evolutionStages as stage, index}
                                    <div class="flex-shrink-0">
                                        <a 
                                            href="/pokemon/{stage.name}" 
                                        >
                                            <div class="bg-white/10 rounded-2xl p-4 {currentPokemonIndex === index ? 'bg-yellow-400/30 ring-4 ring-yellow-400' : 'hover:bg-white/20 hover:scale-105 transition-transform duration-300'}">
                                                <img 
                                                    src={stage.sprite} 
                                                    alt={stage.name} 
                                                    class="w-24 h-24 mx-auto mb-2 drop-shadow-lg"
                                                />
                                                <div class="text-white font-semibold capitalize text-sm mb-1">
                                                    {stage.name}
                                                </div>
                                                <div class="text-white/70 text-xs">
                                                    #{stage.id.toString().padStart(3, '0')}
                                                </div>
                                                {#if currentPokemonIndex === index}
                                                    <div class="mt-2">
                                                        <span class="bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">
                                                            Current
                                                        </span>
                                                    </div>
                                                {/if}
                                            </div>
                                        </a>
                                    </div>
                                    
                                    {#if index < evolutionStages.length - 1}
                                        <div class="flex flex-col items-center mx-2 flex-shrink-0">
                                            <svg class="w-8 h-8 text-white/60 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                                            </svg>
                                            {#if evolutionStages[index + 1].evolutionDetails}
                                                <span class="text-white/60 text-xs text-center px-2 py-1 bg-white/10 rounded-full">
                                                    {evolutionStages[index + 1].evolutionDetails}
                                                </span>
                                            {/if}
                                        </div>
                                    {/if}
                                {/each}
                            {/if}
                            
                        </div>
                    </div>
				</div>

				<!-- Pokemon Info -->
				<div class="text-white">
					<div class="mb-4">
						<h1 class="text-5xl font-bold capitalize mb-2">{pokemon.name}</h1>
						<p class="text-2xl text-white/80">#{pokemon.id.toString().padStart(3, '0')}</p>
					</div>

					<!-- Types -->
					<div class="flex gap-3 mb-6">
						{#each pokemon.types as type}
							<span class="px-4 py-2 rounded-full text-white font-semibold capitalize {typeColors[type.type.name] || 'bg-gray-500'}">
								{type.type.name}
							</span>
						{/each}
					</div>

					<!-- Description -->
					<div class="bg-white/10 rounded-2xl p-6 mb-6">
						<h3 class="text-xl font-semibold mb-3">Description</h3>
						<p class="text-white/90 leading-relaxed">{flavorText}</p>
					</div>

					<!-- Basic Info Grid -->
					<div class="grid grid-cols-2 gap-4">
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-2xl font-bold">{pokemon.height / 10}m</div>
							<div class="text-white/70">Height</div>
						</div>
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-2xl font-bold">{pokemon.weight / 10}kg</div>
							<div class="text-white/70">Weight</div>
						</div>
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-2xl font-bold">{pokemon.base_experience}</div>
							<div class="text-white/70">Base EXP</div>
						</div>
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-2xl font-bold">{species.capture_rate}</div>
							<div class="text-white/70">Catch Rate</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Section -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
			<h2 class="text-3xl font-bold text-white mb-6 text-center">Base Stats</h2>
			<div class="grid gap-4">
				{#each pokemon.stats as stat}
					<div class="flex items-center gap-4">
						<div class="w-32 text-white font-semibold capitalize text-right">
							{stat.stat.name.replace('-', ' ')}
						</div>
						<div class="w-16 text-white font-bold text-center">
							{stat.base_stat}
						</div>
						<div class="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
							<div 
								class="h-full rounded-full transition-all duration-1000 {getStatColor(stat.base_stat)}"
								style="width: {getStatPercentage(stat.base_stat)}%"
							></div>
						</div>
					</div>
				{/each}
				<!-- Total Stats -->
				<div class="border-t border-white/20 pt-4 mt-4">
					<div class="flex items-center gap-4">
						<div class="w-32 text-white font-bold text-right">Total</div>
						<div class="w-16 text-white font-bold text-center">
							{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
						</div>
						<div class="flex-1"></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Abilities Section -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
			<h2 class="text-3xl font-bold text-white mb-6 text-center">Abilities</h2>
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each pokemon.abilities as ability}
					<div class="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-colors duration-300">
						<div class="text-lg font-semibold text-white capitalize mb-2">
							{ability.ability.name.replace('-', ' ')}
						</div>
						{#if ability.is_hidden}
							<span class="inline-block bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">
								Hidden Ability
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Sprites Gallery -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8">
			<h2 class="text-3xl font-bold text-white mb-6 text-center">Sprite Gallery</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				{#if pokemon.sprites.front_default}
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<img src={pokemon.sprites.front_default} alt="Front Default" class="w-24 h-24 mx-auto mb-2" />
						<p class="text-white text-sm">Front</p>
					</div>
				{/if}
				{#if pokemon.sprites.back_default}
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<img src={pokemon.sprites.back_default} alt="Back Default" class="w-24 h-24 mx-auto mb-2" />
						<p class="text-white text-sm">Back</p>
					</div>
				{/if}
				{#if pokemon.sprites.front_shiny}
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<img src={pokemon.sprites.front_shiny} alt="Front Shiny" class="w-24 h-24 mx-auto mb-2" />
						<p class="text-white text-sm">Shiny Front</p>
					</div>
				{/if}
				{#if pokemon.sprites.back_shiny}
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<img src={pokemon.sprites.back_shiny} alt="Back Shiny" class="w-24 h-24 mx-auto mb-2" />
						<p class="text-white text-sm">Shiny Back</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>