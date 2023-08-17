import reservedNames from 'github-reserved-names/reserved-names.json';
import {addTests} from './collector.js';

const $ = <E extends Element>(selector: string) => document.querySelector<E>(selector);
const exists = (selector: string) => Boolean($(selector));

const combinedTestOnly = ['combinedTestOnly']; // To be used only to skip tests of combined functions, i.e. isPageA() || isPageB()

addTests('__urls_that_dont_match__', [
	'https://github.com/sindresorhus/refined-github/issues/new',
	'https://github.com/sindresorhus/refined-github/issues/new/choose',
	'https://github.com/sindresorhus/refined-github/issues/templates/edit',
	'https://github.com/orgs/community/discussions/new/choose',
]);

export const is404 = (): boolean => /^(Page|File) not found · GitHub/.test(document.title); // #98; When logged out, it starts with "File"

export const is500 = (): boolean => document.title === 'Server Error · GitHub' || document.title === 'Unicorn! · GitHub' || document.title === '504 Gateway Time-out';

export const isPasswordConfirmation = (): boolean => document.title === 'Confirm password' || document.title === 'Confirm access';

export const isBlame = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blame/'));
addTests('isBlame', [
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
]);

export const isCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => isSingleCommit(url) || isPRCommit(url);
addTests('isCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
	'isPRCommit',
]);

export const isCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoCommitList(url) || isPRCommitList(url);
addTests('isCommitList', combinedTestOnly);

export const isRepoCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('commits'));
addTests('isRepoCommitList', [
	'https://github.com/sindresorhus/refined-github/commits/master?page=2',
	'https://github.com/sindresorhus/refined-github/commits/test-branch',
	'https://github.com/sindresorhus/refined-github/commits/0.13.0',
	'https://github.com/sindresorhus/refined-github/commits/230c2',
	'https://github.com/sindresorhus/refined-github/commits/230c2935fc5aea9a681174ddbeba6255ca040d63',
	'https://github.com/sindresorhus/refined-github/commits?author=fregante',
	'https://github.com/sindresorhus/runs/commits/',
]);

export const isCompare = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('compare'));
addTests('isCompare', [
	'https://github.com/sindresorhus/refined-github/compare',
	'https://github.com/sindresorhus/refined-github/compare/',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isCompareWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).split('/').slice(3, 5).includes('_compare');
addTests('isCompareWikiPage', [
	'https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d',
	'https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d',
]);

export const isDashboard = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
addTests('isDashboard', [
	'https://github.com///',
	'https://github.com//',
	'https://github.com/',
	'https://github.com',
	'https://github.com/orgs/test/dashboard',
	'https://github.com/dashboard/index/2',
	'https://github.com//dashboard',
	'https://github.com/dashboard',
	'https://github.com/orgs/edit/dashboard',
	'https://github.big-corp.com/',
	'https://not-github.com/',
	'https://my-little-hub.com/',
	'https://github.com/?tab=repositories', // Gotcha for `isUserProfileRepoTab`
	'https://github.com/?tab=stars', // Gotcha for `isUserProfileStarsTab`
	'https://github.com/?tab=followers', // Gotcha for `isUserProfileFollowersTab`
	'https://github.com/?tab=following', // Gotcha for `isUserProfileFollowingTab`
	'https://github.com/?tab=overview', // Gotcha for `isUserProfileMainTab`
	'https://github.com?search=1', // Gotcha for `isRepoTree`
]);

export const isEnterprise = (url: URL | HTMLAnchorElement | Location = location): boolean => url.hostname !== 'github.com' && url.hostname !== 'gist.github.com';
addTests('isEnterprise', [
	'https://github.big-corp.com/',
	'https://not-github.com/',
	'https://my-little-hub.com/',
	'https://my-little-hub.com/gist',
	'https://my-little-hub.com/gist/in-fragrante',
	'https://gist.my-little-hub.com/in-fragrante',
]);

export const isGist = (url: URL | HTMLAnchorElement | Location = location): boolean => typeof getCleanGistPathname(url) === 'string';
addTests('isGist', [
	'https://gist.github.com',
	'http://gist.github.com',
	'https://gist.github.com/fregante/2205329b71218fa2c1d3',
	'https://gist.github.com/fregante/2205329b71218fa2c1d3/d1ebf7d9cfaba4d4596d2ea9174e202479a5f9ad',
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
	'https://my-little-hub.com/gist',
	'https://gist.github.com/kidonng/0d16c7f17045f486751fad1b602204a0/revisions',
	'https://gist.github.com/fregante',
	'https://gist.github.com/github',
	'https://gist.github.com/babel',
	'https://my-little-hub.com/gist/in-fragrante',
	'https://gist.my-little-hub.com/in-fragrante',
]);

export const isGlobalIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => ['issues', 'pulls'].includes(url.pathname.split('/', 2)[1]!);
addTests('isGlobalIssueOrPRList', [
	'https://github.com/issues',
	'https://github.com/issues?q=is%3Apr+is%3Aopen',
	'https://github.com/issues/assigned',
	'https://github.com/issues/mentioned',
	'https://github.com/pulls',
	'https://github.com/pulls?q=issues',
	'https://github.com/pulls/assigned',
	'https://github.com/pulls/mentioned',
	'https://github.com/pulls/review-requested',
]);

export const isGlobalSearchResults = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/search' && new URLSearchParams(url.search).get('q') !== null;
addTests('isGlobalSearchResults', [
	'https://github.com/search?q=refined-github&ref=opensearch',
]);

export const isIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => /^issues\/\d+/.test(getRepo(url)?.path!) && document.title !== 'GitHub · Where software is built'; // The title check excludes deleted issues
addTests('isIssue', [
	'https://github.com/sindresorhus/refined-github/issues/146',
]);

export const isIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isGlobalIssueOrPRList(url)
	|| isRepoIssueOrPRList(url)
	|| isMilestone(url);
addTests('isIssueOrPRList', combinedTestOnly);

export const isConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => isIssue(url) || isPRConversation(url);
addTests('isConversation', combinedTestOnly);

export const isLabelList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'labels';
addTests('isLabelList', [
	'https://github.com/sindresorhus/refined-github/labels',
	'https://github.com/sindresorhus/refined-github/labels/',
]);

export const isMilestone = (url: URL | HTMLAnchorElement | Location = location): boolean => /^milestone\/\d+/.test(getRepo(url)?.path!);
addTests('isMilestone', [
	'https://github.com/sindresorhus/refined-github/milestone/12',
]);

export const isMilestoneList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'milestones';
addTests('isMilestoneList', [
	'https://github.com/sindresorhus/refined-github/milestones',
]);

export const isNewFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('new'));
addTests('isNewFile', [
	'https://github.com/sindresorhus/refined-github/new/main',
]);

export const isNewIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'issues/new';
addTests('isNewIssue', [
	'https://github.com/sindresorhus/refined-github/issues/new',
]);

export const isNewRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'releases/new';
addTests('isNewRelease', [
	'https://github.com/sindresorhus/refined-github/releases/new',
]);

export const isNewWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_new');
addTests('isNewWikiPage', [
	'https://github.com/tooomm/wikitest/wiki/_new',
]);

export const isNotifications = (url: URL | HTMLAnchorElement | Location = location): boolean => getCleanPathname(url) === 'notifications';
addTests('isNotifications', [
	'https://github.com/notifications',
]);

export const isOrganizationProfile = (): boolean => exists('meta[name="hovercard-subject-tag"][content^="organization"]');

export const isOrganizationRepo = (): boolean => exists('.AppHeader-context-full [data-hovercard-type="organization"]');

export const isTeamDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getOrg(url)?.path.startsWith('teams'));
addTests('isTeamDiscussion', [
	'https://github.com/orgs/refined-github/teams/core-team/discussions?pinned=1',
	'https://github.com/orgs/refined-github/teams/core-team/discussions/1',
	'https://github.com/orgs/refined-github/teams/core-team',
]);

export const isOwnUserProfile = (): boolean => getCleanPathname() === getUsername();

// If there's a Report Abuse link, we're not part of the org
export const isOwnOrganizationProfile = (): boolean => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');

export const isProject = (url: URL | HTMLAnchorElement | Location = location): boolean => /^projects\/\d+/.test(getRepo(url)?.path!);
addTests('isProject', [
	'https://github.com/sindresorhus/refined-github/projects/3',
]);

export const isProjects = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'projects';
addTests('isProjects', [
	'https://github.com/sindresorhus/refined-github/projects',
]);

export const isDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => /^discussions\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path!);
addTests('isDiscussion', [
	'https://github.com/tophf/mpiv/discussions/50',
	'https://github.com/orgs/community/discussions/11202',
]);

export const isNewDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'discussions/new' || getOrg(url)?.path === 'discussions/new';
addTests('isNewDiscussion', [
	'https://github.com/withastro/roadmap/discussions/new?category=proposal',
	'https://github.com/orgs/community/discussions/new?category=pull-requests',
]);

export const isDiscussionList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'discussions' || getOrg(url)?.path === 'discussions';
addTests('isDiscussionList', [
	'https://github.com/tophf/mpiv/discussions',
	'https://github.com/orgs/community/discussions',
]);

export const isPR = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+/.test(getRepo(url)?.path!) && !isPRConflicts(url);
addTests('isPR', [
	'isPRFiles',
	'isPRCommitList',
	'https://github.com/sindresorhus/refined-github/pull/148',
]);

export const isPRConflicts = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path!);
addTests('isPRConflicts', [
	'https://github.com/sindresorhus/refined-github/pull/148/conflicts',
]);

/** Any `isIssueOrPRList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown */
export const isPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/pulls' || getRepo(url)?.path === 'pulls';
addTests('isPRList', [
	'https://github.com/pulls',
	'https://github.com/pulls?q=issues',
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

export const isPRCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/commits\/[\da-f]{5,40}$/.test(getRepo(url)?.path!);
addTests('isPRCommit', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
]);

export const isPRCommit404 = (): boolean => isPRCommit() && document.title.startsWith('Commit range not found · Pull Request');
export const isPRFile404 = (): boolean => isPRFiles() && document.title.startsWith('Commit range not found · Pull Request');

export const isPRConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+$/.test(getRepo(url)?.path!);
addTests('isPRConversation', [
	'https://github.com/sindresorhus/refined-github/pull/148',
]);

export const isPRCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/commits$/.test(getRepo(url)?.path!);
addTests('isPRCommitList', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits',
]);

export const isPRFiles = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/files/.test(getRepo(url)?.path!) || isPRCommit(url);
addTests('isPRFiles', [
	'isPRCommit', // File contents but lacks "Viewed" checkbox, has commit information
	'https://github.com/sindresorhus/refined-github/pull/148/files',
	'https://github.com/sindresorhus/refined-github/pull/148/files/e1aba6f', // This means "every commit until e1aba6f"
	'https://github.com/sindresorhus/refined-github/pull/148/files/1e27d799..e1aba6f', // This means specifically "Between commit A and B"
]);

export const isQuickPR = (url: URL | HTMLAnchorElement | Location = location): boolean => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
addTests('isQuickPR', [
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isDraftPR = (): boolean => exists('#partial-discussion-header .octicon-git-pull-request-draft');
export const isOpenPR = (): boolean => exists('#partial-discussion-header :is(.octicon-git-pull-request, .octicon-git-pull-request-draft)');
export const isMergedPR = (): boolean => exists('#partial-discussion-header .octicon-git-merge');
export const isClosedPR = (): boolean => exists('#partial-discussion-header :is(.octicon-git-pull-request-closed, .octicon-git-merge)');
export const isClosedIssue = (): boolean => exists('#partial-discussion-header :is(.octicon-issue-closed, .octicon-skip)');

export const isReleases = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'releases';
addTests('isReleases', [
	'https://github.com/sindresorhus/refined-github/releases',
	'https://github.com/sindresorhus/refined-github/releases?page=2',
]);

export const isTags = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'tags';
addTests('isTags', [
	'https://github.com/sindresorhus/refined-github/tags',
	'https://github.com/sindresorhus/refined-github/tags?after=21.8.1',
]);

export const isSingleReleaseOrTag = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path!.startsWith('releases/tag'));
addTests('isSingleReleaseOrTag', [
	'https://github.com/refined-github/refined-github/releases/tag/1.20.1', // Tag
	'https://github.com/refined-github/refined-github/releases/tag/23.7.25', // Release
]);

export const isReleasesOrTags = (url: URL | HTMLAnchorElement | Location = location): boolean => isReleases(url) || isTags(url);
addTests('isReleasesOrTags', [
	'isReleases',
	'isTags',
]);

export const isDeletingFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('delete'));
addTests('isDeletingFile', [
	'https://github.com/sindresorhus/refined-github/delete/master/readme.md',
	'https://github.com/sindresorhus/refined-github/delete/ghe-injection/source/background.ts',
]);

export const isEditingFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('edit'));
addTests('isEditingFile', [
	'https://github.com/sindresorhus/refined-github/edit/master/readme.md',
	'https://github.com/sindresorhus/refined-github/edit/ghe-injection/source/background.ts',
]);

export const hasFileEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingFile(url) || isNewFile(url) || isDeletingFile(url);
addTests('hasFileEditor', combinedTestOnly);

export const isEditingRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('releases/edit'));
addTests('isEditingRelease', [
	'https://github.com/sindresorhus/refined-github/releases/edit/v1.2.3',
]);

export const hasReleaseEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingRelease(url) || isNewRelease(url);
addTests('hasReleaseEditor', combinedTestOnly);

export const isEditingWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_edit');
addTests('isEditingWikiPage', [
	'https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit',
]);

export const hasWikiPageEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingWikiPage(url) || isNewWikiPage(url);
addTests('hasWikiPageEditor', combinedTestOnly);

export const isRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[^/]+/.test(getCleanPathname(url))
	&& !reservedNames.includes(url.pathname.split('/', 2)[1]!)
	&& !isDashboard(url)
	&& !isGist(url)
	&& !isNewRepoTemplate(url);
addTests('isRepo', [
	// Some of these are here simply as "gotchas" to other detections
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
	'https://github.com/sindresorhus/refined-github/issues/146',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/refined-github/pull/148',
	'https://github.com/sindresorhus/refined-github/milestones/new', // Gotcha for isRepoTaxonomyIssueOrPRList
	'https://github.com/sindresorhus/refined-github/milestones/1/edit', // Gotcha for isRepoTaxonomyIssueOrPRList
	'https://github.com/sindresorhus/refined-github/issues/new/choose', // Gotcha for isRepoIssueList
	'https://github.com/sindresorhus/refined-github/issues/templates/edit', // Gotcha for isRepoIssueList
]);

export const hasRepoHeader = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepo(url) && !isRepoSearch(url);
addTests('hasRepoHeader', combinedTestOnly);

// On empty repos, there's only isRepoHome; this element is found in `<head>`
export const isEmptyRepoRoot = (): boolean => isRepoHome() && !exists('link[rel="canonical"]');

export const isEmptyRepo = (): boolean => exists('[aria-label="Cannot fork because repository is empty."]');

export const isPublicRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_public"][content="true"]');

export const isArchivedRepo = (): boolean => Boolean(isRepo() && $('main > .flash-warn')?.textContent!.includes('archived'));

export const isBlank = (): boolean => exists('main .blankslate:not([hidden] .blankslate)');

export const isRepoTaxonomyIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path!);
addTests('isRepoTaxonomyIssueOrPRList', [
	'https://github.com/sindresorhus/refined-github/labels/bug',
	'https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github',
	'https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt',
	'https://github.com/sindresorhus/refined-github/milestones/1',
]);

export const isRepoIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isRepoPRList(url)
	|| isRepoIssueList(url)
	|| isRepoTaxonomyIssueOrPRList(url);
addTests('isRepoIssueOrPRList', combinedTestOnly);

export const isRepoPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('pulls'));
addTests('isRepoPRList', [
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

export const isRepoIssueList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	// `issues/fregante` is a list but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit` aren’t
	/^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path!);
addTests('isRepoIssueList', [
	'http://github.com/sindresorhus/ava/issues',
	'https://github.com/sindresorhus/refined-github/issues',
	'https://github.com/sindresorhus/refined-github/issues/fregante',
	'https://github.com/sindresorhus/refined-github/issues/newton',
	'https://github.com/sindresorhus/refined-github/issues/wptemplates',
	'https://github.com/sindresorhus/refined-github/issues?q=is%3Aclosed+sort%3Aupdated-desc',
	'https://github.com/sindresorhus/refined-github/labels/bug',
	'https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github',
	'https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt',
]);

const hasSearchParameter = (url: URL | HTMLAnchorElement | Location): boolean => new URLSearchParams(url.search).get('search') === '1';

export const isRepoHome = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === ''
	&& !hasSearchParameter(url);
addTests('isRepoHome', [
	// Some tests are here only as "gotchas" for other tests that may misidentify their pages
	'https://github.com/sindresorhus/refined-github',
	'https://github.com/sindresorhus/refined-github/',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/edit',
	'https://github.com/sindresorhus///edit',
	'https://github.com/sindresorhus/search',
	'https://github.com/sindresorhus/branches',
	'https://github.com/sindresorhus/refined-github?files=1',
]);

const _isRepoRoot = (url?: URL | HTMLAnchorElement | Location): boolean => {
	const repository = getRepo(url ?? location);

	if (!repository) {
		return false;
	}

	if (!repository.path) {
		// Absolute repo root: `isRepoHome`
		return true;
	}

	if (url) {
		// Root of a branch/commit/tag
		return /^tree\/[^/]+$/.test(repository.path);
	}

	// If we're checking the current page, add support for branches with slashes // #15 #24
	return repository.path.startsWith('tree/') && document.title.startsWith(repository.nameWithOwner) && !document.title.endsWith(repository.nameWithOwner);
};

// `_isRepoRoot` logic depends on whether a URL was passed, so don't use a `url` default parameter
export const isRepoRoot = (url?: URL | HTMLAnchorElement | Location): boolean => !hasSearchParameter(url ?? location) && _isRepoRoot(url);

addTests('isRepoRoot', [
	'isRepoHome',
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons',
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/',
	'https://github.com/sindresorhus/refined-github/tree/57bf4',
	'https://github.com/sindresorhus/refined-github/tree/master?files=1',
]);

export const isRepoSearch = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'search';
addTests('isRepoSearch', [
	'https://github.com/sindresorhus/refined-github/search?q=diff',
	'https://github.com/sindresorhus/refined-github/search?q=diff&unscoped_q=diff&type=Issues',
	'https://github.com/sindresorhus/refined-github/search',
]);

export const isRepoSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('settings'));
addTests('isRepoSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
	'https://github.com/sindresorhus/refined-github/settings/branches',
]);

export const isRepoMainSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'settings';
addTests('isRepoMainSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
]);

export const isRepliesSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/replies');
addTests('isRepliesSettings', [
	'https://github.com/settings/replies',
	'https://github.com/settings/replies/88491/edit',
]);

export const isUserSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/');
addTests('isUserSettings', [
	'https://github.com/settings/profile',
	'isRepliesSettings',
]);

export const isRepoTree = (url: URL | HTMLAnchorElement | Location = location): boolean => _isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith('tree/'));
addTests('isRepoTree', [
	'isRepoRoot',
	'https://github.com/sindresorhus/refined-github/tree/main/source',
	'https://github.com/sindresorhus/refined-github/tree/0.13.0/extension',
	'https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/extension',
	'https://github.com/sindresorhus/refined-github?search=1',
]);

export const isRepoWiki = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('wiki'));
addTests('isRepoWiki', [
	'https://github.com/lukesampson/scoop/wiki',
	'https://github.com/tooomm/wikitest/wiki/_new',
	'https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit',
	'https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d',
	'https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d',
]);

export const isSingleCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path!);
addTests('isSingleCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
]);

export const isSingleFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blob/'));
addTests('isSingleFile', [
	'https://github.com/sindresorhus/refined-github/blob/master/.gitattributes',
	'https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css',
	'https://github.com/sindresorhus/refined-github/blob/master/edit.txt',
]);

export const isFileFinder = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('find/'));
addTests('isFileFinder', [
	'https://github.com/sindresorhus/refined-github/find/master',
]);

/**
 * @example https://github.com/fregante/GhostText/tree/3cacd7df71b097dc525d99c7aa2f54d31b02fcc8/chrome/scripts/InputArea
 * @example https://github.com/refined-github/refined-github/blob/some-non-existent-ref/source/features/bugs-tab.tsx
 */
export const isRepoFile404 = (url: URL | HTMLAnchorElement | Location = location): boolean => (isSingleFile(url) || isRepoTree(url)) && document.title.startsWith('File not found');

export const isRepoForksList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network/members';
addTests('isRepoForksList', [
	'https://github.com/sindresorhus/refined-github/network/members',
]);

export const isRepoNetworkGraph = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network';
addTests('isRepoNetworkGraph', [
	'https://github.com/sindresorhus/refined-github/network',
]);

export const isForkedRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');

export const isSingleGist = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url)!);
addTests('isSingleGist', [
	'https://gist.github.com/fregante/2205329b71218fa2c1d3',
	'https://gist.github.com/fregante/2205329b71218fa2c1d3/d1ebf7d9cfaba4d4596d2ea9174e202479a5f9ad',
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
]);

export const isGistRevision = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url)!);
addTests('isGistRevision', [
	'https://gist.github.com/kidonng/0d16c7f17045f486751fad1b602204a0/revisions',
]);

export const isTrending = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/trending' || url.pathname.startsWith('/trending/');
addTests('isTrending', [
	'https://github.com/trending',
	'https://github.com/trending/developers',
	'https://github.com/trending/unknown',
]);

export const isBranches = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('branches'));
addTests('isBranches', [
	'https://github.com/sindresorhus/refined-github/branches',
]);

// Use this with a clean pathname, without leading `/gist/`
const doesLookLikeAProfile = (string: string | undefined): boolean =>
	typeof string === 'string'
	&& string.length > 0 // Isn't root (http://github.com/)
	&& !string.includes('/') // Single-level
	&& !string.includes('.') // No extensions
	&& !reservedNames.includes(string);

export const isProfile = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	!isGist(url)
	&& doesLookLikeAProfile(getCleanPathname(url));

addTests('isProfile', [
	'https://github.com/fregante',
	'https://github.com/github',
	'https://github.com/babel',
	'https://github.com/fregante?tab=repositories',
	'https://github.com/fregante?tab=repositories&type=source',
	'https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=',
	'https://github.com/fregante?tab=stars',
	'https://github.com/fregante?direction=desc&sort=updated&tab=stars',
	'https://github.com/fregante?tab=followers',
	'https://github.com/sindresorhus?tab=followers',
	'https://github.com/fregante?tab=following',
	'https://github.com/sindresorhus?tab=following',
]);

export const isGistProfile = (url: URL | HTMLAnchorElement | Location = location): boolean => doesLookLikeAProfile(getCleanGistPathname(url));

addTests('isGistProfile', [
	'https://gist.github.com/fregante',
	'https://gist.github.com/github',
	'https://gist.github.com/babel',
	'https://my-little-hub.com/gist/in-fragrante',
	'https://gist.my-little-hub.com/in-fragrante',
]);

export const isUserProfile = (): boolean => isProfile() && !isOrganizationProfile();

export const isPrivateUserProfile = (): boolean => isUserProfile() && !exists('.UnderlineNav-item[href$="tab=stars"]');

export const isUserProfileMainTab = (): boolean =>
	isUserProfile()
	&& !new URLSearchParams(location.search).has('tab');

// The following can be URL-based because they have a `tab` parameter, unlike the organizations
export const isUserProfileRepoTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'repositories';
addTests('isUserProfileRepoTab', [
	'https://github.com/fregante?tab=repositories',
	'https://github.com/fregante?tab=repositories&type=source',
	'https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=',
]);

export const isUserProfileStarsTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'stars';
addTests('isUserProfileStarsTab', [
	'https://github.com/fregante?tab=stars',
	'https://github.com/fregante?direction=desc&sort=updated&tab=stars',
]);

export const isUserProfileFollowersTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'followers';
addTests('isUserProfileFollowersTab', [
	'https://github.com/fregante?tab=followers',
	'https://github.com/sindresorhus?tab=followers',
]);

export const isUserProfileFollowingTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'following';
addTests('isUserProfileFollowingTab', [
	'https://github.com/fregante?tab=following',
	'https://github.com/sindresorhus?tab=following',
]);

export const isProfileRepoList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isUserProfileRepoTab(url) || getOrg(url)?.path === 'repositories';
addTests('isProfileRepoList', [
	'https://github.com/fregante?tab=repositories',
	'https://github.com/fregante?tab=repositories&type=source',
	'https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=',
	'https://github.com/orgs/refined-github/repositories',
	'https://github.com/orgs/refined-github/repositories?q=&type=private&language=&sort=',
]);

addTests('hasComments', combinedTestOnly);
export const hasComments = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isPR(url)
	|| isIssue(url)
	|| isCommit(url)
	|| isTeamDiscussion(url)
	|| isSingleGist(url);

addTests('hasRichTextEditor', combinedTestOnly);
export const hasRichTextEditor = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	hasComments(url)
	|| isNewIssue(url)
	|| isCompare(url)
	|| isRepliesSettings(url)
	|| hasReleaseEditor(url)
	|| isDiscussion(url)
	|| isNewDiscussion(url);

addTests('hasCode', combinedTestOnly);
/** Static code, not the code editor */
export const hasCode = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	hasComments(url)
	|| isRepoTree(url) // Readme files
	|| isRepoSearch(url)
	|| isGlobalSearchResults(url)
	|| isSingleFile(url)
	|| isGist(url)
	|| isCompare(url)
	|| isCompareWikiPage(url)
	|| isBlame(url);

addTests('hasFiles', combinedTestOnly);
/** Has a list of files */
export const hasFiles = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isCommit(url)
	|| isCompare(url)
	|| isPRFiles(url);

export const isMarketplaceAction = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/marketplace/actions/');
addTests('isMarketplaceAction', [
	'https://github.com/marketplace/actions/urlchecker-action',
	'https://github.com/marketplace/actions/github-action-for-assignee-to-reviewer',
	'https://github.com/marketplace/actions/hugo-actions',
]);

export const isActionJobRun = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('runs/'));
addTests('isActionJobRun', [
	'https://github.com/sindresorhus/refined-github/runs/639481849',
	'https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true',
]);

export const isActionRun = (url: URL | HTMLAnchorElement | Location = location): boolean => /^(actions\/)?runs/.test(getRepo(url)?.path!);
addTests('isActionRun', [
	'https://github.com/sindresorhus/refined-github/runs/639481849',
	'https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true',
	'https://github.com/refined-github/github-url-detection/actions/runs/294962314',
]);

export const isNewAction = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'actions/new';
addTests('isNewAction', [
	'https://github.com/sindresorhus/refined-github/actions/new',
]);

export const isRepositoryActions = (url: URL | HTMLAnchorElement | Location = location): boolean => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path!);
addTests('isRepositoryActions', [
	'https://github.com/refined-github/github-url-detection/actions',
	'https://github.com/refined-github/github-url-detection/actions/workflows/demo.yml',
	'https://github.com/refined-github/github-url-detection/actions/workflows/esm-lint.yml',
]);

export const isUserTheOrganizationOwner = (): boolean => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');

export const canUserEditRepo = (): boolean => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]');

export const isNewRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/new' || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url));
addTests('isNewRepo', [
	'https://github.com/new',
	'https://github.com/organizations/npmhub/repositories/new',
]);

// This can't use `getRepo().path` to avoid infinite recursion:
export const isNewRepoTemplate = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(url.pathname.split('/')[3] === 'generate');
addTests('isNewRepoTemplate', [
	'https://github.com/fregante/browser-extension-template/generate',
]);

/** Get the logged-in user’s username */
const getUsername = (): string | undefined => $('meta[name="user-login"]')?.getAttribute('content')!;

/** Drop all duplicate slashes */
const getCleanPathname = (url: URL | HTMLAnchorElement | Location = location): string => url.pathname.replaceAll(/\/+/g, '/').slice(1, url.pathname.endsWith('/') ? -1 : undefined);

const getCleanGistPathname = (url: URL | HTMLAnchorElement | Location = location): string | undefined => {
	const pathname = getCleanPathname(url);
	if (url.hostname.startsWith('gist.')) {
		return pathname;
	}

	const [gist, ...parts] = pathname.split('/');
	return gist === 'gist' ? parts.join('/') : undefined;
};

const getOrg = (url: URL | HTMLAnchorElement | Location = location): {name: string; path: string} | undefined => {
	const [, orgs, name, ...path] = url.pathname.split('/');
	if (orgs === 'orgs' && name) {
		return {name, path: path.join('/')};
	}

	return undefined;
};

export type RepositoryInfo = {
	owner: string;
	name: string;

	/** The 'user/repo' part from an URL */
	nameWithOwner: string;

	/** A repo's subpage
	@example '/user/repo/issues/' -> 'issues'
	@example '/user/repo/' -> ''
	@example '/settings/token/' -> undefined */
	path: string;
};

const getRepo = (url?: URL | HTMLAnchorElement | Location | string): RepositoryInfo | undefined => {
	if (!url) {
		// We use `canonical` here to use the correct capitalization
		// `rel=canonical` doesn't appear on every page
		const canonical = $<HTMLMetaElement>('[property="og:url"]');
		if (canonical) {
			const canonicalUrl = new URL(canonical.content, location.origin);
			// Sometimes GitHub sets the canonical to an incomplete URL, so it can't be used
			if (getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase()) {
				url = canonicalUrl;
			}
		}
	}

	if (typeof url === 'string') {
		url = new URL(url, location.origin);
	}

	if (!isRepo(url)) {
		return;
	}

	const [owner, name, ...path] = getCleanPathname(url).split('/') as [string, string, string];
	return {
		owner,
		name,
		nameWithOwner: owner + '/' + name,
		path: path.join('/'),
	};
};

export const utils = {
	getOrg,
	getUsername,
	getCleanPathname,
	getCleanGistPathname,
	getRepositoryInfo: getRepo,
};
