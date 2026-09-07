<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import TeamSheet from '$lib/components/team-sheet/TeamSheet.svelte';
	import { members as league } from '$lib/global-var';

	// Rosters are 11 deep, but the loader only returns teams that have played,
	// so show progress against the drafted roster rather than a bare count.
	const roster: Record<string, number> = Object.fromEntries(
		league.map((m) => [m.name, m.teams.length])
	);

	export let data;

	let open: Record<string, boolean> = {};

	function toggle(name: string) {
		open = { ...open, [name]: !open[name] };
	}

	$: members = data.members ?? [];
	$: maxWins = Math.max(...members.map((m) => m.wins), 1);
	$: played = members.reduce((n, m) => n + m.wins + m.losses, 0);
	$: leader = members[0];
	$: empty = played === 0;
</script>

<header class="head">
	<div class="title">
		<h1>Standings</h1>
		<span class="count fig">{members.length}</span>
	</div>
	<hr class="rule" />
	<p class="sub">
		{#if empty}
			<span class="eyebrow">Awaiting first kickoff</span>
		{:else}
			<span class="eyebrow">{played} games played</span>
			<span class="dot" aria-hidden="true"></span>
			<span class="eyebrow lead">{leader.name} leads</span>
		{/if}
	</p>
</header>

{#if empty}
	<div class="empty">
		<div class="empty-mark" aria-hidden="true">—</div>
		<h2>No results yet</h2>
		<p>Records will appear here once teams start playing.</p>
	</div>
{:else}
	<ol class="board">
		{#each members as member, i (member.name)}
			{@const isOpen = !!open[member.name]}
			<li class="row" class:first={i === 0} class:open={isOpen} style="--i:{i}">
				<button
					class="line"
					aria-expanded={isOpen}
					aria-label="{member.name}, {member.wins} wins {member.losses} losses. Show teams."
					on:click={() => toggle(member.name)}
				>
					<span class="rank fig">{String(i + 1).padStart(2, '0')}</span>

					<span class="who">
						<span class="name">{member.name}</span>
						<span class="meta">
							<span class="fig">{member.teams.length}</span><span class="of">/</span><span
								class="fig">{roster[member.name] ?? member.teams.length}</span
							>
							played
							<span class="gap" aria-hidden="true"></span>
							{#if i === 0}
								<span class="tag">Leader</span>
							{:else if member.gamesBehind === 0}
								<span class="tag">Tied</span>
							{:else}
								<span class="fig">{member.gamesBehind}</span> GB
							{/if}
						</span>
					</span>

					<span class="record">
						<span class="w fig">{member.wins}</span>
						<span class="slash" aria-hidden="true">–</span>
						<span class="l fig">{member.losses}</span>
					</span>

					<svg class="chev" viewBox="0 0 10 6" aria-hidden="true">
						<path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4" />
					</svg>
				</button>

				<div class="field" aria-hidden="true">
					<div class="turf" style="--pct:{(member.wins / maxWins) * 100}%"></div>
				</div>

				{#if isOpen}
					<div class="sheet" transition:slide={{ duration: 280, easing: quintOut }}>
						<TeamSheet {member} />
					</div>
				{/if}
			</li>
		{/each}
	</ol>
{/if}

<style>
	/* ---------- header ---------- */
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

	.dot {
		width: 3px;
		height: 3px;
		background: var(--line);
		border-radius: 50%;
	}

	.lead {
		color: var(--accent);
	}

	/* ---------- board ---------- */
	.board {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}

	.row {
		border-bottom: 1px solid var(--line);
		animation: rise var(--slow) var(--ease) backwards;
		animation-delay: calc(var(--i) * 55ms);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}

	.line {
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr auto auto;
		align-items: center;
		gap: var(--s-4);
		padding: var(--s-3) var(--s-2);
		background: none;
		border: 0;
		color: inherit;
		font: inherit;
		text-align: left;
		cursor: pointer;
		min-height: var(--tap);
		transition: background var(--fast) var(--ease);
	}

	.line:hover {
		background: var(--ink-800);
	}

	/* rank */
	.rank {
		font-size: 1rem;
		color: var(--chalk-3);
		width: 2ch;
		transition: color var(--fast) var(--ease);
	}

	.first .rank {
		color: var(--accent);
	}

	/* name block */
	.who {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.name {
		font-family: var(--body);
		font-weight: 600;
		font-size: 1.6rem;
		line-height: 1.1;
		letter-spacing: -0.01em;
	}

	.first .name {
		color: var(--accent);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-family: var(--display);
		font-weight: 700;
		color: var(--chalk-3);
	}

	.meta .fig {
		font-family: var(--figure);
		font-weight: 400;
		letter-spacing: 0;
		color: var(--chalk-2);
	}

	.of {
		color: var(--line);
		margin-inline: 0.1em;
	}

	.gap {
		width: 10px;
		height: 1px;
		background: var(--line);
	}

	.tag {
		color: var(--accent-deep);
	}

	/* record */
	.record {
		display: flex;
		align-items: baseline;
		gap: 0.15em;
		font-size: 1.5rem;
	}

	.w {
		color: var(--chalk);
	}

	.slash {
		color: var(--chalk-3);
		font-size: 0.9em;
	}

	.l {
		color: var(--chalk-3);
	}

	.first .w {
		color: var(--accent);
	}

	/* chevron */
	.chev {
		width: 12px;
		height: 8px;
		color: var(--chalk-3);
		transition:
			transform var(--mid) var(--ease),
			color var(--fast) var(--ease);
	}

	.line:hover .chev {
		color: var(--chalk);
	}

	.open .chev {
		transform: rotate(180deg);
		color: var(--accent);
	}

	/* ---------- the field: wins as yardage ---------- */
	.field {
		height: 7px;
		margin: 0 var(--s-2) var(--s-3);
		background-color: var(--ink-600);
		background-image: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			rgba(236, 231, 217, 0.14) calc(10% - 1px) 10%
		);
		overflow: hidden;
	}

	.turf {
		height: 100%;
		width: var(--pct);
		/* Chalk for the pack, flag yellow for the leader — same weight so
		   the lengths stay comparable at a glance. */
		background: linear-gradient(90deg, #24463a, var(--chalk-3));
		transform-origin: left;
		animation: drive 900ms var(--ease) backwards;
		animation-delay: calc(var(--i) * 55ms + 120ms);
		transition: filter var(--fast) var(--ease);
	}

	.first .turf {
		background: linear-gradient(90deg, var(--accent-deep), var(--accent));
	}

	.row:hover .turf {
		filter: brightness(1.35);
	}

	@keyframes drive {
		from {
			transform: scaleX(0);
		}
	}

	.sheet {
		padding: 0 var(--s-2) var(--s-5);
	}

	/* ---------- empty ---------- */
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

	/* ---------- mobile ---------- */
	@media (max-width: 640px) {
		.line {
			grid-template-columns: auto 1fr auto;
			gap: var(--s-3);
			padding: var(--s-3) 0;
		}

		.chev {
			display: none;
		}

		.name {
			font-size: 1.25rem;
		}

		.record {
			font-size: 1.2rem;
		}

		.meta {
			font-size: 0.66rem;
		}

		.field {
			margin-inline: 0;
		}

		.sheet {
			padding-inline: 0;
		}
	}
</style>
