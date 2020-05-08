import {isRepo} from '.';

export const getUsername = () => document.querySelector('meta[name="user-login"]')!.getAttribute('content')!;

export const getDiscussionNumber = (url: URL | Location = location): string | undefined => url.pathname.split(/(?:pull|issues)\/(\d+)/)[1];

// Drops leading and trailing slash to avoid /\/?/ everywhere
export const getCleanPathname = (url: URL | Location = location): string => url.pathname.replace(/^\/|\/$/g, '');

// Parses a repo's subpage, e.g.
// '/user/repo/issues/' -> 'issues'
// '/user/repo/' -> ''
// returns undefined if the path is not a repo
export const getRepoPath = (url: URL | Location = location): string | undefined => {
	if (isRepo(url)) {
		return getCleanPathname(url).split('/').slice(2).join('/');
	}

	return undefined;
};
