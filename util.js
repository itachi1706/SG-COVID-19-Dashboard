module.exports.toISOLocal = function(d) {
    let z  = n =>  ('0' + n).slice(-2);
    let zz = n => ('00' + n).slice(-3);
    let off = d.getTimezoneOffset();
    let sign = off < 0? '+' : '-';
    off = Math.abs(off);

    return d.getFullYear() + '-'
        + z(d.getMonth()+1) + '-' +
        z(d.getDate()) + 'T' +
        z(d.getHours()) + ':'  +
        z(d.getMinutes()) + ':' +
        z(d.getSeconds()) + '.' +
        zz(d.getMilliseconds()) +
        sign + z(off/60|0) + ':' + z(off%60);
}