module.exports = function(refresh=false) {

    const fs = require('fs')
    const path = require('path')
    const store = require('../translation-store')
    const { conceptStore } = require('sdg-metadata-convert')

    if (refresh) {
        store.refresh()
    }

    // We need to put a file in www/_data for Jekyll to use.
    const destinationFolder = path.join('www', '_data')
    const jekyllData = {
        metadata: store.getTranslationStore(),
        fields: store.getFields().map(cid => conceptStore.getConcept(cid)),
        // The 't' namespace contains all miscellaneous translations.
        t: store.getMiscellaneousTranslationStore(),
    }

    fs.writeFileSync(path.join(destinationFolder, 'store.json'), JSON.stringify(jekyllData), 'utf8')
}
