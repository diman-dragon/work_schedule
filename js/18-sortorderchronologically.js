/* sortOrderChronologically: one application-level function per file. */
function sortOrderChronologically(){
  order.sort((a,b) => {
    const ma = DATA[a], mb = DATA[b];
    return (ma.year - mb.year) || (ma.month - mb.month);
  });
}
