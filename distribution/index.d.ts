/* Examples added by add-examples-to-dts.ts */
export declare const is404: () => boolean;
export declare const is500: () => boolean;
export declare const isPasswordConfirmation: () => boolean;
export declare const isLoggedIn: () => boolean;
/** @example https://github.com/sindresorhus/refined-github/blame/master/package.json */
export declare const isBlame: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f
 * @example https://github.com/sindresorhus/refined-github/commit/5b614
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d79
 */
export declare const isCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/commits/master?page=2
 * @example https://github.com/sindresorhus/refined-github/commits/test-branch
 * @example https://github.com/sindresorhus/refined-github/commits/0.13.0
 * @example https://github.com/sindresorhus/refined-github/commits/230c2
 * @example https://github.com/sindresorhus/refined-github/commits/230c2935fc5aea9a681174ddbeba6255ca040d63
 * @example https://github.com/sindresorhus/refined-github/commits?author=fregante
 * @example https://github.com/sindresorhus/runs/commits/
 */
export declare const isRepoCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/compare
 * @example https://github.com/sindresorhus/refined-github/compare/
 * @example https://github.com/sindresorhus/refined-github/compare/master...branch-name
 * @example https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1
 */
export declare const isCompare: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 * @example https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 */
export declare const isCompareWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com///
 * @example https://github.com//
 * @example https://github.com/
 * @example https://github.com
 * @example https://github.com/orgs/test/dashboard
 * @example https://github.com/dashboard/index/2
 * @example https://github.com//dashboard
 * @example https://github.com/dashboard
 * @example https://github.com/orgs/edit/dashboard
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
export declare const isDashboard: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.big-corp.com/
 * @example https://not-github.com/
 * @example https://my-little-hub.com/
 * @example https://my-little-hub.com/gist
 * @example https://my-little-hub.com/gist/in-fragrante
 * @example https://gist.my-little-hub.com/in-fragrante
 */
export declare const isEnterprise: (url?: URL | HTMLAnchorElement | Location) => boolean;
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
export declare const isGist: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/issues
 * @example https://github.com/issues?q=is%3Apr+is%3Aopen
 * @example https://github.com/issues/assigned
 * @example https://github.com/issues/mentioned
 * @example https://github.com/pulls
 * @example https://github.com/pulls?q=issues
 * @example https://github.com/pulls/assigned
 * @example https://github.com/pulls/mentioned
 * @example https://github.com/pulls/review-requested
 */
export declare const isGlobalIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/search?q=refined-github&ref=opensearch */
export declare const isGlobalSearchResults: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/issues/146 */
export declare const isIssue: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isConversation: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/labels
 * @example https://github.com/sindresorhus/refined-github/labels/
 */
export declare const isLabelList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/kubernetes/kubernetes/milestone/56 */
export declare const isMilestone: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/milestones */
export declare const isMilestoneList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/new/main */
export declare const isNewFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/issues/new */
export declare const isNewIssue: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/releases/new */
export declare const isNewRelease: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/tooomm/wikitest/wiki/_new */
export declare const isNewWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/notifications */
export declare const isNotifications: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isOrganizationProfile: () => boolean;
export declare const isOrganizationRepo: () => boolean;
/**
 * @example https://github.com/orgs/refined-github/teams/core-team/discussions?pinned=1
 * @example https://github.com/orgs/refined-github/teams/core-team/discussions/1
 * @example https://github.com/orgs/refined-github/teams/core-team
 */
export declare const isTeamDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isOwnUserProfile: () => boolean;
export declare const isOwnOrganizationProfile: () => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/projects/3
 * @example https://github.com/orgs/RSSNext/projects/3
 */
export declare const isProject: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/projects */
export declare const isProjects: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/tophf/mpiv/discussions/50
 * @example https://github.com/orgs/community/discussions/11202
 */
export declare const isDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/withastro/roadmap/discussions/new?category=proposal
 * @example https://github.com/orgs/community/discussions/new?category=pull-requests
 */
export declare const isNewDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/tophf/mpiv/discussions
 * @example https://github.com/orgs/community/discussions
 */
export declare const isDiscussionList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/files
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/e1aba6f
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641..e1aba6febb3fe38aafd1137cff28b536eeeabe7e
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits
 * @example https://github.com/sindresorhus/refined-github/pull/148
 */
export declare const isPR: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/pull/148/conflicts */
export declare const isPRConflicts: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * Any `isIssueOrPRList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown
 * @example https://github.com/pulls
 * @example https://github.com/pulls?q=issues
 * @example https://github.com/sindresorhus/refined-github/pulls
 * @example https://github.com/sindresorhus/refined-github/pulls/
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed
 */
export declare const isPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d79
 */
export declare const isPRCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRCommit404: () => boolean;
export declare const isPRFile404: () => boolean;
/** @example https://github.com/sindresorhus/refined-github/pull/148 */
export declare const isPRConversation: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/pull/148/commits */
export declare const isPRCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/commits/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641
 * @example https://github.com/sindresorhus/refined-github/pull/148/changes/1e27d79
 * @example https://github.com/sindresorhus/refined-github/pull/148/files
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/e1aba6f
 * @example https://github.com/sindresorhus/refined-github/pull/148/files/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d799..e1aba6f
 * @example https://github.com/refined-github/refined-github/pull/148/changes/1e27d7998afdd3608d9fc3bf95ccf27fa5010641..e1aba6febb3fe38aafd1137cff28b536eeeabe7e
 */
export declare const isPRFiles: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/compare/master...branch-name?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/branch-1...branch-2?quick_pull=1
 * @example https://github.com/sindresorhus/refined-github/compare/test-branch?quick_pull=1
 */
export declare const isQuickPR: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isMergedPR: () => boolean;
export declare const isDraftPR: () => boolean;
export declare const isOpenConversation: () => boolean;
export declare const isClosedConversation: () => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/releases
 * @example https://github.com/sindresorhus/refined-github/releases?page=2
 */
export declare const isReleases: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/tags
 * @example https://github.com/sindresorhus/refined-github/tags?after=21.8.1
 */
export declare const isTags: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/refined-github/refined-github/releases/tag/1.20.1
 * @example https://github.com/refined-github/refined-github/releases/tag/23.7.25
 */
export declare const isSingleReleaseOrTag: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/releases
 * @example https://github.com/sindresorhus/refined-github/releases?page=2
 * @example https://github.com/sindresorhus/refined-github/tags
 * @example https://github.com/sindresorhus/refined-github/tags?after=21.8.1
 */
export declare const isReleasesOrTags: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/delete/master/readme.md
 * @example https://github.com/sindresorhus/refined-github/delete/ghe-injection/source/background.ts
 */
export declare const isDeletingFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/edit/master/readme.md
 * @example https://github.com/sindresorhus/refined-github/edit/ghe-injection/source/background.ts
 */
export declare const isEditingFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasFileEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/releases/edit/v1.2.3 */
export declare const isEditingRelease: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasReleaseEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit */
export declare const isEditingWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasWikiPageEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/blame/master/package.json
 * @example https://github.com/sindresorhus/refined-github/issues/146
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/refined-github/pull/148
 * @example https://github.com/sindresorhus/refined-github/milestones/new
 * @example https://github.com/sindresorhus/refined-github/milestones/1/edit
 * @example https://github.com/sindresorhus/refined-github/issues/new/choose
 * @example https://github.com/sindresorhus/refined-github/issues/templates/edit
 */
export declare const isRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasRepoHeader: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEmptyRepoRoot: () => boolean;
export declare const isEmptyRepo: () => boolean;
export declare const isPublicRepo: () => boolean;
export declare const isArchivedRepo: () => boolean;
export declare const isBlank: () => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/labels/bug
 * @example https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github
 * @example https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt
 * @example https://github.com/sindresorhus/refined-github/milestones/1
 */
export declare const isRepoTaxonomyIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/pulls
 * @example https://github.com/sindresorhus/refined-github/pulls/
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Aopen+is%3Apr
 * @example https://github.com/sindresorhus/refined-github/pulls?q=is%3Apr+is%3Aclosed
 */
export declare const isRepoPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example http://github.com/sindresorhus/ava/issues
 * @example https://github.com/sindresorhus/refined-github/issues
 * @example https://github.com/sindresorhus/refined-github/issues/fregante
 * @example https://github.com/sindresorhus/refined-github/issues/newton
 * @example https://github.com/sindresorhus/refined-github/issues/wptemplates
 * @example https://github.com/sindresorhus/refined-github/issues?q=is%3Aclosed+sort%3Aupdated-desc
 * @example https://github.com/sindresorhus/refined-github/labels/bug
 * @example https://github.com/sindresorhus/refined-github/labels/implemented%20by%20github
 * @example https://github.com/sindresorhus/refined-github/labels/%3Adollar%3A%20Funded%20on%20Issuehunt
 */
export declare const isRepoIssueList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github
 * @example https://github.com/sindresorhus/refined-github/
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/edit
 * @example https://github.com/sindresorhus///edit
 * @example https://github.com/sindresorhus/search
 * @example https://github.com/sindresorhus/branches
 * @example https://github.com/sindresorhus/refined-github?files=1
 */
export declare const isRepoHome: (url?: URL | HTMLAnchorElement | Location) => boolean;
export type RepoExplorerInfo = {
    nameWithOwner: string;
    branch: string;
    filePath: string;
};
/**
 * @example https://github.com/sindresorhus/refined-github
 * @example https://github.com/sindresorhus/refined-github/
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/edit
 * @example https://github.com/sindresorhus///edit
 * @example https://github.com/sindresorhus/search
 * @example https://github.com/sindresorhus/branches
 * @example https://github.com/sindresorhus/refined-github?files=1
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/
 * @example https://github.com/sindresorhus/refined-github/tree/57bf4
 * @example https://github.com/sindresorhus/refined-github/tree/master?files=1
 */
export declare const isRepoRoot: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/search?q=diff
 * @example https://github.com/sindresorhus/refined-github/search?q=diff&unscoped_q=diff&type=Issues
 * @example https://github.com/sindresorhus/refined-github/search
 */
export declare const isRepoSearch: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/settings
 * @example https://github.com/sindresorhus/refined-github/settings/branches
 */
export declare const isRepoSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/settings */
export declare const isRepoMainSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/settings/replies
 * @example https://github.com/settings/replies/88491/edit
 */
export declare const isRepliesSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/settings/profile
 * @example https://github.com/settings/replies
 * @example https://github.com/settings/replies/88491/edit
 */
export declare const isUserSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github
 * @example https://github.com/sindresorhus/refined-github/
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/edit
 * @example https://github.com/sindresorhus///edit
 * @example https://github.com/sindresorhus/search
 * @example https://github.com/sindresorhus/branches
 * @example https://github.com/sindresorhus/refined-github?files=1
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/
 * @example https://github.com/sindresorhus/refined-github/tree/57bf4
 * @example https://github.com/sindresorhus/refined-github/tree/master?files=1
 * @example https://github.com/sindresorhus/refined-github/tree/main/source
 * @example https://github.com/sindresorhus/refined-github/tree/0.13.0/extension
 * @example https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/extension
 * @example https://github.com/sindresorhus/refined-github?search=1
 */
export declare const isRepoTree: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/lukesampson/scoop/wiki
 * @example https://github.com/tooomm/wikitest/wiki/_new
 * @example https://github.com/tooomm/wikitest/wiki/Getting-Started/_edit
 * @example https://github.com/brookhong/Surfingkeys/wiki/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 * @example https://github.com/brookhong/Surfingkeys/wiki/Color-Themes/_compare/8ebb46b1a12d16fc1af442b7df0ca13ca3bb34dc...80e51eeabe69b15a3f23880ecc36f800b71e6c6d
 */
export declare const isRepoWiki: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/commit/5b614b9035f2035b839f48b4db7bd5c3298d526f
 * @example https://github.com/sindresorhus/refined-github/commit/5b614
 */
export declare const isSingleCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/blob/master/.gitattributes
 * @example https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css
 * @example https://github.com/sindresorhus/refined-github/blob/master/edit.txt
 */
export declare const isSingleFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/find/master */
export declare const isFileFinder: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante/GhostText/tree/3cacd7df71b097dc525d99c7aa2f54d31b02fcc8/chrome/scripts/InputArea
 * @example https://github.com/refined-github/refined-github/blob/some-non-existent-ref/source/features/bugs-tab.tsx
 */
export declare const isRepoFile404: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/network/members */
export declare const isRepoForksList: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/network */
export declare const isRepoNetworkGraph: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isForkedRepo: () => boolean;
/** @example https://github.com/refined-github/refined-github/fork */
export declare const isForkingRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3
 * @example https://gist.github.com/fregante/2205329b71218fa2c1d3/d1ebf7d9cfaba4d4596d2ea9174e202479a5f9ad
 * @example https://gist.github.com/sindresorhus/0ea3c2845718a0a0f0beb579ff14f064
 */
export declare const isSingleGist: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://gist.github.com/kidonng/0d16c7f17045f486751fad1b602204a0/revisions */
export declare const isGistRevision: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/trending
 * @example https://github.com/trending/developers
 * @example https://github.com/trending/unknown
 */
export declare const isTrending: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/branches */
export declare const isBranches: (url?: URL | HTMLAnchorElement | Location) => boolean;
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
 */
export declare const isProfile: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://gist.github.com/fregante
 * @example https://gist.github.com/github
 * @example https://gist.github.com/babel
 * @example https://my-little-hub.com/gist/in-fragrante
 * @example https://gist.my-little-hub.com/in-fragrante
 */
export declare const isGistProfile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserProfile: () => boolean;
export declare const isPrivateUserProfile: () => boolean;
export declare const isUserProfileMainTab: () => boolean;
/**
 * @example https://github.com/fregante?tab=repositories
 * @example https://github.com/fregante?tab=repositories&type=source
 * @example https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=
 */
export declare const isUserProfileRepoTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante?tab=stars
 * @example https://github.com/fregante?direction=desc&sort=updated&tab=stars
 */
export declare const isUserProfileStarsTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante?tab=followers
 * @example https://github.com/sindresorhus?tab=followers
 */
export declare const isUserProfileFollowersTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante?tab=following
 * @example https://github.com/sindresorhus?tab=following
 */
export declare const isUserProfileFollowingTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante?tab=repositories
 * @example https://github.com/fregante?tab=repositories&type=source
 * @example https://github.com/fregante?tab=repositories&q=&type=source&language=css&sort=
 * @example https://github.com/orgs/refined-github/repositories
 * @example https://github.com/orgs/refined-github/repositories?q=&type=private&language=&sort=
 */
export declare const isProfileRepoList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasComments: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasRichTextEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Static code, not the code editor */
export declare const hasCode: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * Covers blob, trees and blame pages
 * @example https://github.com/sindresorhus/refined-github
 * @example https://github.com/sindresorhus/refined-github/
 * @example https://github.com/sindresorhus/notifications/
 * @example https://github.com/sindresorhus/edit
 * @example https://github.com/sindresorhus///edit
 * @example https://github.com/sindresorhus/search
 * @example https://github.com/sindresorhus/branches
 * @example https://github.com/sindresorhus/refined-github?files=1
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons
 * @example https://github.com/sindresorhus/refined-github/tree/native-copy-buttons/
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6
 * @example https://github.com/sindresorhus/refined-github/tree/03fa6b8b4d6e68dea9dc9bee1d197ef5d992fbd6/
 * @example https://github.com/sindresorhus/refined-github/tree/57bf4
 * @example https://github.com/sindresorhus/refined-github/tree/master?files=1
 * @example https://github.com/sindresorhus/refined-github/tree/main/source
 * @example https://github.com/sindresorhus/refined-github/tree/0.13.0/extension
 * @example https://github.com/sindresorhus/refined-github/tree/57bf435ee12d14b482df0bbd88013a2814c7512e/extension
 * @example https://github.com/sindresorhus/refined-github?search=1
 * @example https://github.com/sindresorhus/refined-github/blob/master/.gitattributes
 * @example https://github.com/sindresorhus/refined-github/blob/fix-narrow-diff/distribution/content.css
 * @example https://github.com/sindresorhus/refined-github/blob/master/edit.txt
 * @example https://github.com/sindresorhus/refined-github/blame/master/package.json
 */
export declare const isRepoGitObject: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Has a list of files */
export declare const hasFiles: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/marketplace/actions/urlchecker-action
 * @example https://github.com/marketplace/actions/github-action-for-assignee-to-reviewer
 * @example https://github.com/marketplace/actions/hugo-actions
 */
export declare const isMarketplaceAction: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/runs/639481849
 * @example https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true
 */
export declare const isActionJobRun: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/sindresorhus/refined-github/runs/639481849
 * @example https://github.com/refined-github/github-url-detection/runs/1224552520?check_suite_focus=true
 * @example https://github.com/refined-github/github-url-detection/actions/runs/294962314
 */
export declare const isActionRun: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/sindresorhus/refined-github/actions/new */
export declare const isNewAction: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/refined-github/github-url-detection/actions
 * @example https://github.com/refined-github/github-url-detection/actions/workflows/demo.yml
 * @example https://github.com/refined-github/github-url-detection/actions/workflows/esm-lint.yml
 */
export declare const isRepositoryActions: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserTheOrganizationOwner: () => boolean;
export declare const canUserAdminRepo: () => boolean;
/** @deprecated Use `canUserAdminRepo` */
export declare const canUserEditRepo: () => boolean;
/**
 * @example https://github.com/new
 * @example https://github.com/organizations/npmhub/repositories/new
 */
export declare const isNewRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** @example https://github.com/fregante/browser-extension-template/generate */
export declare const isNewRepoTemplate: (url?: URL | HTMLAnchorElement | Location) => boolean;
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
export declare const utils: {
    getOrg: (url?: URL | HTMLAnchorElement | Location) => {
        name: string;
        path: string;
    } | undefined;
    /** @deprecated Use `getLoggedInUser` */
    getUsername: () => string | undefined;
    getLoggedInUser: () => string | undefined;
    getCleanPathname: (url?: URL | HTMLAnchorElement | Location) => string;
    getCleanGistPathname: (url?: URL | HTMLAnchorElement | Location) => string | undefined;
    getRepositoryInfo: (url?: URL | HTMLAnchorElement | Location | string) => RepositoryInfo | undefined;
    parseRepoExplorerTitle: (pathname: string, title: string) => RepoExplorerInfo | undefined;
};
