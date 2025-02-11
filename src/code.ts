export function expand(seq: number[], n: number, M: number): number[] {
    // seqの長さ関連
    const seqLen = seq.length;
    const p_0 = seqLen - 1;
    const last = seq[p_0];
    if (last === 0) return seq.slice(0,-1);

    // console.time("parent_time");

    // キャッシュ関連
    const cacheP: Array<number | null> = [];
    const cachePSet: number[][] = [];
    cacheP[0] = p_0;

    // seq内で完結する辞書順
    function ltRange(s1: number, e1: number, s2: number, e2: number): boolean {
        let i = s1, j = s2;
        while (i < e1 && j < e2) {
            if (seq[i] < seq[j]) return true;
            if (seq[i] > seq[j]) return false;
            i += 1;
            j += 1;
        }
        return i === e1 && j < e2;
    }

    // 親関連
    const getP = (n: number): number | null => {
        if (cacheP[n] !== undefined) return cacheP[n];
        const pred = getP(n - 1);
        if (pred === null) {
            cacheP[n] = null;
            cachePSet[n] = [];
            return null;
        }
        const pSet: number[] = [];
        for (let i = 0; i < pred; i++)
            if (ltRange(i,seqLen,pred,seqLen))
                pSet.push(i);
        cachePSet[n] = pSet;
        cacheP[n] = pSet.length > 0 ? pSet[pSet.length - 1] : null;
        return cacheP[n];
    }
    const getPSet = (n: number): number[] => {
        if (cachePSet[n] !== undefined) return cachePSet[n];
        getP(n);
        return cachePSet[n];
    }

    // 引き返す関数
    const u = (x: number, n: number): number =>
        getPSet(n).find(i => x < i) ?? p_0;
    const fp = (x: number, n: number): number => {
        if (n < 0) return x - 1;
        let current = x;
        for (let k = n; k > 0; k--)
            current = u(current, k);
        return current;
    }

    // 親を決定
    const parent = ((): number => {
        const plist = [p_0];
        for (let m = 1; m <= M; m++) {
            const p_m = getP(m);
            if (p_m === null) return -1;
            if (2 <= last-seq[p_m]) return p_m;
            for (let n = 1; n < Math.min(M - 1, m); n++)
                if (ltRange(p_m,u(p_m,n),plist[n],plist[n-1]))
                    return fp(p_m,n);
            plist.push(p_m);
        }
        return fp(plist[M],M-1);
    })();

    // console.timeEnd("parent_time");

    // 数列生成
    const GP = seq.slice(0,parent+1);
    const bp = seq.slice(parent+1,-1).concat([last-1]);
    const BP = Array<number[]>(n + 1).fill(bp).flat();
    return GP.concat(BP);
}