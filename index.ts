import reservedNames from 'github-reserved-names/reserved-names.json';
import collect from './collector';

const exists = (selector: string) => Boolean(document.querySelector(selector));

const combinedTestOnly = 'combinedTestOnly'; // To be used only to skip tests of combined functions, i.e. isPageA() || isPageB()

collect.set('__urls_that_dont_match__', [
	'https://github.com/sindresorhus/refined-github/issues/new',
	'https://github.com/sindresorhus/refined-github/issues/new/choose',
	'https://github.com/sindresorhus/refined-github/issues/templates/edit',
]);

export const is404 = (): boolean => document.title === 'Page not found · GitHub';

export const is500 = (): boolean => document.title === 'Server Error · GitHub' || document.title === 'Unicorn! · GitHub' || document.title === '504 Gateway Time-out';

export const isPasswordConfirmation = (): boolean => document.title === 'Confirm password' || document.title === 'Confirm access';

export const isBlame = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blame/'));
collect.set('isBlame', [
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
]);

export const isCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => isSingleCommit(url) || isPRCommit(url);
collect.set('isCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
]);

export const isCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoCommitList(url) || isPRCommitList(url);
collect.set('isCommitList', combinedTestOnly);

export const isRepoCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('commits'));
collect.set('isRepoCommitList', [
	'https://github.com/sindresorhus/refined-github/commits/master?page=2',
	'https://github.com/sindresorhus/refined-github/commits/test-branch',
	'https://github.com/sindresorhus/refined-github/commits/0.13.0',
	'https://github.com/sindresorhus/refined-github/commits/230c2',
	'https://github.com/sindresorhus/refined-github/commits/230c2935fc5aea9a681174ddbeba6255ca040d63',
	'https://github.com/sindresorhus/refined-github/commits?author=fregante',
	'https://github.com/sindresorhus/runs/commits/',
]);

export const isCompare = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('compare'));
collect.set('isCompare', [
	'https://github.com/sindresorhus/refined-github/compare',
	'https://github.com/sindresorhus/refined-github/compare/',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name',
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isDashboard = (url: URL | HTMLAnchorElement | Location = location): boolean => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
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
	'https://github.com/?tab=overview', // Gotcha for `isUserProfileMainTab`
]);

export const isEnterprise = (url: URL | HTMLAnchorElement | Location = location): boolean => url.hostname !== 'github.com' && url.hostname !== 'gist.github.com';
collect.set('isEnterprise', [
	'https://github.big-corp.com/',
	'https://not-github.com/',
	'https://my-little-hub.com/',
	'https://my-little-hub.com/gist',
]);

export const isGist = (url: URL | HTMLAnchorElement | Location = location): boolean => url.hostname.startsWith('gist.') || url.pathname.split('/', 2)[1] === 'gist';
collect.set('isGist', [
	'https://gist.github.com',
	'http://gist.github.com',
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
	'https://my-little-hub.com/gist',
]);

export const isGlobalConversationList = (url: URL | HTMLAnchorElement | Location = location): boolean => ['issues', 'pulls'].includes(url.pathname.split('/', 2)[1]!);
collect.set('isGlobalConversationList', [
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
collect.set('isGlobalSearchResults', [
	'https://github.com/search?q=refined-github&ref=opensearch',
]);

export const isIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => /^issues\/\d+/.test(getRepo(url)?.path!) && document.title !== 'GitHub · Where software is built'; // The title check excludes deleted issues
collect.set('isIssue', [
	'https://github.com/sindresorhus/refined-github/issues/146',
]);

export const isConversationList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isGlobalConversationList(url) ||
	isRepoConversationList(url) ||
	isMilestone(url);
collect.set('isConversationList', combinedTestOnly);

export const isConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => isIssue(url) || isPRConversation(url);
collect.set('isConversation', combinedTestOnly);

export const isLabelList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'labels';
collect.set('isLabelList', [
	'https://github.com/sindresorhus/refined-github/labels',
	'https://github.com/sindresorhus/refined-github/labels/',
]);

export const isMilestone = (url: URL | HTMLAnchorElement | Location = location): boolean => /^milestone\/\d+/.test(getRepo(url)?.path!);
collect.set('isMilestone', [
	'https://github.com/sindresorhus/refined-github/milestone/12',
]);

export const isMilestoneList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'milestones';
collect.set('isMilestoneList', [
	'https://github.com/sindresorhus/refined-github/milestones',
]);

export const isNewFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('new'));
collect.set('isNewFile', [
	'https://github.com/sindresorhus/refined-github/new/main',
]);

export const isNewIssue = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'issues/new';
collect.set('isNewIssue', [
	'https://github.com/sindresorhus/refined-github/issues/new',
]);

export const isNewRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'releases/new';
collect.set('isNewRelease', [
	'https://github.com/sindresorhus/refined-github/releases/new',
]);

export const isNewWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_new');
collect.set('isNewWikiPage', [
	'https://github.com/tooomm/wikitest/wiki/_new',
]);

export const isNotifications = (url: URL | HTMLAnchorElement | Location = location): boolean => getCleanPathname(url) === 'notifications';
collect.set('isNotifications', [
	'https://github.com/notifications',
]);

export const isOrganizationProfile = (): boolean => exists('meta[name="hovercard-subject-tag"][content^="organization"]');

export const isOrganizationRepo = (): boolean => Boolean(document.querySelector<HTMLElement>('[data-owner-scoped-search-url]')?.dataset['ownerScopedSearchUrl']!.startsWith('/org'));

export const isOrganizationDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => /^orgs\/[^/]+\/teams\/[^/]+($|\/discussions)/.test(getCleanPathname(url));
collect.set('isOrganizationDiscussion', [
	'https://github.com/orgs/refined-github/teams/core-team/discussions?pinned=1',
	'https://github.com/orgs/refined-github/teams/core-team/discussions/1',
	'https://github.com/orgs/refined-github/teams/core-team',
]);

export const isOwnUserProfile = (): boolean => getCleanPathname() === getUsername();

// If there's a Report Abuse link, we're not part of the org
export const isOwnOrganizationProfile = (): boolean => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');

export const isProject = (url: URL | HTMLAnchorElement | Location = location): boolean => /^projects\/\d+/.test(getRepo(url)?.path!);
collect.set('isProject', [
	'https://github.com/sindresorhus/refined-github/projects/3',
]);

export const isDiscussion = (url: URL | HTMLAnchorElement | Location = location): boolean => /^discussions\/\d+/.test(getRepo(url)?.path!);
collect.set('isDiscussion', [
	'https://github.com/tophf/mpiv/discussions/50',
]);

export const isDiscussionList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'discussions';
collect.set('isDiscussionList', [
	'https://github.com/tophf/mpiv/discussions',
]);

export const isPR = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+/.test(getRepo(url)?.path!) && !isPRConflicts(url);
collect.set('isPR', [
	'https://github.com/sindresorhus/refined-github/pull/148',
	'https://github.com/sindresorhus/refined-github/pull/148/commits',
	'https://github.com/sindresorhus/refined-github/pull/148/files',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
]);

export const isPRConflicts = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path!);
collect.set('isPRConflicts', [
	'https://github.com/sindresorhus/refined-github/pull/148/conflicts',
]);

/** Any `isConversationList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown */
export const isPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/pulls' || getRepo(url)?.path === 'pulls';
collect.set('isPRList', [
	'https://github.com/pulls',
	'https://github.com/pulls?q=issues',
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

export const isPRCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/commits\/[\da-f]{5,40}/.test(getRepo(url)?.path!);
collect.set('isPRCommit', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits/0019603b83bd97c2f7ef240969f49e6126c5ec85',
	'https://github.com/sindresorhus/refined-github/pull/148/commits/00196',
]);

export const isPRCommit404 = (): boolean => isPRCommit() && document.title.startsWith('Commit range not found · Pull Request');
export const isPRFile404 = (): boolean => isPRFiles() && document.title.startsWith('Commit range not found · Pull Request');

export const isPRConversation = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+$/.test(getRepo(url)?.path!);
collect.set('isPRConversation', [
	'https://github.com/sindresorhus/refined-github/pull/148',
]);

export const isPRCommitList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/commits$/.test(getRepo(url)?.path!);
collect.set('isPRCommitList', [
	'https://github.com/sindresorhus/refined-github/pull/148/commits',
]);

export const isPRFiles = (url: URL | HTMLAnchorElement | Location = location): boolean => /^pull\/\d+\/files/.test(getRepo(url)?.path!);
collect.set('isPRFiles', [
	'https://github.com/sindresorhus/refined-github/pull/148/files',
]);

export const isQuickPR = (url: URL | HTMLAnchorElement | Location = location): boolean => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
collect.set('isQuickPR', [
	'https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1',
	'https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1',
]);

export const isDraftPR = (): boolean => exists('#partial-discussion-header [title="Status: Draft"]');
export const isOpenPR = (): boolean => exists('#partial-discussion-header [title="Status: Open"], #partial-discussion-header [title="Status: Draft"]');
export const isMergedPR = (): boolean => exists('#partial-discussion-header [title="Status: Merged"]');
export const isClosedPR = (): boolean => exists('#partial-discussion-header [title="Status: Closed"], #partial-discussion-header [title="Status: Merged"]');

export const isReleasesOrTags = (url: URL | HTMLAnchorElement | Location = location): boolean => /^tags$|^releases($|\/tag)/.test(getRepo(url)?.path!);
collect.set('isReleasesOrTags', [
	'https://github.com/sindresorhus/refined-github/releases',
	'https://github.com/sindresorhus/refined-github/tags',
	'https://github.com/sindresorhus/refined-github/releases/tag/v1.0.0-beta.4',
	'https://github.com/sindresorhus/refined-github/releases/tag/0.2.1',
]);

export const isEditingFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('edit'));
collect.set('isEditingFile', [
	'https://github.com/sindresorhus/refined-github/edit/master/readme.md',
	'https://github.com/sindresorhus/refined-github/edit/ghe-injection/source/background.ts',
]);

export const isEditingRelease = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('releases/edit'));
collect.set('isEditingRelease', [
	'https://github.com/sindresorhus/refined-github/releases/edit/v1.2.3',
]);

export const isEditingWikiPage = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoWiki(url) && getCleanPathname(url).endsWith('/_edit');
collect.set('isEditingWikiPage', [
	'https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit',
]);

export const isRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) &&
	!reservedNames.includes(url.pathname.split('/', 2)[1]!) &&
	!isDashboard(url) &&
	!isGist(url) &&
	!isRepoSearch(url) &&
	!isNewRepoTemplate(url);
collect.set('isRepo', [
	// Some of these are here simply as "gotchas" to other detections
	'https://github.com/sindresorhus/refined-github/blame/master/package.json',
	'https://github.com/sindresorhus/refined-github/issues/146',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/refined-github/pull/148',
	'https://github.com/sindresorhus/refined-github/milestones/new', // Gotcha for isRepoTaxonomyConversationList
	'https://github.com/sindresorhus/refined-github/milestones/1/edit', // Gotcha for isRepoTaxonomyConversationList
	'https://github.com/sindresorhus/refined-github/issues/new/choose', // Gotcha for isRepoIssueList
	'https://github.com/sindresorhus/refined-github/issues/templates/edit', // Gotcha for isRepoIssueList
]);

// On empty repos, there's only isRepoHome; this element is found in `<head>`
export const isEmptyRepoRoot = (): boolean => isRepoHome() && !exists('link[rel="canonical"]');

export const isEmptyRepo = (): boolean => exists('[aria-label="Cannot fork because repository is empty."]');

export const isRepoTaxonomyConversationList = (url: URL | HTMLAnchorElement | Location = location): boolean => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path!);
collect.set('isRepoTaxonomyConversationList', [
	'https://github.com/sindresorhus/refined-github/labels/bug',
	'https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github',
	'https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt',
	'https://github.com/sindresorhus/refined-github/milestones/1',
]);

export const isRepoConversationList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isRepoPRList(url) ||
	isRepoIssueList(url) ||
	isRepoTaxonomyConversationList(url);
collect.set('isRepoConversationList', combinedTestOnly);

export const isRepoPRList = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('pulls'));
collect.set('isRepoPRList', [
	'https://github.com/sindresorhus/refined-github/pulls',
	'https://github.com/sindresorhus/refined-github/pulls/',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr',
	'https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed',
]);

export const isRepoIssueList = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	// `issues/fregante` is a list but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit` aren’t
	/^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path!);
collect.set('isRepoIssueList', [
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

export const isRepoHome = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === '';
collect.set('isRepoHome', [
	// Some tests are here only as "gotchas" for other tests that may misidentify their pages
	'https://github.com/sindresorhus/refined-github',
	'https://github.com/sindresorhus/refined-github/',
	'https://github.com/sindresorhus/notifications/',
	'https://github.com/sindresorhus/edit',
	'https://github.com/sindresorhus/search',
	'https://github.com/sindresorhus/branches',
	'https://github.com/sindresorhus/refined-github?files=1',
]);

export const isRepoRoot = (url?: URL | HTMLAnchorElement | Location): boolean => {
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

collect.set('isRepoRoot', [
	...collect.get('isRepoHome') as string[],
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons',
	'https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6',
	'https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/',
	'https://github.com/sindresorhus/refined-github/tree/57bf4',
	'https://github.com/sindresorhus/refined-github/tree/master?files=1',
]);

// This can't use `getRepositoryInfo().path` to avoid infinite recursion:
// `getRepositoryInfo` depends on `isRepo` and `isRepo` depends on `isRepoSearch`
export const isRepoSearch = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.split('/')[3] === 'search';
collect.set('isRepoSearch', [
	'https://github.com/sindresorhus/refined-github/search?q=diff',
	'https://github.com/sindresorhus/refined-github/search?q=diff&unscoped_q=diff&type=Issues',
	'https://github.com/sindresorhus/refined-github/search',
]);

export const isRepoSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('settings'));
collect.set('isRepoSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
	'https://github.com/sindresorhus/refined-github/settings/branches',
]);

export const isRepoMainSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'settings';
collect.set('isRepoMainSettings', [
	'https://github.com/sindresorhus/refined-github/settings',
]);

export const isRepliesSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/replies');
collect.set('isRepliesSettings', [
	'https://github.com/settings/replies',
	'https://github.com/settings/replies/88491/edit',
]);

export const isUserSettings = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/settings/');
collect.set('isUserSettings', [
	'https://github.com/settings/profile',
	...collect.get('isRepliesSettings') as string[],
]);

export const isRepoTree = (url: URL | HTMLAnchorElement | Location = location): boolean => isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith('tree/'));
collect.set('isRepoTree', [
	...collect.get('isRepoRoot') as string[],
	'https://github.com/sindresorhus/refined-github/tree/master/distribution',
	'https://github.com/sindresorhus/refined-github/tree/0.13.0/distribution',
	'https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/distribution',
]);

export const isRepoWiki = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('wiki'));
collect.set('isRepoWiki', [
	'https://github.com/lukesampson/scoop/wiki',
	'https://github.com/tooomm/wikitest/wiki/_new',
	'https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit',
]);

export const isSingleCommit = (url: URL | HTMLAnchorElement | Location = location): boolean => /^commit\/[\da-f]{5,40}/.test(getRepo(url)?.path!);
collect.set('isSingleCommit', [
	'https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f',
	'https://github.com/sindresorhus/refined-github/commit/5b614',
]);

export const isSingleFile = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('blob/'));
collect.set('isSingleFile', [
	'https://github.com/sindresorhus/refined-github/blob/master/.gitattributes',
	'https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css',
	'https://github.com/sindresorhus/refined-github/blob/master/edit.txt',
]);

export const isFileFinder = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('find/'));
collect.set('isFileFinder', [
	'https://github.com/sindresorhus/refined-github/find/master',
]);

export const isRepoForksList = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network/members';
collect.set('isRepoForksList', [
	'https://github.com/sindresorhus/refined-github/network/members',
]);

export const isRepoNetworkGraph = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'network';
collect.set('isRepoNetworkGraph', [
	'https://github.com/sindresorhus/refined-github/network',
]);

export const isForkedRepo = (): boolean => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');

export const isSingleGist = (url: URL | HTMLAnchorElement | Location = location): boolean => isGist(url) && /^\/(gist\/)?[^/]+\/[\da-f]{32}$/.test(url.pathname);
collect.set('isSingleGist', [
	'https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064',
]);

export const isTrending = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/trending' || url.pathname.startsWith('/trending/');
collect.set('isTrending', [
	'https://github.com/trending',
	'https://github.com/trending/developers',
	'https://github.com/trending/unknown',
]);

export const isBranches = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('branches'));
collect.set('isBranches', [
	'https://github.com/sindresorhus/refined-github/branches',
]);

export const isUserProfile = (): boolean => exists('.user-profile-nav');

export const isUserProfileMainTab = (): boolean => exists('[aria-label="User profile"] > .selected:first-child');

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

export const isSingleTag = (url: URL | HTMLAnchorElement | Location = location): boolean => /^(releases\/tag)/.test(getRepo(url)?.path!);
collect.set('isSingleTag', [
	'https://github.com/sindresorhus/refined-github/releases/tag/v1.0.0-beta.4',
	'https://github.com/sindresorhus/refined-github/releases/tag/0.2.1',
]);

collect.set('hasComments', combinedTestOnly);
export const hasComments = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	isPR(url) ||
	isIssue(url) ||
	isCommit(url) ||
	isOrganizationDiscussion(url) ||
	isSingleGist(url);

collect.set('hasRichTextEditor', combinedTestOnly);
export const hasRichTextEditor = (url: URL | HTMLAnchorElement | Location = location): boolean =>
	hasComments(url) ||
	isNewIssue(url) ||
	isCompare(url) ||
	isRepliesSettings(url) ||
	isDiscussion(url);

collect.set('hasCode', combinedTestOnly);
export const hasCode = (url: URL | HTMLAnchorElement | Location = location): boolean => // Static code, not the editor
	hasComments(url) ||
	isRepoTree(url) || // Readme files
	isSingleFile(url) ||
	isGist(url) ||
	isCompare(url) ||
	isBlame(url);

export const isMarketplaceAction = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname.startsWith('/marketplace/actions/');
collect.set('isMarketplaceAction', [
	'https://github.com/marketplace/actions/urlchecker-action',
	'https://github.com/marketplace/actions/github-action-for-assignee-to-reviewer',
	'https://github.com/marketplace/actions/hugo-actions',
]);

export const isActionJobRun = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(getRepo(url)?.path.startsWith('runs/'));
collect.set('isActionJobRun', [
	'https://github.com/sindresorhus/refined-github/runs/639481849',
	'https://github.com/fregante/github-url-detection/runs/1224552520?check_suite_focus=true',
]);

export const isActionRun = (url: URL | HTMLAnchorElement | Location = location): boolean => /^(actions\/)?runs/.test(getRepo(url)?.path!);
collect.set('isActionRun', [
	'https://github.com/sindresorhus/refined-github/runs/639481849',
	'https://github.com/fregante/github-url-detection/runs/1224552520?check_suite_focus=true',
	'https://github.com/fregante/github-url-detection/actions/runs/294962314',
]);

export const isNewAction = (url: URL | HTMLAnchorElement | Location = location): boolean => getRepo(url)?.path === 'actions/new';
collect.set('isNewAction', [
	'https://github.com/sindresorhus/refined-github/actions/new',
]);

export const isRepositoryActions = (url: URL | HTMLAnchorElement | Location = location): boolean => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path!);
collect.set('isRepositoryActions', [
	'https://github.com/fregante/github-url-detection/actions',
	'https://github.com/fregante/github-url-detection/actions/workflows/demo.yml',
	'https://github.com/fregante/github-url-detection/actions/workflows/esm-lint.yml',
]);

export const isUserTheOrganizationOwner = (): boolean => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');
/** @deprecated use isUserTheOrganizationOwner instead */
export const canUserEditOrganization = isUserTheOrganizationOwner;

export const canUserEditRepo = (): boolean => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]');

export const isNewRepo = (url: URL | HTMLAnchorElement | Location = location): boolean => url.pathname === '/new' || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url));
collect.set('isNewRepo', [
	'https://github.com/new',
	'https://github.com/organizations/npmhub/repositories/new',
]);

// This can't use `getRepo().path` to avoid infinite recursion:
export const isNewRepoTemplate = (url: URL | HTMLAnchorElement | Location = location): boolean => Boolean(url.pathname.split('/')[3] === 'generate');
collect.set('isNewRepoTemplate', [
	'https://github.com/fregante/browser-extension-template/generate',
]);

/** Get the logged-in user’s username */
const getUsername = (): string | undefined => document.querySelector('meta[name="user-login"]')?.getAttribute('content')!;

/** Drop leading and trailing slashes */
const getCleanPathname = (url: URL | HTMLAnchorElement | Location = location): string => url.pathname.slice(1, url.pathname.endsWith('/') ? -1 : undefined);

export interface RepositoryInfo {
	owner: string;
	name: string;

	/** The 'user/repo' part from an URL */
	nameWithOwner: string;

	/** A repo's subpage
	@example '/user/repo/issues/' -> 'issues'
	@example '/user/repo/' -> ''
	@example '/settings/token/' -> undefined */
	path: string;
}

const getRepo = (url?: URL | HTMLAnchorElement | Location | string): RepositoryInfo | undefined => {
	if (!url) {
		// We use `canonical` here to use the correct capitalization
		// `rel=canonical` doesn't appear on every page
		const canonical = document.querySelector<HTMLMetaElement>('[property="og:url"]');
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
	getUsername,
	getCleanPathname,
	getRepositoryInfo: getRepo,
};
