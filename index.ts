import reservedNames from 'github-reserved-names/reserved-names.json';
import collect from './collector';

const exists = (selector: string) => Boolean(document.querySelector(selector));

const combinedTestOnly = 'combinedTestOnly'; // To be used only to skip tests of combined functions, i.e. isPageA() || isPageB()

export const is404 = (): boolean => document.title === 'Page not found · GitHub';

export const is500 = (): boolean => document.title === 'Server Error · GitHub' || document.title === 'Unicorn! · GitHub' || document.title === '504 Gateway Time-out';

export const isBlame = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('blame/');
collect.set('isBlame', [
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
]);

export const isCommit = (url: URL | Location = location): boolean => isSingleCommit(url) || isPRCommit(url);
collect.set('isCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
]);

export const isCommitList = (url: URL | Location = location): boolean => isRepoCommitList(url) || isPRCommitList(url);
collect.set('isCommitList', combinedTestOnly);

export const isRepoCommitList = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('commits');
collect.set('isRepoCommitList', [
	'https://github.com/sindresorhus/refined-github/commits/master?page=2',
	'https://github.com/sindresorhus/refined-github/commits/test-branch',
	'https://github.com/sindresorhus/refined-github/commits/0.13.0',
	'https://github.com/sindresorhus/refined-github/commits/230c2',
	'https://github.com/sindresorhus/refined-github/commits/230c2935fc5aea9a681174ddbeba6255ca040d63',
	'https://github.com/sindresorhus/refined-github/commits?author=fregante',
	'https://github.com/sindresorhus/runs/commits/',
]);

export const isCompare = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('compare');
collect.set('isCompare', [
	'https://github.com/sindresorhus/refined-github/compare',
	'https://github.com/sindresorhus/refined-github/compare/',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isDashboard = (url: URL | Location = location): boolean => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
collect.set('isDashboard', [
	'https://github.com/',
	'https://github.com',
	'https://github.com/orgs/test/dashboard',
	'https://github.com/dashboard/index/2',
	'https://github.com/dashboard',
	'https://github.com/orgs/edit/dashboard',
	'https://github.big-corp.com/',
	'https://not-github.com/',
	'https://my-little-hub.com/',
	'https://github.com/?tab=repositories', // Gotcha for `isUserProfileRepoTab`
	'https://github.com/?tab=stars', // Gotcha for `isUserProfileStarsTab`
	'https://github.com/?tab=followers', // Gotcha for `isUserProfileFollowersTab`
	'https://github.com/?tab=following', // Gotcha for `isUserProfileFollowingTab`
]);

export const isEnterprise = (url: URL | Location = location): boolean => url.hostname !== 'github.com' && url.hostname !== 'gist.github.com';
collect.set('isEnterprise', [
	'https://github.big-corp.com/',
	'https://not-github.com/',
	'https://my-little-hub.com/',
	'https://my-little-hub.com/gist',
]);

export const isGist = (url: URL | Location = location): boolean => url.hostname.startsWith('gist.') || url.pathname.split('/', 2)[1] === 'gist';
collect.set('isGist', [
	'https://gist.github.com',
	'http://gist.github.com',
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
	'https://my-little-hub.com/gist',
]);

export const isGlobalDiscussionList = (url: URL | Location = location): boolean => ['issues', 'pulls'].includes(url.pathname.split('/', 2)[1]);
collect.set('isGlobalDiscussionList', [
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

export const isGlobalSearchResults = (url: URL | Location = location): boolean => url.pathname === '/search' && new URLSearchParams(url.search).get('q') !== null;
collect.set('isGlobalSearchResults', [
	'https://github.com/search?q=refined-github&ref=opensearch',
]);

export const isIssue = (url: URL | Location = location): boolean => /^issues\/\d+/.test(getRepoPath(url)!) && document.title !== 'GitHub · Where software is built'; // The title check excludes deleted issues
collect.set('isIssue', [
	'https://github.com/sindresorhus/refined-github/issues/146',
]);

export const isDiscussionList = (url: URL | Location = location): boolean => isGlobalDiscussionList(url) || isRepoDiscussionList(url);
collect.set('isDiscussionList', combinedTestOnly);

export const isLabelList = (url: URL | Location = location): boolean => getRepoPath(url) === 'labels';
collect.set('isLabelList', [
	'https://github.com/sindresorhus/refined-github/labels',
]);

export const isMilestone = (url: URL | Location = location): boolean => /^milestone\/\d+/.test(getRepoPath(url)!);
collect.set('isMilestone', [
	'https://github.com/sindresorhus/refined-github/milestone/12',
]);

export const isMilestoneList = (url: URL | Location = location): boolean => getRepoPath(url) === 'milestones';
collect.set('isMilestoneList', [
	'https://github.com/sindresorhus/refined-github/milestones',
]);

export const isNewIssue = (url: URL | Location = location): boolean => getRepoPath(url) === 'issues/new';
collect.set('isNewIssue', [
	'https://github.com/sindresorhus/refined-github/issues/new',
]);

export const isNewRelease = (url: URL | Location = location): boolean => getRepoPath(url) === 'releases/new';
collect.set('isNewRelease', [
	'https://github.com/sindresorhus/refined-github/releases/new',
]);

export const isNotifications = (url: URL | Location = location): boolean => getCleanPathname(url) === 'notifications';
collect.set('isNotifications', [
	'https://github.com/notifications',
]);

export const isOrganizationProfile = (): boolean => exists('meta[name="hovercard-subject-tag"][content^="organization"]');

export const isOrganizationDiscussion = (url: URL | Location = location): boolean => /^orgs\/[^/]+\/teams\/[^/]+($|\/discussions)/.test(getCleanPathname(url));
collect.set('isOrganizationDiscussion', [
	'https://github.com/orgs/refined-github/teams/core-team/discussions?pinned=1',
	'https://github.com/orgs/refined-github/teams/core-team/discussions/1',
	'https://github.com/orgs/refined-github/teams/core-team',
]);

export const isOwnUserProfile = (): boolean => getCleanPathname() === getUsername();

// If there's a Report Abuse link, we're not part of the org
export const isOwnOrganizationProfile = (): boolean => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');

export const isProject = (url: URL | Location = location): boolean => /^projects\/\d+/.test(getRepoPath(url)!);
collect.set('isProject', [
	'https://github.com/sindresorhus/refined-github/projects/3',
]);

export const isPR = (url: URL | Location = location): boolean => /^pull\/\d+/.test(getRepoPath(url)!) && !isConflict(url);
collect.set('isPR', [
	'https://github.com/sindresorhus/refined-github/pull/148',
	'https://github.com/sindresorhus/refined-github/pull/148/commits',
	'https://github.com/sindresorhus/refined-github/pull/148/files',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
]);

export const isPRConflicts = (url: URL | Location = location): boolean => /^pull\/\d+\/conflicts/.test(getRepoPath(url)!);
collect.set('isPRConflicts', [
	'https://github.com/sindresorhus/refined-github/pull/148/conflicts',
]);

/** @deprecated use isPRConflicts instead */
export const isConflict = isPRConflicts;
collect.set('isConflict', combinedTestOnly);

/** Any `isDiscussionList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown */
export const isPRList = (url: URL | Location = location): boolean => url.pathname === '/pulls' || getRepoPath(url) === 'pulls';
collect.set('isPRList', [
	'https://github.com/pulls',
	'https://github.com/pulls?q=issues',
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

export const isPRCommit = (url: URL | Location = location): boolean => /^pull\/\d+\/commits\/[\da-f]{5,40}/.test(getRepoPath(url)!);
collect.set('isPRCommit', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
]);

export const isPRConversation = (url: URL | Location = location): boolean => /^pull\/\d+$/.test(getRepoPath(url)!);
collect.set('isPRConversation', [
	'https://github.com/sindresorhus/refined-github/pull/148',
]);

export const isPRCommitList = (url: URL | Location = location): boolean => /^pull\/\d+\/commits$/.test(getRepoPath(url)!);
collect.set('isPRCommitList', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits',
]);

export const isPRFiles = (url: URL | Location = location): boolean => /^pull\/\d+\/files/.test(getRepoPath(url)!);
collect.set('isPRFiles', [
	'https://github.com/sindresorhus/refined-github/pull/148/files',
]);

export const isQuickPR = (url: URL | Location = location): boolean => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
collect.set('isQuickPR', [
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isReleasesOrTags = (url: URL | Location = location): boolean => /^tags$|^releases($|\/tag)/.test(getRepoPath(url)!);
collect.set('isReleasesOrTags', [
	'https://github.com/sindresorhus/refined-github/releases',
	'https://github.com/sindresorhus/refined-github/tags',
	'https://github.com/sindresorhus/refined-github/releases/tag/v1.0.0-beta.4',
	'https://github.com/sindresorhus/refined-github/releases/tag/0.2.1',
]);

export const isEditingFile = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('edit');
collect.set('isEditingFile', [
	'https://github.com/sindresorhus/refined-github/edit/master/readme.md',
	'https://github.com/sindresorhus/refined-github/edit/ghe-injection/source/background.ts',
]);

export const isRepo = (url: URL | Location = location): boolean => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) &&
	!reservedNames.includes(url.pathname.split('/', 2)[1]) &&
	!isDashboard(url) &&
	!isGist(url) &&
	!isRepoSearch(url);
collect.set('isRepo', [
	// Some of these are here simply as "gotchas" to other detections
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
	'https://github.com/sindresorhus/refined-github/issues/146',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/refined-github/pull/148',
	'https://github.com/sindresorhus/refined-github/milestones/new', // Gotcha for isRepoTaxonomyDiscussionList
	'https://github.com/sindresorhus/refined-github/milestones/1/edit', // Gotcha for isRepoTaxonomyDiscussionList
	'https://github.com/sindresorhus/refined-github/issues/new/choose', // Gotcha for isRepoIssueList
	'https://github.com/sindresorhus/refined-github/issues/templates/edit', // Gotcha for isRepoIssueList
]);

/** @deprecated use isEmptyRepoRoot instead */
export const isEmptyRepo = (): boolean => isRepo() && exists('.blankslate');

export const isEmptyRepoRoot = (): boolean => isRepoRoot() && exists('.blankslate');

export const isRepoTaxonomyDiscussionList = (url: URL | Location = location): boolean => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepoPath(url)!);
collect.set('isRepoTaxonomyDiscussionList', [
	'https://github.com/sindresorhus/refined-github/labels/Priority%3A%20critical',
	'https://github.com/sindresorhus/refined-github/milestones/1',
]);

export const isRepoDiscussionList = (url: URL | Location = location): boolean =>
	isRepoPRList(url) ||
	isRepoIssueList(url) ||
	isRepoTaxonomyDiscussionList(url);
collect.set('isRepoDiscussionList', combinedTestOnly);

export const isRepoPRList = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('pulls');
collect.set('isRepoPRList', [
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

// `issues/fregante` is a list but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit` aren’t
export const isRepoIssueList = (url: URL | Location = location): boolean =>
	String(getRepoPath(url)).startsWith('issues') &&
	!/^issues\/(\d+|new|templates)($|\/)/.test(getRepoPath(url)!);
collect.set('isRepoIssueList', [
	'http://github.com/sindresorhus/ava/issues',
	'https://github.com/sindresorhus/refined-github/issues',
	'https://github.com/sindresorhus/refined-github/issues/fregante',
	'https://github.com/sindresorhus/refined-github/issues/newton',
	'https://github.com/sindresorhus/refined-github/issues/wptemplates',
	'https://github.com/sindresorhus/refined-github/issues?q=is%3Aclosed+sort%3Aupdated-desc',
]);

export const isRepoRoot = (url: URL | Location = location): boolean => /^(tree\/[^/]+)?$/.test(getRepoPath(url)!);
collect.set('isRepoRoot', [
	// Some tests are here only as "gotchas" for other tests that may misidentify their pages
	'https://github.com/sindresorhus/edit',
	'https://github.com/sindresorhus/search',
	'https://github.com/sindresorhus/refined-github',
	'https://github.com/sindresorhus/refined-github/',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons',
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/',
	'https://github.com/sindresorhus/refined-github/tree/57bf4',
	'https://github.com/sindresorhus/refined-github?files=1',
	'https://github.com/sindresorhus/refined-github/tree/master?files=1',
	'https://github.com/sindresorhus/branches',
]);

// This can't use `getRepoPath` to avoid infinite recursion.
// `getRepoPath` depends on `isRepo` and `isRepo` depends on `isRepoSearch`
export const isRepoSearch = (url: URL | Location = location): boolean => url.pathname.slice(1).split('/')[2] === 'search';
collect.set('isRepoSearch', [
	'https://github.com/sindresorhus/refined-github/search?q=diff',
	'https://github.com/sindresorhus/refined-github/search?q=diff&unscoped_q=diff&type=Issues',
	'https://github.com/sindresorhus/refined-github/search',
]);

export const isRepoSettings = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('settings');
collect.set('isRepoSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
	'https://github.com/sindresorhus/refined-github/settings/branches',
]);

export const isRepoMainSettings = (url: URL | Location = location): boolean => getRepoPath(url) === 'settings';
collect.set('isRepoMainSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
]);

export const isRepoTree = (url: URL | Location = location): boolean => isRepoRoot(url) || String(getRepoPath(url)).startsWith('tree/');
collect.set('isRepoTree', [
	...collect.get('isRepoRoot') as string[],
	'https://github.com/sindresorhus/refined-github/tree/master/distribution',
	'https://github.com/sindresorhus/refined-github/tree/0.13.0/distribution',
	'https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/distribution',
]);

export const isSingleCommit = (url: URL | Location = location): boolean => /^commit\/[\da-f]{5,40}/.test(getRepoPath(url)!);
collect.set('isSingleCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
]);

export const isSingleFile = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('blob/');
collect.set('isSingleFile', [
	'https://github.com/sindresorhus/refined-github/blob/master/.gitattributes',
	'https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css',
	'https://github.com/sindresorhus/refined-github/blob/master/edit.txt',
]);

export const isFileFinder = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('find/');
collect.set('isFileFinder', [
	'https://github.com/sindresorhus/refined-github/find/master',
]);

export const isForkedRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');

export const isSingleGist = (url: URL | Location = location): boolean => isGist(url) && /^\/(gist\/)?[^/]+\/[\da-f]{32}$/.test(url.pathname);
collect.set('isSingleGist', [
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
]);

export const isTrending = (url: URL | Location = location): boolean => url.pathname === '/trending' || url.pathname.startsWith('/trending/');
collect.set('isTrending', [
	'https://github.com/trending',
	'https://github.com/trending/developers',
	'https://github.com/trending/unknown',
]);

export const isBranches = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('branches');
collect.set('isBranches', [
	'https://github.com/sindresorhus/refined-github/branches',
]);

export const isUserProfile = (): boolean => exists('.user-profile-nav');

export const isUserProfileMainTab = (): boolean =>
	isUserProfile() && !new URLSearchParams(location.search).get('tab');

export const isUserProfileRepoTab = (): boolean =>
	isUserProfile() &&
	new URLSearchParams(location.search).get('tab') === 'repositories';

export const isUserProfileStarsTab = (): boolean =>
	isUserProfile() &&
	new URLSearchParams(location.search).get('tab') === 'stars';

export const isUserProfileFollowersTab = (): boolean =>
	isUserProfile() &&
	new URLSearchParams(location.search).get('tab') === 'followers';

export const isUserProfileFollowingTab = (): boolean =>
	isUserProfile() &&
	new URLSearchParams(location.search).get('tab') === 'following';

export const isSingleTagPage = (url: URL | Location = location): boolean => /^(releases\/tag)/.test(getRepoPath(url)!);
collect.set('isSingleTagPage', [
	'https://github.com/sindresorhus/refined-github/releases/tag/v1.0.0-beta.4',
	'https://github.com/sindresorhus/refined-github/releases/tag/0.2.1',
]);

collect.set('hasComments', combinedTestOnly);
export const hasComments = (url: URL | Location = location): boolean =>
	isPR(url) ||
	isIssue(url) ||
	isCommit(url) ||
	isOrganizationDiscussion(url);

collect.set('hasRichTextEditor', combinedTestOnly);
export const hasRichTextEditor = (url: URL | Location = location): boolean =>
	hasComments(url) ||
	isNewIssue(url) ||
	isCompare(url);

collect.set('hasCode', combinedTestOnly);
export const hasCode = (url: URL | Location = location): boolean => // Static code, not the editor
	hasComments(url) ||
	isRepoTree(url) || // Readme files
	isSingleFile(url) ||
	isGist(url) ||
	isCompare(url) ||
	isBlame(url);

export const isActionPage = (url: URL | Location = location): boolean => url.pathname.startsWith('/marketplace/actions/');
collect.set('isActionPage', [
	'https://github.com/marketplace/actions/urlchecker-action',
	'https://github.com/marketplace/actions/github-action-for-assignee-to-reviewer',
	'https://github.com/marketplace/actions/hugo-actions',
]);

export const isActionJobRun = (url: URL | Location = location): boolean => String(getRepoPath(url)).startsWith('runs/');
collect.set('isActionJobRun', [
	'https://github.com/sindresorhus/refined-github/runs/639481849',
]);

export const canUserEditOrganization = (): boolean => isOrganizationProfile() && exists('.pagehead-tabs-item[href$="/settings/profile"]');

export const canUserEditRepo = (): boolean => isRepo() && exists('.reponav-item[href$="/settings"]');

/** @deprecated use canUserEditRepo instead */
export const isRepoWithAccess = canUserEditRepo;

/** Get the logged-in user’s username */
const getUsername = () => document.querySelector('meta[name="user-login"]')!.getAttribute('content')!;

/** Drop leading and trailing slashes */
const getCleanPathname = (url: URL | Location = location): string => url.pathname.replace(/^\/|\/$/g, '');

/** Parses a repo's subpage
@example '/user/repo/issues/' -> 'issues'
@example '/user/repo/' -> ''
@exampke '/settings/token/' -> undefined
*/
const getRepoPath = (url: URL | Location = location): string | undefined => {
	if (isRepo(url)) {
		return getCleanPathname(url).split('/').slice(2).join('/');
	}

	return undefined;
};

export const utils = {
	getUsername,
	getCleanPathname,
	getRepoPath,
};
