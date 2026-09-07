<script lang="ts">
	import type { GameTeam } from '$lib/types';

	export let team: GameTeam;
</script>

{#if team.member_name}
	<span class="owner" class:won={team.result === 'win'} class:lost={team.result === 'loss'}>
		<span class="pip" aria-hidden="true"></span>
		<span class="who">{team.member_name}</span>
	</span>
{/if}

<style>
	.owner {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		padding: 3px var(--s-2);
		border: 1px solid var(--line);
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 0.72rem;
		color: var(--chalk-2);
		white-space: nowrap;
	}

	.pip {
		width: 5px;
		height: 5px;
		background: var(--chalk-3);
	}

	.owner.won {
		color: var(--ink-900);
		background: var(--win);
		border-color: var(--win);
	}

	.owner.won .pip {
		background: var(--ink-900);
	}

	.owner.lost {
		color: var(--chalk-3);
		border-color: var(--line-soft);
	}

	.owner.lost .pip {
		background: var(--loss);
	}
</style>
