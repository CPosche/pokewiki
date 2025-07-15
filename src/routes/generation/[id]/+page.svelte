<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: generation = data.generation;
	$: region = data.region;
	
	// Get the English name
	$: displayName = generation.names
		.find(name => name.language.name === 'en')
		?.name || generation.name;
	
	$: regionDisplayName = region.names
		.find(name => name.language.name === 'en')
		?.name || region.name;
	
	// Map region names to their corresponding image URLs
	const getRegionMapUrl = (regionName: string) => {
		const regionMaps: Record<string, string> = {
			kanto: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/kanto.png',
			johto: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/johto.png',
			hoenn: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/hoenn.png',
			sinnoh: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/sinnoh.png',
			unova: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/unova.png',
			kalos: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/kalos.png',
			alola: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/alola.png',
			galar: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/galar.png',
			paldea: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/paldea.png'
		};
		return regionMaps[regionName.toLowerCase()];
	};
	
	$: regionMapUrl = getRegionMapUrl(region.name);
</script>

<svelte:head>
	<title>{displayName} - PokeWiki</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500">
	<div class="container mx-auto px-4 py-8">
		<!-- Back Button -->
		<div class="mb-6">
			<a href="/" class="inline-flex items-center text-white hover:text-yellow-300 transition-colors duration-300">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
				</svg>
				Back to PokeWiki
			</a>
		</div>

		<!-- Main Generation Card -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-2xl">
			<div class="text-center text-white">
				<div class="mb-4">
					<h1 class="text-5xl font-bold mb-2">{displayName}</h1>
					<p class="text-2xl text-white/80">Generation {generation.id}</p>
				</div>

				<!-- Main Region -->
				<div class="bg-white/10 rounded-2xl p-6 mb-6 w-full">
					<h3 class="text-xl font-semibold mb-3">Main Region</h3>
					<p class="text-white/90 text-lg capitalize mb-4">{regionDisplayName}</p>
					{#if regionMapUrl}
						<div class="flex justify-center">
							<img 
								src={regionMapUrl} 
								alt="{regionDisplayName} region map"
								class="max-w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
								style="max-height: 400px;"
							/>
						</div>
					{/if}
				</div>

				<!-- Stats Grid -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<div class="text-2xl font-bold">{generation.pokemon_species.length}</div>
						<div class="text-white/70">Pokemon Species</div>
					</div>
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<div class="text-2xl font-bold">{generation.moves.length}</div>
						<div class="text-white/70">New Moves</div>
					</div>
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<div class="text-2xl font-bold">{generation.abilities.length}</div>
						<div class="text-white/70">New Abilities</div>
					</div>
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<div class="text-2xl font-bold">{generation.types.length}</div>
						<div class="text-white/70">New Types</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Pokemon Species Section -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
			<h2 class="text-3xl font-bold text-white mb-6 text-center">Pokemon Species</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
				{#each generation.pokemon_species as species}
					<a 
						href="/pokemon/{species.name}" 
						class="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-colors duration-300 group"
					>
						<div class="text-white capitalize font-medium group-hover:text-yellow-300 transition-colors duration-300">
							{species.name}
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Version Groups Section -->
		<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
			<h2 class="text-3xl font-bold text-white mb-6 text-center">Version Groups</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each generation.version_groups as versionGroup}
					<div class="bg-white/10 rounded-xl p-4 text-center">
						<div class="text-white capitalize font-medium">
							{versionGroup.name.replace('-', ' ')}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- New Moves Section -->
		{#if generation.moves.length > 0}
			<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8">
				<h2 class="text-3xl font-bold text-white mb-6 text-center">New Moves</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
					{#each generation.moves as move}
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-white capitalize font-medium">
								{move.name.replace('-', ' ')}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- New Abilities Section -->
		{#if generation.abilities.length > 0}
			<div class="bg-white/20 backdrop-blur-md rounded-3xl p-8">
				<h2 class="text-3xl font-bold text-white mb-6 text-center">New Abilities</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{#each generation.abilities as ability}
						<div class="bg-white/10 rounded-xl p-4 text-center">
							<div class="text-white capitalize font-medium">
								{ability.name.replace('-', ' ')}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>