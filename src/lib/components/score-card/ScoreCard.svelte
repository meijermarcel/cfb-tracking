<script lang="ts">
	import type { GameScore, GameTeam } from '$lib/types';
	import MemberView from './member-view/MemberView.svelte';

	export let game: GameScore;

	let failed: Record<string, boolean> = {};

	function fallback(name: string) {
		failed = { ...failed, [name]: true };
	}

	function initials(name: string) {
		return name
			.replace(/[^A-Za-z ]/g, '')
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join('')
			.toUpperCase();
	}

	function sanitize(score: number) {
		return isNaN(score) ? '·' : score;
	}

	function quarters(team: GameTeam) {
		return [team.first_quarter, team.second_quarter, team.third_quarter, team.fourth_quarter];
	}

	$: label = game.status === 'live' ? 'Live' : game.status === 'scheduled' ? 'Scheduled' : 'Final';
	$: headToHead = !!game.away_team.member_name && !!game.home_team.member_name;
	$: teams = [game.away_team, game.home_team];
</script>

<article class="card" class:live={game.status === 'live'} class:h2h={headToHead}>
	<header class="top">
		<span class="status" class:live={game.status === 'live'}>
			<span class="dot" aria-hidden="true"></span>
			{label}
		</span>
		{#if headToHead}
			<span class="h2h-tag">Head to head</span>
		{:else if game.channel}
			<span class="chan">{game.channel}</span>
		{/if}
	</header>

	<div class="teams">
		{#each teams as team (team.name + (team.member_name ?? ''))}
			<div class="team" class:won={team.result === 'win'} class:lost={team.result === 'loss'}>
				<span class="crest">
					{#if team.img && !failed[team.name]}
						<img src={team.img} alt="" loading="lazy" on:error={() => fallback(team.name)} />
					{:else}
						<span class="mono">{initials(team.name)}</span>
					{/if}
				</span>

				<span class="name">{team.name}</span>

				{#if game.status === 'live'}
					<span class="qs fig" aria-hidden="true">
						{#each quarters(team) as q}
							<span class="q">{sanitize(q)}</span>
						{/each}
					</span>
				{/if}

				{#if game.status !== 'scheduled'}
					<span class="total fig">{sanitize(team.total)}</span>
				{:else}
					<span class="total fig muted">·</span>
				{/if}
			</div>
		{/each}
	</div>

	{#if game.away_team.member_name || game.home_team.member_name || game.status !== 'final'}
		<footer class="bottom">
			<span class="owners">
				<MemberView team={game.away_team} />
				{#if headToHead}<span class="v">v</span>{/if}
				<MemberView team={game.home_team} />
			</span>
			{#if game.status !== 'final' && game.time}
				<span class="time fig">{game.time}</span>
			{/if}
		</footer>
	{/if}
</article>

<style>
	.card {
		border: 1px solid var(--line);
		background: var(--ink-800);
		display: flex;
		flex-direction: column;
		transition:
			border-color var(--fast) var(--ease),
			background var(--fast) var(--ease);
	}

	.card:hover {
		border-color: var(--chalk-3);
		background: var(--ink-700);
	}

	.card.live {
		border-color: rgba(255, 90, 54, 0.45);
	}

	.card.h2h {
		border-color: var(--accent-deep);
	}

	/* ---- top bar ---- */
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-bottom: 1px solid var(--line-soft);
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.7rem;
		color: var(--chalk-3);
	}

	.status.live {
		color: var(--live);
	}

	.dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: currentColor;
	}

	.status.live .dot {
		animation: pulse 1.4s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			box-shadow: 0 0 0 0 rgba(255, 90, 54, 0.55);
		}
		70% {
			opacity: 0.7;
			box-shadow: 0 0 0 6px rgba(255, 90, 54, 0);
		}
	}

	.chan,
	.h2h-tag {
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.66rem;
		color: var(--chalk-3);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 55%;
	}

	.h2h-tag {
		color: var(--accent);
	}

	/* ---- teams ---- */
	.teams {
		padding: var(--s-2) var(--s-3);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.team {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) 0;
	}

	.crest {
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		background: var(--chalk);
		border-radius: var(--r-sm);
		overflow: hidden;
	}

	.crest img {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}

	.mono {
		font-family: var(--display);
		font-weight: 800;
		font-size: 0.62rem;
		color: var(--ink-900);
	}

	.name {
		font-family: var(--body);
		font-size: 1rem;
		line-height: 1.15;
		color: var(--chalk-2);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.team.won .name {
		color: var(--chalk);
		font-weight: 600;
	}

	.team.lost .name {
		color: var(--chalk-3);
	}

	.qs {
		display: flex;
		gap: 2px;
		margin-left: auto;
	}

	.q {
		width: 1.5rem;
		text-align: center;
		font-size: 0.7rem;
		color: var(--chalk-3);
		background: var(--ink-700);
		padding: 1px 0;
	}

	.total {
		font-size: 1.25rem;
		color: var(--chalk-2);
		min-width: 2.2ch;
		text-align: right;
	}

	.team.won .total {
		color: var(--accent);
	}

	.team.lost .total {
		color: var(--chalk-3);
	}

	.muted {
		color: var(--line);
	}

	/* ---- bottom ---- */
	.bottom {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-2);
		padding: var(--s-2) var(--s-3);
		border-top: 1px solid var(--line-soft);
		background: var(--ink-900);
		flex-wrap: wrap;
	}

	.owners {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
		flex-wrap: wrap;
	}

	.v {
		font-family: var(--body);
		font-style: italic;
		font-size: 0.8rem;
		color: var(--chalk-3);
	}

	.time {
		font-size: 0.7rem;
		color: var(--chalk-3);
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.name {
			font-size: 0.92rem;
		}

		.q {
			width: 1.25rem;
			font-size: 0.64rem;
		}

		.total {
			font-size: 1.1rem;
		}
	}
</style>
