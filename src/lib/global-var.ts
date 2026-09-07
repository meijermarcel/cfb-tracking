export const members = [
	{
		name: 'Matt',
		teams: [
			'Notre Dame',
			'Penn State',
			'BYU',
			'Iowa',
			'Clemson',
			'Pittsburgh',
			'Missouri',
			'North Carolina',
			'Georgia Tech',
			'Maryland',
			'Stanford'
		]
	},
	{
		name: 'Nate',
		teams: [
			'Oregon',
			'Texas',
			'Michigan',
			'Kansas State',
			'Arizona',
			'Florida',
			'Wisconsin',
			'Arizona St.',
			'TCU',
			'NC State',
			'Rutgers'
		]
	},
	{
		name: 'Carter',
		teams: [
			'Miami (Fla.)',
			'Georgia',
			'Oklahoma',
			'Louisville',
			'Houston',
			'Illinois',
			'Oklahoma State',
			'Duke',
			'UCLA',
			'Baylor',
			'Kentucky'
		]
	},
	{
		name: 'Bob',
		teams: [
			'Indiana',
			'Utah',
			'Alabama',
			'Navy',
			'Washington',
			'Virginia Tech',
			'Army',
			'South Carolina',
			'Minnesota',
			'California',
			'Wake Forest'
		]
	},
	{
		name: 'Tom',
		teams: [
			'Ohio State',
			'Texas Tech',
			'Ole Miss',
			'Virginia',
			'Florida State',
			'Tennessee',
			'Air Force',
			'Cincinnati',
			'West Virginia',
			'Syracuse',
			'Arkansas'
		]
	},
	{
		name: 'Marcel',
		teams: [
			'LSU',
			'USC',
			'Texas A&M',
			'SMU',
			'Vanderbilt',
			'Nebraska',
			'Auburn',
			'Kansas',
			'UCF',
			'Michigan St.',
			'Iowa St.'
		]
	}
];

export const weeks = [
	{
		week_number: 1,
		period: 'Aug 29 - Sep 10'
	},
	{
		week_number: 2,
		period: 'Sep 11 - Sep 17'
	},
	{
		week_number: 3,
		period: 'Sep 18 - Sep 24'
	},
	{
		week_number: 4,
		period: 'Sep 25 - Oct 1'
	},
	{
		week_number: 5,
		period: 'Oct 2 - Oct 8'
	},
	{
		week_number: 6,
		period: 'Oct 9 - Oct 15'
	},
	{
		week_number: 7,
		period: 'Oct 16 - Oct 22'
	},
	{
		week_number: 8,
		period: 'Oct 23 - Oct 29'
	},
	{
		week_number: 9,
		period: 'Oct 30 - Nov 5'
	},
	{
		week_number: 10,
		period: 'Nov 6 - Nov 12'
	},
	{
		week_number: 11,
		period: 'Nov 13 - Nov 19'
	},
	{
		week_number: 12,
		period: 'Nov 20 - Nov 26'
	},
	{
		week_number: 13,
		period: 'Nov 27 - Dec 3'
	},
	{
		week_number: 14,
		period: 'Dec 4 - Dec 10'
	}
];

export const seasonYear = 2026;

/**
 * Saturday of Week 1. Weeks run Friday–Thursday around each Saturday slate;
 * Week 1 reaches back to the Aug 29 opener (see the `weeks` periods above).
 */
const week1Saturday = new Date(2026, 8, 5);

/** Week number for a given date, clamped to the season's bounds. */
export function currentWeek(now: Date = new Date()): number {
	for (const week of weeks) {
		// Each week closes on the Thursday five days after its Saturday.
		const end = new Date(week1Saturday);
		end.setDate(end.getDate() + 7 * (week.week_number - 1) + 5);
		end.setHours(23, 59, 59, 999);
		if (now <= end) return week.week_number;
	}
	return weeks[weeks.length - 1].week_number;
}
