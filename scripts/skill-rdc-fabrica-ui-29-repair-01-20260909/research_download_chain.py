import hashlib, json, os, re, shutil, subprocess, sys, time
from pathlib import Path
os.environ['GIT_TERMINAL_PROMPT']='0'
DEST=Path(sys.argv[1]).resolve(); WORK=Path(sys.argv[2]).resolve(); SRC=WORK/'src'; PACK=WORK/'pack'
LFS_POINTER_PREFIX=b'version https://git-lfs.github.com/spec/v1\n'
POINTER_SCAN_BYTES=1024
MANIFEST=DEST/'RESEARCH_DOWNLOAD_MANIFEST_FABRICA_UI_29_REPAIR_01_20260909.jsonl'; SPLIT_TARGET=12000000; MAX_ZIP=17*1000*1000; BATCH_LIMIT=90*1024*1024; CHUNK=8*1024*1024
REPOS=[('01','GrapesJS','https://github.com/GrapesJS/grapesjs.git'),('02','Puck','https://github.com/measuredco/puck.git'),('03','Craft.js','https://github.com/prevwong/craft.js.git'),('04','Plasmic','https://github.com/plasmicapp/plasmic.git'),('05','Onlook','https://github.com/onlook-dev/onlook.git'),('06','Webstudio','https://github.com/webstudio-is/webstudio.git'),('07','Office-Ribbon-2010','https://github.com/OkGoDoIt/Office-Ribbon-2010.git'),('08','Fluent.Ribbon','https://github.com/fluentribbon/Fluent.Ribbon.git'),('09','Fluent-UI','https://github.com/microsoft/fluentui.git'),('10','VS-Code-Contribution-Points-Docs','https://github.com/microsoft/vscode-docs.git'),('11','VS-Code-Extension-Samples','https://github.com/microsoft/vscode-extension-samples.git'),('12','Appsmith','https://github.com/appsmithorg/appsmith.git'),('13','ToolJet','https://github.com/ToolJet/ToolJet.git'),('14','Budibase','https://github.com/Budibase/budibase.git'),('15','Lowcoder','https://github.com/lowcoder-org/lowcoder.git'),('16','NocoBase','https://github.com/nocobase/nocobase.git'),('17','Node-RED','https://github.com/node-red/node-red.git'),('18','n8n','https://github.com/n8n-io/n8n.git'),('19','Blockly','https://github.com/RaspberryPiFoundation/blockly.git'),('20','JSONForms','https://github.com/eclipsesource/jsonforms.git'),('21','RJSF','https://github.com/rjsf-team/react-jsonschema-form.git'),('22','formio.js','https://github.com/formio/formio.js.git'),('23','Pyodide','https://github.com/pyodide/pyodide.git'),('24','QuickJS','https://github.com/bellard/quickjs.git'),('25','WebContainers','https://github.com/stackblitz/webcontainer-core.git'),('26','Deno','https://github.com/denoland/deno.git'),('27','Directus','https://github.com/directus/directus.git'),('28','NocoDB','https://github.com/nocodb/nocodb.git'),('29','Payload','https://github.com/payloadcms/payload.git')]
def run(c,cwd=None): subprocess.run(c,cwd=cwd,check=True)
def is_lfs_pointer(path):
    try:
        if not path.is_file() or path.stat().st_size > POINTER_SCAN_BYTES: return False
        with path.open('rb') as f: return f.read(POINTER_SCAN_BYTES).startswith(LFS_POINTER_PREFIX)
    except OSError: return False
def guard_source_tree(root):
    bad=[]
    for p in sorted(x for x in root.rglob('*') if is_lfs_pointer(x)):
        bad.append(str(p.relative_to(root)))
    if bad:
        raise RuntimeError('SOURCE_LFS_POINTER_GAP: '+'; '.join(bad[:20]))

def clone_retry(cmd,url,root,attempts=3):
    last=None
    for attempt in range(1,attempts+1):
        shutil.rmtree(root,ignore_errors=True)
        try:
            run(cmd+[url,str(root)]); return
        except subprocess.CalledProcessError as e:
            last=e
            if attempt==attempts: break
            time.sleep(attempt*5)
    raise last
def note(**kw):
    MANIFEST.parent.mkdir(parents=True,exist_ok=True)
    with MANIFEST.open('a') as f: f.write(json.dumps(kw,sort_keys=True)+'\n')
def done(slug):
    if not MANIFEST.exists(): return False
    return any((lambda d:d.get('slug')==slug and d.get('status')=='COMPLETE')(json.loads(x)) for x in MANIFEST.read_text().splitlines() if x.strip())
def stage_repo(slug,root):
    stage=PACK/f'{slug}_stage'; shutil.rmtree(stage,ignore_errors=True); stage.mkdir(parents=True); records=[]
    for p in root.rglob('*'):
        if not p.is_file(): continue
        rel=p.relative_to(root); target=stage/slug/rel; target.parent.mkdir(parents=True,exist_ok=True); size=p.stat().st_size
        if size<=CHUNK: shutil.copy2(p,target); continue
        d=target.parent/(target.name+'.chunks'); d.mkdir(parents=True,exist_ok=True)
        with p.open('rb') as f:
            i=0
            while True:
                data=f.read(CHUNK)
                if not data: break
                (d/f'{target.name}.part-{i:04d}').write_bytes(data); i+=1
        records.append({'repo':slug,'path':str(rel),'chunks_dir':str(d.relative_to(stage)),'bytes':size,'chunk_bytes':CHUNK})
    if records: (stage/'SPLIT_FILES.json').write_text(json.dumps(records,indent=2))
    return stage
def package(slug,root):
    stage=stage_repo(slug,root); full=PACK/f'{slug}_full.zip'; full.unlink(missing_ok=True)
    run(['zip','-q','-r','-1','-y',str(full.resolve()),'.'],cwd=stage)
    if full.stat().st_size<=SPLIT_TARGET:
        out=PACK/f'{slug}_0001.zip'; full.replace(out); shutil.rmtree(stage,ignore_errors=True); return [(out,out.stat().st_size)]
    before=set(PACK.glob('*.zip'))
    try: run(['zipsplit','-n',str(SPLIT_TARGET),'-b',str(PACK.resolve()),str(full.resolve())])
    except subprocess.CalledProcessError:
        print(f'SKIP ZIPSPLIT FAIL {slug}',flush=True); shutil.rmtree(stage,ignore_errors=True); return []
    full.unlink(missing_ok=True)
    made=[p for p in PACK.glob('*.zip') if p not in before and p != full]
    if not made:
        print(f'SKIP ZIPSPLIT EMPTY {slug}',flush=True); shutil.rmtree(stage,ignore_errors=True); return []
    out=[]
    for i,p in enumerate(sorted(made,key=lambda p:(p.stat().st_mtime,p.name)),1):
        q=PACK/f'{slug}_{i:04d}.zip'; p.replace(q); size=q.stat().st_size
        if size>MAX_ZIP:
            print(f'SKIP MAX_ZIP {q} {size}',flush=True); shutil.rmtree(stage,ignore_errors=True); return []
        if subprocess.run(['unzip','-tq',str(q)]).returncode!=0:
            print(f'SKIP CRC {q}',flush=True); shutil.rmtree(stage,ignore_errors=True); return []
        out.append((q,size))
    shutil.rmtree(stage,ignore_errors=True); return out
def push(label):
    try:
        run(['git','fetch','origin','main']); run(['git','rebase','origin/main']); run(['git','push','--no-verify','origin','HEAD:main']); print(f'PUSH PASS {label}'); return
    except subprocess.CalledProcessError:
        print(f'SKIP PUSH FAIL {label}',flush=True); return
def commit(n,label):
    if not n:return
    run(['git','add','--sparse',str(DEST)])
    if subprocess.run(['git','diff','--cached','--quiet']).returncode==0:return
    run(['git','config','user.name','github-actions[bot]']); run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com']); run(['git','commit','-m',f'build(download): research queue batch {label} ({n} bytes)']); push(label)
run(['git','config','--local','filter.lfs.clean','cat'])
run(['git','config','--local','filter.lfs.smudge','cat'])
run(['git','config','--local','filter.lfs.process',''])
run(['git','config','--local','filter.lfs.required','false'])
DEST.mkdir(parents=True,exist_ok=True); SRC.mkdir(parents=True,exist_ok=True); PACK.mkdir(parents=True,exist_ok=True)
batch=batch_no=0; skipped=[]
CLONE=['git','-c','filter.lfs.smudge=','-c','filter.lfs.clean=','-c','filter.lfs.process=','-c','filter.lfs.required=false','clone','--depth','1','--single-branch','--no-tags']
for number,slug,url in REPOS:
    print(f'===== QUEUE {number}/29: {slug} =====')
    if done(slug): print(f'{slug}: COMPLETE; skipping'); continue
    root=SRC/slug; shutil.rmtree(root,ignore_errors=True)
    try: clone_retry(CLONE,url,root)
    except subprocess.CalledProcessError:
        print(f'SKIP CLONE FAIL {number} {slug} {url}',flush=True)
        note(number=int(number),slug=slug,source=url,status='SKIPPED',reason='clone'); skipped.append(number); continue
    sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(); guard_source_tree(root); shutil.rmtree(root/'.git',ignore_errors=True)
    parts=package(slug,root)
    if not parts:
        print(f'SKIP PACKAGE {number} {slug}',flush=True)
        note(number=int(number),slug=slug,source=url,status='SKIPPED',reason='package'); skipped.append(number)
        shutil.rmtree(root,ignore_errors=True); continue
    print(f'{slug}: {len(parts)} ZIP part(s)')
    for z,size in parts:
        if batch and batch+size>BATCH_LIMIT: commit(batch,f'{batch_no:03d}'); batch=0; batch_no+=1
        shutil.copy2(z,DEST/z.name); batch+=size; print(f'  {z.name}: {size} bytes; batch={batch}')
    note(number=int(number),slug=slug,source=url,source_commit=sha,parts=len(parts),status='COMPLETE')
    shutil.rmtree(root,ignore_errors=True); shutil.rmtree(PACK,ignore_errors=True); PACK.mkdir(parents=True,exist_ok=True)
commit(batch,f'{batch_no:03d}-final')
print('SKIPPED',skipped)
print('===== QUEUE COMPLETE: 29/29 repositories processed =====')
