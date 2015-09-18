
/**
 * Encode a document id for use in a REST URL.
 *
 * Replaces '/' with ','
 *
 * @param docId
 * @returns {*}
 */
function encode (docId) {
  return docId ? docId.replace(/\//g, ',') : docId
}

/**
 * Decode an encoded document id from a REST URL.
 *
 * Replaces ',' with '/'
 *
 * @param docId
 * @returns {*}
 */
function decode (docId) {
  return docId ? docId.replace(/\,/g, '/') : docId
}

export { encode, decode }
