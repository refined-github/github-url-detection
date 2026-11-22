import type {StrictlyParseSelector} from 'typed-query-selector/parser.js';
import reservedNames from 'github-reserved-names/reserved-names.json' with {type: 'json'};

function $<Selector extends string, Selected extends Element = StrictlyParseSelector<Selector>>(
	selector: Selector,
): Selected | undefined;
function $<Selected extends Element = HTMLElement>(
	selector: string,
): Selected | undefined;
function $<Selected extends Element>(selector: string): Selected | undefined {
	return document.querySelector<Selected>(selector) ?? undefined;
}

function exists<Selector extends string, Selected extends Element = StrictlyParseSelector<Selector>>(
	selector: Selector,
): Selected extends never ? never : boolean;
function exists(selector: string): boolean;
function exists(selector: string): boolean {
	return Boolean(document.querySelector(selector));
}

/**
 * Waits for a detection to return true by repeatedly checking it on each animation frame.
 * Useful for DOM-based detections that need to wait for elements to appear.
 * @param detection - A detection function to check repeatedly
 * @returns A promise that resolves to the final result of the detection
 * @example
 * ```
 * import {utils} from 'github-url-detection';
 *
 * async function init() {
 *   if (!await utils.waitFor(isOrganizationProfile)) {
 *     return;
 *   }
 *   // Do something when on organization profile
 * }
 * ```
 */
async function waitFor(detection: () => boolean): Promise<boolean> {
	while (!detection() && document.readyState !== 'complete') {
		// eslint-disable-next-line no-await-in-loop
		await new Promise(resolve => {
			requestAnimationFrame(resolve);
		});
	}

	return detection();
}

export const is404 = (): boolean => /^(Page|File) not found(?: · GitHub|$)/.test(document.title);

export const is500 = (): boolean => document.title === 'Server Error · GitHub' || document.title === 'Unicorn! · GitHub' || document.title === '504 Gateway Time-out';

export const isPasswordConfirmation = (): boolean => document.title === 'Confirm password' || document.title === 'Confirm access';

export const isLoggedIn = (): boolean => exists('body.logged-in');

/**
 * @example https://github.com/sindresorhus/refined-github/blame/master/package.json
 */
export const isBlame = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blame/'));

/**
 * @example https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f
 * @example https://github.com/sindresorhus/refined-github/commit/5b614
 * @see isPRCommit
 */
export const isCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => isSingleCommit(url) || isPRCommit(url);

/**
 * @see isRepoCommitList
 * @see isPRCommitList
 */
export const isCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoCommitList(url) || isPRCommitList(url);

/**
 * @example https://github.com/sindresorhus/refined-github/commits/master?page=2
 * @example https://github.com/sindresorhus/refined-github/commits/test-branch
 * @example https://github.com/sindresorhus/refined-github/commits/0.13.0
 * @example https://github.com/sindresorhus/refined-github/commits/230c2
 * @example https://github.com/sindresorhus/refined-github/commits/230c2935fc5aea9a681174ddbeba6255ca040d63
 * @example https://github.com/sindresorhus/refined-github/commits?author=fregante
 * @example https://github.com/sindresorhus/runs/commits/
 */
export const isRepoCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('commits'));

/**
 * @example https://github.com/sindresorhus/refined-github/compare
 * @example https://github.com/sindresorhus/refined-github/compare/
 * @example https://github.com/sindresorhus/refined-github/compare/master...branch-name
 * @see isQuickPR
 */
export const isCompare = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('compare'));

/**
 * @example https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 * @example https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 */
export const isCompareWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).split('/').slice(3, 5).includes('_compare');

/**
 * @deprecated Use `isHome` and/or `isFeed` instead
 * @example https://github.com///
 * @example https://github.com//
 * @example https://github.com/
 * @example https://github.com
 * @example https://github.com/orgs/refined-github/dashboard
 * @example https://github.com/dashboard/index/2
 * @example https://github.com//dashboard
 * @example https://github.com/dashboard
 * @example https://github.big-corp.com/
 * @example https://not-github.com/
 * @example https://my-little-hub.com/
 * @example https://github.com/?tab=repositories
 * @example https://github.com/?tab=stars
 * @example https://github.com/?tab=followers
 * @example https://github.com/?tab=following
 * @example https://github.com/?tab=overview
 * @example https://github.com?search=1
 * @example https://github.com/dashboard-feed
 */
export const isDashboard = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(-feed)?(\/|$)/.test(getCleanPathname(url));

/**
 * @example https://github.com
 * @example https://github.com//dashboard
 * @example https://github.com///
 * @example https://github.com//
 * @example https://github.com/
 * @example https://github.com/dashboard
 * @example https://github.big-corp.com/
 * @example https://not-github.com/
 * @example https://my-little-hub.com/
 * @example https://github.com/?tab=repositories
 * @example https://github.com/?tab=stars
 * @example https://github.com/?tab=followers
 * @example https://github.com/?tab=following
 * @example https://github.com/?tab=overview
 * @example https://github.com?search=1
 */
export const isHome = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && /^$|^dashboard\/?$/.test(getCleanPathname(url));

/**
 * @example https://github.com/feed
 * @example https://github.com/orgs/refined-github/dashboard
 */
export const isFeed = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && /^(feed|orgs\/[^/]+\/dashboard)\/?$/.test(getCleanPathname(url));

/**
 * @example https://github.big-corp.com/
 * @example https://not-github.com/
 * @example https://my-little-hub.com/
 * @example https://my-little-hub.com/gist
 * @example https://my-little-hub.com/gist/in-fragrante
 * @example https://gist.my-little-hub.com/in-fragrante
 */
export const isEnterprise = (url: URL | HTMLAnchorElement | Location = location): boolean => url.hostname !== 'github.com' && url.hostname !== 'gist.github.com';

/**
 * @example https://gist.github.com
 * @example http://gist.github.com
 * @example https://gist.github.com/new
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3/d1ebf7d9cfaba4d4596d2ea9174e202479a5f9ad
 * @example https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064
 * @example https://my-little-hub.com/gist
 * @example https://gist.github.com/kidonng/0d16c7f17045f486751fad1b602204a0/revisions
 * @example https://gist.github.com/fregante
 * @example https://gist.github.com/github
 * @example https://gist.github.com/babel
 * @example https://my-little-hub.com/gist/in-fragrante
 * @example https://gist.my-little-hub.com/in-fragrante
 */
export const isGist = (url: URL | HTMLAnchorElement | Location = location): boolean => typeof getCleanGistPathname(url) === 'string';

/**
 * @example https://github.com/issues
 * @example https://github.com/issues/assigned
 * @example https://github.com/issues/mentioned
 * @example https://github.com/issues?q=is%3Apr+is%3Aopen
 * @example https://github.com//issues/
 */
export const isGlobalIssueList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^issues($|\/)/.test(getCleanPathname(url));

/**
 * @example https://github.com/pulls
 * @example https://github.com/pulls/assigned
 * @example https://github.com/pulls/mentioned
 * @example https://github.com/pulls/review-requested
 * @example https://github.com/pulls?q=issues
 * @example https://github.com//pulls/
 */
export const isGlobalPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pulls($|\/)/.test(getCleanPathname(url));

/**
 * @see isGlobalPRList
 * @see isGlobalIssueList
 */
export const isGlobalIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => isGlobalPRList(url) || isGlobalIssueList(url);

/**
 * @example https://github.com/search?q=refined-github&ref=opensearch
 */
export const isGlobalSearchResults = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/search' && new URLSearchParams(url.search).get('q') !== null;

/**
 * @example https://github.com/sindresorhus/refined-github/issues/146
 */
export const isIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => /^issues\/\d+/.test(getRepo(url)?.path) && document.title !== 'GitHub · Where software is built'; // The title check excludes deleted issues

/**
 * @see isRepoIssueList
 * @see isGlobalIssueList
 * @see isMilestone
 */
export const isIssueList = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoIssueList(url) || isGlobalIssueList(url) || isMilestone(url);

/**
 * @see isIssueList
 * @see isPRList
 */
export const isIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => isIssueList(url) || isPRList(url);

/**
 * @see isIssue
 * @see isPRConversation
 */
export const isConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => isIssue(url) || isPRConversation(url);

/**
 * @example https://github.com/sindresorhus/refined-github/labels
 * @example https://github.com/sindresorhus/refined-github/labels/
 */
export const isLabelList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'labels';

/**
 * @example https://github.com/kubernetes/kubernetes/milestone/56
 */
export const isMilestone = (url: URL | HTMLAnchorElement | Location = location): boolean => /^milestone\/\d+/.test(getRepo(url)?.path);

/**
 * @example https://github.com/sindresorhus/refined-github/milestones
 */
export const isMilestoneList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'milestones';

/**
 * @example https://github.com/sindresorhus/refined-github/new/main
 */
export const isNewFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('new'));

/**
 * @example https://github.com/sindresorhus/refined-github/issues/new
 */
export const isNewIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'issues/new';

/**
 * @example https://github.com/sindresorhus/refined-github/releases/new
 */
export const isNewRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'releases/new';

/**
 * @example https://github.com/tooomm/wikitest/wiki/_new
 */
export const isNewWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_new');

/**
 * @example https://github.com/notifications
 */
export const isNotifications = (url: URL | HTMLAnchorElement | Location = location): boolean => getCleanPathname(url) === 'notifications';

export const isOrganizationProfile = (): boolean => exists('meta[name="hovercard-subject-tag"][content^="organization"]');

export const isOrganizationRepo = (): boolean => exists([
	'qbsearch-input[data-current-repository][data-current-org]:not([data-current-repository=""], [data-current-org=""])',
	// TODO: Remove after June 2026
	'.AppHeader-context-full [data-hovercard-type="organization"]',
].join(','));

/**
 * @example https://github.com/orgs/refined-github/teams/core-team/discussions?pinned=1
 * @example https://github.com/orgs/refined-github/teams/core-team/discussions/1
 * @example https://github.com/orgs/refined-github/teams/core-team
 */
export const isTeamDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getOrg(url)?.path.startsWith('teams'));

export const isOwnUserProfile = (): boolean => getCleanPathname() === getLoggedInUser();

// If there's a Report Abuse link, we're not part of the org
export const isOwnOrganizationProfile = (): boolean => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');

/**
 * @example https://github.com/sindresorhus/refined-github/projects/3
 * @example https://github.com/orgs/RSSNext/projects/3
 */
export const isProject = (url: URL | HTMLAnchorElement | Location = location): boolean => /^projects\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);

/**
 * @example https://github.com/sindresorhus/refined-github/projects
 */
export const isProjects = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'projects';

/**
 * @example https://github.com/tophf/mpiv/discussions/50
 * @example https://github.com/orgs/community/discussions/11202
 */
export const isDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => /^discussions\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);

/**
 * @example https://github.com/withastro/roadmap/discussions/new?category=proposal
 * @example https://github.com/orgs/community/discussions/new?category=pull-requests
 */
export const isNewDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'discussions/new' || getOrg(url)?.path === 'discussions/new';

/**
 * @example https://github.com/tophf/mpiv/discussions
 * @example https://github.com/orgs/community/discussions
 */
export const isDiscussionList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'discussions' || getOrg(url)?.path === 'discussions';

/**
 * @see isPRFiles
 * @see isPRCommitList
 * @example https://github.com/sindresorhus/refined-github/pull/148
 */
export const isPR = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+/.test(getRepo(url)?.path) && !isPRConflicts(url);

/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/conflicts
 */
export const isPRConflicts = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path);

/**
 * Any `isIssueOrPRList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown
 * @see isRepoPRList
 * @see isGlobalPRList
 */
export const isPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoPRList(url) || isGlobalPRList(url);

/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d79
 */
export const isPRCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/(commits|changes)\/[\da-f]{7,40}$/.test(getRepo(url)?.path);

export const isPRCommit404 = (): boolean => isPRCommit() && document.title.startsWith('Commit range not found · Pull Request');
export const isPRFile404 = (): boolean => isPRFiles() && document.title.startsWith('Commit range not found · Pull Request');

/**
 * @example https://github.com/sindresorhus/refined-github/pull/148
 */
export const isPRConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+$/.test(getRepo(url)?.path);

/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits
 */
export const isPRCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/commits$/.test(getRepo(url)?.path);

/**
 * @see isPRCommit
 * @example https://github.com/sindresorhus/refined-github/pull/148/files
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/e1aba6f
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641..e1aba6febb3fe38aafd1137cff28b536eeeabe7e
 */
export const isPRFiles = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/(files|(changes(\/[\da-f]{7,40}..[\da-f]{7,40})?$))/.test(getRepo(url)?.path) || isPRCommit(url);

/**
 * @example https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1
 * @example https://github.com/refined-github/sandbox/compare/fregante-patch-2?expand=1
 * @example https://github.com/refined-github/sandbox/compare/default-a...fregante-patch-2?expand=1
 */
export const isQuickPR = (url: URL | HTMLAnchorElement | Location = location): boolean => isCompare(url) && /[?&](quick_pull|expand)=1(&|$)/.test(url.search);

const getStateLabel = (): string | undefined => $([
	'.State', // Old view
	// React versions
	'[class^="StateLabel"]', // TODO: Remove after July 2026
	'[class^="prc-StateLabel-StateLabel"]',
].join(','))?.textContent?.trim();

export const isMergedPR = (): boolean => getStateLabel() === 'Merged';
export const isDraftPR = (): boolean => getStateLabel() === 'Draft';
export const isOpenConversation = (): boolean => {
	const status = getStateLabel();
	return status === 'Open' || status === 'Draft';
};

export const isClosedConversation = (): boolean => {
	const status = getStateLabel();
	return status === 'Closed' || status === 'Closed as not planned' || status === 'Merged';
};

/**
 * @example https://github.com/sindresorhus/refined-github/releases
 * @example https://github.com/sindresorhus/refined-github/releases?page=2
 */
export const isReleases = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'releases';

/**
 * @example https://github.com/sindresorhus/refined-github/tags
 * @example https://github.com/sindresorhus/refined-github/tags?after=21.8.1
 */
export const isTags = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'tags';

/**
 * @example https://github.com/refined-github/refined-github/releases/tag/1.20.1
 * @example https://github.com/refined-github/refined-github/releases/tag/23.7.25
 */
export const isSingleReleaseOrTag = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path!.startsWith('releases/tag'));

/**
 * @see isReleases
 * @see isTags
 */
export const isReleasesOrTags = (url: URL | HTMLAnchorElement | Location = location): boolean => isReleases(url) || isTags(url);

/**
 * @example https://github.com/sindresorhus/refined-github/delete/master/readme.md
 * @example https://github.com/sindresorhus/refined-github/delete/ghe-injection/source/background.ts
 */
export const isDeletingFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('delete'));

/**
 * @example https://github.com/sindresorhus/refined-github/edit/master/readme.md
 * @example https://github.com/sindresorhus/refined-github/edit/ghe-injection/source/background.ts
 */
export const isEditingFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('edit'));

/**
 * @see isEditingFile
 * @see isNewFile
 * @see isDeletingFile
 */
export const hasFileEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingFile(url) || isNewFile(url) || isDeletingFile(url);

/**
 * @example https://github.com/sindresorhus/refined-github/releases/edit/v1.2.3
 */
export const isEditingRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('releases/edit'));

/**
 * @see isEditingRelease
 * @see isNewRelease
 */
export const hasReleaseEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingRelease(url) || isNewRelease(url);

/**
 * @example https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit
 */
export const isEditingWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_edit');

/**
 * @see isEditingWikiPage
 * @see isNewWikiPage
 */
export const hasWikiPageEditor = (url: URL | HTMLAnchorElement | Location = location): boolean => isEditingWikiPage(url) || isNewWikiPage(url);

/**
 * @see isActionRun
 * @see isActionJobRun
 * @see isBranches
 * @see isCompare
 * @see isDeletingFile
 * @see isEditingFile
 * @see isEditingRelease
 * @see isFileFinder
 * @see isForkingRepo
 * @see isIssue
 * @see isLabelList
 * @see isMilestone
 * @see isMilestoneList
 * @see isNewAction
 * @see isNewFile
 * @see isNewIssue
 * @see isNewRelease
 * @see isPR
 * @see isPRConversation
 * @see isPRConflicts
 * @see isProjects
 * @see isReleases
 * @see isRepoPRList
 * @see isRepoCommitList
 * @see isRepoForksList
 * @see isRepoGitObject
 * @see isRepoIssueList
 * @see isRepoNetworkGraph
 * @see isRepoSearch
 * @see isRepoSettings
 * @see isRepoMainSettings
 * @see isRepoTaxonomyIssueOrPRList
 * @see isRepoWiki
 * @see isNewWikiPage
 * @see isEditingWikiPage
 * @see isCompareWikiPage
 * @see isRepositoryActions
 * @see isSingleCommit
 * @see isSingleReleaseOrTag
 * @see isTags
 * @example https://github.com/sindresorhus/refined-github/projects/3
 * @example https://github.com/tophf/mpiv/discussions/50
 * @example https://github.com/withastro/roadmap/discussions/new?category=proposal
 * @example https://github.com/tophf/mpiv/discussions
 * @example https://github.com/sindresorhus/refined-github/milestones/new
 * @example https://github.com/sindresorhus/refined-github/milestones/1/edit
 * @example https://github.com/sindresorhus/refined-github/issues/new/choose
 * @example https://github.com/sindresorhus/refined-github/issues/templates/edit
 * @example https://github.com/refined-github/refined-github/issues/views
 */
export const isRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => {
	const [user, repo, extra] = getCleanPathname(url).split('/');
	return Boolean(user
		&& repo
		&& !reservedNames.includes(user)
		&& !url.hostname.startsWith('gist.')
		&& extra !== 'generate'); // Like isNewRepoTemplate but inlined for performance
};

export const hasRepoHeader = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepo(url) && !isRepoSearch(url);

export const isEmptyRepoRoot = (): boolean => isRepoHome() && exists([
	// If you don't have write access
	'.blankslate-icon',
	// If you have write access
	'#empty-setup-clone-url',
].join(','));

/**
 * @deprecated Doesn't work anymore. Use `isEmptyRepoRoot` or API instead.
 */
export const isEmptyRepo = (): boolean => exists('[aria-label="Cannot fork because repository is empty."]');

export const isPublicRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_public"][content="true"]');

export const isArchivedRepo = (): boolean => Boolean(isRepo() && $('main > .flash-warn')?.textContent!.includes('archived'));

export const isBlank = (): boolean => exists('main .blankslate:not([hidden] .blankslate)');

/**
 * @example https://github.com/sindresorhus/refined-github/labels/bug
 * @example https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github
 * @example https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt
 * @example https://github.com/sindresorhus/refined-github/milestones/1
 */
export const isRepoTaxonomyIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path);

/**
 * @see isRepoPRList
 * @see isRepoIssueList
 * @see isRepoTaxonomyIssueOrPRList
 */
export const isRepoIssueOrPRList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isRepoPRList(url)
	|| isRepoIssueList(url)
	|| isRepoTaxonomyIssueOrPRList(url);

/**
 * @example https://github.com/sindresorhus/refined-github/pulls
 * @example https://github.com/sindresorhus/refined-github/pulls/
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed
 */
export const isRepoPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('pulls'));

/**
 * @example http://github.com/sindresorhus/ava/issues
 * @example https://github.com/sindresorhus/refined-github/issues
 * @example https://github.com/sindresorhus/refined-github/issues/fregante
 * @example https://github.com/sindresorhus/refined-github/issues/newton
 * @example https://github.com/refined-github/refined-github/issues/views/4537
 * @example https://github.com/sindresorhus/refined-github/issues/wptemplates
 * @example https://github.com/sindresorhus/refined-github/issues?q=is%3Aclosed+sort%3Aupdated-desc
 * @example https://github.com/sindresorhus/refined-github/labels/bug
 * @example https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github
 * @example https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt
 */
export const isRepoIssueList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	// `issues/fregante` and `issues/views/123` are lists but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit`, `issues/views` aren’t
	/^labels\/|^issues(?!\/(\d+|new|templates|views$)($|\/))/.test(getRepo(url)?.path);

const hasSearchParameter = (url: URL | HTMLAnchorElement | Location): boolean => new URLSearchParams(url.search).get('search') === '1';

/**
 * @example https://github.com/sindresorhus/refined-github
 * @example https://github.com/sindresorhus/refined-github/
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/edit
 * @example https://github.com/sindresorhus///edit
 * @example https://github.com/sindresorhus/search
 * @example https://github.com/sindresorhus/branches
 * @example https://github.com/sindresorhus/refined-github?files=1
 * @example https://github.com/pullsuser/my-library
 * @example https://github.com/issuesuser/my-library
 */
export const isRepoHome = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === ''
	&& !hasSearchParameter(url);

export type RepoExplorerInfo = {
	nameWithOwner: string;
	branch: string;
	filePath: string;
};

// https://github.com/eslint/js/tree/2.x ->'eslint/js at 2.x'
// https://github.com/eslint/js/tree/2.x ->'js/ at 2.x · eslint/js'
// https://github.com/eslint/js/tree/2.x/tools -> 'js/tools at 2.x · eslint/js'
const titleParseRegex = /^(?:(?<nameWithOwner>[^ ]+) at (?<branch>[^ ]+)|[^/ ]+(?:\/(?<filePath>[^ ]*))? at (?<branch2>[^ ]+)(?: · (?<nameWithOwner2>[^ ]+))?)$/;
// TODO: Reuse regex group names on the next MAJOR version https://github.com/tc39/proposal-duplicate-named-capturing-groups/issues/4

const parseRepoExplorerTitle = (pathname: string, title: string): RepoExplorerInfo | undefined => {
	const match = titleParseRegex.exec(title);
	if (!match?.groups) {
		return;
	}

	let {nameWithOwner, branch, filePath, nameWithOwner2, branch2} = match.groups;

	nameWithOwner ??= nameWithOwner2;
	branch ??= branch2;
	filePath ??= '';

	if (!nameWithOwner || !branch || !pathname.startsWith(`/${nameWithOwner}/tree/`)) {
		return;
	}

	return {nameWithOwner, branch, filePath};
};

const _isRepoRoot = (url?: URL | HTMLAnchorElement | Location): boolean => {
	const repository = getRepo(url ?? location);

	if (!repository) {
		// Not a repo
		return false;
	}

	const path = repository.path ? repository.path.split('/') : [];

	switch (path.length) {
		case 0: {
			// Absolute repo root: `isRepoHome`
			return true;
		}

		case 2: {
			// 100% certainty that it's a root if it's `tree`
			return path[0] === 'tree';
		}

		default: {
			if (url) {
				// From the URL we can safely only know it's a root if it's `user/repo/tree/something`
				// With `user/repo/tree/something/else` we can't be sure whether `else` is a folder or still the branch name ("something/else")
				return false;
			}

			// If we're checking the current page, add support for branches with slashes
			const titleInfo = parseRepoExplorerTitle(location.pathname, document.title);

			return titleInfo?.filePath === '';
		}
	}
};

// `_isRepoRoot` logic depends on whether a URL was passed, so don't use a `url` default parameter
/**
 * @see isRepoHome
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/
 * @example https://github.com/sindresorhus/refined-github/tree/57bf4
 * @example https://github.com/sindresorhus/refined-github/tree/master?files=1
 */
export const isRepoRoot = (url?: URL | HTMLAnchorElement | Location): boolean => !hasSearchParameter(url ?? location) && _isRepoRoot(url);

/**
 * @example https://github.com/sindresorhus/refined-github/search?q=diff
 * @example https://github.com/sindresorhus/refined-github/search?q=diff&unscoped_q=diff&type=Issues
 * @example https://github.com/sindresorhus/refined-github/search
 */
export const isRepoSearch = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'search';

/**
 * @example https://github.com/sindresorhus/refined-github/settings
 * @example https://github.com/sindresorhus/refined-github/settings/branches
 */
export const isRepoSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('settings'));

/**
 * @example https://github.com/sindresorhus/refined-github/settings
 */
export const isRepoMainSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'settings';

/**
 * @example https://github.com/settings/replies
 * @example https://github.com/settings/replies/88491/edit
 */
export const isRepliesSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/replies');

/**
 * @example https://github.com/settings/profile
 * @see isRepliesSettings
 */
export const isUserSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/');

/**
 * @see isRepoRoot
 * @example https://github.com/sindresorhus/refined-github/tree/main/source
 * @example https://github.com/sindresorhus/refined-github/tree/0.13.0/extension
 * @example https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/extension
 * @example https://github.com/sindresorhus/refined-github?search=1
 */
export const isRepoTree = (url: URL | HTMLAnchorElement | Location = location): boolean => _isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith('tree/'));

/**
 * @example https://github.com/lukesampson/scoop/wiki
 * @example https://github.com/tooomm/wikitest/wiki/_new
 * @example https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit
 * @example https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 * @example https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 */
export const isRepoWiki = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('wiki'));

/**
 * @example https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f
 * @example https://github.com/sindresorhus/refined-github/commit/5b614
 */
export const isSingleCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path);

/**
 * @example https://github.com/sindresorhus/refined-github/blob/master/.gitattributes
 * @example https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css
 * @example https://github.com/sindresorhus/refined-github/blob/master/edit.txt
 * @see isRenderedTextFile
 */
export const isSingleFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blob/'));

/**
 * @example https://github.com/sindresorhus/refined-github/blob/master/readme.md
 * @example https://github.com/sindresorhus/refined-github/blob/master/README.markdown
 * @example https://github.com/sindresorhus/refined-github/blob/main/docs/guide.mdown
 * @example https://github.com/sindresorhus/refined-github/blob/main/CONTRIBUTING.mkdn
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.textile
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.rdoc
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.org
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.creole
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.mediawiki
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.wiki
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.rst
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.asciidoc
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.adoc
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.asc
 * @example https://github.com/sindresorhus/refined-github/blob/master/file.pod
 */
export const isRenderedTextFile = (url: URL | HTMLAnchorElement | Location = location): boolean => isSingleFile(url) && /\.(md|markdown|mdown|mkdn|textile|rdoc|org|creole|mediawiki|wiki|rst|asciidoc|adoc|asc|pod)$/i.test(url.pathname);

/**
 * @see isRepoRoot
 * @see isRenderedTextFile
 */
export const hasRenderedText = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoRoot(url) || isRenderedTextFile(url);

/**
 * @example https://github.com/sindresorhus/refined-github/find/master
 */
export const isFileFinder = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('find/'));

/**
 * @deprecated Use is404 and isSingleFile/isRepoTree directly
 * @example https://github.com/fregante/GhostText/tree/3cacd7df71b097dc525d99c7aa2f54d31b02fcc8/chrome/scripts/InputArea
 * @example https://github.com/refined-github/refined-github/blob/some-non-existent-ref/source/features/bugs-tab.tsx
 */
export const isRepoFile404 = (url: URL | HTMLAnchorElement | Location = location): boolean => (isSingleFile(url) || isRepoTree(url)) && document.title.startsWith('File not found');

/**
 * @example https://github.com/sindresorhus/refined-github/network/members
 */
export const isRepoForksList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network/members';

/**
 * @example https://github.com/sindresorhus/refined-github/network
 */
export const isRepoNetworkGraph = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network';

export const isForkedRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');

/**
 * @example https://github.com/refined-github/refined-github/fork
 */
export const isForkingRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'fork';

/**
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3/d1ebf7d9cfaba4d4596d2ea9174e202479a5f9ad
 * @example https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064
 */
export const isSingleGist = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url));

/**
 * @example https://gist.github.com/kidonng/0d16c7f17045f486751fad1b602204a0/revisions
 */
export const isGistRevision = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url));

/**
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3
 * @example https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064
 */
export const isGistFile = (url: URL | HTMLAnchorElement | Location = location): boolean => {
	const pathname = getCleanGistPathname(url);
	return pathname?.replace(/[^/]/g, '').length === 1;
};

/**
 * @example https://github.com/trending
 * @example https://github.com/trending/developers
 * @example https://github.com/trending/unknown
 */
export const isTrending = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/trending' || url.pathname.startsWith('/trending/');

/**
 * @example https://github.com/sindresorhus/refined-github/branches
 */
export const isBranches = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('branches'));

// Use this with a clean pathname, without leading `/gist/`
const doesLookLikeAProfile = (string: string | undefined): boolean =>
	typeof string === 'string'
	&& string.length > 0 // Isn't root (http://github.com/)
	&& !string.includes('/') // Single-level
	&& !string.includes('.') // No extensions
	&& !reservedNames.includes(string);

/**
 * @example https://github.com/fregante
 * @example https://github.com/github
 * @example https://github.com/babel
 * @example https://github.com/fregante?tab=repositories
 * @example https://github.com/fregante?tab=repositories&type=source
 * @example https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=
 * @example https://github.com/fregante?tab=stars
 * @example https://github.com/fregante?direction=desc&sort=updated&tab=stars
 * @example https://github.com/fregante?tab=followers
 * @example https://github.com/sindresorhus?tab=followers
 * @example https://github.com/fregante?tab=following
 * @example https://github.com/sindresorhus?tab=following
 * @example https://github.com/pullsuser
 * @example https://github.com/issuesuser
 */
export const isProfile = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	!isGist(url)
	&& doesLookLikeAProfile(getCleanPathname(url));

/**
 * @example https://gist.github.com/fregante
 * @example https://gist.github.com/github
 * @example https://gist.github.com/babel
 * @example https://my-little-hub.com/gist/in-fragrante
 * @example https://gist.my-little-hub.com/in-fragrante
 */
export const isGistProfile = (url: URL | HTMLAnchorElement | Location = location): boolean => doesLookLikeAProfile(getCleanGistPathname(url));

export const isUserProfile = (): boolean => isProfile() && !isOrganizationProfile();

export const isPrivateUserProfile = (): boolean => isUserProfile() && exists('#user-private-profile-frame');

export const isUserProfileMainTab = (): boolean =>
	isUserProfile()
	&& !new URLSearchParams(location.search).has('tab');

// The following can be URL-based because they have a `tab` parameter, unlike the organizations
/**
 * @example https://github.com/fregante?tab=repositories
 * @example https://github.com/fregante?tab=repositories&type=source
 * @example https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=
 */
export const isUserProfileRepoTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'repositories';

/**
 * @example https://github.com/fregante?tab=stars
 * @example https://github.com/fregante?direction=desc&sort=updated&tab=stars
 */
export const isUserProfileStarsTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'stars';

/**
 * @example https://github.com/fregante?tab=followers
 * @example https://github.com/sindresorhus?tab=followers
 */
export const isUserProfileFollowersTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'followers';

/**
 * @example https://github.com/fregante?tab=following
 * @example https://github.com/sindresorhus?tab=following
 */
export const isUserProfileFollowingTab = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isProfile(url)
	&& new URLSearchParams(url.search).get('tab') === 'following';

/**
 * @example https://github.com/fregante?tab=repositories
 * @example https://github.com/fregante?tab=repositories&type=source
 * @example https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=
 * @example https://github.com/orgs/refined-github/repositories
 * @example https://github.com/orgs/refined-github/repositories?q=&type=private&language=&sort=
 */
export const isProfileRepoList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isUserProfileRepoTab(url) || getOrg(url)?.path === 'repositories';

/**
 * @see isPR
 * @see isIssue
 * @see isCommit
 * @see isTeamDiscussion
 * @see isSingleGist
 */
export const hasComments = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isPR(url)
	|| isIssue(url)
	|| isCommit(url)
	|| isTeamDiscussion(url)
	|| isSingleGist(url);

/**
 * @see hasComments
 * @see isNewIssue
 * @see isCompare
 * @see isRepliesSettings
 * @see hasReleaseEditor
 * @see isDiscussion
 * @see isNewDiscussion
 */
export const hasRichTextEditor = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	hasComments(url)
	|| isNewIssue(url)
	|| isCompare(url)
	|| isRepliesSettings(url)
	|| hasReleaseEditor(url)
	|| isDiscussion(url)
	|| isNewDiscussion(url);

/**
 * Static code, not the code editor
 * @see hasComments
 * @see isRepoTree
 * @see isRepoSearch
 * @see isGlobalSearchResults
 * @see isSingleFile
 * @see isBlame
 * @see isGist
 * @see isCompare
 * @see isCompareWikiPage
 */
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

/**
 * Covers blob, trees and blame pages
 * @see isRepoTree
 * @see isSingleFile
 * @see isBlame
 */
export const isRepoGitObject = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isRepo(url)
	&& [undefined, 'blob', 'tree', 'blame'].includes(getCleanPathname(url).split('/')[2]);

/**
 * Has a list of files
 * @see isCommit
 * @see isCompare
 * @see isPRFiles
 */
export const hasFiles = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isCommit(url)
	|| isCompare(url)
	|| isPRFiles(url);

/**
 * @example https://github.com/marketplace/actions/urlchecker-action
 * @example https://github.com/marketplace/actions/github-action-for-assignee-to-reviewer
 * @example https://github.com/marketplace/actions/hugo-actions
 */
export const isMarketplaceAction = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/marketplace/actions/');

/**
 * @example https://github.com/sindresorhus/refined-github/runs/639481849
 * @example https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true
 */
export const isActionJobRun = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('runs/'));

/**
 * @example https://github.com/sindresorhus/refined-github/runs/639481849
 * @example https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true
 * @example https://github.com/refined-github/github-url-detection/actions/runs/294962314
 */
export const isActionRun = (url: URL | HTMLAnchorElement | Location = location): boolean => /^(actions\/)?runs/.test(getRepo(url)?.path);

/**
 * @example https://github.com/sindresorhus/refined-github/actions/new
 */
export const isNewAction = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'actions/new';

/**
 * @example https://github.com/refined-github/github-url-detection/actions
 * @example https://github.com/refined-github/github-url-detection/actions/workflows/demo.yml
 * @example https://github.com/refined-github/github-url-detection/actions/workflows/esm-lint.yml
 */
export const isRepositoryActions = (url: URL | HTMLAnchorElement | Location = location): boolean => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path);

export const isUserTheOrganizationOwner = (): boolean => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');

/**
 * @deprecated Use canUserAccessRepoSettings or API instead.
 */
export const canUserAdminRepo = (): boolean => {
	const repo = getRepo();
	return Boolean(repo && exists(`.GlobalNav a[href="/${repo.nameWithOwner}/settings"]`));
};

// eslint-disable-next-line @typescript-eslint/no-deprecated
export const canUserAccessRepoSettings = canUserAdminRepo;

/**
 * @example https://github.com/new
 * @example https://github.com/organizations/npmhub/repositories/new
 */
export const isNewRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && (url.pathname === '/new' || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url)));

// This can't use `getRepo().path` to avoid infinite recursion:
/**
 * @example https://github.com/fregante/browser-extension-template/generate
 */
export const isNewRepoTemplate = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(url.pathname.split('/')[3] === 'generate');

/** Get the logged-in user’s username */
const getLoggedInUser = (): string | undefined => $('meta[name="user-login"]')?.getAttribute('content') ?? undefined;

/** Drop all redundant slashes */
const getCleanPathname = (url: URL | HTMLAnchorElement | Location = location): string => url.pathname.replaceAll(/\/\/+/g, '/').replace(/\/$/, '').slice(1);

const getCleanGistPathname = (url: URL | HTMLAnchorElement | Location = location): string | undefined => {
	const pathname = getCleanPathname(url);
	if (url.hostname.startsWith('gist.')) {
		return pathname;
	}

	const [gist, ...parts] = pathname.split('/');
	return gist === 'gist' ? parts.join('/') : undefined;
};

const getOrg = (url: URL | HTMLAnchorElement | Location = location): {name: string; path: string} | undefined => {
	const [orgs, name, ...path] = getCleanPathname(url).split('/');
	if (orgs === 'orgs' && name) {
		return {name, path: path.join('/')};
	}

	return undefined;
};

export type NameWithOwner = `${string}/${string}`;

export type RepositoryInfo = {
	/** The repo owner/user */
	owner: string;

	/** The repo name */
	name: string;

	/** The 'user/repo' part from an URL */
	nameWithOwner: NameWithOwner;

	/** A repo's subpage
	@example '/user/repo/issues/' -> 'issues'
	@example '/user/repo/' -> ''
	@example '/settings/token/' -> undefined */
	path: string;

	/** The `path` segments
	@example '/user/repo/' -> []
	@example '/user/repo/issues/' -> ['issues']
	@example '/user/repo/issues/new' -> ['issues', 'new'] */
	pathParts: string[];
};

/**
 * Parse a repository URL into its parts, or return `undefined`
 * @param url Can be a full URL or a relative URL
 * @returns
 */
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

	const [owner, name, ...pathParts] = getCleanPathname(url).split('/') as [string, string, string];
	return {
		owner,
		name,
		pathParts,
		nameWithOwner: `${owner}/${name}`,
		path: pathParts.join('/'),
	};
};

export const utils = {
	getOrg,
	getLoggedInUser,
	getCleanPathname,
	getCleanGistPathname,
	getRepositoryInfo: getRepo,
	parseRepoExplorerTitle,
	waitFor,
};
