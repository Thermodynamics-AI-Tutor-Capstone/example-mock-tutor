#!/usr/bin/env python3
"""Render the private source scans and install geometric cell overlays, without OCR.

Requires Pillow and Poppler's pdftoppm. Usage:
  python scripts/import-property-tables.py --source-dir /path/to/course/pdfs
The source PDFs, generated page images and manifest are local/private artifacts.
All geometry below was reviewed against these specific scanned PDF editions.
No unverified numeric text is synthesized. Row labels are generic except reviewed examples.
"""
import argparse, hashlib, json, subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
SOURCES={'saturation':'SaturationTables.pdf','subcooled':'SubcooledLiquidTables.pdf','superheated':'SuperheatedVaporTables.pdf'}
EXPECTED_SOURCE_SHA256 = {'SaturationTables.pdf': '9f324d301590612588c28747ab6d91e9f02d9889b51c81afc0ba4e3506711b31', 'SubcooledLiquidTables.pdf': 'f4e23f7a1004918c99bfa92a85268c223253e15c40d101676dd3b6514517946e', 'SuperheatedVaporTables.pdf': '9f11585ebc4133b6e6c17db09a01b0b4fa414d0921deb9412acc1a2997fcf35c'}
EXPECTED_IMAGE_SHA256 = {'saturation-1.png': 'd30879ed7c875c04d0abd2010d1f0c490b3531031f8d761ba575445ab4061317', 'saturation-2.png': 'f986d78fedea3ddae502c8ab0a229e9fd78fb08e2d01827690789476bb3b5646', 'saturation-3.png': '28e3be14c639d97e5e68089f83447287e8e2b081a6e377fc91561ae049f52da6', 'saturation-4.png': 'f6a1965d43c430bb878c3d70dbfb5c8cf1139f13e09eb7cbf93f83e93aa5f2e2', 'saturation-5.png': 'afd08ffde1489f854d43d13b82e5374b41badcbd850fe5158c34e0c732e1146b', 'subcooled-1.png': '7ae1ae296d37c248ea0d38d9ba110f824e45f215e6b2f7f71e3ef98bb5285a28', 'subcooled-2.png': '5fe1d71d0db5752039fdf67f232986caf2892e56c5ab6f63263e60f87e5c17aa', 'subcooled-3.png': '2c30b8e111c5ffe4700bc66be6f1426d959d8fb9cd7a10fd26eabd6e717dcd0c', 'superheated-01.png': 'bc311057bbe08e7649d98b0b53f4b9a9a7e0421442eae821f72dd99c868b9843', 'superheated-02.png': '56477830bda637b21077181d7622bc8413adfabb78dc9886cdf719b2d19969bc', 'superheated-03.png': '4d23d0d4df8d0f5a294e4e6e84eed33e59622957378a36cf8733a3e534e6cb0c', 'superheated-04.png': '376689ae6fcf6ed1a0f940f6aa002c9f7dd4f9190cf835f41d27de001d5aa109', 'superheated-05.png': '0ad39d795c7c5237af7f942945f790337e3dc4baf2e5d4b639edd0d0504d8bc8', 'superheated-06.png': 'a3a2d84b8746a55efcb6908430dce948200f7b7e0b4aab84ef8646a806422113', 'superheated-07.png': 'dfa7dc4080b0b8ab42229232ca59aff1a1b98e3d3fd55076ae05fc92cdd0c03f', 'superheated-08.png': '4d8f6287779e6c6edcecce7bc29d79135595029d02b9951ae7d4fe938756e585', 'superheated-09.png': 'fa4d3cfbf53b121b21d970690050b8aa9b12434beb51e8561357b4db953ba0a4', 'superheated-10.png': '37329a301d38495513c6288cd21e3247ec002a5019fcf74caed98bb5d8b5d9b8', 'superheated-11.png': '3cb1c0a404ba2bdf55593ab3d70fba1ed4f7f4405853076fdd6d87d68f8461bf', 'superheated-12.png': '56ff4c61c11218ab44492a72eddaae7ef792ebf3ce587a8e4594b6f1279682b7'}
# first/last numeric-row centers and row count (reviewed against source page images).
GEOMETRY={
 'saturation': [[(796,1998,48)],[(282,1971,67)],[(335,1968,50)],[(294,1930,50)],[(316,1484,36)]],
 'subcooled': [[(354,820,15),(1449,2016,18)],[(316,916,19),(1376,2012,20)],[(313,946,20),(1389,2023,20)]],
 'superheated': [[(356,1051,26),(1337,2032,26)],[(314,1006,26),(1302,2022,27)],[(303,1026,27),(1293,2015,27)],[(301,1023,27),(1294,2016,27)],[(299,1021,27),(1292,2015,27)],[(319,1042,27),(1312,2034,27)],[(306,1029,27),(1297,2019,27)],[(302,1025,27),(1294,2016,27)],[(302,1025,27),(1294,2017,27)],[(314,1034,27),(1303,2026,27)],[(306,1029,27),(1270,2021,28)],[(308,1058,28),(1283,2034,28)]]
}
# Reviewed source-header border positions; captions are outside the crop, column headers inside.
HEADER_TOP={'saturation': [[655], [154], [190], [159], [185]], 'subcooled': [[238, 1333], [194, 1256], [198, 1273]], 'superheated': [[247, 1227], [198, 1186], [194, 1183], [194, 1186], [191, 1184], [202, 1194], [196, 1187], [192, 1183], [192, 1183], [195, 1187], [195, 1159], [190, 1166]]}
SHIFTS={'saturation':[0,15,10,10,-45],'subcooled':[0,0,0],'superheated':[0,-55,-20,-20,0,-40,-30,-10,0,-50,-25,-50]}
PRESSURES={'subcooled':['5.0','10.0','15.0','20.0','30.0','50.0'],'superheated':['0.006','0.035','0.070','0.100','0.150','0.30','0.50','0.70','1.0','1.5','2.0','3.0','4.0','6.0','8.0','10.0','12.0','14.0','16.0','18.0','20.0','26.0','28.0','32.0']}
TITLES={'saturation':'Saturation tables','subcooled':'Compressed liquid tables','superheated':'Superheated and supercritical tables'}
SAT_COLUMNS=[('T','Temperature','T','K',None),('P','Pressure','P',None,None),('vf','Specific volume','v_f','m³/kg','saturated liquid'),('vg','Specific volume','v_g','m³/kg','saturated vapor'),('uf','Specific internal energy','u_f','kJ/kg','saturated liquid'),('ug','Specific internal energy','u_g','kJ/kg','saturated vapor'),('hf','Specific enthalpy','h_f','kJ/kg','saturated liquid'),('hg','Specific enthalpy','h_g','kJ/kg','saturated vapor'),('sf','Specific entropy','s_f','kJ/(kg·K)','saturated liquid'),('sg','Specific entropy','s_g','kJ/(kg·K)','saturated vapor')]
PHASE_COLUMNS=[('T','Temperature','T','K',None),('P','Pressure','P','MPa',None),('rho','Density','ρ','kg/m³',None),('v','Specific volume','v','m³/kg',None),('u','Specific internal energy','u','kJ/kg',None),('h','Specific enthalpy','h','kJ/kg',None),('s','Specific entropy','s','kJ/(kg·K)',None)]
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def columns(series,page):
    shift=SHIFTS[series][page-1]
    if series=='saturation':
        definition=list(SAT_COLUMNS)
        if page>=3:definition[0],definition[1]=definition[1],definition[0]
        edges=[175,285,425,555,690,835,970,1105,1245,1390,1535]
    else:definition=PHASE_COLUMNS;edges=[270,440,600,790,970,1140,1310,1530]
    return [dict(key=k,label=label,symbol=symbol,unit=('kPa' if page in [1,3] else 'MPa') if k=='P' and series=='saturation' else unit,
                 **({'phase':phase} if phase else {}),left=edges[i]+shift,right=edges[i+1]+shift)
            for i,(k,label,symbol,unit,phase) in enumerate(definition)]
def section(series,page,part,geometry):
    start,end,count=geometry;step=(end-start)/(count-1)
    if series=='saturation':
        table='D.1' if page<3 else 'D.2';kind='saturation-temperature' if page<3 else 'saturation-pressure'
        title='Table '+table+' · Saturation by '+('temperature' if page<3 else 'pressure');phase='saturated liquid and vapor';pressure=None
    else:
        i=(page-1)*2+part;table=('D.4' if series=='subcooled' else 'D.3')+chr(65+i)
        pressure={'value':PRESSURES[series][i],'unit':'MPa'}
        phase='compressed liquid' if series=='subcooled' else 'supercritical fluid' if float(pressure['value'])>22.064 else 'superheated vapor'
        kind='compressed-liquid' if series=='subcooled' else 'supercritical' if phase=='supercritical fluid' else 'superheated-vapor'
        title=f"Table {table} · P = {pressure['value']} MPa"+(' · Supercritical' if kind=='supercritical' else '')
    rows=[{'id':'r'+str(i+1),'top':round(start+(i-.5)*step),'bottom':round(start+(i+.5)*step)} for i in range(count)]
    if series=='superheated' and pressure and float(pressure['value'])<22.064:rows[0]['phase']='saturated vapor (boundary)'
    if series=='subcooled' and pressure and float(pressure['value'])<=20:rows[-1]['phase']='saturated liquid (boundary)'
    return dict(id=table.lower().replace('.','')+'-p'+str(page),table=table,title=title,kind=kind,phase=phase,
                **({'pressure':pressure} if pressure else {}),headerTop=HEADER_TOP[series][page-1][part],columns=columns(series,page),rows=rows,verifiedCells=[])
def refine_row_boundaries(page, image_path):
    # Find whitespace close to each reviewed row separator. This accounts for source scan
    # skew without changing row counts or synthesizing numbers. Shared edges never overlap.
    with Image.open(image_path).convert('L') as image:
        for sec in page['sections']:
            left,right=sec['columns'][0]['left'],sec['columns'][-1]['right']
            rows=sec['rows'];predicted=[r['top'] for r in rows]+[rows[-1]['bottom']]
            edges=[]
            for boundary in predicted:
                choices=range(max(0,boundary-5),min(image.height-1,boundary+5)+1)
                # Two-pixel white strip ensures the crop edge does not bisect a printed digit.
                edge=min(choices,key=lambda y:(sum(image.crop((left,y,right,y+2)).histogram()[:100]),abs(y-boundary)))
                edges.append(edge)
            for i,row in enumerate(rows):row['top'],row['bottom']=edges[i],edges[i+1]

def install_examples(manifest):
    # These strings are transcribed from, and independently checked against, the printed source.
    examples=[('saturation',1,0,'r28','T = 300 K',{'T':'300','P':'3.536900','vf':'0.0010035','vg':'39.078','uf':'112.56','ug':'2411.6','hf':'112.56','hg':'2549.9','sf':'0.39309','sg':'8.5174'}),
      ('saturation',3,0,'r50','P = 100.0 kPa',{'P':'100.0','T':'372.76','vf':'0.0010432','vg':'1.6939','uf':'417.40','ug':'2505.6','hf':'417.50','hg':'2674.9','sf':'1.3028','sg':'7.3588'}),
      ('subcooled',1,0,'r3','T = 300 K; P = 5 MPa',{'T':'300','P':'5','rho':'998.74','v':'0.001001','u':'112.15','h':'117.2','s':'0.3917'}),
      ('superheated',1,0,'r6','T = 400 K; P = 0.006 MPa',{'T':'400','P':'0.006','rho':'0.032522','v':'30.748','u':'2554.6','h':'2739.0','s':'8.8179'})]
    for series,page,part,rowid,label,values in examples:
        dataset=next(d for d in manifest['datasets'] if d['id']==series);sec=dataset['pages'][page-1]['sections'][part]
        row=next(r for r in sec['rows'] if r['id']==rowid);row['label']=label
        sec['verifiedCells']=[dict(rowId=rowid,columnKey=k,value=v,rowLabel=label,verification='manual source-page review') for k,v in values.items()]
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source-dir',type=Path,required=True);ap.add_argument('--output-dir',type=Path,default=ROOT/'public/property-tables');ap.add_argument('--pdftoppm',default='pdftoppm');ap.add_argument('--reuse-images',action='store_true');args=ap.parse_args()
    output=args.output_dir;images=output/'images';images.mkdir(parents=True,exist_ok=True)
    manifest={'version':1,'mode':'source-scans','fluid':'Water (H₂O)','notice':'Original scanned numbers remain authoritative. Only explicitly verified cells have numeric text. This viewer does not interpolate or calculate property values.','render':{'maxDimension':2200,'nominalDpi':200,'format':'png','method':'Poppler pdftoppm; source scans retained without OCR'},'datasets':[]}
    for series,filename in SOURCES.items():
        src=args.source_dir/filename
        if digest(src)!=EXPECTED_SOURCE_SHA256[filename]:raise ValueError(f'Unrecognized PDF edition: {filename}. Source geometry must be reviewed before import.')
        if not args.reuse_images:subprocess.run([args.pdftoppm,'-scale-to','2200','-png',str(src),str(images/series)],check=True)
        dataset={'id':series,'title':TITLES[series],'source':{'file':filename,'pageCount':len(GEOMETRY[series]),'sha256':digest(src)},'pages':[]}
        for number,parts in enumerate(GEOMETRY[series],1):
            name=f'{series}-{number:02d}.png' if series=='superheated' else f'{series}-{number}.png';path=images/name
            if args.reuse_images and digest(path)!=EXPECTED_IMAGE_SHA256[name]:raise ValueError(f'Unrecognized reused image {name}; re-render from the verified PDF without --reuse-images.')
            with Image.open(path) as im:width,height=im.size
            if (width,height)!=(1700,2200):raise ValueError(f'Unexpected rendering size {path}: {(width,height)}')
            page={'id':f'{series}-{number}','number':number,'printedPage':str((35 if series=='saturation' else 52 if series=='subcooled' else 40)+number),'image':'/property-tables/images/'+name,'width':width,'height':height,'sha256':digest(path),'sections':[section(series,number,i,g) for i,g in enumerate(parts)]}
            refine_row_boundaries(page,path)
            dataset['pages'].append(page)
        manifest['datasets'].append(dataset)
    install_examples(manifest)
    (output/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
    print('Installed',sum(len(d['pages']) for d in manifest['datasets']),'source pages;',sum(len(s['rows']) for d in manifest['datasets'] for p in d['pages'] for s in p['sections']),'selectable rows')
if __name__=='__main__':main()
