import { MemberStanding } from '$lib/types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { members } from '$lib/global-var';

let standings: MemberStanding[] = [];

const url = 'https://www.cbssports.com/college-football/standings/';
// export const load = (async ({ fetch, params }) => {
// 	return { members: standings };
// }) satisfies Standings;

// function to reset standings
const resetStandings = () => {
	standings = [
		new MemberStanding('Marcel'),
		new MemberStanding('Nate'),
		new MemberStanding('Bob'),
		new MemberStanding('Tom'),
		new MemberStanding('Carter'),
		new MemberStanding('Matt')
	];
};

export const load = async () => {
	resetStandings();

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

			const listItems = $('tbody > tr');

			listItems.each((index: number, element: any) => {
				const team = $(element).find('td').eq(0).text().trim();
				if (team) {
					const winsText = $(element).find('td').eq(5).text().trim();
					const lossesText = $(element).find('td').eq(6).text().trim();
					const wins = parseInt(winsText) || 0;
					const losses = parseInt(lossesText) || 0;

					const member = members.find((member) => member.teams.includes(team));
					const teamImg = $(element).find('td').eq(0).find('img').attr('src') || '';

					if (member) {
						const memberStanding = standings.find((standing) => standing.name === member.name);
						if (memberStanding && !isNaN(wins) && !isNaN(losses)) {
							memberStanding.wins += wins;
							memberStanding.losses += losses;
							memberStanding.teams.push({
								name: team,
								wins: wins,
								losses: losses,
								img: teamImg
							});
						}
					}
				}
				// const record = $(element).find('td').eq(2).text();
				// const runsScored = parseInt($(element).find('td').eq(7).text());
				// const diff = parseInt($(element).find('td').eq(9).text());

				// // get img src from team
				// const teamImg = $(element).find('td').eq(1).find('img').attr('src');

				// // remove leading and trailing whitespace from team name
				// const teamSanitized = team.trim();
				// // remove whitepsace from record
				// const recordSanitized = record.replace(/\s/g, '');

				// const split = recordSanitized.split('-');
				// const wins = parseInt(split[0]);
				// const losses = parseInt(split[1]);

				// // console.log(teamSanitized, wins, losses);
				// // find member that has this team

				// if (member) {
				// 	// find member in standings list
				// 	const memberStanding = standings.find((person) => person.name === member.name);
				// 	if (memberStanding) {
				// 		// add wins and losses to memberStanding
				// 		memberStanding.wins += wins;
				// 		memberStanding.losses += losses;
				// 		memberStanding.runsScored += runsScored;
				// 		memberStanding.diff += diff;
				// 		// add team to memberStanding
				// 		memberStanding.teams.push({
				// 			name: teamSanitized,
				// 			img: teamImg || '',
				// 			wins,
				// 			losses,
				// 			runsScored: runsScored,
				// 			diff: diff
				// 		});
				// 	}
				// }
			});

			// sort standings by wins, total games
			standings.sort((a, b) => b.wins - a.wins || a.wins + a.losses - (b.wins + b.losses));

			// sort each member's teams by wins, name
			standings.forEach((member) => {
				member.teams.sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));
			});

			// calculate games behind
			standings.forEach((member, index) => {
				if (index === 0) {
					member.gamesBehind = 0;
				} else {
					const leader = standings[0];
					member.gamesBehind = leader.wins - member.wins;
				}
			});

			return { members: standings };
		})
		.catch((error) => {
			console.error('Error fetching standings:', error.message);
			// Return empty standings on error
			return { members: standings };
		});
};
