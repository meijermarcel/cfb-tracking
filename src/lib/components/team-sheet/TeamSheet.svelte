<script lang="ts">
	import type { MemberStanding } from '$lib/types';
	import { members as league } from '$lib/global-var';

	export let member: MemberStanding;

	// The standings loader only returns teams that have a record, so a team that
	// hasn't kicked off yet would silently vanish from the roster. Merge the
	// drafted roster back in and show those as pending.
	$: drafted = league.find((m) => m.name === member.name)?.teams ?? [];
	$: pending = drafted
		.filter((name) => !member.teams.some((t) => t.name === name))
		.map((name) => ({ name, wins: 0, losses: 0, img: '', pending: true }));
	$: rows = [...member.teams.map((t) => ({ ...t, pending: false })), ...pending];

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

	function verdict(w: number, l: number) {
		if (w > l) return 'up';
		if (l > w) return 'down';
		return 'even';
	}
</script>

<div class="sheet">
	<div class="cap">
		<span class="eyebrow">Roster</span>
		<span class="eyebrow num fig">{rows.length}</span>
	</div>

	<ul class="grid">
		{#each rows as team, i (team.name)}
			<li class="chip {team.pending ? 'pending' : verdict(team.wins, team.losses)}" style="--i:{i}">
				<span class="crest">
					{#if team.img && !failed[team.name]}
						<img src={team.img} alt="" loading="lazy" on:error={() => fallback(team.name)} />
					{:else}
						<span class="mono">{initials(team.name)}</span>
					{/if}
				</span>
				<span class="team">{team.name}</span>
				<span class="rec fig">{team.wins}<span class="s">–</span>{team.losses}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.sheet {
		border-top: 1px solid var(--line-soft);
		padding-top: var(--s-3);
	}

	.cap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--s-3);
	}

	.num {
		color: var(--chalk-3);
		font-family: var(--figure);
		letter-spacing: 0;
	}

	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 1px;
		background: var(--line-soft);
		border: 1px solid var(--line-soft);
	}

	.chip {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3);
		background: var(--ink-800);
		position: relative;
		animation: fade 340ms var(--ease) backwards;
		animation-delay: calc(var(--i) * 22ms);
		transition: background var(--fast) var(--ease);
	}

	.chip:hover {
		background: var(--ink-600);
	}

	/* result spine */
	.chip::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--line);
	}

	.chip.up::before {
		background: var(--win);
	}

	.chip.down::before {
		background: var(--loss);
	}

	/* Drafted but yet to play */
	.chip.pending {
		background: var(--ink-900);
	}

	.chip.pending .team,
	.chip.pending .crest {
		opacity: 0.75;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.crest {
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		background: var(--chalk);
		border-radius: var(--r-sm);
		overflow: hidden;
		flex-shrink: 0;
	}

	.crest img {
		width: 22px;
		height: 22px;
		object-fit: contain;
	}

	.mono {
		font-family: var(--display);
		font-weight: 800;
		font-size: 0.68rem;
		color: var(--ink-900);
		letter-spacing: 0.02em;
	}

	.team {
		font-family: var(--body);
		font-size: 0.95rem;
		line-height: 1.2;
		color: var(--chalk-2);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chip.up .team {
		color: var(--chalk);
	}

	.rec {
		font-size: 0.85rem;
		color: var(--chalk-3);
	}

	.chip.up .rec {
		color: var(--win);
	}

	.chip.down .rec {
		color: var(--loss);
	}

	.s {
		opacity: 0.5;
		margin-inline: 0.1em;
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		}

		.chip {
			padding: var(--s-2) var(--s-3);
			gap: var(--s-2);
		}

		.team {
			font-size: 0.85rem;
		}

		.crest {
			width: 22px;
			height: 22px;
		}

		.crest img {
			width: 18px;
			height: 18px;
		}
	}
</style>
