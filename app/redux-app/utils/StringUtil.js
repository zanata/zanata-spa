export function startsWith(str, prefix, ignoreCase) {
  if (ignoreCase && str && prefix) {
    str = str.toUpperCase()
    prefix = prefix.toUpperCase()
  }
  return str.lastIndexOf(prefix, 0) === 0
}

export function endsWith(str, suffix, ignoreCase) {
  if (ignoreCase && str && suffix) {
    str = str.toUpperCase()
    suffix = suffix.toUpperCase()
  }
  return str.indexOf(suffix, str.length - suffix.length) !== -1
}

export function equals(from, to, ignoreCase) {
  if (ignoreCase && from && to) {
    from = from.toUpperCase()
    to = to.toUpperCase()
  }
  return from === to
}

