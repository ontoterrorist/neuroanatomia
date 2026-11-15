"""Descomprime raw/bp3d-isa/isa.zip (BodyParts3D 4.0) si la carpeta extraida no existe.

Uso: python -I tools/extraer.py
"""
import os, zipfile

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIP = os.path.join(RAIZ, 'raw', 'bp3d-isa', 'isa.zip')
DEST = os.path.join(RAIZ, 'raw', 'bp3d-isa')

if os.path.isdir(os.path.join(DEST, 'isa_BP3D_4.0_obj_99')):
    print('ya extraido')
elif not os.path.isfile(ZIP):
    raise SystemExit('Falta ' + ZIP + ': descargalo de https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip')
else:
    with zipfile.ZipFile(ZIP) as z:
        z.extractall(DEST)
        print('extraidos', len(z.namelist()), 'archivos')
