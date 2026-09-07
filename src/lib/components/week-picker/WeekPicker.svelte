<script lang="ts">
	import { weeks, currentWeek } from '$lib/global-var';

	export let selectedWeek = currentWeek();

	const span = 5;

	// Keep the selected week centred in the strip, clamped to the season.
	$: start = Math.min(
		Math.max(0, selectedWeek - 1 - Math.floor(span / 2)),
		Math.max(0, weeks.length - span)
	);
	$: shown = weeks.slice(start, start + span);
</script>

<nav class="strip" aria-label="Week">
	{#each shown as week (week.week_number)}
		<a
			href="/scores/{week.week_number}"
			class:on={week.week_number === selectedWeek}
			aria-current={week.week_number === selectedWeek ? 'page' : undefined}
		>
			<span class="n fig">{String(week.week_number).padStart(2, '0')}</span>
			<span class="p">{week.period}</span>
		</a>
	{/each}
</nav>

<style>
	.strip {
		display: flex;
		gap: 1px;
		background: var(--line-soft);
		border: 1px solid var(--line-soft);
		overflow-x: auto;
	}

	a {
		flex: 1 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: var(--s-2) var(--s-3);
		background: var(--ink-800);
		min-height: var(--tap);
		justify-content: center;
		transition:
			background var(--fast) var(--ease),
			color var(--fast) var(--ease);
	}

	a:hover {
		background: var(--ink-600);
	}

	a.on {
		background: var(--accent);
	}

	.n {
		font-size: 0.85rem;
		color: var(--chalk);
	}

	.p {
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 0.6rem;
		color: var(--chalk-3);
		white-space: nowrap;
	}

	a.on .n,
	a.on .p {
		color: var(--ink-900);
	}
</style>
