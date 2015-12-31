/**
 * Utility functions to help interactions with a Zanata server.
 *
 * Can access the tool modules in 3 ways
 *
 * e.g. to get to the doc-id encode method:
 *
 *  - import { encode } from 'zanata-tools/doc-id'
 *    encode(foo)
 *
 *  - import { docId } from 'zanata-tools/doc-id'
 *    docId.encode(foo)
 *
 *  - import * as zanataTools from 'zanata-tools'
 *    zanataTools.docId.encode(foo)
 */

import * as docId from './doc-id'
import * as phrase from './phrase'

export { docId, phrase }
