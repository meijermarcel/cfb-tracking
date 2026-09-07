<script lang="ts">
	import type { PageData } from './$types';
	import ScoreCard from '$lib/components/score-card/ScoreCard.svelte';
	import { currentWeek, weeks } from '$lib/global-var';

	export let data: PageData;

	// The loader always returns the live slate, so label it by today's week
	// rather than the URL slug — that way the heading can never lie.
	const week = currentWeek();
	const period = weeks.find((w) => w.week_number === week)?.period ?? '';

	$: sections = [
		{ key: 'live', title: 'Live', games: data.live_games },
		{ key: 'final', title: 'Final', games: data.final_games },
		{ key: 'scheduled', title: 'Upcoming', games: data.scheduled_games }
	].filter((s) => s.games.length > 0);

	$: total = data.live_games.length + data.final_games.length + data.scheduled_games.length;
</script>

<header class="head">
	<div class="title">
		<h1>Scores</h1>
		<span class="count fig">{total}</span>
	</div>
	<hr class="rule" />
	<p class="sub">
		<span class="eyebrow">Week {week}</span>
		<span class="dot" aria-hidden="true"></span>
		<span class="eyebrow soft">{period}</span>
		<span class="dot" aria-hidden="true"></span>
		<span class="eyebrow soft">League teams only</span>
	</p>
</header>

{#if total === 0}
	<div class="empty">
		<div class="empty-mark" aria-hidden="true">—</div>
		<h2>Nothing on the board</h2>
		<p>No league teams are playing right now. Check back on gameday.</p>
	</div>
{:else}
	{#each sections as section, s (section.key)}
		<section class="block" style="--s:{s}">
			<div class="block-head">
				<h2 class:hot={section.key === 'live'}>{section.title}</h2>
				<span class="tally fig">{section.games.length}</span>
				<hr class="rule flex" />
			</div>
			<div class="grid">
				{#each section.games as game, i (section.key + i)}
					<div class="cell" style="--i:{i}">
						<ScoreCard {game} />
					</div>
				{/each}
			</div>
		</section>
	{/each}
{/if}

<style>
	.head {
		margin-bottom: var(--s-6);
	}

	.title {
		display: flex;
		align-items: flex-start;
		gap: var(--s-3);
		margin-bottom: var(--s-3);
	}

	h1 {
		font-size: clamp(3.2rem, 12vw, 5.6rem);
		letter-spacing: -0.015em;
	}

	.count {
		font-size: 0.8rem;
		color: var(--accent);
		padding-top: 0.5em;
	}

	.sub {
		margin: var(--s-3) 0 0;
		display: flex;
		align-items: center;
		gap: var(--s-3);
		flex-wrap: wrap;
	}

	.soft {
		color: var(--chalk-3);
	}

	.dot {
		width: 3px;
		height: 3px;
		background: var(--line);
		border-radius: 50%;
	}

	/* ---- sections ---- */
	.block {
		margin-bottom: var(--s-7);
		animation: rise var(--slow) var(--ease) backwards;
		animation-delay: calc(var(--s) * 90ms);
	}

	.block-head {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		margin-bottom: var(--s-4);
	}

	.block-head h2 {
		font-size: 1.5rem;
		letter-spacing: 0.02em;
	}

	.block-head h2.hot {
		color: var(--live);
	}

	.tally {
		font-size: 0.75rem;
		color: var(--chalk-3);
	}

	.flex {
		flex: 1;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--s-3);
	}

	.cell {
		display: flex;
		animation: rise 420ms var(--ease) backwards;
		animation-delay: calc(var(--i) * 40ms + 120ms);
	}

	.cell > :global(*) {
		width: 100%;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	/* ---- empty ---- */
	.empty {
		border: 1px solid var(--line);
		padding: var(--s-8) var(--s-5);
		text-align: center;
	}

	.empty-mark {
		font-family: var(--display);
		font-size: 3rem;
		color: var(--line);
		line-height: 1;
	}

	.empty h2 {
		font-size: 1.6rem;
		margin: var(--s-3) 0 var(--s-2);
	}

	.empty p {
		margin: 0;
		color: var(--chalk-3);
		font-size: 0.95rem;
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.block {
			margin-bottom: var(--s-6);
		}
	}
</style>
