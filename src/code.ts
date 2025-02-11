export function expand(seq: number[], n: number, M: number): number[] {
    // seqの長さ関連
    const seqLen = seq.length;
    const p0 = seqLen - 1;
    const last = seq[p0];
    if (last === 0) return seq.slice(0,-1);

    // console.time("parent_time");

    // キャッシュ関連
    const pCache: Array<number | null> = [];
    const setPCache: number[][] = [];
    pCache[0] = p0;

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
        if (pCache[n] !== undefined) return pCache[n];
        const pred = getP(n - 1);
        if (pred === null) {
            pCache[n] = null;
            setPCache[n] = [];
            return null;
        }
        const setP: number[] = [];
        for (let i = 0; i < pred; i++)
            if (ltRange(i,seqLen,pred,seqLen))
                setP.push(i);
        setPCache[n] = setP;
        pCache[n] = setP.length > 0 ? setP[setP.length - 1] : null;
        return pCache[n];
    }
    const getSetP = (n: number): number[] => {
        if (setPCache[n] !== undefined) return setPCache[n];
        getP(n);
        return setPCache[n];
    }

    // 引き返す関数
    const u = (x: number, n: number): number =>
        getSetP(n).find((i) => x < i) ?? p0;
    const fp = (x: number, n: number): number => {
        if (n < 0) return x - 1;
        let current = x;
        for (let k = n; k > 0; k--)
            current = u(current, k);
        return current;
    }

    // 親を決定
    const parent = ((): number => {
        const plist = [p0];
        for (let m = 1; m <= M; m++) {
            const pm = getP(m);
            if (pm === null) return -1;
            if (2 <= last-seq[pm]) return pm;
            for (let n = 1; n < Math.min(M - 1, m); n++)
                if (ltRange(pm,u(pm,n),plist[n],plist[n-1]))
                    return fp(pm,n);
            plist.push(pm);
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