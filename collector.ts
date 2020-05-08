// This needs to be in a separate file so it can bee tree-shaken before being published, while still being importable by tests
export default new Map<string, string[] | 'combinedTestOnly'>();
