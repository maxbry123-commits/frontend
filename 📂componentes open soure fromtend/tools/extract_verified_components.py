import json, os, shutil, subprocess
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

ROOT = Path.cwd()
COMP = ROOT / "📂componentes open soure fromtend"
FRONT = COMP / "Fromtend code"
YAIWES = COMP / "UI YAIWES"
YAIWES_COPY = ROOT / "UI YAIWES" / "Interface YAIWES ui" / "ENGINE ADAPTER"
SKILLS = ROOT / "📂 skills de fromtend" / "📂 archivos skills fromtend"

FRONT_SLUGS = [
    "OpenPencil","OpenDesign","Onlook","Penpot","Webstudio","Silex",
    "Frappe-Builder","BESSER","tldraw","drawio","xyflow","Craft.js",
    "Mermaid","PlantUML","anthropic-skills","microsoft-skills",
    "ui-ux-pro-max-skill","wordpress-agent-skills","frontend-audit-skill",
    "nolly-agent-skills","PracticalSwan-agent-skills","accessibility-skills",
]
YAIWES_SLUGS = ["Transformers.js","MLC-WebLLM","ONNX-Runtime","wllama","LiteRT"]
SKILL_SLUGS = {
    "anthropic-skills","microsoft-skills","ui-ux-pro-max-skill",
    "wordpress-agent-skills","frontend-audit-skill","nolly-agent-skills",
    "PracticalSwan-agent-skills","accessibility-skills",
}

def run(args, cwd=None, check=True):
    print("+", " ".join(map(str,args)), flush=True)
    return subprocess.run(args, cwd=cwd, check=check)

def output(args, cwd=None):
    return subprocess.check_output(args, cwd=cwd, text=True).strip()

def files_count(path):
    return sum(1 for p in path.rglob("*") if p.is_file() or p.is_symlink()) if path.exists() else 0

def safe_members(zip_path):
    with ZipFile(zip_path) as z:
        names = z.namelist()
    bad=[]
    for n in names:
        p=PurePosixPath(n)
        if p.is_absolute() or ".." in p.parts:
            bad.append(n)
    if bad:
        raise RuntimeError(f"unsafe archive paths in {zip_path}: {bad[:5]}")
    return names

def parts_for(base, slug):
    return sorted(base.glob(f"{slug}_*.zip"))

def verify_parts(parts):
    if not parts:
        raise RuntimeError("no ZIP parts")
    union=[]
    for z in parts:
        if z.stat().st_size <= 0:
            raise RuntimeError(f"zero-byte ZIP: {z}")
        run(["unzip","-tq",str(z)])
        union.extend(safe_members(z))
    return union

def extract_slug(base, slug):
    parts=parts_for(base,slug)
    dest=base/slug
    if not parts:
        n=files_count(dest)
        if n:
            print(f"ALREADY_EXTRACTED {slug} files={n}",flush=True)
            return [], None, n, True
        raise RuntimeError(f"no ZIP parts and no extracted tree: {slug}")
    archived=verify_parts(parts)
    if dest.exists():
        shutil.rmtree(dest)
    for z in parts:
        run(["unzip","-oq",str(z),"-d",str(base)])
    if not dest.exists() or not dest.is_dir():
        raise RuntimeError(f"extraction folder missing: {dest}")
    real_files=[p for p in dest.rglob("*") if p.is_file() or p.is_symlink()]
    if not real_files:
        raise RuntimeError(f"no extracted files: {dest}")
    missing=[]
    for n in archived:
        p=PurePosixPath(n)
        if str(p).endswith("/"):
            continue
        target=base.joinpath(*p.parts)
        if not target.exists() and not target.is_symlink():
            missing.append(n)
    if missing:
        raise RuntimeError(f"archive/extraction mismatch {slug}: {missing[:10]}")
    return parts, len(archived), len(real_files), False

def strip_lfs_pointer_placeholders(dest):
    # Downloader intentionally used GIT_LFS_SKIP_SMUDGE, so prebuilt binaries
    # in LiteRT are only Git-LFS pointer text, not actual binary payloads.
    # Keep source code; omit unavailable pointer placeholders and record them.
    base=dest/"litert"/"prebuilt"
    skipped=[]
    if base.exists():
        for p in sorted(base.rglob("*")):
            if not p.is_file() or p.suffix.lower() not in {".so",".dylib",".dll",".lib"}:
                continue
            raw=p.read_bytes()
            if raw.startswith(b"version https://git-lfs.github.com/spec/v1"):
                skipped.append({
                    "path":str(p.relative_to(dest)),
                    "pointer":raw.decode("utf-8","replace").strip()
                })
                p.unlink()
    note=dest/"LFS_POINTERS_SKIPPED.json"
    note.write_text(json.dumps({
        "reason":"upstream files are Git LFS pointers; original downloader used GIT_LFS_SKIP_SMUDGE so binary objects were never downloaded",
        "count":len(skipped),
        "items":skipped
    },indent=2,ensure_ascii=False)+"\n")
    print(f"LITERT_LFS_POINTERS_SKIPPED {len(skipped)}",flush=True)
    return len(skipped)

def copy_tree(src,dst):
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src,dst,symlinks=True)
    src_files=sorted(str(p.relative_to(src)) for p in src.rglob("*") if p.is_file() or p.is_symlink())
    dst_files=sorted(str(p.relative_to(dst)) for p in dst.rglob("*") if p.is_file() or p.is_symlink())
    if src_files != dst_files:
        raise RuntimeError(f"copy verification failed {src} -> {dst}")
    return len(dst_files)

def configure_git():
    run(["git","config","user.name","github-actions[bot]"])
    run(["git","config","user.email","41898282+github-actions[bot]@users.noreply.github.com"])

def commit_push(label, add_paths, delete_paths):
    run(["git","add","--sparse","--"] + [str(p) for p in add_paths])
    existing=[p for p in delete_paths if p.exists()]
    if existing:
        run(["git","rm","-f","--"] + [str(p) for p in existing])
    if subprocess.run(["git","diff","--cached","--quiet"]).returncode == 0:
        print("NO_CHANGES",label,flush=True)
        return None
    run(["git","commit","-m",f"build(frontend): extract {label} and remove verified ZIP parts"])
    run(["git","fetch","origin","main"])
    run(["git","rebase","origin/main"])
    run(["git","push","origin","HEAD:main"])
    sha=output(["git","rev-parse","HEAD"])
    print("PUSH_PASS",label,sha,flush=True)
    return sha

configure_git()
report=[]
SKILLS.mkdir(parents=True,exist_ok=True)
YAIWES_COPY.mkdir(parents=True,exist_ok=True)

for slug in FRONT_SLUGS:
    print(f"===== EXTRACT FRONTEND {slug} =====",flush=True)
    parts, archived_count, file_count, already = extract_slug(FRONT,slug)
    add=[FRONT/slug]
    copied=0
    if slug in SKILL_SLUGS:
        skill_dst=SKILLS/slug
        if files_count(skill_dst)==0 or not already:
            copied=copy_tree(FRONT/slug,skill_dst)
            add.append(skill_dst)
        else:
            copied=files_count(skill_dst)
    sha=None if already else commit_push(slug,add,parts)
    report.append({
        "slug":slug,"group":"frontend","status":"EXTRACTED_VERIFIED" if already else "EXTRACTED",
        "zip_parts_removed":len(parts),"archive_entries":archived_count,
        "extracted_files":file_count,"skill_copy_files":copied,"commit":sha
    })

for slug in YAIWES_SLUGS:
    print(f"===== EXTRACT YAIWES {slug} =====",flush=True)
    parts, archived_count, file_count, already = extract_slug(YAIWES,slug)
    if slug=="LiteRT" and not already:
        lfs_skipped=strip_lfs_pointer_placeholders(YAIWES/slug)
        file_count=files_count(YAIWES/slug)
    else:
        lfs_skipped=0
    copy_dst=YAIWES_COPY/slug
    if files_count(copy_dst)==0 or not already:
        copied=copy_tree(YAIWES/slug,copy_dst)
    else:
        copied=files_count(copy_dst)
    dup_parts=parts_for(YAIWES_COPY,slug)
    if parts:
        canonical_by_name={p.name:output(["git","hash-object",str(p)]) for p in parts}
        for p in dup_parts:
            if p.name not in canonical_by_name:
                raise RuntimeError(f"unexpected duplicate ZIP {p}")
            if output(["git","hash-object",str(p)]) != canonical_by_name[p.name]:
                raise RuntimeError(f"duplicate ZIP differs {p}")
    sha=None if already else commit_push(
        slug,[YAIWES/slug,copy_dst],parts+dup_parts
    )
    report.append({
        "slug":slug,"group":"yaiwes","status":"EXTRACTED_VERIFIED" if already else "EXTRACTED",
        "zip_parts_removed":len(parts)+len(dup_parts),
        "archive_entries":archived_count,"extracted_files":file_count,
        "engine_copy_files":copied,"lfs_pointer_placeholders_skipped":lfs_skipped,
        "commit":sha
    })

report_path=COMP/"EXTRACTION_XRAY_REPORT.json"
report_path.write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n")
placeholder=SKILLS/".gitkeep"
run(["git","add","--sparse","--",str(report_path)])
if placeholder.exists():
    run(["git","rm","-f","--",str(placeholder)],check=False)
if subprocess.run(["git","diff","--cached","--quiet"]).returncode != 0:
    run(["git","commit","-m","docs(frontend): record verified component extraction X-Ray"])
    run(["git","fetch","origin","main"])
    run(["git","rebase","origin/main"])
    run(["git","push","origin","HEAD:main"])

print("===== EXTRACTION COMPLETE 27/27 =====",flush=True)
print(json.dumps(report,ensure_ascii=False),flush=True)
