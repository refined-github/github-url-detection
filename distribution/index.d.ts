export declare const is404: () => boolean;
export declare const is500: () => boolean;
export declare const isPasswordConfirmation: () => boolean;
export declare const isLoggedIn: () => boolean;
export declare const isBlame: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isCompare: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isCompareWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isDashboard: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEnterprise: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isGist: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isGlobalIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isGlobalSearchResults: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isIssue: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isConversation: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isLabelList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isMilestone: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isMilestoneList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewIssue: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewRelease: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNotifications: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isOrganizationProfile: () => boolean;
export declare const isOrganizationRepo: () => boolean;
export declare const isTeamDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isOwnUserProfile: () => boolean;
export declare const isOwnOrganizationProfile: () => boolean;
export declare const isProject: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isProjects: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewDiscussion: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isDiscussionList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPR: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRConflicts: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Any `isIssueOrPRList` can display both issues and PRs, prefer that detection. `isPRList` only exists because this page has PR-specific filters like the "Reviews" dropdown */
export declare const isPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRCommit404: () => boolean;
export declare const isPRFile404: () => boolean;
export declare const isPRConversation: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRCommitList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isPRFiles: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isQuickPR: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isMergedPR: () => boolean;
export declare const isDraftPR: () => boolean;
export declare const isOpenConversation: () => boolean;
export declare const isClosedConversation: () => boolean;
export declare const isReleases: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isTags: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isSingleReleaseOrTag: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isReleasesOrTags: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isDeletingFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEditingFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasFileEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEditingRelease: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasReleaseEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEditingWikiPage: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasWikiPageEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasRepoHeader: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isEmptyRepoRoot: () => boolean;
export declare const isEmptyRepo: () => boolean;
export declare const isPublicRepo: () => boolean;
export declare const isArchivedRepo: () => boolean;
export declare const isBlank: () => boolean;
export declare const isRepoTaxonomyIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoIssueOrPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoPRList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoIssueList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoHome: (url?: URL | HTMLAnchorElement | Location) => boolean;
export type RepoExplorerInfo = {
    nameWithOwner: string;
    branch: string;
    filePath: string;
};
export declare const isRepoRoot: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoSearch: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoMainSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepliesSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserSettings: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoTree: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoWiki: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isSingleCommit: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isSingleFile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isFileFinder: (url?: URL | HTMLAnchorElement | Location) => boolean;
/**
 * @example https://github.com/fregante/GhostText/tree/3cacd7df71b097dc525d99c7aa2f54d31b02fcc8/chrome/scripts/InputArea
 * @example https://github.com/refined-github/refined-github/blob/some-non-existent-ref/source/features/bugs-tab.tsx
 */
export declare const isRepoFile404: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoForksList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepoNetworkGraph: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isForkedRepo: () => boolean;
export declare const isForkingRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isSingleGist: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isGistRevision: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isTrending: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isBranches: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isProfile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isGistProfile: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserProfile: () => boolean;
export declare const isPrivateUserProfile: () => boolean;
export declare const isUserProfileMainTab: () => boolean;
export declare const isUserProfileRepoTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserProfileStarsTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserProfileFollowersTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserProfileFollowingTab: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isProfileRepoList: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasComments: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const hasRichTextEditor: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Static code, not the code editor */
export declare const hasCode: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Covers blob, trees and blame pages */
export declare const isRepoGitObject: (url?: URL | HTMLAnchorElement | Location) => boolean;
/** Has a list of files */
export declare const hasFiles: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isMarketplaceAction: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isActionJobRun: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isActionRun: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isNewAction: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isRepositoryActions: (url?: URL | HTMLAnchorElement | Location) => boolean;
export declare const isUserTheOrganizationOwner: () => boolean;
export declare const canUserAdminRepo: () => boolean;
/** @deprecated Use `canUserAdminRepo` */
export declare const canUserEditRepo: () => boolean;
export declare const isNewRepo: (url?: URL | HTMLAnchorElement | Location) => boolean;
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
