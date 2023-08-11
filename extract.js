import {Project} from 'ts-morph';

const project = new Project({
	tsConfigFilePath: 'tsconfig.json',
});
const testSourceFiles = project.getSourceFile('index.ts');
for (const tag of testSourceFiles.getSymbol('isRepo').getExport('isRepo').getJsDocTags()) {
	if (tag.getName() !== 'example') {
		continue;
	}

	const contents = tag.getText().at(0).text;
	if (contents.startsWith('http')) {
		console.log(contents);
	}
}
