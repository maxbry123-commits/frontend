import assert from 'node:assert/strict';

globalThis.document={getElementById:()=>null,addEventListener:()=>{}};
globalThis.queueMicrotask=globalThis.queueMicrotask||((fn)=>Promise.resolve().then(fn));
const {parseFactoryExport,restoreFactoryExport}=await import('../src/json-roundtrip-v1.js');

const original={state:{components:[{id:'c1',kind:'button',label:'Guardar',x:10,y:20,w:120,h:60,props:{action:'save'}}],selectedId:'c1',step:5,version:7},config:{destinations:[{type:'DOWNLOAD',path:'out'}],theme:{accent:'#fff'}}};
const parsed=parseFactoryExport(JSON.stringify(original));
assert.deepEqual(parsed.project.state,original.state);
assert.deepEqual(parsed.config,original.config);
assert.equal(parsed.project.schema,'yaiwes.factory.project/v1');

const memory=new Map();
const storage={setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)};
restoreFactoryExport(JSON.stringify(original),storage);
const restoredProject=JSON.parse(memory.get('yaiwes-factory-project-v19'));
const restoredConfig=JSON.parse(memory.get('yaiwes-factory-config-v13'));
assert.deepEqual(restoredProject.state,original.state);
assert.deepEqual(restoredConfig,original.config);

assert.throws(()=>parseFactoryExport('{"state":{}}'),/INVALID_YAIWES_FACTORY_EXPORT/);
assert.throws(()=>parseFactoryExport('not-json'));
console.log('F_IO_028_JSON_ROUNDTRIP=PASS');
