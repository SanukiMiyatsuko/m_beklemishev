export function expand(seq: number[], n: number, M: number): number[] {
    const p0 = seq.length-1;
    const last = seq[p0];
    if (last === 0) return seq.slice(-1);
    const parent = ((): number => {
        const setP = (n: number): number[] => {
            const result: number[] = [];
            const pPredn = p(n-1);
            if (pPredn === null) return result;
            for (let i = pPredn-1; i > -1; i--)
                if (lt(seq.slice(i), seq.slice(pPredn)))
                    result.push(i);
            return result.reverse();
        }
        const p = (n: number): number | null => {
            if (n === 0) return p0;
            if (setP(n).length === 0) return null;
            return Math.max(...setP(n));
        }
        const u = (x: number, n: number): number => {
            let i: number;
            for (i of setP(n))
                if (x < i) return i;
            return p0;
        }
        const fp = (x: number, n: number): number => {
            if (n === 0) return x;
            return fp(u(x,n),n-1);
        }
        const plist = [p0];
        for (let m = 1; m < M; m++) {
            const pm = p(m);
            if (pm === null) return -1;
            if (2 <= last-seq[pm]) return pm;
            for (let n = 1; n < m; n++)
                if (lt(seq.slice(pm,u(pm,n)),seq.slice(plist[n],plist[n-1])))
                    return fp(pm,n);
            plist.push(pm);
        }
        const pM = p(M);
        if (pM === null) return -1;
        if (2 <= last-seq[pM]) return pM;
        for (let n = 1; n < M-1; n++)
            if (lt(seq.slice(pM,u(pM,n)),seq.slice(plist[n],plist[n-1])))
                return fp(pM,n);
        return fp(pM,M-1);
    })()
    const GP = seq.slice(0,parent+1);
    const bp = seq.slice(parent+1,-1).concat([last-1]);
    let BP: number[] = [];
    for (let i = 0; i < n; i++)
        BP = BP.concat(bp);
    return GP.concat(BP);
}

function lt(seq1: number[], seq2: number[]): boolean {
    if (seq1.length === 0) return seq2.length !== 0;
    if (seq2.length === 0) return false;
    return seq1[0] < seq2[0] || (seq1[0] === seq2[0] && lt(seq1.slice(1),seq2.slice(1)));
}