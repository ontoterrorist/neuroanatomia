"""Lista nodos, mallas, triangulos y cajas de un .glb (sin dependencias)."""
import json, struct, sys


def load(path):
    with open(path, 'rb') as f:
        data = f.read()
    magic, ver, length = struct.unpack_from('<4sII', data, 0)
    assert magic == b'glTF', magic
    off = 12
    js = None
    binc = None
    while off < length:
        clen, ctype = struct.unpack_from('<II', data, off)
        chunk = data[off + 8: off + 8 + clen]
        if ctype == 0x4E4F534A:
            js = json.loads(chunk.decode('utf8'))
        elif ctype == 0x004E4942:
            binc = chunk
        off += 8 + clen
    return js, binc


if __name__ == '__main__':
    js, binc = load(sys.argv[1])
    print('asset', js.get('asset'), 'ext', js.get('extensionsUsed'))
    print('nodes', len(js.get('nodes', [])), 'meshes', len(js.get('meshes', [])),
          'materials', len(js.get('materials', [])), 'bin', len(binc or b''))
    acc = js['accessors']
    tot = 0
    rows = []
    for i, n in enumerate(js['nodes']):
        if 'mesh' not in n:
            rows.append((n.get('name'), None, None, n.get('children'), {k: n[k] for k in ('translation', 'rotation', 'scale', 'matrix') if k in n}))
            continue
        m = js['meshes'][n['mesh']]
        tris = 0
        mn = [1e9] * 3
        mx = [-1e9] * 3
        for p in m['primitives']:
            a = acc[p['attributes']['POSITION']]
            tris += (acc[p['indices']]['count'] if 'indices' in p else a['count']) // 3
            for k in range(3):
                mn[k] = min(mn[k], a['min'][k])
                mx[k] = max(mx[k], a['max'][k])
        tot += tris
        rows.append((n.get('name'), tris, [round(v, 4) for v in mn + mx], None,
                     {k: n[k] for k in ('translation', 'rotation', 'scale', 'matrix') if k in n}))
    for r in rows:
        print(r)
    print('TOTAL tris', tot)
    print('scenes', js.get('scenes'))
    if '-m' in sys.argv:
        for m in js.get('materials', []):
            print(m)
