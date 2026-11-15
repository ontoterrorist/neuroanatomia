"""Convierte estructuras del PDB y conformeros 3D de PubChem a JSON compacto.

Proteinas -> assets/prot/<id>.json : trazas C-alfa por cadena, estructura secundaria,
ligandos, y orientacion respecto de la membrana (eje y = normal, +y = extracelular).
Moleculas -> assets/moleculas.json : atomos y enlaces.

Uso: python -I tools/build-mol.py
"""
import json, math, os, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw')
OUT = os.path.join(ROOT, 'assets', 'prot')
os.makedirs(OUT, exist_ok=True)

HYD = set('ALA VAL LEU ILE PHE MET TRP CYS'.split())
POL = set('ASP GLU LYS ARG ASN GLN HIS'.split())
POS = set('LYS ARG'.split())
CHG = set('ASP GLU LYS ARG'.split())
WAT = {'HOH', 'DOD', 'WAT'}
# aditivos de cristalizacion / detergentes / lipidos / glicanos que no interesan
SKIP = set('SO4 PO4 GOL EDO PEG PG4 PGE 1PE P6G ACT FMT CL NAG BMA MAN FUC GAL NDG LMT BOG LDA OLC OLA OLB PLM CLR Y01 '
           'POV PCW PEE PTY CDL DMU HTG MPD DMS UNX UNL UNK TRS MES EPE IPA BME DTT NO3 SCN IOD BR CIT TAR MLI '
           'D10 D12 HEX OCT C8E LPP 9Z9 6OU PX4 LHG 3PH PC1 CPL PLC P5S 5PL 1N7 NH4 CD HG PT AU XE KR MG ZN CA K NA'.split())

# id -> configuracion. keep: cadenas a conservar (None = todas); biomt: aplicar ensamblaje biologico;
# mem: proteina de membrana; lig: ligandos a conservar aunque esten en SKIP; ion: iones a conservar.
CFG = {
    '6AGF': dict(mem=True, nterm=('A', 'cyt')),
    '2R9R': dict(mem=True, biomt=True, keep='AB', nterm=('B1', 'cyt')),
    '1K4C': dict(mem=True, biomt=True, keep='C', ion={'K'}, nterm=('C1', 'cyt')),
    '2ZXE': dict(mem=True, ion={'K', 'MG'}, nterm=('A', 'cyt')),
    '5GJV': dict(mem=True, nterm=('A', 'cyt')),
    '3KG2': dict(mem=True, nterm=('A', 'ext')),
    '4PE5': dict(mem=True, nterm=('A', 'ext')),
    '6HUO': dict(mem=True, keep='ABCDE', nterm=('A', 'ext')),
    '3JAD': dict(mem=True, nterm=('A', 'ext')),
    '2BG9': dict(mem=True, nterm=('A', 'ext')),
    '6DDF': dict(mem=True, keep='ABCR', nterm=('R', 'ext')),
    '6CM4': dict(mem=True, nterm=('A', 'ext')),
    '6N51': dict(mem=True, keep='AB', nterm=('A', 'ext')),
    '1SFC': dict(mem=False, keep='ABCD'),
    '4M48': dict(mem=True, keep='A', ion={'NA', 'CL'}, nterm=('A', 'cyt')),
    '5I6X': dict(mem=True, keep='A', ion={'NA', 'CL'}, nterm=('A', 'cyt')),
    '4EY7': dict(mem=False, keep='A'),
    '3J5P': dict(mem=True, nterm=('A', 'cyt')),
    '1F88': dict(mem=True, keep='A', nterm=('A', 'ext')),
    '1JFF': dict(mem=False, ion={'MG', 'ZN'}),
}


def parse_pdb(path):
    chains = {}      # id -> list of (resseq, resname, xyz)
    het = []         # (resname, chain, resseq, element, xyz)
    helix, sheet = [], []
    biomt = []       # lista de (chains, [matrices 3x4])
    compnd = {}
    cur_chains, cur_mats = None, []
    mol = None
    title = ''
    with open(path, encoding='latin-1') as f:
        for line in f:
            rec = line[:6]
            if rec == 'TITLE ':
                title += line[10:80].strip() + ' '
            elif rec == 'COMPND':
                t = line[10:80].strip()
                if t.startswith('MOLECULE:'):
                    mol = t[9:].strip().rstrip(';')
                elif t.startswith('CHAIN:') and mol:
                    for c in t[6:].replace(';', '').split(','):
                        compnd[c.strip()] = mol
            elif rec == 'REMARK' and line[6:10] == ' 350':
                t = line[11:]
                if t.startswith('BIOMOLECULE:'):
                    if cur_chains is not None:
                        biomt.append((cur_chains, cur_mats))
                    cur_chains, cur_mats = [], []
                elif 'APPLY THE FOLLOWING TO CHAINS:' in t or 'AND CHAINS:' in t:
                    if cur_chains is None:
                        cur_chains, cur_mats = [], []
                    cur_chains += [c.strip() for c in t.split(':')[1].split(',') if c.strip()]
                elif t.strip().startswith('BIOMT'):
                    p = t.split()
                    row = int(p[0][-1])
                    if row == 1:
                        cur_mats.append([])
                    cur_mats[-1].append([float(v) for v in p[2:6]])
            elif rec == 'HELIX ':
                helix.append((line[19], int(line[21:25]), int(line[33:37])))
            elif rec == 'SHEET ':
                sheet.append((line[21], int(line[22:26]), int(line[33:37])))
            elif rec == 'ATOM  ':
                if line[12:16].strip() == 'CA' and line[16] in ' A':
                    ch = line[21]
                    chains.setdefault(ch, []).append((int(line[22:26]), line[17:20], [float(line[30:38]), float(line[38:46]), float(line[46:54])]))
            elif rec == 'HETATM':
                rn = line[17:20].strip()
                if rn in WAT:
                    continue
                el = line[76:78].strip().upper() or line[12:14].strip().upper()
                het.append((rn, line[21], int(line[22:26]), el, [float(line[30:38]), float(line[38:46]), float(line[46:54])]))
            elif rec == 'ENDMDL':
                break
    if cur_chains is not None:
        biomt.append((cur_chains, cur_mats))
    return dict(title=title.strip(), chains=chains, het=het, helix=helix, sheet=sheet, biomt=biomt, compnd=compnd)


def sphere_dirs(n=1500):
    i = np.arange(n) + 0.5
    phi = np.arccos(1 - i / n)            # hemisferio superior
    th = math.pi * (1 + 5 ** 0.5) * i
    return np.stack([np.cos(th) * np.sin(phi), np.sin(th) * np.sin(phi), np.cos(phi)], 1)


def find_membrane(xyz, resn, half=15.0):
    """Busca el eje y la posicion de la lamina (30 A) con mas residuos hidrofobos y menos polares."""
    w = np.array([1.0 if r in HYD else (-3.0 if r in CHG else (-0.5 if r in POL else 0.0)) for r in resn])
    c0 = xyz.mean(0)
    X = xyz - c0
    best = None
    for d in sphere_dirs():
        t = X @ d
        lo, hi = t.min(), t.max()
        order = np.argsort(t)
        ts, ws = t[order], w[order]
        cs = np.concatenate([[0], np.cumsum(ws)])
        for z in np.arange(lo + half, hi - half + 0.01, 2.0):
            a = np.searchsorted(ts, z - half)
            b = np.searchsorted(ts, z + half)
            s = cs[b] - cs[a]
            if best is None or s > best[0]:
                best = (s, d, z)
    s, d, z = best
    return d, c0 + d * z, s


def rot_to_y(d):
    """Matriz que lleva el vector unitario d al eje +y."""
    y = np.array([0, 1.0, 0])
    v = np.cross(d, y)
    c = float(d @ y)
    if np.linalg.norm(v) < 1e-8:
        return np.eye(3) if c > 0 else np.diag([1.0, -1.0, -1.0])
    vx = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + vx + vx @ vx * (1 / (1 + c))


def build_protein(pid, cfg):
    P = parse_pdb(os.path.join(RAW, 'pdb', pid + '.pdb'))
    keep = cfg.get('keep')
    chains = {c: v for c, v in P['chains'].items() if (keep is None or c in keep) and len(v) >= 20}
    mats = [np.array([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]], float)]
    if cfg.get('biomt') and P['biomt']:
        mats = [np.array(m) for m in P['biomt'][0][1]]
    out_ch = []
    allxyz, allres = [], []
    for k, M in enumerate(mats):
        for c, v in chains.items():
            xyz = np.array([a[2] for a in v]) @ M[:, :3].T + M[:, 3]
            seq = [a[0] for a in v]
            rn = [a[1] for a in v]
            ss = ['-'] * len(v)
            for (hc, a, b) in P['helix']:
                if hc == c:
                    for i, s in enumerate(seq):
                        if a <= s <= b:
                            ss[i] = 'H'
            for (sc, a, b) in P['sheet']:
                if sc == c:
                    for i, s in enumerate(seq):
                        if a <= s <= b and ss[i] == '-':
                            ss[i] = 'E'
            out_ch.append(dict(id=c + (str(k + 1) if len(mats) > 1 else ''), mol=P['compnd'].get(c, ''), xyz=xyz, seq=seq, rn=rn, ss=''.join(ss)))
            allxyz.append(xyz)
            allres += rn
    A = np.concatenate(allxyz)
    # ligandos
    ions = cfg.get('ion', set())
    ligs = {}
    for (rn, c, rs, el, xyz) in P['het']:
        if keep is not None and c not in keep:
            continue
        if rn in SKIP and rn not in ions:
            continue
        ligs.setdefault((rn, c, rs), []).append((el, xyz))
    lig_out = []
    for k, M in enumerate(mats):
        for (rn, c, rs), atoms in ligs.items():
            xyz = np.array([a[1] for a in atoms]) @ M[:, :3].T + M[:, 3]
            lig_out.append(dict(n=rn, c=c, el=[a[0] for a in atoms], xyz=xyz))
    # orientacion
    info = {}
    if cfg.get('mem'):
        d, cm, score = find_membrane(A, allres)
        R = rot_to_y(d)
        T = lambda X: (X - cm) @ R.T
        Y = T(A)
        # orientacion por topologia conocida: de que lado queda el extremo N de una cadena
        cid, side = cfg['nterm']
        k0 = 0
        for c in out_ch:
            if c['id'] == cid:
                break
            k0 += len(c['seq'])
        yn = float(Y[k0:k0 + 8, 1].mean())
        up = dn = 0
        flip = (yn > 0) != (side == 'ext')
        if abs(yn) < 6:
            print('   !! extremo N cerca del centro de la membrana (y=%.1f)' % yn)
        if flip:
            F = np.diag([1.0, -1.0, -1.0])
            T0 = T
            T = lambda X: T0(X) @ F.T
        Y = T(A)
        info = dict(score=round(float(score)), yN=round(yn, 1), flip=bool(flip), ext=round(float(Y[:, 1].max())), cyt=round(float(Y[:, 1].min())))
    else:
        cm = A.mean(0)
        # eje mayor en y
        u, s, vt = np.linalg.svd(A - cm, full_matrices=False)
        R = rot_to_y(vt[0])
        T = lambda X: (X - cm) @ R.T
    q = lambda X: [int(round(v * 10)) for v in T(X).reshape(-1)]
    js = dict(id=pid, title=P['title'], mem=bool(cfg.get('mem')),
              chains=[dict(id=c['id'], mol=c['mol'], n=len(c['seq']), s0=c['seq'][0], seq=c['seq'] if any(b - a != 1 for a, b in zip(c['seq'], c['seq'][1:])) else None,
                           ss=c['ss'], ca=q(c['xyz']), aa=''.join(AA3.get(r, 'X') for r in c['rn'])) for c in out_ch],
              lig=[dict(n=l['n'], el=l['el'], xyz=q(l['xyz'])) for l in lig_out])
    with open(os.path.join(OUT, pid + '.json'), 'w') as f:
        json.dump(js, f, separators=(',', ':'))
    ch = ', '.join('%s:%d(%s)' % (c['id'], len(c['seq']), c['mol'][:28]) for c in out_ch[:8])
    lg = sorted(set(l['n'] for l in lig_out))
    print(pid, '| cadenas', len(out_ch), ch, '| lig', lg, '|', info)


AA3 = dict(ALA='A', ARG='R', ASN='N', ASP='D', CYS='C', GLN='Q', GLU='E', GLY='G', HIS='H', ILE='I', LEU='L', LYS='K',
           MET='M', PHE='F', PRO='P', SER='S', THR='T', TRP='W', TYR='Y', VAL='V')


def build_molecules():
    out = {}
    d = os.path.join(RAW, 'pubchem')
    for fn in sorted(os.listdir(d)):
        if not fn.endswith('.sdf'):
            continue
        L = open(os.path.join(d, fn), encoding='latin-1').read().splitlines()
        if len(L) < 5 or 'V2000' not in L[3]:
            print('  !! sin 3D:', fn, L[:1])
            continue
        na, nb = int(L[3][0:3]), int(L[3][3:6])
        atoms = [(L[4 + i][31:34].strip(), float(L[4 + i][0:10]), float(L[4 + i][10:20]), float(L[4 + i][20:30])) for i in range(na)]
        bonds = [(int(L[4 + na + i][0:3]) - 1, int(L[4 + na + i][3:6]) - 1, int(L[4 + na + i][6:9])) for i in range(nb)]
        cid = None
        for i, l in enumerate(L):
            if 'PUBCHEM_COMPOUND_CID' in l:
                cid = int(L[i + 1])
        out[fn[:-4]] = dict(cid=cid, el=[a[0] for a in atoms], xyz=[round(v, 3) for a in atoms for v in a[1:]], b=[v for b in bonds for v in b])
    out['nitric_oxide'] = dict(cid=145068, el=['N', 'O'], xyz=[-0.575, 0, 0, 0.575, 0, 0], b=[0, 1, 2])
    with open(os.path.join(ROOT, 'assets', 'moleculas.json'), 'w') as f:
        json.dump(out, f, separators=(',', ':'))
    print('moleculas:', len(out), ' '.join('%s(%d)' % (k, len(v['el'])) for k, v in out.items()))


if __name__ == '__main__':
    only = sys.argv[1:]
    for pid, cfg in CFG.items():
        if only and pid not in only:
            continue
        build_protein(pid, cfg)
    if not only:
        build_molecules()
