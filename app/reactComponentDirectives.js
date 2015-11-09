/**
 * Entry point for webpack to combine all directives used for
 * React component trees.
 * Needed so that all can be bundled together with a single instance
 * of React, without the complexity of common chunk bundling.
 */

require('./components/EditorHeader/editorHeaderDirective')()
require('./components/Suggestions/suggestionHeaderDirective')()
require('./components/Suggestions/suggestionsBodyDirective')()
