interface MatchChain {
    buffer1index: number;
    buffer2index: number;
    chain: MatchChain | null;
}
interface DiffBlock {
    buffer1: [
        number,
        number
    ];
    buffer1Content: string[];
    buffer2: [
        number,
        number
    ];
    buffer2Content: string[];
}
interface ChangeRegion {
    ab: "a" | "b";
    oStart: number;
    oLength: number;
    abStart: number;
    abLength: number;
}
interface StableRegion {
    stable: true;
    buffer: "o" | "a" | "b";
    bufferStart: number;
    bufferLength: number;
    bufferContent: string[];
}
interface ConflictRegion {
    stable: false;
    aStart: number;
    aLength: number;
    aContent: string[];
    oStart: number;
    oLength: number;
    oContent: string[];
    bStart: number;
    bLength: number;
    bContent: string[];
}
interface MergeOptions {
    excludeFalseConflicts?: boolean;
    stringSeparator?: RegExp;
    label?: {
        a?: string;
        b?: string;
    };
}
type MergeSegment = {
    ok: string[];
    conflict?: never;
} | {
    ok?: never;
    conflict: {
        a: string[];
        aIndex: number;
        o: string[];
        oIndex: number;
        b: string[];
        bIndex: number;
    };
};
// The following LCS / three-way merge routines derive from node-diff3 / Project Synchrotron.
// Copyright Tony Garnock-Jones, LShift Ltd. and Bryan Housel; MIT, see licenses/node-diff3-LICENSE.md.
// Restored / formatted from the earlier NoteCloud bundle; key-map handling uses Object.create(null).
function P(c: string[], t: string[]): MatchChain {
    const e = new Map<string, number[]>();
    for (let r = 0; r < t.length; r++) {
        let u = t[r];
        const positions = e.get(u);
        if (positions)
            positions.push(r);
        else
            e.set(u, [r]);
    }
    const i: MatchChain[] = [{ buffer1index: -1, buffer2index: -1, chain: null }];
    for (let r = 0; r < c.length; r++) {
        let u = c[r], f = e.get(u) || [], a = 0, d = i[0];
        for (let n of f) {
            let l;
            for (l = a; l < i.length && !(i[l].buffer2index < n && (l === i.length - 1 || i[l + 1].buffer2index > n)); l++)
                ;
            if (l < i.length) {
                let o = { buffer1index: r, buffer2index: n, chain: i[l] };
                if (a === i.length ? i.push(d) : i[a] = d, a = l + 1, d = o, a === i.length)
                    break;
            }
        }
        i[a] = d;
    }
    return i[i.length - 1];
}
function $(c: string[], t: string[]): DiffBlock[] {
    let e = P(c, t), s: DiffBlock[] = [], i = c.length, r = t.length;
    for (let u: MatchChain | null = e; u !== null; u = u.chain) {
        let f = i - u.buffer1index - 1, a = r - u.buffer2index - 1;
        {
            i = u.buffer1index;
            r = u.buffer2index;
            if ((f || a)) {
                s.push({ buffer1: [i + 1, f], buffer1Content: c.slice(i + 1, i + 1 + f), buffer2: [r + 1, a], buffer2Content: t.slice(r + 1, r + 1 + a) });
            }
        }
    }
    return s.reverse(), s;
}
function U(c: string[], t: string[], e: string[]): (StableRegion | ConflictRegion)[] {
    const s: ChangeRegion[] = [];
    function i(a: DiffBlock, d: "a" | "b") {
        s.push({ ab: d, oStart: a.buffer1[0], oLength: a.buffer1[1], abStart: a.buffer2[0], abLength: a.buffer2[1] });
    }
    {
        $(t, c).forEach((a) => i(a, "a"));
        $(t, e).forEach((a) => i(a, "b"));
        s.sort((a, d) => a.oStart - d.oStart);
    }
    let r: (StableRegion | ConflictRegion)[] = [], u = 0;
    function f(a: number) {
        if (a > u) {
            r.push({ stable: true, buffer: "o", bufferStart: u, bufferLength: a - u, bufferContent: t.slice(u, a) });
            u = a;
        }
    }
    for (; s.length;) {
        let a = s.shift()!, d = a.oStart, n = a.oStart + a.oLength, l = [a];
        for (f(d); s.length;) {
            let o = s[0], g = o.oStart;
            if (g > n)
                break;
            {
                n = Math.max(n, g + o.oLength);
                l.push(s.shift()!);
            }
        }
        if (l.length === 1) {
            if (a.abLength > 0) {
                let o = a.ab === "a" ? c : e;
                r.push({ stable: true, buffer: a.ab, bufferStart: a.abStart, bufferLength: a.abLength, bufferContent: o.slice(a.abStart, a.abStart + a.abLength) });
            }
        }
        else {
            let o: Record<"a" | "b", [
                number,
                number,
                number,
                number
            ]> = { a: [c.length, -1, t.length, -1], b: [e.length, -1, t.length, -1] };
            for (; l.length;) {
                a = l.shift()!;
                let v = a.oStart, k = v + a.oLength, S = a.abStart, C = S + a.abLength, b = o[a.ab];
                {
                    b[0] = Math.min(S, b[0]);
                    b[1] = Math.max(C, b[1]);
                    b[2] = Math.min(v, b[2]);
                    b[3] = Math.max(k, b[3]);
                }
            }
            let g = o.a[0] + (d - o.a[2]), y = o.a[1] + (n - o.a[3]), m = o.b[0] + (d - o.b[2]), p = o.b[1] + (n - o.b[3]), w: ConflictRegion = { stable: false, aStart: g, aLength: y - g, aContent: c.slice(g, y), oStart: d, oLength: n - d, oContent: t.slice(d, n), bStart: m, bLength: p - m, bContent: e.slice(m, p) };
            r.push(w);
        }
        u = n;
    }
    return f(t.length), r;
}
function j(c: string[] | string, t: string[] | string, e: string[] | string, options?: MergeOptions): MergeSegment[] {
    const s = { excludeFalseConflicts: true, stringSeparator: /\s+/, ...options };
    c = typeof c === "string" ? c.split(s.stringSeparator) : c;
    t = typeof t === "string" ? t.split(s.stringSeparator) : t;
    e = typeof e === "string" ? e.split(s.stringSeparator) : e;
    let r: MergeSegment[] = [], u = U(c, t, e), f: string[] = [];
    function a() {
        {
            if (f.length) {
                r.push({ ok: f });
            }
            f = [];
        }
    }
    function d(n: string[], l: string[]) {
        if (n.length !== l.length)
            return false;
        for (let o = 0; o < n.length; o++)
            if (n[o] !== l[o])
                return false;
        return true;
    }
    return u.forEach((n) => {
        if (n.stable)
            f.push(...n.bufferContent);
        else if (s.excludeFalseConflicts && d(n.aContent, n.bContent))
            f.push(...n.aContent);
        else {
            a();
            r.push({ conflict: { a: n.aContent, aIndex: n.aStart, o: n.oContent, oIndex: n.oStart, b: n.bContent, bIndex: n.bStart } });
        }
    }), a(), r;
}
export function mergeLines(c: string[] | string, t: string[] | string, e: string[] | string, options?: MergeOptions) {
    const s = { excludeFalseConflicts: true, stringSeparator: /\s+/, label: {}, ...options };
    let r = "<<<<<<<" + (s.label.a ? ` ${s.label.a}` : ""), u = "=======", f = ">>>>>>>" + (s.label.b ? ` ${s.label.b}` : ""), a = j(c, t, e, s), d = false, n: string[] = [];
    return a.forEach((l) => {
        if (l.ok) {
            n = n.concat(l.ok);
        }
        else {
            if (l.conflict) {
                d = true;
                n = n.concat([r], l.conflict.a, [u], l.conflict.b, [f]);
            }
        }
    }), { conflict: d, result: n };
}
