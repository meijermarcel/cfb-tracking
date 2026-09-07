<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { currentWeek, seasonYear, weeks } from '$lib/global-var';

	const week = currentWeek();
	const period = weeks.find((w) => w.week_number === week)?.period ?? '';

	$: pathname = $page.url.pathname;
	$: onScores = pathname.startsWith('/scores');
</script>

<nav>
	<div class="bar">
		<a class="brand" href="/" aria-label="CFB {seasonYear} home">
			<span class="mark">CFB</span><span class="yr">{String(seasonYear).slice(2)}</span>
			<span class="sep" aria-hidden="true"></span>
			<span class="kicker">Press<br />Box</span>
		</a>

		<div class="tabs">
			<a href="/" class:active={!onScores} data-sveltekit-preload-data>
				Standings
				<span class="ink" aria-hidden="true"></span>
			</a>
			<a href="/scores/{week}" class:active={onScores} data-sveltekit-preload-data>
				Scores
				<span class="ink" aria-hidden="true"></span>
			</a>
		</div>
	</div>
	<div class="ticker">
		<span class="eyebrow">Week {week}</span>
		<span class="dash" aria-hidden="true"></span>
		<span class="period fig">{period}</span>
	</div>
</nav>

<main class="shell">
	{#if $navigating}
		<div class="loading" role="status" aria-live="polite">
			<div class="chains" aria-hidden="true"><i></i><i></i><i></i></div>
			<span class="eyebrow">Measuring…</span>
		</div>
	{:else}
		<slot />
	{/if}
</main>

<footer>
	<hr class="rule" />
	<div class="foot">
		<span class="eyebrow">twelveminusfive</span>
		<span class="eyebrow dim">{seasonYear} Season</span>
	</div>
</footer>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(8, 11, 9, 0.86);
		backdrop-filter: blur(14px) saturate(1.2);
		-webkit-backdrop-filter: blur(14px) saturate(1.2);
		border-bottom: 1px solid var(--line);
	}

	.bar {
		max-width: var(--shell);
		margin: 0 auto;
		padding: var(--s-3) var(--s-5);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-4);
	}

	/* ---- wordmark ---- */
	.brand {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		min-width: 0;
	}

	.mark,
	.yr {
		font-family: var(--display);
		font-weight: 900;
		font-size: 2rem;
		line-height: 0.8;
		letter-spacing: -0.01em;
	}

	.mark {
		color: var(--chalk);
	}

	.yr {
		color: var(--accent);
	}

	.sep {
		width: 1px;
		align-self: stretch;
		background: var(--line);
		margin-inline: var(--s-1);
	}

	.kicker {
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		font-size: 0.6rem;
		line-height: 1.05;
		color: var(--chalk-3);
	}

	/* ---- tabs ---- */
	.tabs {
		display: flex;
		gap: var(--s-2);
	}

	.tabs a {
		position: relative;
		font-family: var(--display);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.13em;
		font-size: 0.92rem;
		color: var(--chalk-3);
		padding: var(--s-3) var(--s-3) calc(var(--s-3) - 2px);
		display: flex;
		align-items: center;
		min-height: var(--tap);
		transition: color var(--fast) var(--ease);
	}

	.tabs a:hover {
		color: var(--chalk);
	}

	.tabs a.active {
		color: var(--chalk);
	}

	/* underline sweeps in from the left */
	.ink {
		position: absolute;
		left: var(--s-3);
		right: var(--s-3);
		bottom: 0;
		height: 2px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform var(--mid) var(--ease);
	}

	.tabs a.active .ink,
	.tabs a:hover .ink {
		transform: scaleX(1);
	}

	.tabs a:hover .ink {
		background: var(--line);
	}

	.tabs a.active:hover .ink {
		background: var(--accent);
	}

	/* ---- week ticker ---- */
	.ticker {
		border-top: 1px solid var(--line-soft);
		background: var(--ink-800);
	}

	.ticker {
		max-width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-2) var(--s-5);
	}

	.dash {
		width: 14px;
		height: 1px;
		background: var(--line);
	}

	.period {
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--chalk-3);
	}

	/* ---- shell ---- */
	main {
		max-width: var(--shell);
		margin: 0 auto;
		padding: var(--s-7) var(--s-5) var(--s-8);
		min-height: 60vh;
	}

	/* ---- loading: the chain crew ---- */
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--s-4);
		min-height: 44vh;
	}

	.chains {
		display: flex;
		gap: var(--s-2);
		align-items: flex-end;
		height: 34px;
	}

	.chains i {
		display: block;
		width: 4px;
		height: 34px;
		background: var(--accent);
		transform-origin: bottom;
		animation: chain 900ms var(--ease) infinite;
	}

	.chains i:nth-child(2) {
		animation-delay: 130ms;
		background: var(--accent-deep);
	}
	.chains i:nth-child(3) {
		animation-delay: 260ms;
	}

	@keyframes chain {
		0%,
		100% {
			transform: scaleY(0.28);
			opacity: 0.45;
		}
		50% {
			transform: scaleY(1);
			opacity: 1;
		}
	}

	/* ---- footer ---- */
	footer {
		max-width: var(--shell);
		margin: 0 auto;
		padding: 0 var(--s-5) var(--s-6);
	}

	.foot {
		padding-top: var(--s-4);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--s-3);
	}

	.dim {
		color: var(--line);
	}

	@media (max-width: 640px) {
		.bar {
			padding: var(--s-3) var(--s-4);
		}

		.mark,
		.yr {
			font-size: 1.6rem;
		}

		.kicker {
			display: none;
		}

		.sep {
			display: none;
		}

		.tabs a {
			font-size: 0.8rem;
			padding-inline: var(--s-2);
			letter-spacing: 0.1em;
		}

		.ink {
			left: var(--s-2);
			right: var(--s-2);
		}

		main {
			padding: var(--s-5) var(--s-4) var(--s-7);
		}

		footer {
			padding-inline: var(--s-4);
		}
	}
</style>
