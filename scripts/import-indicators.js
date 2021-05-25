const path = require('path')
const fs = require('fs')

const sdgMetadataConvert = require('sdg-metadata-convert')
const wordTemplateInput = new sdgMetadataConvert.WordTemplateInput({
    debug: true,
    cheerio: { decodeEntities: false },
})
const yamlOutput = new sdgMetadataConvert.YamlOutput()

const sourceFolder = 'indicators'
const targetFolder = path.join('translations', 'en')
const extensions = ['.docx', '.docm']
const files = fs.readdirSync(sourceFolder).filter(file => {
    return extensions.includes(path.extname(file).toLowerCase());
})
const conversions = files.map(sourceFile => {
    const sourcePath = path.join(sourceFolder, sourceFile)
    const targetFile = convertFilename(sourceFile)
    const targetPath = path.join(targetFolder, targetFile)
    return [sourcePath, targetPath]
})

importIndicators()

async function importIndicators() {
    for (const conversion of conversions) {
        const [inputFile, outputFile] = conversion
        try {
            const metadata = await wordTemplateInput.read(inputFile)
            await yamlOutput.write(metadata, outputFile)
            console.log(`Converted ${inputFile} to ${outputFile}.`);
        } catch(e) {
            console.log(e)
        }
    }
}

function convertFilename(filename) {
    return filename.split('.')[0] + '.yml'
}