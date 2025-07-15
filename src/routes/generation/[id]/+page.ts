import type { PageLoad } from './$types';
import type { Generation, Region } from '$lib';

export const load: PageLoad = async ({ params, fetch }) => {
	const { id } = params;
	
	try {
		// Fetch generation data
		const generationResponse = await fetch(`https://pokeapi.co/api/v2/generation/${id.toLowerCase()}`);
		if (!generationResponse.ok) {
			throw new Error(`Generation ${id} not found`);
		}
		const generation: Generation = await generationResponse.json();
		
		// Fetch region data
		const regionResponse = await fetch(generation.main_region.url);
		const region: Region = await regionResponse.json();
		
		return {
			generation,
			region
		};
	} catch (error) {
		throw new Error(`Failed to load Generation: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};