// index.ts
import reservedNames from "github-reserved-names/reserved-names.json" with { type: "json" };
var $ = (selector) => document.querySelector(selector);
var exists = (selector) => Boolean($(selector));
var is404 = () => /^(Page|File) not found · GitHub/.test(document.title);
var is500 = () => document.title === "Server Error \xB7 GitHub" || document.title === "Unicorn! \xB7 GitHub" || document.title === "504 Gateway Time-out";
var isPasswordConfirmation = () => document.title === "Confirm password" || document.title === "Confirm access";
var isLoggedIn = () => exists("body.logged-in");
var isBlame = (url = location) => Boolean(getRepo(url)?.path.startsWith("blame/"));
var isCommit = (url = location) => isSingleCommit(url) || isPRCommit(url);
var isCommitList = (url = location) => isRepoCommitList(url) || isPRCommitList(url);
var isRepoCommitList = (url = location) => Boolean(getRepo(url)?.path.startsWith("commits"));
var isCompare = (url = location) => Boolean(getRepo(url)?.path.startsWith("compare"));
var isCompareWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).split("/").slice(3, 5).includes("_compare");
var isDashboard = (url = location) => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(-feed)?(\/|$)/.test(getCleanPathname(url));
var isEnterprise = (url = location) => url.hostname !== "github.com" && url.hostname !== "gist.github.com";
var isGist = (url = location) => typeof getCleanGistPathname(url) === "string";
var isGlobalIssueOrPRList = (url = location) => ["issues", "pulls"].includes(url.pathname.split("/", 2)[1]);
var isGlobalSearchResults = (url = location) => url.pathname === "/search" && new URLSearchParams(url.search).get("q") !== null;
var isIssue = (url = location) => /^issues\/\d+/.test(getRepo(url)?.path) && document.title !== "GitHub \xB7 Where software is built";
var isIssueOrPRList = (url = location) => isGlobalIssueOrPRList(url) || isRepoIssueOrPRList(url) || isMilestone(url);
var isConversation = (url = location) => isIssue(url) || isPRConversation(url);
var isLabelList = (url = location) => getRepo(url)?.path === "labels";
var isMilestone = (url = location) => /^milestone\/\d+/.test(getRepo(url)?.path);
var isMilestoneList = (url = location) => getRepo(url)?.path === "milestones";
var isNewFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("new"));
var isNewIssue = (url = location) => getRepo(url)?.path === "issues/new";
var isNewRelease = (url = location) => getRepo(url)?.path === "releases/new";
var isNewWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_new");
var isNotifications = (url = location) => getCleanPathname(url) === "notifications";
var isOrganizationProfile = () => exists('meta[name="hovercard-subject-tag"][content^="organization"]');
var isOrganizationRepo = () => exists('.AppHeader-context-full [data-hovercard-type="organization"]');
var isTeamDiscussion = (url = location) => Boolean(getOrg(url)?.path.startsWith("teams"));
var isOwnUserProfile = () => getCleanPathname() === getLoggedInUser();
var isOwnOrganizationProfile = () => isOrganizationProfile() && !exists('[href*="contact/report-abuse?report="]');
var isProject = (url = location) => /^projects\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);
var isProjects = (url = location) => getRepo(url)?.path === "projects";
var isDiscussion = (url = location) => /^discussions\/\d+/.test(getRepo(url)?.path ?? getOrg(url)?.path);
var isNewDiscussion = (url = location) => getRepo(url)?.path === "discussions/new" || getOrg(url)?.path === "discussions/new";
var isDiscussionList = (url = location) => getRepo(url)?.path === "discussions" || getOrg(url)?.path === "discussions";
var isPR = (url = location) => /^pull\/\d+/.test(getRepo(url)?.path) && !isPRConflicts(url);
var isPRConflicts = (url = location) => /^pull\/\d+\/conflicts/.test(getRepo(url)?.path);
var isPRList = (url = location) => url.pathname === "/pulls" || getRepo(url)?.path === "pulls";
var isPRCommit = (url = location) => /^pull\/\d+\/(commits|changes)\/[\da-f]{7,40}$/.test(getRepo(url)?.path);
var isPRCommit404 = () => isPRCommit() && document.title.startsWith("Commit range not found \xB7 Pull Request");
var isPRFile404 = () => isPRFiles() && document.title.startsWith("Commit range not found \xB7 Pull Request");
var isPRConversation = (url = location) => /^pull\/\d+$/.test(getRepo(url)?.path);
var isPRCommitList = (url = location) => /^pull\/\d+\/commits$/.test(getRepo(url)?.path);
var isPRFiles = (url = location) => /^pull\/\d+\/(files|(changes(\/[\da-f]{7,40}..[\da-f]{7,40})?$))/.test(getRepo(url)?.path) || isPRCommit(url);
var isQuickPR = (url = location) => isCompare(url) && /[?&]quick_pull=1(&|$)/.test(url.search);
var getStateLabel = () => $([
  ".State",
  // Old view
  '[class^="StateLabel"]'
  // React version
].join(","))?.textContent?.trim();
var isMergedPR = () => getStateLabel() === "Merged";
var isDraftPR = () => getStateLabel() === "Draft";
var isOpenConversation = () => {
  const status = getStateLabel();
  return status === "Open" || status === "Draft";
};
var isClosedConversation = () => {
  const status = getStateLabel();
  return status === "Closed" || status === "Closed as not planned" || status === "Merged";
};
var isReleases = (url = location) => getRepo(url)?.path === "releases";
var isTags = (url = location) => getRepo(url)?.path === "tags";
var isSingleReleaseOrTag = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/tag"));
var isReleasesOrTags = (url = location) => isReleases(url) || isTags(url);
var isDeletingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("delete"));
var isEditingFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("edit"));
var hasFileEditor = (url = location) => isEditingFile(url) || isNewFile(url) || isDeletingFile(url);
var isEditingRelease = (url = location) => Boolean(getRepo(url)?.path.startsWith("releases/edit"));
var hasReleaseEditor = (url = location) => isEditingRelease(url) || isNewRelease(url);
var isEditingWikiPage = (url = location) => isRepoWiki(url) && getCleanPathname(url).endsWith("/_edit");
var hasWikiPageEditor = (url = location) => isEditingWikiPage(url) || isNewWikiPage(url);
var isRepo = (url = location) => {
  const [user, repo, extra] = getCleanPathname(url).split("/");
  return Boolean(user && repo && !reservedNames.includes(user) && !url.hostname.startsWith("gist.") && extra !== "generate");
};
var hasRepoHeader = (url = location) => isRepo(url) && !isRepoSearch(url);
var isEmptyRepoRoot = () => isRepoHome() && !exists('link[rel="canonical"]');
var isEmptyRepo = () => exists('[aria-label="Cannot fork because repository is empty."]');
var isPublicRepo = () => exists('meta[name="octolytics-dimension-repository_public"][content="true"]');
var isArchivedRepo = () => Boolean(isRepo() && $("main > .flash-warn")?.textContent.includes("archived"));
var isBlank = () => exists("main .blankslate:not([hidden] .blankslate)");
var isRepoTaxonomyIssueOrPRList = (url = location) => /^labels\/.+|^milestones\/\d+(?!\/edit)/.test(getRepo(url)?.path);
var isRepoIssueOrPRList = (url = location) => isRepoPRList(url) || isRepoIssueList(url) || isRepoTaxonomyIssueOrPRList(url);
var isRepoPRList = (url = location) => Boolean(getRepo(url)?.path.startsWith("pulls"));
var isRepoIssueList = (url = location) => (
  // `issues/fregante` is a list but `issues/1`, `issues/new`, `issues/new/choose`, `issues/templates/edit` aren’t
  /^labels\/|^issues(?!\/(\d+|new|templates)($|\/))/.test(getRepo(url)?.path)
);
var hasSearchParameter = (url) => new URLSearchParams(url.search).get("search") === "1";
var isRepoHome = (url = location) => getRepo(url)?.path === "" && !hasSearchParameter(url);
var titleParseRegex = /^(?:(?<nameWithOwner>[^ ]+) at (?<branch>[^ ]+)|[^/ ]+(?:\/(?<filePath>[^ ]*))? at (?<branch2>[^ ]+)(?: · (?<nameWithOwner2>[^ ]+))?)$/;
var parseRepoExplorerTitle = (pathname, title) => {
  const match = titleParseRegex.exec(title);
  if (!match?.groups) {
    return;
  }
  let { nameWithOwner, branch, filePath, nameWithOwner2, branch2 } = match.groups;
  nameWithOwner ??= nameWithOwner2;
  branch ??= branch2;
  filePath ??= "";
  if (!nameWithOwner || !branch || !pathname.startsWith(`/${nameWithOwner}/tree/`)) {
    return;
  }
  return { nameWithOwner, branch, filePath };
};
var _isRepoRoot = (url) => {
  const repository = getRepo(url ?? location);
  if (!repository) {
    return false;
  }
  const path = repository.path ? repository.path.split("/") : [];
  switch (path.length) {
    case 0: {
      return true;
    }
    case 2: {
      return path[0] === "tree";
    }
    default: {
      if (url) {
        return false;
      }
      const titleInfo = parseRepoExplorerTitle(location.pathname, document.title);
      return titleInfo?.filePath === "";
    }
  }
};
var isRepoRoot = (url) => !hasSearchParameter(url ?? location) && _isRepoRoot(url);
var isRepoSearch = (url = location) => getRepo(url)?.path === "search";
var isRepoSettings = (url = location) => Boolean(getRepo(url)?.path.startsWith("settings"));
var isRepoMainSettings = (url = location) => getRepo(url)?.path === "settings";
var isRepliesSettings = (url = location) => url.pathname.startsWith("/settings/replies");
var isUserSettings = (url = location) => url.pathname.startsWith("/settings/");
var isRepoTree = (url = location) => _isRepoRoot(url) || Boolean(getRepo(url)?.path.startsWith("tree/"));
var isRepoWiki = (url = location) => Boolean(getRepo(url)?.path.startsWith("wiki"));
var isSingleCommit = (url = location) => /^commit\/[\da-f]{5,40}$/.test(getRepo(url)?.path);
var isSingleFile = (url = location) => Boolean(getRepo(url)?.path.startsWith("blob/"));
var isFileFinder = (url = location) => Boolean(getRepo(url)?.path.startsWith("find/"));
var isRepoFile404 = (url = location) => (isSingleFile(url) || isRepoTree(url)) && document.title.startsWith("File not found");
var isRepoForksList = (url = location) => getRepo(url)?.path === "network/members";
var isRepoNetworkGraph = (url = location) => getRepo(url)?.path === "network";
var isForkedRepo = () => exists('meta[name="octolytics-dimension-repository_is_fork"][content="true"]');
var isForkingRepo = (url = location) => getRepo(url)?.path === "fork";
var isSingleGist = (url = location) => /^[^/]+\/[\da-f]{20,32}(\/[\da-f]{40})?$/.test(getCleanGistPathname(url));
var isGistRevision = (url = location) => /^[^/]+\/[\da-f]{20,32}\/revisions$/.test(getCleanGistPathname(url));
var isTrending = (url = location) => url.pathname === "/trending" || url.pathname.startsWith("/trending/");
var isBranches = (url = location) => Boolean(getRepo(url)?.path.startsWith("branches"));
var doesLookLikeAProfile = (string) => typeof string === "string" && string.length > 0 && !string.includes("/") && !string.includes(".") && !reservedNames.includes(string);
var isProfile = (url = location) => !isGist(url) && doesLookLikeAProfile(getCleanPathname(url));
var isGistProfile = (url = location) => doesLookLikeAProfile(getCleanGistPathname(url));
var isUserProfile = () => isProfile() && !isOrganizationProfile();
var isPrivateUserProfile = () => isUserProfile() && !exists('.UnderlineNav-item[href$="tab=stars"]');
var isUserProfileMainTab = () => isUserProfile() && !new URLSearchParams(location.search).has("tab");
var isUserProfileRepoTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "repositories";
var isUserProfileStarsTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "stars";
var isUserProfileFollowersTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "followers";
var isUserProfileFollowingTab = (url = location) => isProfile(url) && new URLSearchParams(url.search).get("tab") === "following";
var isProfileRepoList = (url = location) => isUserProfileRepoTab(url) || getOrg(url)?.path === "repositories";
var hasComments = (url = location) => isPR(url) || isIssue(url) || isCommit(url) || isTeamDiscussion(url) || isSingleGist(url);
var hasRichTextEditor = (url = location) => hasComments(url) || isNewIssue(url) || isCompare(url) || isRepliesSettings(url) || hasReleaseEditor(url) || isDiscussion(url) || isNewDiscussion(url);
var hasCode = (url = location) => hasComments(url) || isRepoTree(url) || isRepoSearch(url) || isGlobalSearchResults(url) || isSingleFile(url) || isGist(url) || isCompare(url) || isCompareWikiPage(url) || isBlame(url);
var isRepoGitObject = (url = location) => isRepo(url) && [void 0, "blob", "tree", "blame"].includes(getCleanPathname(url).split("/")[2]);
var hasFiles = (url = location) => isCommit(url) || isCompare(url) || isPRFiles(url);
var isMarketplaceAction = (url = location) => url.pathname.startsWith("/marketplace/actions/");
var isActionJobRun = (url = location) => Boolean(getRepo(url)?.path.startsWith("runs/"));
var isActionRun = (url = location) => /^(actions\/)?runs/.test(getRepo(url)?.path);
var isNewAction = (url = location) => getRepo(url)?.path === "actions/new";
var isRepositoryActions = (url = location) => /^actions(\/workflows\/.+\.ya?ml)?$/.test(getRepo(url)?.path);
var isUserTheOrganizationOwner = () => isOrganizationProfile() && exists('[aria-label="Organization"] [data-tab-item="org-header-settings-tab"]');
var canUserAdminRepo = () => isRepo() && exists('.reponav-item[href$="/settings"], [data-tab-item$="settings-tab"]');
var canUserEditRepo = canUserAdminRepo;
var isNewRepo = (url = location) => !isGist(url) && (url.pathname === "/new" || /^organizations\/[^/]+\/repositories\/new$/.test(getCleanPathname(url)));
var isNewRepoTemplate = (url = location) => Boolean(url.pathname.split("/")[3] === "generate");
var getLoggedInUser = () => $('meta[name="user-login"]')?.getAttribute("content") ?? void 0;
var getCleanPathname = (url = location) => url.pathname.replaceAll(/\/\/+/g, "/").replace(/\/$/, "").slice(1);
var getCleanGistPathname = (url = location) => {
  const pathname = getCleanPathname(url);
  if (url.hostname.startsWith("gist.")) {
    return pathname;
  }
  const [gist, ...parts] = pathname.split("/");
  return gist === "gist" ? parts.join("/") : void 0;
};
var getOrg = (url = location) => {
  const [orgs, name, ...path] = getCleanPathname(url).split("/");
  if (orgs === "orgs" && name) {
    return { name, path: path.join("/") };
  }
  return void 0;
};
var getRepo = (url) => {
  if (!url) {
    const canonical = $('[property="og:url"]');
    if (canonical) {
      const canonicalUrl = new URL(canonical.content, location.origin);
      if (getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase()) {
        url = canonicalUrl;
      }
    }
  }
  if (typeof url === "string") {
    url = new URL(url, location.origin);
  }
  if (!isRepo(url)) {
    return;
  }
  const [owner, name, ...pathParts] = getCleanPathname(url).split("/");
  return {
    owner,
    name,
    pathParts,
    nameWithOwner: `${owner}/${name}`,
    path: pathParts.join("/")
  };
};
var utils = {
  getOrg,
  /** @deprecated Use `getLoggedInUser` */
  getUsername: getLoggedInUser,
  getLoggedInUser,
  getCleanPathname,
  getCleanGistPathname,
  getRepositoryInfo: getRepo,
  parseRepoExplorerTitle
};
export {
  canUserAdminRepo,
  canUserEditRepo,
  hasCode,
  hasComments,
  hasFileEditor,
  hasFiles,
  hasReleaseEditor,
  hasRepoHeader,
  hasRichTextEditor,
  hasWikiPageEditor,
  is404,
  is500,
  isActionJobRun,
  isActionRun,
  isArchivedRepo,
  isBlame,
  isBlank,
  isBranches,
  isClosedConversation,
  isCommit,
  isCommitList,
  isCompare,
  isCompareWikiPage,
  isConversation,
  isDashboard,
  isDeletingFile,
  isDiscussion,
  isDiscussionList,
  isDraftPR,
  isEditingFile,
  isEditingRelease,
  isEditingWikiPage,
  isEmptyRepo,
  isEmptyRepoRoot,
  isEnterprise,
  isFileFinder,
  isForkedRepo,
  isForkingRepo,
  isGist,
  isGistProfile,
  isGistRevision,
  isGlobalIssueOrPRList,
  isGlobalSearchResults,
  isIssue,
  isIssueOrPRList,
  isLabelList,
  isLoggedIn,
  isMarketplaceAction,
  isMergedPR,
  isMilestone,
  isMilestoneList,
  isNewAction,
  isNewDiscussion,
  isNewFile,
  isNewIssue,
  isNewRelease,
  isNewRepo,
  isNewRepoTemplate,
  isNewWikiPage,
  isNotifications,
  isOpenConversation,
  isOrganizationProfile,
  isOrganizationRepo,
  isOwnOrganizationProfile,
  isOwnUserProfile,
  isPR,
  isPRCommit,
  isPRCommit404,
  isPRCommitList,
  isPRConflicts,
  isPRConversation,
  isPRFile404,
  isPRFiles,
  isPRList,
  isPasswordConfirmation,
  isPrivateUserProfile,
  isProfile,
  isProfileRepoList,
  isProject,
  isProjects,
  isPublicRepo,
  isQuickPR,
  isReleases,
  isReleasesOrTags,
  isRepliesSettings,
  isRepo,
  isRepoCommitList,
  isRepoFile404,
  isRepoForksList,
  isRepoGitObject,
  isRepoHome,
  isRepoIssueList,
  isRepoIssueOrPRList,
  isRepoMainSettings,
  isRepoNetworkGraph,
  isRepoPRList,
  isRepoRoot,
  isRepoSearch,
  isRepoSettings,
  isRepoTaxonomyIssueOrPRList,
  isRepoTree,
  isRepoWiki,
  isRepositoryActions,
  isSingleCommit,
  isSingleFile,
  isSingleGist,
  isSingleReleaseOrTag,
  isTags,
  isTeamDiscussion,
  isTrending,
  isUserProfile,
  isUserProfileFollowersTab,
  isUserProfileFollowingTab,
  isUserProfileMainTab,
  isUserProfileRepoTab,
  isUserProfileStarsTab,
  isUserSettings,
  isUserTheOrganizationOwner,
  utils
};
