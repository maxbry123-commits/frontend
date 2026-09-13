const CONFIG_KEY='yaiwes-factory-config-v13';

function readConfig(){
  try{return JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}catch{return {}}
}
function writeConfig(config){localStorage.setItem(CONFIG_KEY,JSON.stringify(config))}
function skillSection(){
  return [...document.querySelectorAll('.tool-section')].find(section=>section.querySelector('h3')?.textContent?.trim()==='Skills de diseño')||null;
}
function decorate(){
  const section=skillSection();
  if(!section)return;
  const config=readConfig();
  const skills=Array.isArray(config.skills)?config.skills:[];
  const cards=[...section.querySelectorAll('.tool-list .tool-card')];
  cards.forEach((card,index)=>{
    if(index>=skills.length)return;
    let button=card.querySelector('[data-skill-activate]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.dataset.skillActivate=String(index);
      button.className='skill-activate-control';
      card.appendChild(button);
    }
    const active=Boolean(skills[index]?.active);
    button.textContent=active?'Activo':'Inactivo';
    button.setAttribute('aria-pressed',String(active));
  });
}
function activeSkills(){
  const config=readConfig();
  const skills=Array.isArray(config.skills)?config.skills:[];
  return skills.filter(skill=>skill?.active).map(skill=>({name:skill.name,source:skill.source,purpose:skill.purpose}));
}

document.addEventListener('click',event=>{
  const activation=event.target?.closest?.('[data-skill-activate]');
  if(activation){
    event.preventDefault();
    const index=Number(activation.dataset.skillActivate);
    const config=readConfig();
    if(!Array.isArray(config.skills)||!config.skills[index])return;
    config.skills[index]={...config.skills[index],active:!config.skills[index].active};
    writeConfig(config);
    decorate();
    globalThis.__YAIWES_SKILL_ACTIVATION_LAST__=Object.freeze({index,active:Boolean(config.skills[index].active)});
    return;
  }
  const send=event.target?.closest?.('#send-ai-job');
  if(send){
    queueMicrotask(()=>{
      const preview=document.getElementById('delta-preview');
      if(!preview)return;
      try{
        const payload=JSON.parse(preview.textContent||'{}');
        payload.activeSkills=activeSkills();
        preview.textContent=JSON.stringify(payload,null,2);
      }catch{}
    });
  }
});

new MutationObserver(decorate).observe(document.documentElement,{subtree:true,childList:true});
queueMicrotask(decorate);

globalThis.__YAIWES_SKILL_ACTIVATION_V1__=Object.freeze({activeSkills,decorate});
