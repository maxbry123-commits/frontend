import hashlib,json,os,pathlib,re,shutil,subprocess,sys,tempfile
QUEUE=pathlib.Path('scripts/watchdog-ui-yaiwes-26-download-extract-20260908/QUEUE.json')
q=json.loads(QUEUE.read_text(encoding='utf-8'))
items=[c for c in q['components'] if 5 <= c['director_index'] <= 16]
GIT_BLOB_LIMIT=100*1024*1024
LFS=b'version https://git-lfs.github.com/spec/v1'

def run(*args,cwd=None): return subprocess.run(args,cwd=cwd,check=True,text=True,capture_output=True)
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
def license_evidence(root):
    out=[]
    for p in root.rglob('*'):
        if p.is_file() and not p.name.startswith('SOURCE_') and re.match(r'^(license|licence|copying|notice|copyright)(\.|$|[-_])',p.name.lower()):
            out.append((p.relative_to(root).as_posix(),sha(p)))
    return sorted(out)

gaps=[]; verified=[]
with tempfile.TemporaryDirectory(prefix='watchdog-ui-repair01-') as td:
    td=pathlib.Path(td)
    for c in items:
        idx,slug,url,dest=c['director_index'],c['slug'],c['source_url'],pathlib.Path(c['destination'])
        try:
            lr=run('git','ls-remote',url,'HEAD').stdout.strip().split()
            if not lr or not re.fullmatch(r'[0-9a-f]{40}',lr[0]): raise RuntimeError('SOURCE_REF_GAP')
            pinned=lr[0]; src=td/slug
            subprocess.run(['git','-c','filter.lfs.smudge=','-c','filter.lfs.clean=','-c','filter.lfs.process=','-c','filter.lfs.required=false','clone','--depth','1','--single-branch','--no-tags',url,str(src)],check=True)
            actual=run('git','rev-parse','HEAD',cwd=src).stdout.strip()
            if actual!=pinned: raise RuntimeError('SOURCE_REF_MOVED_GAP')
            shutil.rmtree(src/'.git',ignore_errors=True)
            for p in src.rglob('*'):
                if p.is_symlink():
                    target=(p.parent/os.readlink(p)).resolve()
                    if not target.is_relative_to(src.resolve()): raise RuntimeError('UNSAFE_SOURCE_SYMLINK')
                elif p.is_file():
                    if p.stat().st_size>=GIT_BLOB_LIMIT: raise RuntimeError('GIT_BLOB_LIMIT_GAP')
                    if p.stat().st_size<=1024 and p.read_bytes().startswith(LFS): raise RuntimeError('SOURCE_LFS_POINTER_GAP')
            if dest.exists():
                u=dest/'SOURCE_URL.txt'; cm=dest/'SOURCE_COMMIT.txt'
                if u.is_file() and cm.is_file() and u.read_text().strip()==url and cm.read_text().strip()==pinned:
                    verified.append((idx,slug,'VERIFIED_EXISTING',pinned)); continue
                raise RuntimeError('COLLISION_BLOCKED')
            dest.mkdir(parents=True)
            shutil.copytree(src,dest,dirs_exist_ok=True,symlinks=True)
            (dest/'SOURCE_URL.txt').write_text(url+'\n')
            (dest/'SOURCE_COMMIT.txt').write_text(pinned+'\n')
            lic=license_evidence(dest)
            if not lic: raise RuntimeError('LICENSE_EVIDENCE_MISSING')
            (dest/'SOURCE_LICENSE.txt').write_text('SOURCE_LICENSE_FILES\n'+''.join(f'{d}  {r}\n' for r,d in lic))
            rows=[]
            for p in sorted(x for x in dest.rglob('*') if x.is_file() and x.name!='SOURCE_SHA256SUMS.txt'):
                rows.append(f'{sha(p)}  {p.relative_to(dest).as_posix()}\n')
            (dest/'SOURCE_SHA256SUMS.txt').write_text(''.join(rows))
            verified.append((idx,slug,'EXTRACTED_TREE',pinned))
        except Exception as e:
            if dest.exists() and not (dest/'SOURCE_URL.txt').exists(): shutil.rmtree(dest,ignore_errors=True)
            gaps.append((idx,slug,str(e)))
report={'task_id':'watchdog-ui-yaiwes-26-repair-01','verified':verified,'gaps':gaps,'blocked_preserved':[[3,'copilotkit','SOURCE_LFS_POINTER_GAP'],[4,'agent-ui','SOURCE_404_GAP']]}
pathlib.Path('UI YAIWES/todos los componentes/Watchdog UI/REPAIR_01_CHECKPOINT_20260908.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
if gaps: raise SystemExit(42)
