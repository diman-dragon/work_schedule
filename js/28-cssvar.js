/* cssVar: one application-level function per file. */
function cssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
