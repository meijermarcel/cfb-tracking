import axios from 'axios';
import * as cheerio from 'cheerio';
import type { GameScore, GameTeam } from '$lib/types';
import { members } from '$lib/global-var';

function setGameResult(game: any) {
	if (game.status === 'final') {
		if (game.away_team.total > game.home_team.total) {
			game.away_team.result = 'win';
			game.home_team.result = 'loss';
		} else if (game.away_team.total < game.home_team.total) {
			game.away_team.result = 'loss';
			game.home_team.result = 'win';
		} else {
			game.away_team.result = 'tie';
			game.home_team.result = 'tie';
		}
	}
}

export const load = async ({ params }) => {
	// const url = `https://www.cbssports.com/college-football/scoreboard/FBS/2023/regular/${params.slug}/?layout=compact`;
	const url = 'https://www.cbssports.com/college-football/scoreboard/';

	return axios
		.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			},
			timeout: 10000
		})
		.then((response) => {
			// Load HTML we fetched in the previous line
			const $ = cheerio.load(response.data);
			// get all div with class score-cards
			const scoreCards = $('.score-cards');
			const games: GameScore[] = [];
			// get each of scoreCards child divs
			scoreCards.children().each((index: number, element: any) => {
				// get child with class 'live-update'
				const liveUpdate = $(element).find('.live-update');
				if (liveUpdate.length) {
					const table = liveUpdate.find('table');
					const thead = table.find('thead');
					let game;
					if (thead.length) {
						let status = 'live';
						// check if postgame
						const postgame = liveUpdate.find('.postgame');
						if (postgame.length) {
							status = postgame.text();
							if (status.includes('final')) status = 'final';
						}
						// live/final game
						const trs = table.find('tbody').find('tr');
						const awayTeamName = trs.eq(0).find('.team-name-link').text();
						const homeTeamName = trs.eq(1).find('.team-name-link').text();
						const awayMemberName = members.find((member) =>
							member.teams.includes(awayTeamName)
						)?.name;
						const homeMemberName = members.find((member) =>
							member.teams.includes(homeTeamName)
						)?.name;

						game = {
							away_team: {
								name: awayTeamName,
								img: trs.eq(0).find('.team-details-wrapper').find('img').attr('src') || '',
								first_quarter: parseInt(trs.eq(0).find('td').eq(1).text()),
								second_quarter: parseInt(trs.eq(0).find('td').eq(2).text()),
								third_quarter: parseInt(trs.eq(0).find('td').eq(3).text()),
								fourth_quarter: parseInt(trs.eq(0).find('td').eq(4).text()),
								total: parseInt(trs.eq(0).find('.total').text()),
								member_name: awayMemberName,
								result: '',
								memberName: awayMemberName || '',
								logoSrc: trs.eq(0).find('.team-details-wrapper').find('img').attr('src') || '',
								score: parseInt(trs.eq(0).find('.total').text())
							},
							home_team: {
								name: homeTeamName,
								img: trs.eq(1).find('.team-details-wrapper').find('img').attr('src') || '',
								first_quarter: parseInt(trs.eq(1).find('td').eq(1).text()),
								second_quarter: parseInt(trs.eq(1).find('td').eq(2).text()),
								third_quarter: parseInt(trs.eq(1).find('td').eq(3).text()),
								fourth_quarter: parseInt(trs.eq(1).find('td').eq(4).text()),
								total: parseInt(trs.eq(1).find('.total').text()),
								member_name: homeMemberName,
								result: '',
								memberName: homeMemberName || '',
								logoSrc: trs.eq(1).find('.team-details-wrapper').find('img').attr('src') || '',
								score: parseInt(trs.eq(1).find('.total').text())
							},
							status: status,
							time: liveUpdate.find('.ingame').find('.game-status').text(),
							channel: liveUpdate.find('.broadcaster').text()
						};
					} else {
						// scheduled games
						const trs = table.find('tbody').find('tr');
						const awayTeamName = trs.eq(0).find('.team-name-link').text();
						const homeTeamName = trs.eq(1).find('.team-name-link').text();
						const awayMemberName = members.find((member) =>
							member.teams.includes(awayTeamName)
						)?.name;
						const homeMemberName = members.find((member) =>
							member.teams.includes(homeTeamName)
						)?.name;

						game = {
							away_team: {
								name: awayTeamName,
								img: trs.eq(0).find('.team-details-wrapper').find('img').attr('src') || '',
								first_quarter: 0,
								second_quarter: 0,
								third_quarter: 0,
								fourth_quarter: 0,
								total: 0,
								member_name: awayMemberName,
								result: '',
								memberName: awayMemberName || '',
								logoSrc: trs.eq(0).find('.team-details-wrapper').find('img').attr('src') || '',
								score: 0
							},
							home_team: {
								name: homeTeamName,
								img: trs.eq(1).find('.team-details-wrapper').find('img').attr('src') || '',
								first_quarter: 0,
								second_quarter: 0,
								third_quarter: 0,
								fourth_quarter: 0,
								total: 0,
								member_name: homeMemberName,
								result: '',
								memberName: homeMemberName || '',
								logoSrc: trs.eq(1).find('.team-details-wrapper').find('img').attr('src') || '',
								score: 0
							},
							status: 'scheduled',
							time: liveUpdate.find('.pregame').find('.game-status').find('formatter').text(),
							channel: liveUpdate.find('.broadcaster').text()
						};
						console.log(liveUpdate.find('.game-status').eq(0));
					}
					if (game.away_team.member_name || game.home_team.member_name) {
						setGameResult(game);
						games.push(game);
					}
				}
			});
			// group games by live, scheduled, final
			const live_games = games.filter((game) => game.status === 'live');
			const scheduled_games = games.filter((game) => game.status === 'scheduled');
			const final_games = games.filter(
				(game) => game.status !== 'live' && game.status !== 'scheduled'
			);

			// console.log(live_games);
			console.log(scheduled_games);
			// console.log(final_games);

			return {
				live_games,
				scheduled_games,
				final_games
			};
		})
		.catch((error) => {
			// Upstream is flaky; degrade to an empty slate instead of a 500.
			console.error('Error fetching scoreboard:', error.message);
			return { live_games: [], scheduled_games: [], final_games: [] };
		});
};
