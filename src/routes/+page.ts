import { MemberStanding } from '$lib/types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { members } from '$lib/global-var';

const url = 'https://www.cbssports.com/college-football/standings/';

// function to create initial standings
const createInitialStandings = (): MemberStanding[] => {
	return [
		new MemberStanding('Marcel'),
		new MemberStanding('Nate'),
		new MemberStanding('Bob'),
		new MemberStanding('Tom'),
		new MemberStanding('Carter'),
		new MemberStanding('Matt')
	];
};

export const load = async () => {
	try {
		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
			},
			timeout: 10000
		});

		// Create fresh standings array for this load
		const standings = createInitialStandings();

		console.log('Starting to parse standings data...');

		// Load HTML we fetched
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

				if (member && (wins > 0 || losses > 0)) {
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

		console.log(
			'Standings parsed successfully:',
			standings.map((m) => `${m.name}: ${m.wins}-${m.losses}`)
		);
		return { members: standings };
	} catch (error: any) {
		console.error('Error fetching standings:', error.message);
		console.error('Error details:', error);
		// Return empty standings on error - don't throw to avoid breaking the page
		return { members: createInitialStandings() };
	}
};
