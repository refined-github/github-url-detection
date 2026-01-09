/** @file This needs to be in a separate file so it can bee tree-shaken before being published, while still being importable by tests */
export declare const testableUrls: any;
export declare function addTests(test: string, urls: string[]): void;
export declare function getTests(detectName: string): string[];
export declare function getAllUrls(): Set<string>;
