(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[`ability.damage`,`ability.range`,`ability.cooldown`,`ability.critChance`,`ability.knockback`,`player.moveSpeed`,`player.maxHp`,`player.contactIFrames`,`player.contactArmor`,`player.hpRegen`,`xp.magnetRadius`,`xp.gainMultiplier`],t=[{id:`pimenta`,icon:`🌶️`,name:`Pimenta no Dente`,effectLine:`+25% de dano`,maxStacks:5,effect:{stat:`ability.damage`,percentPerStack:.25,flatPerStack:0}},{id:`bocao`,icon:`🗣️`,name:`Abriu o Bocão`,effectLine:`+20% de alcance`,maxStacks:4,effect:{stat:`ability.range`,percentPerStack:.2,flatPerStack:0}},{id:`cafe`,icon:`☕`,name:`Café Passado na Hora`,effectLine:`-12% de recarga`,maxStacks:4,effect:{stat:`ability.cooldown`,percentPerStack:-.12,flatPerStack:0,min:.35}},{id:`chinelo`,icon:`🩴`,name:`Chinelo Ligeiro`,effectLine:`+10% de velocidade`,maxStacks:4,effect:{stat:`player.moveSpeed`,percentPerStack:.1,flatPerStack:0}},{id:`marmita`,icon:`🍱`,name:`Marmita Reforçada`,effectLine:`+20 de HP máximo e cura 20 na hora`,maxStacks:5,effect:{stat:`player.maxHp`,percentPerStack:0,flatPerStack:20},healOnPick:20},{id:`ima`,icon:`🧲`,name:`Ímã de Geladeira Gigante`,effectLine:`+50% no raio do ímã de XP`,maxStacks:3,effect:{stat:`xp.magnetRadius`,percentPerStack:.5,flatPerStack:0}},{id:`capa`,icon:`🧥`,name:`Capa de Chuva de Saco de Lixo`,effectLine:`+0,25 s de invulnerabilidade ao levar dano`,maxStacks:2,effect:{stat:`player.contactIFrames`,percentPerStack:0,flatPerStack:.25,max:1.1}},{id:`figurinha`,icon:`✨`,name:`Figurinha Premiada`,effectLine:`+25% de XP por orbe`,maxStacks:3,effect:{stat:`xp.gainMultiplier`,percentPerStack:.25,flatPerStack:0}},{id:`capacete`,icon:`⛑️`,name:`Capacete de Obra Emprestado`,effectLine:`-2 de dano por pancada (dói no mínimo 1)`,maxStacks:2,effect:{stat:`player.contactArmor`,percentPerStack:0,flatPerStack:2}},{id:`soro`,icon:`🥤`,name:`Soro Caseiro`,effectLine:`+0,5 de HP por segundo`,maxStacks:3,effect:{stat:`player.hpRegen`,percentPerStack:0,flatPerStack:.5}},{id:`dado`,icon:`🎲`,name:`Dado Viciado`,effectLine:`15% de chance de dano em dobro`,maxStacks:3,effect:{stat:`ability.critChance`,percentPerStack:0,flatPerStack:.15}},{id:`rodo`,icon:`🧹`,name:`Rodo de Enchente`,effectLine:`Empurra 0,5 u quem você acerta`,maxStacks:3,effect:{stat:`ability.knockback`,percentPerStack:0,flatPerStack:.5}},{id:`trocado`,icon:`🪙`,name:`Trocado`,effectLine:`Cura 20 de HP`,maxStacks:1/0,healOnPick:20,isFallback:!0}];function n(e,t,n){switch(n){case`ability.damage`:return t.ability.damage;case`ability.range`:return t.ability.range;case`ability.cooldown`:return t.ability.cooldown;case`ability.critChance`:return 0;case`ability.knockback`:return 0;case`player.contactArmor`:return 0;case`player.hpRegen`:return 0;case`player.moveSpeed`:return t.stats.moveSpeed;case`player.maxHp`:return t.stats.maxHp;case`player.contactIFrames`:return t.stats.contactIFrames;case`xp.magnetRadius`:return e.xp.magnetRadius;case`xp.gainMultiplier`:return 1}}function r(e,t,r,i,a=[]){let o=0,s=0,c=-1/0,l=1/0;for(let t=0;t<e.upgrades.length;t++){let n=e.upgrades[t].effect;if(n===void 0||n.stat!==r)continue;let a=i[t]??0;o+=n.percentPerStack*a,s+=n.flatPerStack*a,n.min!==void 0&&n.min>c&&(c=n.min),n.max!==void 0&&n.max<l&&(l=n.max)}for(let t=0;t<e.talents.length;t++){let n=e.talents[t].effect;if(n.stat!==r)continue;let i=a[t]??0;o+=n.percentPerStack*i,s+=n.flatPerStack*i,n.min!==void 0&&n.min>c&&(c=n.min),n.max!==void 0&&n.max<l&&(l=n.max)}let u=n(e,t,r)*(1+o)+s;return u<c?c:u>l?l:u}var i=[{id:`feijoada`,name:`Feijoada Completa`,effectLine:`+5% de dano por nível`,icon:`🍛`,maxRank:5,costPerRank:[50,100,200,350,550],effect:{stat:`ability.damage`,percentPerStack:.05,flatPerStack:0}},{id:`casca`,name:`Casca Grossa`,effectLine:`+10 de HP máximo por nível`,icon:`🥥`,maxRank:3,costPerRank:[60,140,260],effect:{stat:`player.maxHp`,percentPerStack:0,flatPerStack:10}},{id:`tenis`,name:`Tênis de Camelô`,effectLine:`+4% de velocidade por nível`,icon:`👟`,maxRank:3,costPerRank:[50,120,240],effect:{stat:`player.moveSpeed`,percentPerStack:.04,flatPerStack:0}},{id:`despertador`,name:`Despertador Velho`,effectLine:`-5% de recarga por nível`,icon:`⏰`,maxRank:3,costPerRank:[80,180,320],effect:{stat:`ability.cooldown`,percentPerStack:-.05,flatPerStack:0,min:.35}},{id:`cha`,name:`Chá da Vizinha`,effectLine:`+0,2 de HP por segundo por nível`,icon:`🍵`,maxRank:2,costPerRank:[120,280],effect:{stat:`player.hpRegen`,percentPerStack:0,flatPerStack:.2}},{id:`bolso`,name:`Bolso Fundo`,effectLine:`+20% no raio do ímã de XP por nível`,icon:`👖`,maxRank:2,costPerRank:[40,90],effect:{stat:`xp.magnetRadius`,percentPerStack:.2,flatPerStack:0}},{id:`cracha`,name:`Crachá de Esforçado`,effectLine:`+10% de XP por orbe por nível`,icon:`📛`,maxRank:3,costPerRank:[70,160,300],effect:{stat:`xp.gainMultiplier`,percentPerStack:.1,flatPerStack:0}},{id:`coelho`,name:`Pé de Coelho Falsificado`,effectLine:`+2% de chance de crítico por nível`,icon:`🐰`,maxRank:3,costPerRank:[100,220,400],effect:{stat:`ability.critChance`,percentPerStack:0,flatPerStack:.02}}],a=.2,o=[{id:`capivara`,name:`Capivara`,tagline:`Mordida automática — briga colada: curto alcance, ritmo rápido`,stats:{moveSpeed:8,maxHp:100,radius:.5,contactIFrames:.6},ability:{kind:`mordida`,damage:10,cooldown:.8,range:2.2}},{id:`carteiro`,name:`Carteiro`,tagline:`Cartas que voltam — briga à distância: a carta atravessa a horda na ida e na volta`,stats:{moveSpeed:8,maxHp:100,radius:.5,contactIFrames:.6},ability:{kind:`cartas`,damage:7,cooldown:1.2,range:7,projectileSpeed:14,cardRadius:.6,maxLive:3}},{id:`churrasqueiro`,name:`Churrasqueiro`,tagline:`Baforadas de fumaça ao redor — briga no meio da horda: ser cercado é o plano`,stats:{moveSpeed:8,maxHp:100,radius:.5,contactIFrames:.6},ability:{kind:`fumaca`,damage:6,cooldown:1,range:2}}],s=[{id:`cone`,name:`Cone Revoltado`,icon:`🚧`,behavior:{kind:`chase`},moveSpeed:3.2,maxHp:20,radius:.45,contactDamage:8,xpValue:1,spawnStateDuration:.4,dyingStateDuration:.25},{id:`rato`,name:`Rato de Entulho`,icon:`🐀`,behavior:{kind:`chase`},moveSpeed:5,maxHp:6,radius:.35,contactDamage:5,xpValue:1,spawnStateDuration:.3,dyingStateDuration:.2},{id:`britadeira`,name:`Britadeira Desgovernada`,icon:`⚒️`,behavior:{kind:`chase`},moveSpeed:1.8,maxHp:90,radius:.7,contactDamage:18,xpValue:6,spawnStateDuration:.6,dyingStateDuration:.35},{id:`pombo`,name:`Pombo de Obra`,icon:`🐦`,behavior:{kind:`flyby`,despawnRadius:40,despawnAfter:15},moveSpeed:7,maxHp:12,radius:.4,contactDamage:10,xpValue:2,spawnStateDuration:.4,dyingStateDuration:.2},{id:`galinha`,name:`Galinha de Quintal`,icon:`🐔`,behavior:{kind:`chase`},moveSpeed:5.4,maxHp:6,radius:.35,contactDamage:5,xpValue:1,spawnStateDuration:.3,dyingStateDuration:.2},{id:`carrinho`,name:`Carrinho de Feira Desembestado`,icon:`🛒`,behavior:{kind:`investida`,windup:.9,chargeTime:1.2},moveSpeed:9.5,maxHp:35,radius:.5,contactDamage:14,xpValue:3,spawnStateDuration:.5,dyingStateDuration:.3},{id:`abacaxi`,name:`Abacaxi Casca-Grossa`,icon:`🍍`,behavior:{kind:`chase`},moveSpeed:1.6,maxHp:110,radius:.75,contactDamage:20,xpValue:7,spawnStateDuration:.6,dyingStateDuration:.35},{id:`maritaca`,name:`Maritaca Tagarela`,icon:`🦜`,behavior:{kind:`flyby`,despawnRadius:40,despawnAfter:13},moveSpeed:8,maxHp:10,radius:.4,contactDamage:9,xpValue:2,spawnStateDuration:.35,dyingStateDuration:.2},{id:`sagui`,name:`Sagui Ladrão de Lanche`,icon:`🐒`,behavior:{kind:`chase`},moveSpeed:5.6,maxHp:6,radius:.35,contactDamage:5,xpValue:1,spawnStateDuration:.3,dyingStateDuration:.2},{id:`bola`,name:`Bola de Futevôlei Possuída`,icon:`🏐`,behavior:{kind:`investida`,windup:.8,chargeTime:1.1},moveSpeed:10,maxHp:30,radius:.5,contactDamage:13,xpValue:3,spawnStateDuration:.5,dyingStateDuration:.3},{id:`coco`,name:`Coco Gelado Rancoroso`,icon:`🥥`,behavior:{kind:`chase`},moveSpeed:1.7,maxHp:120,radius:.75,contactDamage:20,xpValue:7,spawnStateDuration:.6,dyingStateDuration:.35},{id:`urubu`,name:`Urubu de Orla`,icon:`🦅`,behavior:{kind:`flyby`,despawnRadius:40,despawnAfter:13},moveSpeed:8.5,maxHp:10,radius:.4,contactDamage:9,xpValue:2,spawnStateDuration:.35,dyingStateDuration:.2}],c=[{id:`cidade`,name:`Avenida em Obras`,tagline:`Pista urbana, cones de trânsito por todo lado, prédios ao fundo — a obra nunca termina`,playable:!0,arena:{halfSize:60},spawnSchedule:[{fromTime:0,weights:{cone:100}},{fromTime:60,weights:{cone:75,rato:25}},{fromTime:150,weights:{cone:55,rato:30,britadeira:15}},{fromTime:240,weights:{cone:40,rato:30,britadeira:20,pombo:10}},{fromTime:360,weights:{cone:30,rato:30,britadeira:25,pombo:15}}]},{id:`feira`,name:`Feira de Domingo`,tagline:`Barracas de lona, chão de terra batida e carrinho desgovernado — leve o troco e corra`,playable:!0,arena:{halfSize:60},spawnSchedule:[{fromTime:0,weights:{galinha:100}},{fromTime:45,weights:{galinha:70,carrinho:30}},{fromTime:120,weights:{galinha:50,carrinho:30,abacaxi:20}},{fromTime:210,weights:{galinha:35,carrinho:30,abacaxi:20,maritaca:15}},{fromTime:330,weights:{galinha:25,carrinho:30,abacaxi:25,maritaca:20}}]},{id:`rio`,name:`Rio de Janeiro`,tagline:`Cartão-postal com morro de verdade: escale o Corcovado até o Cristo, Pão de Açúcar no horizonte, calçadão de Copacabana — e a fauna da orla no seu pé`,playable:!0,arena:{halfSize:110},spawnSchedule:[{fromTime:0,weights:{sagui:100}},{fromTime:50,weights:{sagui:70,bola:30}},{fromTime:130,weights:{sagui:50,bola:30,coco:20}},{fromTime:220,weights:{sagui:35,bola:30,coco:20,urubu:15}},{fromTime:340,weights:{sagui:25,bola:30,coco:25,urubu:20}}]},{id:`laje`,name:`Festa na Laje`,playable:!1,arena:{halfSize:60}}],l={dropChance:.04,tiers:[{copies:1,damageBonus:.05},{copies:5,damageBonus:.1},{copies:15,damageBonus:.2},{copies:40,damageBonus:.35}]};function u(e,t){let n=0;for(let r of e.tiers)t>=r.copies&&(n=r.damageBonus);return n}function d(e,t){for(let n of e.tiers)if(t<n.copies)return n;return null}var f=[{id:`estreia`,name:`Estreia no Asfalto`,description:`Jogue a sua primeira run`,icon:`🎬`,reward:10,condition:{kind:`runsPlayed`,count:1}},{id:`primeiro-cascudo`,name:`Primeiro Cascudo`,description:`Derrote 1 inimigo`,icon:`👊`,reward:5,condition:{kind:`lifetimeKills`,count:1}},{id:`deja-vu`,name:`Déjà Vu`,description:`Jogue 10 runs`,icon:`🔁`,reward:50,condition:{kind:`runsPlayed`,count:10}},{id:`sindico`,name:`Síndico do Caos`,description:`Jogue 50 runs`,icon:`📋`,reward:150,condition:{kind:`runsPlayed`,count:50}},{id:`cem-na-conta`,name:`Cem na Conta`,description:`Derrote 100 inimigos numa única run`,icon:`💯`,reward:30,condition:{kind:`runKills`,count:100}},{id:`dizimador`,name:`Dizimador de Esquina`,description:`Derrote 400 inimigos numa única run`,icon:`🌪️`,reward:80,condition:{kind:`runKills`,count:400}},{id:`mil-e-uma`,name:`Mil e Uma Utilidades`,description:`Derrote 1.000 inimigos no total`,icon:`🧮`,reward:60,condition:{kind:`lifetimeKills`,count:1e3}},{id:`praga-urbana`,name:`Praga Urbana`,description:`Derrote 10.000 inimigos no total`,icon:`😈`,reward:200,condition:{kind:`lifetimeKills`,count:1e4}},{id:`xo-pombo`,name:`Xô, Pombo!`,description:`Derrote 100 Pombos de Obra`,icon:`🐦`,reward:40,condition:{kind:`lifetimeKills`,count:100,enemyTypeId:`pombo`}},{id:`ferias-pro-britador`,name:`Férias pro Britador`,description:`Derrote 50 Britadeiras Desgovernadas`,icon:`⚒️`,reward:40,condition:{kind:`lifetimeKills`,count:50,enemyTypeId:`britadeira`}},{id:`depenador`,name:`Depenador`,description:`Derrote 100 Galinhas de Quintal`,icon:`🐔`,reward:40,condition:{kind:`lifetimeKills`,count:100,enemyTypeId:`galinha`}},{id:`estacionamento`,name:`Flanelinha Vingador`,description:`Derrote 30 Carrinhos de Feira Desembestados`,icon:`🛒`,reward:40,condition:{kind:`lifetimeKills`,count:30,enemyTypeId:`carrinho`}},{id:`aguenta-mao`,name:`Aguenta Mão`,description:`Sobreviva 5 minutos numa run`,icon:`⏱️`,reward:40,condition:{kind:`runTime`,seconds:300}},{id:`hora-extra`,name:`Hora Extra`,description:`Sobreviva 10 minutos numa run`,icon:`🕙`,reward:120,condition:{kind:`runTime`,seconds:600}},{id:`subiu-na-vida`,name:`Subiu na Vida`,description:`Alcance o nível 10 numa run`,icon:`📈`,reward:30,condition:{kind:`runLevel`,level:10}},{id:`lenda-do-bairro`,name:`Lenda do Bairro`,description:`Alcance o nível 20 numa run`,icon:`👑`,reward:100,condition:{kind:`runLevel`,level:20}},{id:`rapidinha`,name:`Rapidinha`,description:`Morra em menos de 30 segundos (acontece nas melhores famílias)`,icon:`💀`,reward:15,condition:{kind:`runDeathUnder`,seconds:30}},{id:`cliente-da-casa`,name:`Cliente da Casa`,description:`Compre 1 nível de talento na loja`,icon:`🛍️`,reward:20,condition:{kind:`talentRanksBought`,count:1}},{id:`investidor-anjo`,name:`Investidor Anjo`,description:`Compre todos os níveis de um talento`,icon:`😇`,reward:80,condition:{kind:`talentsMaxed`,count:1}},{id:`cacho-cheio`,name:`Cacho Cheio`,description:`Acumule 1.000 bananas ganhas em abates`,icon:`🍌`,reward:100,condition:{kind:`lifetimeBananas`,count:1e3}},{id:`rodizio`,name:`Rodízio de Heróis`,description:`Jogue com os 3 personagens`,icon:`🎭`,reward:40,condition:{kind:`charactersPlayed`,count:3}},{id:`turista-local`,name:`Turista Local`,description:`Jogue nos 2 mapas abertos`,icon:`🗺️`,reward:40,condition:{kind:`mapsPlayed`,count:2}},{id:`colecionador`,name:`Colecionador Iniciante`,description:`Ganhe a sua primeira figurinha do álbum`,icon:`🃏`,reward:20,condition:{kind:`albumCards`,count:1}},{id:`zoologico-urbano`,name:`Zoológico Urbano`,description:`Tenha figurinha de 8 tipos de inimigo diferentes`,icon:`🦁`,reward:60,condition:{kind:`albumTypesCollected`,count:8}},{id:`pagina-virada`,name:`Página Virada`,description:`Complete o set de figurinhas de um inimigo (último degrau)`,icon:`📖`,reward:100,condition:{kind:`albumSetsMaxed`,count:1}}];function p(e,t,n){let r=[];for(let i of e.achievements)n.has(i.id)||m(i.condition,t)&&r.push(i);return r}function m(e,t){switch(e.kind){case`runsPlayed`:return t.runsPlayed>=e.count;case`lifetimeKills`:return e.enemyTypeId===void 0?t.lifetimeKills>=e.count:(t.lifetimeKillsByType[e.enemyTypeId]??0)>=e.count;case`lifetimeBananas`:return t.lifetimeBananas>=e.count;case`runKills`:return t.lastRun!==null&&t.lastRun.kills>=e.count;case`runTime`:return t.lastRun!==null&&t.lastRun.timeSec>=e.seconds;case`runLevel`:return t.lastRun!==null&&t.lastRun.level>=e.level;case`runDeathUnder`:return t.lastRun!==null&&t.lastRun.died&&t.lastRun.timeSec<e.seconds;case`talentRanksBought`:return t.talentRanksBought>=e.count;case`talentsMaxed`:return t.talentsMaxed>=e.count;case`charactersPlayed`:return t.charactersPlayed>=e.count;case`mapsPlayed`:return t.mapsPlayed>=e.count;case`albumCards`:return t.albumCards>=e.count;case`albumTypesCollected`:return t.albumTypesCollected>=e.count;case`albumSetsMaxed`:return t.albumSetsMaxed>=e.count;default:throw Error(`condição de conquista sem caso: ${JSON.stringify(e)}`)}}var h=1/60,g={enemies:{maxAlive:600},enemyTypes:s,spawn:{baseRatePerSec:2,rateGrowthPerMinute:4.5,ringMinRadius:24,ringMaxRadius:32},xp:{maxOrbs:1024,collectRadius:.8,magnetRadius:3.5,magnetSpeed:12,baseToNext:5,growthPerLevel:1.3},characters:o,maps:c,upgrades:t,talents:i,bananas:{perKill:1},album:l,achievements:f,orelhoes:{firstAtSec:25,intervalSec:45,killRequirements:[5,15,30,60,100,150],answerRadius:1.8}},_=new Set([`gameData.upgrades`,`gameData.talents`,`gameData.characters`,`gameData.maps`,`gameData.enemyTypes`,`gameData.album`,`gameData.achievements`]);function v(e){A(e,`gameData`),y(e),C(e),w(e),T(e),E(e),D(e),O(e);let t=e.orelhoes.killRequirements;M(t.length>0,`gameData.orelhoes.killRequirements não pode ser vazio`);for(let e=1;e<t.length;e++)M(t[e]>t[e-1],`gameData.orelhoes.killRequirements deve ser estritamente crescente`);let{enemies:n,spawn:r,xp:i}=e;M(i.growthPerLevel>1,`gameData.xp.growthPerLevel deve ser > 1`),M(r.ringMinRadius<r.ringMaxRadius,`gameData.spawn.ringMinRadius deve ser < ringMaxRadius`),M(Number.isInteger(n.maxAlive)&&n.maxAlive<=4096,`gameData.enemies.maxAlive deve ser inteiro <= 4096`),M(Number.isInteger(i.maxOrbs)&&i.maxOrbs<=8192,`gameData.xp.maxOrbs deve ser inteiro <= 8192`),M(i.collectRadius<i.magnetRadius,`gameData.xp.collectRadius deve ser < magnetRadius`)}function y(e){let t=e.enemyTypes;M(t.length>0,`gameData.enemyTypes não pode ser vazio`),M(t.length<=256,`gameData.enemyTypes: máximo 256 tipos (typeIndex é Uint8Array)`);let n=new Set;for(let r=0;r<t.length;r++){let i=t[r],a=`gameData.enemyTypes[${r}] (${i.id||`?`})`;if(M(i.id.length>0,`${a}: id vazio`),M(!n.has(i.id),`${a}: id duplicado`),n.add(i.id),M(i.name.length>0,`${a}: name vazio`),M(i.icon.length>0,`${a}: icon vazio`),j(i.moveSpeed,`${a}.moveSpeed`),j(i.maxHp,`${a}.maxHp`),j(i.radius,`${a}.radius`),j(i.contactDamage,`${a}.contactDamage`),j(i.xpValue,`${a}.xpValue`),j(i.spawnStateDuration,`${a}.spawnStateDuration`),j(i.dyingStateDuration,`${a}.dyingStateDuration`),i.behavior.kind===`flyby`){j(i.behavior.despawnRadius,`${a}.behavior.despawnRadius`),j(i.behavior.despawnAfter,`${a}.behavior.despawnAfter`);for(let t of e.maps)t.playable&&M(i.behavior.despawnRadius<=t.arena.halfSize,`${a}.behavior.despawnRadius deve ser <= arena.halfSize do mapa jogável '${t.id}'`)}else i.behavior.kind===`investida`&&(j(i.behavior.windup,`${a}.behavior.windup`),j(i.behavior.chargeTime,`${a}.behavior.chargeTime`))}}function b(e,t,n){M(t.length>0,`${n} não pode ser vazio`);let r=new Set(e.enemyTypes.map(e=>e.id));for(let e=0;e<t.length;e++){let i=t[e],a=`${n}[${e}]`;M(Number.isFinite(i.fromTime)&&i.fromTime>=0,`${a}.fromTime deve ser finito e >= 0`),e===0?M(i.fromTime===0,`${a}.fromTime deve começar em 0`):M(i.fromTime>t[e-1].fromTime,`${a}.fromTime deve ser estritamente crescente`);let o=0;for(let[e,t]of Object.entries(i.weights))M(r.has(e),`${a}.weights: tipo desconhecido (${e})`),M(Number.isFinite(t)&&t>=0,`${a}.weights.${e} deve ser finito e >= 0`),o+=t;M(o>0,`${a}.weights: soma dos pesos deve ser > 0`)}}function x(e){let t=0;for(let n of e.enemyTypes)n.radius>t&&(t=n.radius);return t}function S(e){let t=1/0;for(let n of e.enemyTypes)n.radius<t&&(t=n.radius);return t}function C(e){let t=e.characters;M(t.length>0,`gameData.characters não pode ser vazio`);let n=new Set;for(let r=0;r<t.length;r++){let i=t[r],a=`gameData.characters[${r}] (${i.id||`?`})`;M(i.id.length>0,`${a}: id vazio`),M(!n.has(i.id),`${a}: id duplicado`),n.add(i.id),M(i.name.length>0,`${a}: name vazio`),M(i.tagline.length>0,`${a}: tagline vazia`),A(i.stats,`${a}.stats`);let o=i.ability;j(o.damage,`${a}.ability.damage`),j(o.cooldown,`${a}.ability.cooldown`),j(o.range,`${a}.ability.range`),o.kind===`mordida`||o.kind===`fumaca`?M(o.range>i.stats.radius+x(e),`${a}.ability.range deve ser maior que stats.radius + MAX(enemyTypes.radius)`):(j(o.projectileSpeed,`${a}.ability.projectileSpeed`),j(o.cardRadius,`${a}.ability.cardRadius`),M(Number.isInteger(o.maxLive)&&o.maxLive>=1&&o.maxLive<=128,`${a}.ability.maxLive deve ser inteiro em [1, 128]`),M(o.maxLive<=32,`${a}.ability.maxLive deve ser <= CARD_POOL_CAPACITY (32)`),M(o.projectileSpeed*h<o.cardRadius+S(e),`${a}.ability.projectileSpeed causa tunneling: projectileSpeed × SIM_DT deve ser < cardRadius + MIN(enemyTypes.radius)`))}}function w(e){let t=e.maps;M(t.length>0,`gameData.maps não pode ser vazio`);let n=new Set,r=0;for(let i=0;i<t.length;i++){let a=t[i],o=`gameData.maps[${i}] (${a.id||`?`})`;M(a.id.length>0,`${o}: id vazio`),M(!n.has(a.id),`${o}: id duplicado`),n.add(a.id),M(a.name.length>0,`${o}: name vazio`),a.tagline!==void 0&&M(a.tagline.length>0,`${o}: tagline vazia (omita o campo se não há descrição)`),j(a.arena.halfSize,`${o}.arena.halfSize`),a.playable?(r++,M(e.spawn.ringMaxRadius<a.arena.halfSize,`${o}: spawn.ringMaxRadius deve ser < arena.halfSize`),M(a.spawnSchedule!==void 0,`${o}: mapa jogável precisa de spawnSchedule`),b(e,a.spawnSchedule,`${o}.spawnSchedule`)):a.spawnSchedule!==void 0&&b(e,a.spawnSchedule,`${o}.spawnSchedule`)}M(r>=1,`gameData.maps deve ter ao menos 1 mapa jogável`)}function T(t){let i=t.upgrades;M(i.length>0,`gameData.upgrades não pode ser vazio`);let a=new Set(t.characters.map(e=>e.id)),o=new Set,s=new Set(e),c=0;for(let e=0;e<i.length;e++){let r=i[e],l=`gameData.upgrades[${e}] (${r.id||`?`})`;M(r.id.length>0,`${l}: id vazio`),M(!o.has(r.id),`${l}: id duplicado`),o.add(r.id),M(r.name.length>0,`${l}: name vazio`),M(r.effectLine.length>0,`${l}: effectLine vazia`),M(r.effect!==void 0||r.healOnPick!==void 0,`${l}: melhoria sem efeito contínuo nem cura instantânea`),r.characterId!==void 0&&M(a.has(r.characterId),`${l}: characterId desconhecido (${r.characterId})`),r.healOnPick!==void 0&&M(Number.isFinite(r.healOnPick)&&r.healOnPick>0,`${l}: healOnPick deve ser finito e > 0`),r.isFallback===!0?(c++,M(r.maxStacks===1/0,`${l}: fallback deve ter maxStacks Infinity`),M(r.effect===void 0,`${l}: fallback não pode ter efeito contínuo`)):M(Number.isInteger(r.maxStacks)&&r.maxStacks>=1,`${l}: maxStacks deve ser inteiro >= 1`);let u=r.effect;if(u!==void 0&&(M(s.has(u.stat),`${l}: stat desconhecido (${u.stat})`),M(Number.isFinite(u.percentPerStack)&&Number.isFinite(u.flatPerStack),`${l}: percentPerStack e flatPerStack devem ser finitos`),M(u.percentPerStack!==0||u.flatPerStack!==0,`${l}: efeito sem percentual nem valor absoluto`),u.min!==void 0&&u.max!==void 0&&M(u.min<u.max,`${l}: min deve ser < max`),u.flatPerStack===0))for(let e of t.characters)(r.characterId===void 0||r.characterId===e.id)&&M(n(t,e,u.stat)!==0,`${l}: efeito só-percentual sobre stat de base 0 (${u.stat}) é no-op`)}M(c===1,`gameData.upgrades deve ter exatamente 1 fallback (tem ${c})`);for(let a of t.characters){let o=i.map(e=>e.isFallback===!0||e.characterId!==void 0&&e.characterId!==a.id?0:e.maxStacks);for(let i of e){let e=r(t,a,i,o);n(t,a,i)===0?M(e>=0,`gameData.upgrades: stat ${i} fica < 0 (${e}) com todos os stacks no teto (personagem ${a.id})`):M(e>0,`gameData.upgrades: stat ${i} fica <= 0 (${e}) com todos os stacks no teto (personagem ${a.id})`)}}}function E(t){let i=t.talents,a=new Set,o=new Set(e);for(let e=0;e<i.length;e++){let r=i[e],s=`gameData.talents[${e}] (${r.id||`?`})`;M(r.id.length>0,`${s}: id vazio`),M(!a.has(r.id),`${s}: id duplicado`),a.add(r.id),M(r.name.length>0,`${s}: name vazio`),M(r.effectLine.length>0,`${s}: effectLine vazia`),M(r.icon.length>0,`${s}: icon vazio`),M(Number.isInteger(r.maxRank)&&r.maxRank>=1,`${s}: maxRank deve ser inteiro >= 1`),M(r.costPerRank.length===r.maxRank,`${s}: costPerRank deve ter maxRank entradas (tem ${r.costPerRank.length})`);for(let e=0;e<r.costPerRank.length;e++){let t=r.costPerRank[e];M(Number.isInteger(t)&&t>0,`${s}: costPerRank[${e}] deve ser inteiro > 0`),e>0&&M(t>=r.costPerRank[e-1],`${s}: costPerRank não pode decrescer (nível ${e+1} mais barato que o ${e})`)}let c=r.effect;if(M(o.has(c.stat),`${s}: stat desconhecido (${c.stat})`),M(Number.isFinite(c.percentPerStack)&&Number.isFinite(c.flatPerStack),`${s}: percentPerStack e flatPerStack devem ser finitos`),M(c.percentPerStack!==0||c.flatPerStack!==0,`${s}: efeito sem percentual nem valor absoluto`),c.min!==void 0&&c.max!==void 0&&M(c.min<c.max,`${s}: min deve ser < max`),c.flatPerStack===0)for(let e of t.characters)M(n(t,e,c.stat)!==0,`${s}: efeito só-percentual sobre stat de base 0 (${c.stat}) é no-op`)}let s=i.map(e=>e.maxRank);for(let i of t.characters){let a=t.upgrades.map(e=>e.isFallback===!0||e.characterId!==void 0&&e.characterId!==i.id?0:e.maxStacks);for(let o of e){let e=r(t,i,o,a,s);n(t,i,o)===0?M(e>=0,`gameData.talents: stat ${o} fica < 0 (${e}) com melhorias e talentos no teto (personagem ${i.id})`):M(e>0,`gameData.talents: stat ${o} fica <= 0 (${e}) com melhorias e talentos no teto (personagem ${i.id})`)}}}function D(e){let t=e.album;M(Number.isFinite(t.dropChance)&&t.dropChance>0&&t.dropChance<=1,`gameData.album.dropChance deve estar em (0, 1]`),M(t.tiers.length>0,`gameData.album.tiers não pode ser vazio`);for(let e=0;e<t.tiers.length;e++){let n=t.tiers[e],r=`gameData.album.tiers[${e}]`;M(Number.isInteger(n.copies)&&n.copies>=1,`${r}.copies deve ser inteiro >= 1`),M(Number.isFinite(n.damageBonus)&&n.damageBonus>0,`${r}.damageBonus deve ser finito e > 0`),e>0&&(M(n.copies>t.tiers[e-1].copies,`${r}.copies deve ser estritamente crescente`),M(n.damageBonus>t.tiers[e-1].damageBonus,`${r}.damageBonus deve ser estritamente crescente`))}M(u(t,t.tiers[0].copies-1)===0,`gameData.album: cópias abaixo do 1º degrau devem dar bônus 0`)}function O(e){let t=e.achievements;M(t.length>0,`gameData.achievements não pode ser vazio`);let n=new Set(e.enemyTypes.map(e=>e.id)),r=new Set;for(let e=0;e<t.length;e++){let i=t[e],a=`gameData.achievements[${e}] (${i.id||`?`})`;M(i.id.length>0,`${a}: id vazio`),M(!r.has(i.id),`${a}: id duplicado`),r.add(i.id),M(i.name.length>0,`${a}: name vazio`),M(i.description.length>0,`${a}: description vazia`),M(i.icon.length>0,`${a}: icon vazio`),M(Number.isInteger(i.reward)&&i.reward>=0,`${a}: reward deve ser inteiro >= 0`);let o=i.condition;switch(o.kind){case`lifetimeKills`:o.enemyTypeId!==void 0&&M(n.has(o.enemyTypeId),`${a}: enemyTypeId desconhecido (${o.enemyTypeId})`),k(o.count,`${a}.condition.count`);break;case`runsPlayed`:case`lifetimeBananas`:case`runKills`:case`talentRanksBought`:case`talentsMaxed`:case`charactersPlayed`:case`mapsPlayed`:case`albumCards`:case`albumTypesCollected`:case`albumSetsMaxed`:k(o.count,`${a}.condition.count`);break;case`runTime`:case`runDeathUnder`:j(o.seconds,`${a}.condition.seconds`);break;case`runLevel`:k(o.level,`${a}.condition.level`);break;default:throw Error(`${a}: condição sem validação: ${JSON.stringify(o)}`)}}}function k(e,t){if(!Number.isInteger(e)||e<1)throw Error(`${t} deve ser inteiro >= 1 (recebeu ${e})`)}function A(e,t){for(let[n,r]of Object.entries(e)){let e=`${t}.${n}`;if(!_.has(e)){if(typeof r==`number`)j(r,e);else if(typeof r==`object`&&r)A(r,e);else throw Error(`${e} tem tipo inesperado (${typeof r})`)}}}function j(e,t){if(!Number.isFinite(e)||e<=0)throw Error(`${t} deve ser um número finito e positivo (recebeu ${e})`)}function M(e,t){if(!e)throw Error(t)}function N(e){let t=e>>>0;return{next(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}}var P={Spawning:0,Chasing:1,Dying:2},ee={Outgoing:0,Returning:1};function te(e){return{capacity:e,count:0,posX:new Float32Array(e),posZ:new Float32Array(e),prevX:new Float32Array(e),prevZ:new Float32Array(e),hp:new Float32Array(e),state:new Uint8Array(e),stateTime:new Float32Array(e),typeIndex:new Uint8Array(e),dirX:new Float32Array(e),dirZ:new Float32Array(e),projectileHitCooldown:new Float32Array(e),hitTick:new Int32Array(e).fill(-1),hitDamage:new Float32Array(e),hitCrit:new Uint8Array(e)}}function ne(e){if(e.count>=e.capacity)return-1;let t=e.count;return e.count++,e.state[t]=P.Spawning,e.stateTime[t]=0,e.projectileHitCooldown[t]=0,e.hitTick[t]=-1,e.hitDamage[t]=0,e.hitCrit[t]=0,t}function re(e,t){let n=e.count-1;t!==n&&(e.posX[t]=e.posX[n],e.posZ[t]=e.posZ[n],e.prevX[t]=e.prevX[n],e.prevZ[t]=e.prevZ[n],e.hp[t]=e.hp[n],e.state[t]=e.state[n],e.stateTime[t]=e.stateTime[n],e.typeIndex[t]=e.typeIndex[n],e.dirX[t]=e.dirX[n],e.dirZ[t]=e.dirZ[n],e.projectileHitCooldown[t]=e.projectileHitCooldown[n],e.hitTick[t]=e.hitTick[n],e.hitDamage[t]=e.hitDamage[n],e.hitCrit[t]=e.hitCrit[n]),e.count=n}function ie(e){return{capacity:e,count:0,posX:new Float32Array(e),posZ:new Float32Array(e),prevX:new Float32Array(e),prevZ:new Float32Array(e),xpValue:new Float32Array(e)}}function ae(e){if(e.count>=e.capacity)return-1;let t=e.count;return e.count++,t}function oe(e,t){let n=e.count-1;t!==n&&(e.posX[t]=e.posX[n],e.posZ[t]=e.posZ[n],e.prevX[t]=e.prevX[n],e.prevZ[t]=e.prevZ[n],e.xpValue[t]=e.xpValue[n]),e.count=n}function se(e){return{capacity:e,count:0,posX:new Float32Array(e),posZ:new Float32Array(e),prevX:new Float32Array(e),prevZ:new Float32Array(e),dirX:new Float32Array(e),dirZ:new Float32Array(e),traveled:new Float32Array(e),age:new Float32Array(e),phase:new Uint8Array(e)}}function ce(e){if(e.count>=e.capacity)return-1;let t=e.count;return e.count++,e.traveled[t]=0,e.age[t]=0,e.phase[t]=ee.Outgoing,t}function le(e,t){let n=e.count-1;t!==n&&(e.posX[t]=e.posX[n],e.posZ[t]=e.posZ[n],e.prevX[t]=e.prevX[n],e.prevZ[t]=e.prevZ[n],e.dirX[t]=e.dirX[n],e.dirZ[t]=e.dirZ[n],e.traveled[t]=e.traveled[n],e.age[t]=e.age[n],e.phase[t]=e.phase[n]),e.count=n}function ue(e,t,n,r){let i={abilityDamage:0,abilityRange:0,abilityCooldown:0,critChance:0,knockback:0,moveSpeed:0,maxHp:0,contactIFrames:0,contactArmor:0,hpRegenPerSec:0,playerRadius:0,magnetRadius:0,xpGainMultiplier:0};return fe(e,t,n,r,i),i}function de(e){let t=e.data.characters[e.characterIndex];fe(e.data,t,e.upgradeStacks,e.talentRanks,e.stats)}function fe(e,t,n,i,a){a.abilityDamage=r(e,t,`ability.damage`,n,i),a.abilityRange=r(e,t,`ability.range`,n,i),a.abilityCooldown=r(e,t,`ability.cooldown`,n,i),a.critChance=r(e,t,`ability.critChance`,n,i),a.knockback=r(e,t,`ability.knockback`,n,i),a.moveSpeed=r(e,t,`player.moveSpeed`,n,i),a.maxHp=r(e,t,`player.maxHp`,n,i),a.contactIFrames=r(e,t,`player.contactIFrames`,n,i),a.contactArmor=r(e,t,`player.contactArmor`,n,i),a.hpRegenPerSec=r(e,t,`player.hpRegen`,n,i),a.playerRadius=t.stats.radius,a.magnetRadius=r(e,t,`xp.magnetRadius`,n,i),a.xpGainMultiplier=r(e,t,`xp.gainMultiplier`,n,i)}function pe(e){e.status===`running`&&(e.status=`gameOver`)}function me(e,t){return e.xp.baseToNext*e.xp.growthPerLevel**(t-1)}function he(e,t){return t.map(t=>{let n=[],r=[],i=0;for(let a=0;a<e.enemyTypes.length;a++){let o=t.weights[e.enemyTypes[a].id];o===void 0||o<=0||(i+=o,n.push(a),r.push(i))}return{fromTime:t.fromTime,typeIndices:n,cumulativeWeights:r}})}function ge(e,t,n){let r=e.characters.findIndex(e=>e.id===n.characterId);if(r<0)throw Error(`personagem desconhecido: ${n.characterId}`);let i=e.characters[r],a=n.mapId===void 0?e.maps.find(e=>e.playable):e.maps.find(e=>e.id===n.mapId);if(a===void 0)throw Error(`mapa desconhecido: ${n.mapId??`(nenhum jogável)`}`);if(!a.playable)throw Error(`mapa não jogável: ${a.id}`);if(a.spawnSchedule===void 0)throw Error(`mapa jogável sem spawnSchedule: ${a.id}`);let o=n.talentRanks??Array(e.talents.length).fill(0);if(o.length!==e.talents.length)throw Error(`talentRanks com tamanho ${o.length}; esperado ${e.talents.length}`);let s=n.albumCopies??Array(e.enemyTypes.length).fill(0);if(s.length!==e.enemyTypes.length)throw Error(`albumCopies com tamanho ${s.length}; esperado ${e.enemyTypes.length}`);let c=s.map(t=>1+u(e.album,t)),l=Array(e.upgrades.length).fill(0),d=ue(e,i,l,o);return{data:e,rng:t,characterIndex:r,ability:i.ability,mapId:a.id,arenaHalfSize:a.arena.halfSize,spawnSchedule:he(e,a.spawnSchedule),tickCount:0,time:0,status:`running`,player:{x:0,z:0,prevX:0,prevZ:0,facingX:0,facingZ:1,hp:d.maxHp,level:1,xp:0,xpToNext:me(e,1),abilityCooldown:0,invulnTimer:0,state:`alive`,jumpOffset:0,jumpVelocity:0,prevJumpOffset:0,lastHitTick:-1,lastHitDamage:0},enemies:te(e.enemies.maxAlive),orbs:ie(e.xp.maxOrbs),cards:se(32),events:[],spawnAccumulator:0,upgradeStacks:l,talentRanks:o,bananasEarned:0,kills:0,killsByType:Array(e.enemyTypes.length).fill(0),cardsEarned:Array(e.enemyTypes.length).fill(0),albumDamageMult:c,dropRng:N((n.dropSeed??20261119)>>>0),orelhoes:[],orelhaoRng:N(((n.dropSeed??20261119)>>>0^4071182)>>>0),pendingLevelUps:0,upgradeChoice:null,stats:d}}function _e(e,t){for(let n=0;n<e.upgrades.length;n++)if(e.upgrades[n].id===t)return n;throw Error(`melhoria desconhecida: ${t}`)}function ve(e,t){let n=e.data.upgrades[t];if(n===void 0)throw Error(`índice de melhoria fora da tabela: ${t}`);let r=e.data.characters[e.characterIndex].id;if(n.characterId!==void 0&&n.characterId!==r)throw Error(`melhoria ${n.id} é exclusiva do personagem ${n.characterId} (equipado: ${r})`);if(e.upgradeStacks[t]>=n.maxStacks)throw Error(`melhoria ${n.id} já está no teto de ${n.maxStacks} stacks`);e.upgradeStacks[t]++,de(e),n.healOnPick!==void 0&&(e.player.hp=Math.min(e.player.hp+n.healOnPick,e.stats.maxHp))}function ye(e,t){for(let n of t)ve(e,_e(e.data,n))}function be(e,t){let n=e.upgradeChoice;if(n===null)throw Error(`chooseUpgrade sem escolha aberta`);if(!Number.isInteger(t)||t<0||t>=n.options.length)throw Error(`opção inválida: ${t} (há ${n.options.length} opções)`);ve(e,n.options[t]),e.pendingLevelUps--,e.upgradeChoice=null,Se(e)}function xe(e){let t=e.upgradeChoice;if(t===null)throw Error(`rerollChoice sem escolha aberta`);if(!t.rerollAvailable)throw Error(`reroll já usado nesta escolha`);t.options=Ce(e),t.rerollAvailable=!1}function Se(e){e.status===`running`&&e.upgradeChoice===null&&e.pendingLevelUps!==0&&(e.upgradeChoice={options:Ce(e),rerollAvailable:!0})}function Ce(e){let{data:t,rng:n,upgradeStacks:r}=e,i=t.characters[e.characterIndex].id,a=[],o=-1;for(let e=0;e<t.upgrades.length;e++){let n=t.upgrades[e];n.isFallback===!0?o=e:r[e]<n.maxStacks&&(n.characterId===void 0||n.characterId===i)&&a.push(e)}if(a.length===0)return[o];let s=Math.min(3,a.length);for(let e=0;e<s;e++){let t=e+Math.floor(n.next()*(a.length-e)),r=a[e];a[e]=a[t],a[t]=r}return a.length=s,a}function F(e,t){let n=-e.moveZ,r=e.moveX,i=Math.sin(t),a=Math.cos(t);return e.moveX=n*i-r*a,e.moveZ=n*a+r*i,e}function we(e){let t=new Set,n={moveX:0,moveZ:0,jump:!1},r=e=>{t.add(e.code)},i=e=>{t.delete(e.code)},a=()=>{t.clear()};return e.addEventListener(`keydown`,r),e.addEventListener(`keyup`,i),e.addEventListener(`blur`,a),{sample(){let e=0,r=0;(t.has(`KeyA`)||t.has(`ArrowLeft`))&&--e,(t.has(`KeyD`)||t.has(`ArrowRight`))&&(e+=1),(t.has(`KeyW`)||t.has(`ArrowUp`))&&--r,(t.has(`KeyS`)||t.has(`ArrowDown`))&&(r+=1);let i=Math.hypot(e,r);return i>1&&(e/=i,r/=i),n.moveX=e,n.moveZ=r,n.jump=t.has(`Space`),n},dispose(){e.removeEventListener(`keydown`,r),e.removeEventListener(`keyup`,i),e.removeEventListener(`blur`,a)}}}var Te=.0025,Ee=-.05,I=1.3,De=.4;function L(e){let t=0,n=De,r=Te,i=()=>{if(document.pointerLockElement!==e)try{e.requestPointerLock()?.catch?.(()=>{})}catch{}},a=i=>{document.pointerLockElement===e&&(t-=i.movementX*r,n+=i.movementY*r,n<Ee&&(n=Ee),n>I&&(n=I))};return e.addEventListener(`click`,i),document.addEventListener(`mousemove`,a),{get yaw(){return t},get pitch(){return n},lock(){i()},unlock(){document.pointerLockElement===e&&document.exitPointerLock()},setSensitivity(e){!Number.isFinite(e)||e<=0||(r=Te*e)},dispose(){e.removeEventListener(`click`,i),document.removeEventListener(`mousemove`,a)}}}var R=.05;function Oe(){let e=-1,t=1e3/60,n=0,r=0;return{recordFrame(n){if(e>=0){let r=n-e;t+=(r-t)*R}e=n},recordSim(e){n+=(e-n)*R},recordRender(e){r+=(e-r)*R},get fps(){return 1e3/t},get simMs(){return n},get renderMs(){return r}}}var ke=9,Ae=19;function je(e,t,n){let{player:r}=e,i=t.moveX,a=t.moveZ,o=Math.hypot(i,a);if(o>1&&(i/=o,a/=o),o>0){r.x+=i*e.stats.moveSpeed*n,r.z+=a*e.stats.moveSpeed*n;let t=Math.hypot(i,a);r.facingX=i/t,r.facingZ=a/t}let s=e.arenaHalfSize-e.stats.playerRadius;r.x>s&&(r.x=s),r.x<-s&&(r.x=-s),r.z>s&&(r.z=s),r.z<-s&&(r.z=-s),t.jump===!0&&r.jumpOffset===0&&r.jumpVelocity<=0&&(r.jumpVelocity=ke),(r.jumpOffset>0||r.jumpVelocity>0)&&(r.jumpVelocity-=Ae*n,r.jumpOffset+=r.jumpVelocity*n,r.jumpOffset<=0&&(r.jumpOffset=0,r.jumpVelocity=0))}function Me(e,t){let{player:n,stats:r}=e;if(n.state!==`alive`)return;let i=r.hpRegenPerSec;i!==0&&(n.hp=Math.min(r.maxHp,n.hp+i*t))}var Ne=Math.PI*2,Pe=1e-6;function Fe(e,t){let{data:n,enemies:r,player:i,rng:a}=e,o=n.spawn.baseRatePerSec+n.spawn.rateGrowthPerMinute*(e.time/60);e.spawnAccumulator+=o*t;let s=Ie(e);for(;e.spawnAccumulator>=1&&r.count<r.capacity;){--e.spawnAccumulator;let t=ne(r);if(t<0)break;let o=Le(s,a.next()),c=n.enemyTypes[o],l=a.next()*Ne,u=n.spawn.ringMinRadius+a.next()*(n.spawn.ringMaxRadius-n.spawn.ringMinRadius),d=e.arenaHalfSize-c.radius,f=Re(i.x+Math.cos(l)*u,-d,d),p=Re(i.z+Math.sin(l)*u,-d,d);r.posX[t]=f,r.posZ[t]=p,r.prevX[t]=f,r.prevZ[t]=p,r.hp[t]=c.maxHp,r.typeIndex[t]=o;let m=i.x-f,h=i.z-p,g=Math.hypot(m,h);r.dirX[t]=g>Pe?m/g:0,r.dirZ[t]=g>Pe?h/g:1}e.spawnAccumulator>1&&(e.spawnAccumulator=1)}function Ie(e){let t=e.spawnSchedule;for(let n=t.length-1;n>=0;n--)if(t[n].fromTime<=e.time)return t[n];return t[0]}function Le(e,t){let n=e.cumulativeWeights,r=t*n[n.length-1];for(let t=0;t<n.length;t++)if(r<n[t])return e.typeIndices[t];return e.typeIndices[e.typeIndices.length-1]}function Re(e,t,n){return e<t?t:e>n?n:e}function ze(e,t){return e<-t?-t:e>t?t:e}function Be(e,t){let{enemies:n,orbs:r,player:i,data:a}=e,o=a.enemyTypes;for(let a=n.count-1;a>=0;a--){n.stateTime[a]=n.stateTime[a]+t;let s=n.state[a],c=o[n.typeIndex[a]];if(s===P.Spawning)n.stateTime[a]>=c.spawnStateDuration&&(n.state[a]=P.Chasing,n.stateTime[a]=0);else if(s===P.Chasing){let r=c.behavior;switch(r.kind){case`chase`:{let e=i.x-n.posX[a],r=i.z-n.posZ[a],o=Math.hypot(e,r);if(o>1e-4){let i=c.moveSpeed*t;n.posX[a]=n.posX[a]+e/o*i,n.posZ[a]=n.posZ[a]+r/o*i}break}case`investida`:{let o=r.windup+r.chargeTime;if(n.stateTime[a]%o<r.windup){let e=i.x-n.posX[a],t=i.z-n.posZ[a],r=Math.hypot(e,t);r>1e-4&&(n.dirX[a]=e/r,n.dirZ[a]=t/r)}else{let r=c.moveSpeed*t,i=e.arenaHalfSize-c.radius;n.posX[a]=ze(n.posX[a]+n.dirX[a]*r,i),n.posZ[a]=ze(n.posZ[a]+n.dirZ[a]*r,i)}break}case`flyby`:{let e=c.moveSpeed*t,i=n.posX[a]+n.dirX[a]*e,o=n.posZ[a]+n.dirZ[a]*e;n.posX[a]=i,n.posZ[a]=o;let s=n.dirX[a]*i+n.dirZ[a]*o>0;(i*i+o*o>r.despawnRadius*r.despawnRadius&&s||n.stateTime[a]>r.despawnAfter)&&re(n,a);break}default:throw Error(`comportamento sem caso: ${JSON.stringify(r)}`)}}else if(n.stateTime[a]>=c.dyingStateDuration){let e=ae(r);e>=0&&(r.posX[e]=n.posX[a],r.posZ[e]=n.posZ[a],r.prevX[e]=n.posX[a],r.prevZ[e]=n.posZ[a],r.xpValue[e]=c.xpValue),re(n,a)}}}var Ve=1e-6;function He(e){let t=e.stats.critChance;return t!==0&&e.rng.next()<t}function Ue(e,t){let n=e.stats.knockback;if(n===0)return;let{player:r,enemies:i,data:a}=e,o=i.posX[t]-r.x,s=i.posZ[t]-r.z,c=Math.hypot(o,s),l=c>Ve?o/c:r.facingX,u=c>Ve?s/c:r.facingZ,d=a.enemyTypes[i.typeIndex[t]],f=e.arenaHalfSize-d.radius;i.posX[t]=$e(i.posX[t]+l*n,-f,f),i.posZ[t]=$e(i.posZ[t]+u*n,-f,f)}var We=0,Ge=0,Ke=0,qe=0,Je=[],Ye=[];function Xe(){We=0,Ge=0,Je.length=0,Ye.length=0}function Ze(e,t){let{enemies:n,stats:r}=e,i=n.typeIndex[t],a=He(e);We===0&&(Ke=n.posX[t],qe=n.posZ[t]),We++,a&&Ge++;let o=r.abilityDamage*(a?2:1)*e.albumDamageMult[i];n.hp[t]=n.hp[t]-o,n.hitTick[t]=e.tickCount,n.hitDamage[t]=o,n.hitCrit[t]=+!!a,Ue(e,t),n.hp[t]<=0&&(n.state[t]=P.Dying,n.stateTime[t]=0,Je.push(n.posX[t]),Ye.push(n.posZ[t]),e.bananasEarned+=e.data.bananas.perKill,e.kills++,e.killsByType[i]=e.killsByType[i]+1,e.dropRng.next()<e.data.album.dropChance&&(e.cardsEarned[i]=e.cardsEarned[i]+1))}function Qe(e){if(We!==0){e.events.push({type:`enemyHit`,count:We,critCount:Ge,x:Ke,z:qe});for(let t=0;t<Je.length;t++)e.events.push({type:`enemyDied`,x:Je[t],z:Ye[t]})}}function $e(e,t,n){return e<t?t:e>n?n:e}function et(e,t){let{player:n,stats:r}=e;if(n.abilityCooldown-=t,n.abilityCooldown>0)return;let i=tt(e);i<0?n.abilityCooldown=0:(n.abilityCooldown+=r.abilityCooldown,e.events.push({type:`biteFired`}),Xe(),Ze(e,i),Qe(e))}function tt(e){let{player:t,enemies:n,stats:r}=e,i=r.abilityRange*r.abilityRange,a=-1,o=1/0;for(let e=0;e<n.count;e++){if(n.state[e]!==P.Chasing)continue;let r=n.posX[e]-t.x,s=n.posZ[e]-t.z,c=r*r+s*s;c>i||c>=o||(o=c,a=e)}return a}var nt=1e-6;function rt(e,t){let n=e.ability;if(n.kind!==`cartas`)throw Error(`updateCardAbility com habilidade '${n.kind}'`);let{player:r,enemies:i,cards:a,stats:o}=e;for(let e=0;e<i.count;e++)i.projectileHitCooldown[e]>0&&(i.projectileHitCooldown[e]=i.projectileHitCooldown[e]-t);r.abilityCooldown-=t,r.abilityCooldown<=0&&(r.abilityCooldown=it(e,n)?r.abilityCooldown+o.abilityCooldown:0);let s=o.playerRadius+n.cardRadius,c=s*s,l=n.projectileSpeed*t;for(let i=a.count-1;i>=0;i--)if(a.age[i]=a.age[i]+t,a.age[i]>=3)le(a,i);else{if(a.phase[i]===ee.Outgoing)a.posX[i]=a.posX[i]+a.dirX[i]*l,a.posZ[i]=a.posZ[i]+a.dirZ[i]*l,a.traveled[i]=a.traveled[i]+l,a.traveled[i]>=o.abilityRange&&(a.phase[i]=ee.Returning);else{let e=r.x-a.posX[i],t=r.z-a.posZ[i],n=Math.hypot(e,t);n>nt&&(a.dirX[i]=e/n,a.dirZ[i]=t/n);let o=l<n?l:n;a.posX[i]=a.posX[i]+a.dirX[i]*o,a.posZ[i]=a.posZ[i]+a.dirZ[i]*o;let s=r.x-a.posX[i],u=r.z-a.posZ[i];if(s*s+u*u<=c){le(a,i);continue}}at(e,i,n.cardRadius)}}function it(e,t){let{player:n,enemies:r,cards:i,stats:a}=e;if(i.count>=t.maxLive)return!1;let o=a.abilityRange*a.abilityRange,s=-1,c=1/0;for(let e=0;e<r.count;e++){if(r.state[e]!==P.Chasing)continue;let t=r.posX[e]-n.x,i=r.posZ[e]-n.z,a=t*t+i*i;a>o||a>=c||(c=a,s=e)}if(s<0)return!1;let l=ce(i);if(l<0)return!1;let u=r.posX[s]-n.x,d=r.posZ[s]-n.z,f=Math.hypot(u,d),p=f>nt?u/f:n.facingX,m=f>nt?d/f:n.facingZ;return i.posX[l]=n.x,i.posZ[l]=n.z,i.prevX[l]=n.x,i.prevZ[l]=n.z,i.dirX[l]=p,i.dirZ[l]=m,e.events.push({type:`cardFired`}),!0}function at(e,t,n){let{enemies:r,cards:i,data:o}=e,s=i.posX[t],c=i.posZ[t],l=o.enemyTypes;Xe();for(let t=0;t<r.count;t++){if(r.state[t]!==P.Chasing||r.projectileHitCooldown[t]>0)continue;let i=n+l[r.typeIndex[t]].radius,o=r.posX[t]-s,u=r.posZ[t]-c;o*o+u*u>i*i||(Ze(e,t),r.projectileHitCooldown[t]=a)}Qe(e)}function ot(e,t){let{player:n,stats:r}=e;n.abilityCooldown-=t,n.abilityCooldown>0||(n.abilityCooldown=st(e)>0?n.abilityCooldown+r.abilityCooldown:0)}function st(e){let{player:t,enemies:n,stats:r}=e,i=r.abilityRange*r.abilityRange,a=0;Xe();for(let r=0;r<n.count;r++){if(n.state[r]!==P.Chasing)continue;let o=n.posX[r]-t.x,s=n.posZ[r]-t.z;o*o+s*s>i||(a===0&&e.events.push({type:`smokeFired`}),a++,Ze(e,r))}return Qe(e),a}function ct(e,t){let n=e.ability;switch(n.kind){case`mordida`:et(e,t);break;case`cartas`:rt(e,t);break;case`fumaca`:ot(e,t);break;default:throw Error(`habilidade sem sistema: ${JSON.stringify(n)}`)}}function lt(e,t){let{orbs:n,player:r,data:i}=e,a=i.xp.collectRadius*i.xp.collectRadius,o=e.stats.magnetRadius*e.stats.magnetRadius;for(let s=n.count-1;s>=0;s--){let c=r.x-n.posX[s],l=r.z-n.posZ[s],u=c*c+l*l;if(u<=a){let t=n.xpValue[s];oe(n,s),ut(e,t*e.stats.xpGainMultiplier)}else if(u<=o){let e=Math.sqrt(u),r=Math.min(i.xp.magnetSpeed*t,e);n.posX[s]=n.posX[s]+c/e*r,n.posZ[s]=n.posZ[s]+l/e*r}}}function ut(e,t){let{player:n}=e;for(n.xp+=t;n.xp>=n.xpToNext;)n.xp-=n.xpToNext,n.level++,n.xpToNext=me(e.data,n.level),e.pendingLevelUps++,e.events.push({type:`levelUp`,level:n.level})}function dt(e,t){let{player:n,enemies:r,data:i,stats:a}=e;if(n.invulnTimer>0&&(n.invulnTimer-=t,n.invulnTimer>0)||n.jumpOffset>.8)return;let o=i.enemyTypes;for(let t=0;t<r.count;t++){if(r.state[t]!==P.Chasing)continue;let i=o[r.typeIndex[t]],s=a.playerRadius+i.radius,c=r.posX[t]-n.x,l=r.posZ[t]-n.z;if(c*c+l*l>s*s)continue;let u=Math.max(1,i.contactDamage-a.contactArmor);n.hp-=u,n.invulnTimer=a.contactIFrames,n.lastHitTick=e.tickCount,n.lastHitDamage=u,n.hp<=0&&(n.hp=0,n.state=`dead`,n.jumpOffset=0,n.jumpVelocity=0,e.status=`gameOver`,e.events.push({type:`playerDied`}));return}}var ft=8,pt=6;function mt(e){let t=e.data.orelhoes,n=t.killRequirements;for(;e.orelhoes.length<n.length&&e.time>=t.firstAtSec+e.orelhoes.length*t.intervalSec;){let t=Math.max(1,e.arenaHalfSize-pt),r=0,i=0;for(let n=0;n<ft;n++){r=(e.orelhaoRng.next()*2-1)*t,i=(e.orelhaoRng.next()*2-1)*t;let n=r-e.player.x,a=i-e.player.z;if(n*n+a*a>=400)break}e.orelhoes.push({x:r,z:i,requirement:n[e.orelhoes.length],answered:!1})}let r=t.answerRadius*t.answerRadius;for(let t of e.orelhoes){if(t.answered||e.kills<t.requirement)continue;let n=t.x-e.player.x,i=t.z-e.player.z;n*n+i*i>r||(t.answered=!0,e.bananasEarned+=t.requirement,e.events.push({type:`orelhaoAnswered`,x:t.x,z:t.z,reward:t.requirement}))}}function ht(e,t,n){e.status===`running`&&(e.events.length=0,gt(e),je(e,t,n),Me(e,n),Fe(e,n),Be(e,n),ct(e,n),lt(e,n),dt(e,n),mt(e),Se(e),e.tickCount++,e.time+=n)}function gt(e){let{player:t,enemies:n,orbs:r,cards:i}=e;t.prevX=t.x,t.prevZ=t.z,t.prevJumpOffset=t.jumpOffset;for(let e=0;e<n.count;e++)n.prevX[e]=n.posX[e],n.prevZ[e]=n.posZ[e];for(let e=0;e<r.count;e++)r.prevX[e]=r.posX[e],r.prevZ[e]=r.posZ[e];for(let e=0;e<i.count;e++)i.prevX[e]=i.posX[e],i.prevZ[e]=i.posZ[e]}var _t=.25,vt=5;function yt(e){let t=0,n=performance.now(),r=!1,i=0;function a(o){if(r)return;let s=Math.min((o-n)/1e3,_t);n=o,t+=s;let c=e.getWorld(),l=e.isPaused?.()===!0,u=performance.now(),d=0;for(;!l&&c.upgradeChoice===null&&t>=.016666666666666666&&d<vt;)ht(c,e.sampleInput(),h),t-=h,d++;(l||c.upgradeChoice!==null||d===vt)&&(t=0),e.perf.recordSim(performance.now()-u);let f=c.status!==`running`||c.upgradeChoice!==null||l?1:t/h,p=performance.now();e.draw(c,f,s),e.perf.recordRender(performance.now()-p),e.perf.recordFrame(o),e.afterFrame(c),i=requestAnimationFrame(a)}return i=requestAnimationFrame(a),{stop(){r||(r=!0,cancelAnimationFrame(i))}}}var bt=1e3,xt=1001,St=1002,Ct=1003,wt=1004,Tt=1005,Et=1006,Dt=1007,Ot=1008,kt=1009,At=1010,jt=1011,Mt=1012,Nt=1013,Pt=1014,Ft=1015,It=1016,Lt=1017,Rt=1018,zt=1020,Bt=35902,Vt=35899,Ht=1021,Ut=1022,Wt=1023,Gt=1026,Kt=1027,qt=1028,Jt=1029,Yt=1030,Xt=1031,Zt=1033,Qt=33776,$t=33777,en=33778,tn=33779,nn=35840,rn=35841,an=35842,on=35843,sn=36196,cn=37492,ln=37496,un=37488,dn=37489,fn=37490,pn=37491,mn=37808,hn=37809,gn=37810,_n=37811,vn=37812,yn=37813,bn=37814,xn=37815,Sn=37816,Cn=37817,wn=37818,Tn=37819,En=37820,Dn=37821,On=36492,kn=36494,An=36495,jn=36283,Mn=36284,Nn=36285,Pn=36286,Fn=2300,In=2301,Ln=2302,Rn=2303,zn=2400,Bn=2401,Vn=2402,Hn=3200,Un=`srgb`,Wn=`srgb-linear`,Gn=`linear`,Kn=`srgb`,qn=7680,Jn=35044,Yn=35048,Xn=2e3;function Zn(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Qn(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function $n(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function er(){let e=$n(`canvas`);return e.style.display=`block`,e}var tr={};function nr(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function rr(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function z(...e){e=rr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function B(...e){e=rr(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ir(...e){let t=e.join(` `);t in tr||(tr[t]=!0,z(...e))}function ar(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var or={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},sr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},cr=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),lr=Math.PI/180,ur=180/Math.PI;function dr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(cr[e&255]+cr[e>>8&255]+cr[e>>16&255]+cr[e>>24&255]+`-`+cr[t&255]+cr[t>>8&255]+`-`+cr[t>>16&15|64]+cr[t>>24&255]+`-`+cr[n&63|128]+cr[n>>8&255]+`-`+cr[n>>16&255]+cr[n>>24&255]+cr[r&255]+cr[r>>8&255]+cr[r>>16&255]+cr[r>>24&255]).toLowerCase()}function fr(e,t,n){return Math.max(t,Math.min(n,e))}function pr(e,t){return(e%t+t)%t}function mr(e,t,n){return(1-n)*e+n*t}function hr(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function gr(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function _r(e,t){if(t.constructor===Float32Array)return e;let n=gr(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function vr(e,t){if(t.constructor===Float32Array)return e;let n=gr(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var V=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=fr(this.x,e.x,t.x),this.y=fr(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=fr(this.x,e,t),this.y=fr(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(fr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(fr(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},yr=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:z(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(fr(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},H=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(xr.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(xr.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=fr(this.x,e.x,t.x),this.y=fr(this.y,e.y,t.y),this.z=fr(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=fr(this.x,e,t),this.y=fr(this.y,e,t),this.z=fr(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(fr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return br.copy(this).projectOnVector(e),this.sub(br)}reflect(e){return this.sub(br.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(fr(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},br=new H,xr=new yr,U=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ir(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Sr.makeScale(e,t)),this}rotate(e){return ir(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Sr.makeRotation(-e)),this}translate(e,t){return ir(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Sr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Sr=new U,Cr=new U().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wr=new U().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tr(){let e={enabled:!0,workingColorSpace:Wn,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Dr(e.r),e.g=Dr(e.g),e.b=Dr(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Or(e.r),e.g=Or(e.g),e.b=Or(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Gn:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Wn]:{primaries:t,whitePoint:r,transfer:Gn,toXYZ:Cr,fromXYZ:wr,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Un},outputColorSpaceConfig:{drawingBufferColorSpace:Un}},[Un]:{primaries:t,whitePoint:r,transfer:Kn,toXYZ:Cr,fromXYZ:wr,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Un}}}),e}var Er=Tr();function Dr(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Or(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var kr,Ar=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{kr===void 0&&(kr=$n(`canvas`)),kr.width=e.width,kr.height=e.height;let t=kr.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=kr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=$n(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Dr(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Dr(t[e]/255)*255):t[e]=Dr(t[e]);return{data:t,width:e.width,height:e.height}}return z(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},jr=0,Mr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:jr++}),this.uuid=dr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Nr(r[t].image)):e.push(Nr(r[t]))}else e=Nr(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Nr(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ar.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(z(`Texture: Unable to serialize Texture.`),{})}var Pr=0,Fr=new H,Ir=class e extends sr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=xt,i=xt,a=Et,o=Ot,s=Wt,c=kt,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Pr++}),this.uuid=dr(),this.name=``,this.source=new Mr(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new V(0,0),this.repeat=new V(1,1),this.center=new V(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new U,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Fr).x}get height(){return this.source.getSize(Fr).y}get depth(){return this.source.getSize(Fr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){z(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case bt:e.x-=Math.floor(e.x);break;case xt:e.x=e.x<0?0:1;break;case St:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case bt:e.y-=Math.floor(e.y);break;case xt:e.y=e.y<0?0:1;break;case St:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ir.DEFAULT_IMAGE=null,Ir.DEFAULT_MAPPING=300,Ir.DEFAULT_ANISOTROPY=1;var Lr=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=fr(this.x,e.x,t.x),this.y=fr(this.y,e.y,t.y),this.z=fr(this.z,e.z,t.z),this.w=fr(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=fr(this.x,e,t),this.y=fr(this.y,e,t),this.z=fr(this.z,e,t),this.w=fr(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(fr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Rr=class extends sr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Lr(0,0,e,t),this.scissorTest=!1,this.viewport=new Lr(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Ir({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Mr(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},zr=class extends Rr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Br=class extends Ir{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=xt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Vr=class extends Ir{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ct,this.minFilter=Ct,this.wrapR=xt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Hr=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Ur.setFromMatrixColumn(e,0).length(),i=1/Ur.setFromMatrixColumn(e,1).length(),a=1/Ur.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gr,e,Kr)}lookAt(e,t,n){let r=this.elements;return Yr.subVectors(e,t),Yr.lengthSq()===0&&(Yr.z=1),Yr.normalize(),qr.crossVectors(n,Yr),qr.lengthSq()===0&&(Math.abs(n.z)===1?Yr.x+=1e-4:Yr.z+=1e-4,Yr.normalize(),qr.crossVectors(n,Yr)),qr.normalize(),Jr.crossVectors(Yr,qr),r[0]=qr.x,r[4]=Jr.x,r[8]=Yr.x,r[1]=qr.y,r[5]=Jr.y,r[9]=Yr.y,r[2]=qr.z,r[6]=Jr.z,r[10]=Yr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],ee=r[11],te=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*ee,i[12]=a*w+o*O+s*M+c*te,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*ee,i[13]=l*w+u*O+d*M+f*te,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*ee,i[14]=p*w+m*O+h*M+g*te,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*ee,i[15]=_*w+v*O+y*M+b*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Ur.set(r[0],r[1],r[2]).length(),o=Ur.set(r[4],r[5],r[6]).length(),s=Ur.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Wr.copy(this);let c=1/a,l=1/o,u=1/s;return Wr.elements[0]*=c,Wr.elements[1]*=c,Wr.elements[2]*=c,Wr.elements[4]*=l,Wr.elements[5]*=l,Wr.elements[6]*=l,Wr.elements[8]*=u,Wr.elements[9]*=u,Wr.elements[10]*=u,t.setFromRotationMatrix(Wr),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Xn,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Xn,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ur=new H,Wr=new Hr,Gr=new H(0,0,0),Kr=new H(1,1,1),qr=new H,Jr=new H,Yr=new H,Xr=new Hr,Zr=new yr,Qr=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(fr(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-fr(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(fr(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-fr(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(fr(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-fr(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:z(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Xr.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xr,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Zr.setFromEuler(this),this.setFromQuaternion(Zr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Qr.DEFAULT_ORDER=`XYZ`;var $r=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},ei=0,ti=new H,ni=new yr,ri=new Hr,ii=new H,ai=new H,oi=new H,si=new yr,ci=new H(1,0,0),li=new H(0,1,0),ui=new H(0,0,1),di={type:`added`},fi={type:`removed`},pi={type:`childadded`,child:null},mi={type:`childremoved`,child:null},hi=class e extends sr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ei++}),this.uuid=dr(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new Qr,r=new yr,i=new H(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Hr},normalMatrix:{value:new U}}),this.matrix=new Hr,this.matrixWorld=new Hr,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new $r,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ni.setFromAxisAngle(e,t),this.quaternion.multiply(ni),this}rotateOnWorldAxis(e,t){return ni.setFromAxisAngle(e,t),this.quaternion.premultiply(ni),this}rotateX(e){return this.rotateOnAxis(ci,e)}rotateY(e){return this.rotateOnAxis(li,e)}rotateZ(e){return this.rotateOnAxis(ui,e)}translateOnAxis(e,t){return ti.copy(e).applyQuaternion(this.quaternion),this.position.add(ti.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ci,e)}translateY(e){return this.translateOnAxis(li,e)}translateZ(e){return this.translateOnAxis(ui,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ri.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ii.copy(e):ii.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),ai.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ri.lookAt(ai,ii,this.up):ri.lookAt(ii,ai,this.up),this.quaternion.setFromRotationMatrix(ri),r&&(ri.extractRotation(r.matrixWorld),ni.setFromRotationMatrix(ri),this.quaternion.premultiply(ni.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(B(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(di),pi.child=e,this.dispatchEvent(pi),pi.child=null):B(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(fi),mi.child=e,this.dispatchEvent(mi),mi.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(di),pi.child=e,this.dispatchEvent(pi),pi.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ai,e,oi),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ai,si,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};hi.DEFAULT_UP=new H(0,1,0),hi.DEFAULT_MATRIX_AUTO_UPDATE=!0,hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var W=class extends hi{constructor(){super(),this.isGroup=!0,this.type=`Group`}},gi={type:`move`},_i=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new W,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new W,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new W,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new W;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},vi={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yi={h:0,s:0,l:0},bi={h:0,s:0,l:0};function xi(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var G=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Er.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Er.workingColorSpace){return this.r=e,this.g=t,this.b=n,Er.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Er.workingColorSpace){if(e=pr(e,1),t=fr(t,0,1),n=fr(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=xi(i,r,e+1/3),this.g=xi(i,r,e),this.b=xi(i,r,e-1/3)}return Er.colorSpaceToWorking(this,r),this}setStyle(e,t=Un){function n(t){t!==void 0&&parseFloat(t)<1&&z(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:z(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);z(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Un){let n=vi[e.toLowerCase()];return n===void 0?z(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Dr(e.r),this.g=Dr(e.g),this.b=Dr(e.b),this}copyLinearToSRGB(e){return this.r=Or(e.r),this.g=Or(e.g),this.b=Or(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Un){return Er.workingToColorSpace(Si.copy(this),e),Math.round(fr(Si.r*255,0,255))*65536+Math.round(fr(Si.g*255,0,255))*256+Math.round(fr(Si.b*255,0,255))}getHexString(e=Un){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Er.workingColorSpace){Er.workingToColorSpace(Si.copy(this),t);let n=Si.r,r=Si.g,i=Si.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Er.workingColorSpace){return Er.workingToColorSpace(Si.copy(this),t),e.r=Si.r,e.g=Si.g,e.b=Si.b,e}getStyle(e=Un){Er.workingToColorSpace(Si.copy(this),e);let t=Si.r,n=Si.g,r=Si.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(yi),this.setHSL(yi.h+e,yi.s+t,yi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(yi),e.getHSL(bi);let n=mr(yi.h,bi.h,t),r=mr(yi.s,bi.s,t),i=mr(yi.l,bi.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Si=new G;G.NAMES=vi;var Ci=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new G(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},wi=class extends hi{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qr,this.environmentIntensity=1,this.environmentRotation=new Qr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ti=new H,Ei=new H,Di=new H,Oi=new H,ki=new H,Ai=new H,ji=new H,Mi=new H,Ni=new H,Pi=new H,Fi=new Lr,Ii=new Lr,Li=new Lr,Ri=class e{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Ti.subVectors(e,t),r.cross(Ti);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Ti.subVectors(r,t),Ei.subVectors(n,t),Di.subVectors(e,t);let a=Ti.dot(Ti),o=Ti.dot(Ei),s=Ti.dot(Di),c=Ei.dot(Ei),l=Ei.dot(Di),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Oi)!==null&&Oi.x>=0&&Oi.y>=0&&Oi.x+Oi.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Oi)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Oi.x),s.addScaledVector(a,Oi.y),s.addScaledVector(o,Oi.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Fi.setScalar(0),Ii.setScalar(0),Li.setScalar(0),Fi.fromBufferAttribute(e,t),Ii.fromBufferAttribute(e,n),Li.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Fi,i.x),a.addScaledVector(Ii,i.y),a.addScaledVector(Li,i.z),a}static isFrontFacing(e,t,n,r){return Ti.subVectors(n,t),Ei.subVectors(e,t),Ti.cross(Ei).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ti.subVectors(this.c,this.b),Ei.subVectors(this.a,this.b),Ti.cross(Ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;ki.subVectors(r,n),Ai.subVectors(i,n),Mi.subVectors(e,n);let s=ki.dot(Mi),c=Ai.dot(Mi);if(s<=0&&c<=0)return t.copy(n);Ni.subVectors(e,r);let l=ki.dot(Ni),u=Ai.dot(Ni);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(ki,a);Pi.subVectors(e,i);let f=ki.dot(Pi),p=Ai.dot(Pi);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ai,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return ji.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(ji,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(ki,a).addScaledVector(Ai,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},zi=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Vi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Vi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Vi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Vi):Vi.fromBufferAttribute(r,t),Vi.applyMatrix4(e.matrixWorld),this.expandByPoint(Vi);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Hi.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Hi.copy(e.boundingBox)),Hi.applyMatrix4(e.matrixWorld),this.union(Hi)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Vi),Vi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Yi),Xi.subVectors(this.max,Yi),Ui.subVectors(e.a,Yi),Wi.subVectors(e.b,Yi),Gi.subVectors(e.c,Yi),Ki.subVectors(Wi,Ui),qi.subVectors(Gi,Wi),Ji.subVectors(Ui,Gi);let t=[0,-Ki.z,Ki.y,0,-qi.z,qi.y,0,-Ji.z,Ji.y,Ki.z,0,-Ki.x,qi.z,0,-qi.x,Ji.z,0,-Ji.x,-Ki.y,Ki.x,0,-qi.y,qi.x,0,-Ji.y,Ji.x,0];return!$i(t,Ui,Wi,Gi,Xi)||(t=[1,0,0,0,1,0,0,0,1],!$i(t,Ui,Wi,Gi,Xi))?!1:(Zi.crossVectors(Ki,qi),t=[Zi.x,Zi.y,Zi.z],$i(t,Ui,Wi,Gi,Xi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Vi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Vi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Bi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Bi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Bi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Bi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Bi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Bi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Bi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Bi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Bi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Bi=[new H,new H,new H,new H,new H,new H,new H,new H],Vi=new H,Hi=new zi,Ui=new H,Wi=new H,Gi=new H,Ki=new H,qi=new H,Ji=new H,Yi=new H,Xi=new H,Zi=new H,Qi=new H;function $i(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Qi.fromArray(e,a);let o=i.x*Math.abs(Qi.x)+i.y*Math.abs(Qi.y)+i.z*Math.abs(Qi.z),s=t.dot(Qi),c=n.dot(Qi),l=r.dot(Qi);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var ea=new H,ta=new V,na=0,ra=class extends sr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:na++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Jn,this.updateRanges=[],this.gpuType=Ft,this.version=0,this._normalizationScale=e===void 0?void 0:gr(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ta.fromBufferAttribute(this,t),ta.applyMatrix3(e),this.setXY(t,ta.x,ta.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyMatrix3(e),this.setXYZ(t,ea.x,ea.y,ea.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyMatrix4(e),this.setXYZ(t,ea.x,ea.y,ea.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyNormalMatrix(e),this.setXYZ(t,ea.x,ea.y,ea.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.transformDirection(e),this.setXYZ(t,ea.x,ea.y,ea.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?_r(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?vr(e,this.array):Math.round(e*t)}},ia=class extends ra{constructor(e,t,n){super(new Uint16Array(e),t,n)}},aa=class extends ra{constructor(e,t,n){super(new Uint32Array(e),t,n)}},oa=class extends ra{constructor(e,t,n){super(new Float32Array(e),t,n)}},sa=new zi,ca=new H,la=new H,ua=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?sa.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ca.subVectors(e,this.center);let t=ca.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ca,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(la.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ca.copy(e.center).add(la)),this.expandByPoint(ca.copy(e.center).sub(la))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},da=0,fa=new Hr,pa=new hi,ma=new H,ha=new zi,ga=new zi,_a=new H,va=class e extends sr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:da++}),this.uuid=dr(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Zn(e)?aa:ia)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new U().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return fa.makeRotationFromQuaternion(e),this.applyMatrix4(fa),this}rotateX(e){return fa.makeRotationX(e),this.applyMatrix4(fa),this}rotateY(e){return fa.makeRotationY(e),this.applyMatrix4(fa),this}rotateZ(e){return fa.makeRotationZ(e),this.applyMatrix4(fa),this}translate(e,t,n){return fa.makeTranslation(e,t,n),this.applyMatrix4(fa),this}scale(e,t,n){return fa.makeScale(e,t,n),this.applyMatrix4(fa),this}lookAt(e){return pa.lookAt(e),pa.updateMatrix(),this.applyMatrix4(pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ma).negate(),this.translate(ma.x,ma.y,ma.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new oa(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&z(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ha.setFromBufferAttribute(n),this.morphTargetsRelative?(_a.addVectors(this.boundingBox.min,ha.min),this.boundingBox.expandByPoint(_a),_a.addVectors(this.boundingBox.max,ha.max),this.boundingBox.expandByPoint(_a)):(this.boundingBox.expandByPoint(ha.min),this.boundingBox.expandByPoint(ha.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&B(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ua);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new H,1/0);else if(e){let n=this.boundingSphere.center;if(ha.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ga.setFromBufferAttribute(n),this.morphTargetsRelative?(_a.addVectors(ha.min,ga.min),ha.expandByPoint(_a),_a.addVectors(ha.max,ga.max),ha.expandByPoint(_a)):(ha.expandByPoint(ga.min),ha.expandByPoint(ga.max))}ha.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)_a.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(_a));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)_a.fromBufferAttribute(a,t),o&&(ma.fromBufferAttribute(e,t),_a.add(ma)),r=Math.max(r,n.distanceToSquared(_a))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&B(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){B(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ra(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new H,s[e]=new H;let l=new H,u=new H,d=new H,f=new V,p=new V,m=new V,h=new H,g=new H;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new H,b=new H,x=new H,S=new H;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ra(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)_a.fromBufferAttribute(e,t),_a.normalize(),e.setXYZ(t,_a.x,_a.y,_a.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ra(a,r,i)}if(this.index===null)return z(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ya=new H,ba=new H,xa=new U,Sa=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ya.subVectors(n,t).cross(ba.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ya),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||xa.getNormalMatrix(e),r=this.coplanarPoint(ya).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Ca=0,wa=class extends sr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ca++}),this.uuid=dr(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new G(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qn,this.stencilZFail=qn,this.stencilZPass=qn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){z(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new G().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Sa().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new V().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new V().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Ta=new H,Ea=new H,Da=new H,Oa=new H,ka=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ta)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ta.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ta.copy(this.origin).addScaledVector(this.direction,t),Ta.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ea.copy(e).add(t).multiplyScalar(.5),Da.copy(t).sub(e).normalize(),Oa.copy(this.origin).sub(Ea);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Da),o=Oa.dot(this.direction),s=-Oa.dot(Da),c=Oa.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ea).addScaledVector(Da,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ta.subVectors(e.center,this.origin);let n=Ta.dot(this.direction),r=Ta.dot(Ta)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ta)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,ee=C/w,te=1/w,ne=T-P*D,re=E-ee*D,ie=O-P*A,ae=k-ee*A,oe=j-P*N,se=M-ee*N,ce=oe*ae-se*ie,le=ne*se-re*oe,ue=ie*re-ae*ne;if(r){if(ce<0||le<0||ue<0)return null}else if((ce<0||le<0||ue<0)&&(ce>0||le>0||ue>0))return null;let de=ce+le+ue;if(de===0)return null;let fe=te*(ce*D+le*A+ue*N);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Aa=class extends wa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qr,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ja=new Hr,Ma=new ka,Na=new ua,Pa=new H,Fa=new H,Ia=new H,La=new H,Ra=new H,za=new H,Ba=new H,Va=new H,K=class extends hi{constructor(e=new va,t=new Aa){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){za.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Ra.fromBufferAttribute(s,e),a?za.addScaledVector(Ra,r):za.addScaledVector(Ra.sub(t),r))}t.add(za)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Na.copy(n.boundingSphere),Na.applyMatrix4(i),Ma.copy(e.ray).recast(e.near),Na.containsPoint(Ma.origin)===!1&&(Ma.intersectSphere(Na,Pa)===null||Ma.origin.distanceToSquared(Pa)>(e.far-e.near)**2)||(ja.copy(i).invert(),Ma.copy(e.ray).applyMatrix4(ja),(n.boundingBox===null||Ma.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Ma)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ua(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ua(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ua(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ua(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Ha(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Va.copy(s),Va.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Va);return l<n.near||l>n.far?null:{distance:l,point:Va.clone(),object:e}}function Ua(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Fa),e.getVertexPosition(c,Ia),e.getVertexPosition(l,La);let u=Ha(e,t,n,r,Fa,Ia,La,Ba);if(u){let e=new H;Ri.getBarycoord(Ba,Fa,Ia,La,e),i&&(u.uv=Ri.getInterpolatedAttribute(i,s,c,l,e,new V)),a&&(u.uv1=Ri.getInterpolatedAttribute(a,s,c,l,e,new V)),o&&(u.normal=Ri.getInterpolatedAttribute(o,s,c,l,e,new H),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new H,materialIndex:0};Ri.getNormal(Fa,Ia,La,t.normal),u.face=t,u.barycoord=e}return u}var Wa=class extends Ir{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Ct,l=Ct,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ga=class extends ra{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ka=new Hr,qa=new Hr,Ja=[],Ya=new zi,Xa=new Hr,Za=new K,Qa=new ua,$a=class extends K{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ga(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Xa)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new zi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ka),Ya.copy(e.boundingBox).applyMatrix4(Ka),this.boundingBox.union(Ya)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ua),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ka),Qa.copy(e.boundingSphere).applyMatrix4(Ka),this.boundingSphere.union(Qa)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture===null?null:e.morphTexture.clone(),this.instanceColor=e.instanceColor===null?null:e.instanceColor.clone(),this.count=e.count,this.boundingBox=e.boundingBox===null?null:e.boundingBox.clone(),this.boundingSphere=e.boundingSphere===null?null:e.boundingSphere.clone(),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Za.geometry=this.geometry,Za.material=this.material,Za.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qa.copy(this.boundingSphere),Qa.applyMatrix4(n),e.ray.intersectsSphere(Qa)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Ka),qa.multiplyMatrices(n,Ka),Za.matrixWorld=qa,Za.raycast(e,Ja);for(let e=0,n=Ja.length;e<n;e++){let n=Ja[e];n.instanceId=i,n.object=this,t.push(n)}Ja.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ga(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Wa(new Float32Array(r*this.count),r,this.count,qt,Ft));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},eo=new ua,to=new V(.5,.5),no=new H,ro=class{constructor(e=new Sa,t=new Sa,n=new Sa,r=new Sa,i=new Sa,a=new Sa){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Xn,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),eo.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),eo.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(eo)}intersectsSprite(e){return eo.center.set(0,0,0),eo.radius=.7071067811865476+to.distanceTo(e.center),eo.applyMatrix4(e.matrixWorld),this.intersectsSphere(eo)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(no.x=r.normal.x>0?e.max.x:e.min.x,no.y=r.normal.y>0?e.max.y:e.min.y,no.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(no)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},io=new Hr,ao=class e{constructor(){this.coordinateSystem=Xn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];io.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new ro),n[e].setFromProjectionMatrix(io,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new ro),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},oo=class extends Ir{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},so=class extends Ir{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},co=class extends Ir{constructor(e,t,n=Pt,r,i,a,o=Ct,s=Ct,c,l=Gt,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Mr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},lo=class extends co{constructor(e,t=Pt,n=301,r,i,a=Ct,o=Ct,s,c=Gt){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},uo=class extends Ir{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},q=class e extends va{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new oa(c,3)),this.setAttribute(`normal`,new oa(l,3)),this.setAttribute(`uv`,new oa(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new H;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fo=class e extends va{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new H,l=new V;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new oa(a,3)),this.setAttribute(`normal`,new oa(o,3)),this.setAttribute(`uv`,new oa(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},po=class e extends va{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new oa(u,3)),this.setAttribute(`normal`,new oa(d,3)),this.setAttribute(`uv`,new oa(f,2));function _(){let a=new H,_=new H,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new V,m=new H,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},mo=class e extends po{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ho=class e extends va{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new oa(i,3)),this.setAttribute(`normal`,new oa(i.slice(),3)),this.setAttribute(`uv`,new oa(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new H,r=new H,i=new H;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new H;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new H;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new H,t=new H,n=new H,r=new H,o=new V,s=new V,c=new V;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},go=class e extends ho{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},_o=class e extends va{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new oa(p,3)),this.setAttribute(`normal`,new oa(m,3)),this.setAttribute(`uv`,new oa(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},vo=class e extends va{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new H,p=new V;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new oa(s,3)),this.setAttribute(`normal`,new oa(c,3)),this.setAttribute(`uv`,new oa(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},J=class e extends va{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new H,d=new H,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new oa(p,3)),this.setAttribute(`normal`,new oa(m,3)),this.setAttribute(`uv`,new oa(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};function yo(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(xo(i))i.isRenderTargetTexture?(z(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(xo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function bo(e){let t={};for(let n=0;n<e.length;n++){let r=yo(e[n]);for(let e in r)t[e]=r[e]}return t}function xo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function So(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Co(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Er.workingColorSpace}var wo={clone:yo,merge:bo},To=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Eo=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Do=class extends wa{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=To,this.fragmentShader=Eo,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=yo(e.uniforms),this.uniformsGroups=So(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new G().setHex(r.value);break;case`v2`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Lr().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new U().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Hr().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Oo=class extends Do{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Y=class extends wa{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new G(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new G(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qr,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ko=class extends wa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Hn,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ao=class extends wa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function jo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Mo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var No=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Po=class extends No{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:zn,endingEnd:zn}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Bn:i=e,o=2*t-n;break;case Vn:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Bn:a=e,s=2*n-t;break;case Vn:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Fo=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Io=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Lo=class extends No{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Bo(n,t,g,y,r);i[p]=Ro(x,o,_,b,m)}return i}};function Ro(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function zo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Bo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ro(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=zo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Vo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=jo(t,this.TimeBufferType),this.values=jo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:jo(e.times,Array),values:jo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Mo(e.settings)&&(n.settings={inTangents:jo(e.settings.inTangents,Array),outTangents:jo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Io(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Fo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Po(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Lo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Fn:t=this.InterpolantFactoryMethodDiscrete;break;case In:t=this.InterpolantFactoryMethodLinear;break;case Ln:t=this.InterpolantFactoryMethodSmooth;break;case Rn:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return z(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Fn;case this.InterpolantFactoryMethodLinear:return In;case this.InterpolantFactoryMethodSmooth:return Ln;case this.InterpolantFactoryMethodBezier:return Rn}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Mo(this.settings)&&(Ho(this.settings.inTangents,e),Ho(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Mo(this.settings)&&(Uo(this.settings.inTangents,e),Uo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(B(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(B(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){B(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){B(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Qn(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){B(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ln,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Mo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ho(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Uo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Vo.prototype.ValueTypeName=``,Vo.prototype.TimeBufferType=Float32Array,Vo.prototype.ValueBufferType=Float32Array,Vo.prototype.DefaultInterpolation=In;var Wo=class extends Vo{constructor(e,t,n){super(e,t,n)}};Wo.prototype.ValueTypeName=`bool`,Wo.prototype.ValueBufferType=Array,Wo.prototype.DefaultInterpolation=Fn,Wo.prototype.InterpolantFactoryMethodLinear=void 0,Wo.prototype.InterpolantFactoryMethodSmooth=void 0;var Go=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Go.prototype.ValueTypeName=`color`;var Ko=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Ko.prototype.ValueTypeName=`number`;var qo=class extends No{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)yr.slerpFlat(i,0,a,c-o,a,c,s);return i}},Jo=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new qo(this.times,this.values,this.getValueSize(),e)}};Jo.prototype.ValueTypeName=`quaternion`,Jo.prototype.InterpolantFactoryMethodSmooth=void 0;var Yo=class extends Vo{constructor(e,t,n){super(e,t,n)}};Yo.prototype.ValueTypeName=`string`,Yo.prototype.ValueBufferType=Array,Yo.prototype.DefaultInterpolation=Fn,Yo.prototype.InterpolantFactoryMethodLinear=void 0,Yo.prototype.InterpolantFactoryMethodSmooth=void 0;var Xo=class extends Vo{constructor(e,t,n,r){super(e,t,n,r)}};Xo.prototype.ValueTypeName=`vector`;var Zo=class extends hi{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new G(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Qo=class extends Zo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(hi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new G(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},$o=new Hr,es=new H,ts=new H,ns=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new V(512,512),this.mapType=kt,this.map=null,this.mapPass=null,this.matrix=new Hr,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ro,this._frameExtents=new V(1,1),this._viewportCount=1,this._viewports=[new Lr(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;es.setFromMatrixPosition(e.matrixWorld),t.position.copy(es),ts.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ts),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){$o.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix($o,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply($o)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},rs=new H,is=new yr,as=new H,os=class extends hi{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Hr,this.projectionMatrix=new Hr,this.projectionMatrixInverse=new Hr,this.coordinateSystem=Xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(rs,is,as),as.x===1&&as.y===1&&as.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rs,is,as.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(rs,is,as),as.x===1&&as.y===1&&as.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(rs,is,as.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ss=new H,cs=new V,ls=new V,us=class extends os{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ur*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(lr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ur*2*Math.atan(Math.tan(lr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ss.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ss.x,ss.y).multiplyScalar(-e/ss.z),ss.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ss.x,ss.y).multiplyScalar(-e/ss.z)}getViewSize(e,t){return this.getViewBounds(e,cs,ls),t.subVectors(ls,cs)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(lr*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ds=class extends os{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},fs=class extends ns{constructor(){super(new ds(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ps=class extends Zo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(hi.DEFAULT_UP),this.updateMatrix(),this.target=new hi,this.shadow=new fs}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ms=-90,hs=1,gs=class extends hi{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new us(ms,hs,e,t);r.layers=this.layers,this.add(r);let i=new us(ms,hs,e,t);i.layers=this.layers,this.add(i);let a=new us(ms,hs,e,t);a.layers=this.layers,this.add(a);let o=new us(ms,hs,e,t);o.layers=this.layers,this.add(o);let s=new us(ms,hs,e,t);s.layers=this.layers,this.add(s);let c=new us(ms,hs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},_s=class extends us{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},vs=`\\[\\]\\.:\\/`,ys=RegExp(`[\\[\\]\\.:\\/]`,`g`),bs=`[^\\[\\]\\.:\\/]`,xs=`[^`+vs.replace(`\\.`,``)+`]`,Ss=`((?:WC+[\\/:])*)`.replace(`WC`,bs),Cs=`(WCOD+)?`.replace(`WCOD`,xs),ws=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,bs),Ts=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,bs),Es=RegExp(`^`+Ss+Cs+ws+Ts+`$`),Ds=[`material`,`materials`,`bones`,`map`],Os=class{constructor(e,t,n){let r=n||ks.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ks=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ys,``)}static parseTrackName(e){let t=Es.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ds.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){z(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){B(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){B(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){B(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){B(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){B(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;B(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ks.Composite=Os,ks.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ks.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ks.prototype.GetterByBindingType=[ks.prototype._getValue_direct,ks.prototype._getValue_array,ks.prototype._getValue_arrayElement,ks.prototype._getValue_toArray],ks.prototype.SetterByBindingTypeAndVersioning=[[ks.prototype._setValue_direct,ks.prototype._setValue_direct_setNeedsUpdate,ks.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_array,ks.prototype._setValue_array_setNeedsUpdate,ks.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_arrayElement,ks.prototype._setValue_arrayElement_setNeedsUpdate,ks.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ks.prototype._setValue_fromArray,ks.prototype._setValue_fromArray_setNeedsUpdate,ks.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function As(e,t,n,r){let i=js(r);switch(n){case Ht:return e*t;case qt:return e*t/i.components*i.byteLength;case Jt:return e*t/i.components*i.byteLength;case Yt:return e*t*2/i.components*i.byteLength;case Xt:return e*t*2/i.components*i.byteLength;case Ut:return e*t*3/i.components*i.byteLength;case Wt:return e*t*4/i.components*i.byteLength;case Zt:return e*t*4/i.components*i.byteLength;case Qt:case $t:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case en:case tn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case rn:case on:return Math.max(e,16)*Math.max(t,8)/4;case nn:case an:return Math.max(e,8)*Math.max(t,8)/2;case sn:case cn:case un:case dn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ln:case fn:case pn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case mn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case hn:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case gn:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case _n:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case vn:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case yn:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case bn:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case xn:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Sn:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Cn:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case wn:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Tn:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case En:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Dn:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case On:case kn:case An:return Math.ceil(e/4)*Math.ceil(t/4)*16;case jn:case Mn:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Nn:case Pn:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function js(e){switch(e){case kt:case At:return{byteLength:1,components:1};case Mt:case jt:case It:return{byteLength:2,components:1};case Lt:case Rt:return{byteLength:2,components:4};case Pt:case Nt:case Ft:return{byteLength:4,components:1};case Bt:case Vt:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?z(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Ms(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ns(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var X={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new G(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new U}},envmap:{envMap:{value:null},envMapRotation:{value:new U},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new U}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new U}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new U},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new U},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new U},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new U}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new U}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new U}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new G(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new G(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0},uvTransform:{value:new U}},sprite:{diffuse:{value:new G(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new U},alphaMap:{value:null},alphaMapTransform:{value:new U},alphaTest:{value:0}}},Ps={basic:{uniforms:bo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:X.meshbasic_vert,fragmentShader:X.meshbasic_frag},lambert:{uniforms:bo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new G(0)},envMapIntensity:{value:1}}]),vertexShader:X.meshlambert_vert,fragmentShader:X.meshlambert_frag},phong:{uniforms:bo([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new G(0)},specular:{value:new G(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:X.meshphong_vert,fragmentShader:X.meshphong_frag},standard:{uniforms:bo([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new G(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag},toon:{uniforms:bo([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new G(0)}}]),vertexShader:X.meshtoon_vert,fragmentShader:X.meshtoon_frag},matcap:{uniforms:bo([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:X.meshmatcap_vert,fragmentShader:X.meshmatcap_frag},points:{uniforms:bo([Z.points,Z.fog]),vertexShader:X.points_vert,fragmentShader:X.points_frag},dashed:{uniforms:bo([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:X.linedashed_vert,fragmentShader:X.linedashed_frag},depth:{uniforms:bo([Z.common,Z.displacementmap]),vertexShader:X.depth_vert,fragmentShader:X.depth_frag},normal:{uniforms:bo([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:X.meshnormal_vert,fragmentShader:X.meshnormal_frag},sprite:{uniforms:bo([Z.sprite,Z.fog]),vertexShader:X.sprite_vert,fragmentShader:X.sprite_frag},background:{uniforms:{uvTransform:{value:new U},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:X.background_vert,fragmentShader:X.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new U}},vertexShader:X.backgroundCube_vert,fragmentShader:X.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:X.cube_vert,fragmentShader:X.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:X.equirect_vert,fragmentShader:X.equirect_frag},distance:{uniforms:bo([Z.common,Z.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:X.distance_vert,fragmentShader:X.distance_frag},shadow:{uniforms:bo([Z.lights,Z.fog,{color:{value:new G(0)},opacity:{value:1}}]),vertexShader:X.shadow_vert,fragmentShader:X.shadow_frag}};Ps.physical={uniforms:bo([Ps.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new U},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new U},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new U},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new U},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new U},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new U},sheen:{value:0},sheenColor:{value:new G(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new U},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new U},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new U},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new U},attenuationDistance:{value:0},attenuationColor:{value:new G(0)},specularColor:{value:new G(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new U},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new U},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new U}}]),vertexShader:X.meshphysical_vert,fragmentShader:X.meshphysical_frag};var Fs={r:0,b:0,g:0},Is=new Hr,Ls=new U;Ls.set(-1,0,0,0,1,0,0,0,1);function Rs(e,t,n,r,i,a){let o=new G(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new K(new q(1,1,1),new Do({name:`BackgroundCubeMaterial`,uniforms:yo(Ps.backgroundCube.uniforms),vertexShader:Ps.backgroundCube.vertexShader,fragmentShader:Ps.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Is.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ls),l.material.toneMapped=Er.getTransfer(i.colorSpace)!==Kn,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new K(new _o(2,2),new Do({name:`BackgroundMaterial`,uniforms:yo(Ps.background.uniforms),vertexShader:Ps.background.vertexShader,fragmentShader:Ps.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Er.getTransfer(i.colorSpace)!==Kn,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Fs,Co(e)),n.buffers.color.setClear(Fs.r,Fs.g,Fs.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function zs(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Bs(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Vs(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&z(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Hs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Sa,s=new U,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Us=class extends zr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new oo(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new q(5,5,5),i=new Do({name:`CubemapFromEquirect`,uniforms:yo(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new K(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Et),new gs(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},Ws=256,Gs=3,Ks=20,qs=256,Js=16,Ys=3,Xs=new H,Zs=new G,Qs=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new gs(1,10,null),this._boxMesh=new K(new q(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Xs}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(Zs));let h=new gs(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ac(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ic(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Ws,hr(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?Ws:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=$s(e,!1,!1),n=Math.log2(e)-Gs;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=$s(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=ac()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=ic()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=tc(),this._integrationMaterial=nc());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/Js);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-Ys)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(qs*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=rc());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function $s(e,t,n){return new Us(e,{minFilter:Ot,generateMipmaps:t,type:It,colorSpace:Wn,depthBuffer:n})}function ec(e,t,n){return new Do({name:e,uniforms:t,vertexShader:X.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function tc(){return ec(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${qs}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function nc(){return ec(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Js}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function rc(){return ec(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Ks}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function ic(){return ec(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function ac(){return ec(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function oc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Us(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Qs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Qs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function sc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ir(`WebGLRenderer: `+e+` extension not supported.`),t}}}function cc(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?aa:ia)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function lc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function uc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:B(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function dc(e,t,n){let r=new WeakMap,i=new Lr;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Br(h,p,m,u);g.type=Ft,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new V(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function fc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var pc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function mc(e,t,n,r,i,a){let o=new zr(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new va;u.setAttribute(`position`,new oa([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new oa([0,2,0,0,2,0],2));let d=new Oo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new K(u,d),p=new ds(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new zr(t,n,{type:It,depthBuffer:!1,stencilBuffer:!1}),c=new zr(t,n,{type:It,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new co(t,n),a===!0&&(l.format=Kt,l.type=zt)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},Er.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=pc[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var hc=new Ir,gc=new co(1,1),_c=new lo(1),vc=new Br,yc=new Vr,bc=new oo,xc=[],Sc=[],Cc=new Float32Array(16),wc=new Float32Array(9),Tc=new Float32Array(4);function Ec(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=xc[i];if(a===void 0&&(a=new Float32Array(i),xc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Dc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Oc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function kc(e,t){let n=Sc[t];n===void 0&&(n=new Int32Array(t),Sc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ac(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function jc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Dc(n,t))return;e.uniform2fv(this.addr,t),Oc(n,t)}}function Mc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Dc(n,t))return;e.uniform3fv(this.addr,t),Oc(n,t)}}function Nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Dc(n,t))return;e.uniform4fv(this.addr,t),Oc(n,t)}}function Pc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Dc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Oc(n,t)}else{if(Dc(n,r))return;Tc.set(r),e.uniformMatrix2fv(this.addr,!1,Tc),Oc(n,r)}}function Fc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Dc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Oc(n,t)}else{if(Dc(n,r))return;wc.set(r),e.uniformMatrix3fv(this.addr,!1,wc),Oc(n,r)}}function Ic(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Dc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Oc(n,t)}else{if(Dc(n,r))return;Cc.set(r),e.uniformMatrix4fv(this.addr,!1,Cc),Oc(n,r)}}function Lc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Rc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Dc(n,t))return;e.uniform2iv(this.addr,t),Oc(n,t)}}function zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Dc(n,t))return;e.uniform3iv(this.addr,t),Oc(n,t)}}function Bc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Dc(n,t))return;e.uniform4iv(this.addr,t),Oc(n,t)}}function Vc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Dc(n,t))return;e.uniform2uiv(this.addr,t),Oc(n,t)}}function Uc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Dc(n,t))return;e.uniform3uiv(this.addr,t),Oc(n,t)}}function Wc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Dc(n,t))return;e.uniform4uiv(this.addr,t),Oc(n,t)}}function Gc(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function Kc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?Gc(gc):hc,n.setTexture2D(t||a,i)}function qc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||yc,i)}function Jc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?Gc(_c):bc,n.setTextureCube(t||a,i)}function Yc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||vc,i)}function Xc(e){switch(e){case 5126:return Ac;case 35664:return jc;case 35665:return Mc;case 35666:return Nc;case 35674:return Pc;case 35675:return Fc;case 35676:return Ic;case 5124:case 35670:return Lc;case 35667:case 35671:return Rc;case 35668:case 35672:return zc;case 35669:case 35673:return Bc;case 5125:return Vc;case 36294:return Hc;case 36295:return Uc;case 36296:return Wc;case 35678:case 36198:case 36298:case 36306:case 35682:return Kc;case 35679:case 36299:case 36307:return qc;case 35680:case 36300:case 36308:case 36293:return Jc;case 36289:case 36303:case 36311:case 36292:return Yc}}function Zc(e,t){e.uniform1fv(this.addr,t)}function Qc(e,t){let n=Ec(t,this.size,2);e.uniform2fv(this.addr,n)}function $c(e,t){let n=Ec(t,this.size,3);e.uniform3fv(this.addr,n)}function el(e,t){let n=Ec(t,this.size,4);e.uniform4fv(this.addr,n)}function tl(e,t){let n=Ec(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function nl(e,t){let n=Ec(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function rl(e,t){let n=Ec(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function il(e,t){e.uniform1iv(this.addr,t)}function al(e,t){e.uniform2iv(this.addr,t)}function ol(e,t){e.uniform3iv(this.addr,t)}function sl(e,t){e.uniform4iv(this.addr,t)}function cl(e,t){e.uniform1uiv(this.addr,t)}function ll(e,t){e.uniform2uiv(this.addr,t)}function ul(e,t){e.uniform3uiv(this.addr,t)}function dl(e,t){e.uniform4uiv(this.addr,t)}function fl(e,t,n){let r=this.cache,i=t.length,a=kc(n,i);Dc(r,a)||(e.uniform1iv(this.addr,a),Oc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Gc(gc):hc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function pl(e,t,n){let r=this.cache,i=t.length,a=kc(n,i);Dc(r,a)||(e.uniform1iv(this.addr,a),Oc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||yc,a[e])}function ml(e,t,n){let r=this.cache,i=t.length,a=kc(n,i);Dc(r,a)||(e.uniform1iv(this.addr,a),Oc(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?Gc(_c):bc;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function hl(e,t,n){let r=this.cache,i=t.length,a=kc(n,i);Dc(r,a)||(e.uniform1iv(this.addr,a),Oc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||vc,a[e])}function gl(e){switch(e){case 5126:return Zc;case 35664:return Qc;case 35665:return $c;case 35666:return el;case 35674:return tl;case 35675:return nl;case 35676:return rl;case 5124:case 35670:return il;case 35667:case 35671:return al;case 35668:case 35672:return ol;case 35669:case 35673:return sl;case 5125:return cl;case 36294:return ll;case 36295:return ul;case 36296:return dl;case 35678:case 36198:case 36298:case 36306:case 35682:return fl;case 35679:case 36299:case 36307:return pl;case 35680:case 36300:case 36308:case 36293:return ml;case 36289:case 36303:case 36311:case 36292:return hl}}var _l=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Xc(t.type)}},vl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=gl(t.type)}},yl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},bl=/(\w+)(\])?(\[|\.)?/g;function xl(e,t){e.seq.push(t),e.map[t.id]=t}function Sl(e,t,n){let r=e.name,i=r.length;for(bl.lastIndex=0;;){let a=bl.exec(r),o=bl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){xl(n,l===void 0?new _l(s,e,t):new vl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new yl(s),xl(n,e)),n=e}}}var Cl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Sl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function wl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Tl=37297,El=0;function Dl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Ol=new U;function kl(e){Er._getMatrix(Ol,Er.workingColorSpace,e);let t=`mat3( ${Ol.elements.map(e=>e.toFixed(4))} )`;switch(Er.getTransfer(e)){case Gn:return[t,`LinearTransferOETF`];case Kn:return[t,`sRGBTransferOETF`];default:return z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Al(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Dl(e.getShaderSource(t),r)}return i}function jl(e,t){let n=kl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Ml={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Nl(e,t){let n=Ml[t];return n===void 0?(z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Pl=new H;function Fl(){return Er.getLuminanceCoefficients(Pl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Pl.x.toFixed(4)}, ${Pl.y.toFixed(4)}, ${Pl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Il(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(zl).join(`
`)}function Ll(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Rl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function zl(e){return e!==``}function Bl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Vl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Hl=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ul(e){return e.replace(Hl,Wl)}function Wl(e,t){let n=X[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return Ul(n)}var Gl=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kl(e){return e.replace(Gl,ql)}function ql(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Jl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Yl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Xl(e){return Yl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Zl={302:`ENVMAP_MODE_REFRACTION`};function Ql(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Zl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var $l={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function eu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:$l[e.combine]||`ENVMAP_BLENDING_NONE`}function tu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Xl(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=Ql(n),d=eu(n),f=Il(n),p=Ll(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(zl).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(zl).join(`
`),g.length>0&&(g+=`
`)):(h=[Jl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(zl).join(`
`),g=[Jl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:X.tonemapping_pars_fragment,n.toneMapping===0?``:Nl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,X.colorspace_pars_fragment,jl(`linearToOutputTexel`,n.outputColorSpace),Fl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(zl).join(`
`)),o=Ul(o),o=Bl(o,n),o=Vl(o,n),s=Ul(s),s=Bl(s,n),s=Vl(s,n),o=Kl(o),s=Kl(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=wl(i,i.VERTEX_SHADER,v),x=wl(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Al(i,b,`vertex`),n=Al(i,x,`fragment`);B(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Cl(i,m),w=Rl(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Tl)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=El++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var nu=0,ru=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new iu(e),t.set(e,n)),n}},iu=class{constructor(e){this.id=nu++,this.code=e,this.usedTimes=0}};function au(e){return e===1030||e===37490||e===36285}function ou(e,t,n,r,i,a){let o=new $r,s=new ru,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Ps[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,P=!!i.map,ee=!!i.matcap,te=!!b,ne=te&&b.isPMREMTexture===!0,re=!!i.aoMap,ie=!!i.lightMap,ae=!!i.bumpMap&&i.wireframe===!1,oe=!!i.normalMap,se=!!i.displacementMap,ce=!!i.emissiveMap,le=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.diffuseRoughness>0,me=i.dispersion>0,he=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=de&&!!i.anisotropyMap,be=fe&&!!i.clearcoatMap,xe=fe&&!!i.clearcoatNormalMap,Se=fe&&!!i.clearcoatRoughnessMap,Ce=pe&&!!i.diffuseRoughnessMap,F=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,I=!!i.specularMap,De=!!i.specularColorMap,L=!!i.specularIntensityMap,R=ve&&!!i.transmissionMap,Oe=ve&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,Ne=!!i.extensions,Pe=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let Fe=ne?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Ie={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Er.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:P,matcap:ee,envMap:te,envMapMode:te&&b.mapping,envMapPMREM:ne,envMapMaxLod:ne?Fe.length-1:null,envMapSize:ne?Fe[0].width:null,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:oe,displacementMap:se,emissiveMap:ce,normalMapObjectSpace:oe&&i.normalMapType===1,normalMapTangentSpace:oe&&i.normalMapType===0,packedNormalMap:oe&&i.normalMapType===0&&au(i.normalMap.format),metalnessMap:le,roughnessMap:ue,anisotropy:de,anisotropyMap:ye,clearcoat:fe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,diffuseRoughness:pe,diffuseRoughnessMap:Ce,dispersion:me,retroreflection:he,iridescence:ge,iridescenceMap:F,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:I,specularColorMap:De,specularIntensityMap:L,transmission:ve,transmissionMap:R,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:P&&p(i.map.channel),aoMapUv:re&&p(i.aoMap.channel),lightMapUv:ie&&p(i.lightMap.channel),bumpMapUv:ae&&p(i.bumpMap.channel),normalMapUv:oe&&p(i.normalMap.channel),displacementMapUv:se&&p(i.displacementMap.channel),emissiveMapUv:ce&&p(i.emissiveMap.channel),metalnessMapUv:le&&p(i.metalnessMap.channel),roughnessMapUv:ue&&p(i.roughnessMap.channel),anisotropyMapUv:ye&&p(i.anisotropyMap.channel),clearcoatMapUv:be&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:Ce&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:F&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&p(i.sheenRoughnessMap.channel),specularMapUv:I&&p(i.specularMap.channel),specularColorMapUv:De&&p(i.specularColorMap.channel),specularIntensityMapUv:L&&p(i.specularIntensityMap.channel),transmissionMapUv:R&&p(i.transmissionMap.channel),thicknessMapUv:Oe&&p(i.thicknessMap.channel),alphaMapUv:Ae&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(oe||de),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(P||Ae),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&oe===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:P&&i.map.isVideoTexture===!0&&Er.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ce&&i.emissiveMap.isVideoTexture===!0&&Er.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ne&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Ps[t];n=wo.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new tu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function su(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function cu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function lu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function uu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||cu),r.length>1&&r.sort(t||lu),i.length>1&&i.sort(t||lu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function du(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new uu,e.set(t,[i])):n>=r.length?(i=new uu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function fu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new H,color:new G};break;case`SpotLight`:n={position:new H,direction:new H,color:new G,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new H,color:new G,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new H,skyColor:new G,groundColor:new G};break;case`RectAreaLight`:n={color:new G,position:new H,halfWidth:new H,halfHeight:new H}}return e[t.id]=n,n}}}function pu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var mu=0;function hu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function gu(e){let t=new fu,n=pu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new H);let i=new H,a=new Hr,o=new Hr;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(hu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=mu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function _u(e){let t=new gu(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function vu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new _u(e),t.set(n,[a])):r>=i.length?(a=new _u(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var yu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xu=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],Su=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],Cu=new Hr,wu=new H,Tu=new H;function Eu(e,t,n){let r=new ro,i=new V,a=new V,o=new Lr,s=new ko,c=new Ao,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Do({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:yu,fragmentShader:bu}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new va;m.setAttribute(`position`,new ra(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new K(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(z(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){z(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new zr(i.x,i.y,{format:Yt,type:It,minFilter:Et,magFilter:Et,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new co(i.x,i.y,Ft),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Gt,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ct,d.map.depthTexture.magFilter=Ct}else l.isPointLight?(d.map=new Us(i.x),d.map.depthTexture=new lo(i.x,Pt)):(d.map=new zr(i.x,i.y),d.map.depthTexture=new co(i.x,i.y,Pt)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Gt,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Et,d.map.depthTexture.magFilter=Et):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ct,d.map.depthTexture.magFilter=Ct);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),wu.setFromMatrixPosition(l.matrixWorld),e.position.copy(wu),Tu.copy(e.position),Tu.add(xu[t]),e.up.copy(Su[t]),e.lookAt(Tu),e.updateMatrixWorld(),n.makeTranslation(-wu.x,-wu.y,-wu.z),Cu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Cu,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new zr(i.x,i.y,{format:Yt,type:It}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Du(e,t){function n(){let t=!1,n=new Lr,r=null,i=new Lr(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?le(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=or[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?le(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,ee=e.getParameter(e.VERSION);ee.indexOf(`WebGL`)===-1?ee.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(ee)[1]),N=P>=1);let te=null,ne={},re=e.getParameter(e.SCISSOR_BOX),ie=e.getParameter(e.VIEWPORT),ae=new Lr().fromArray(re),oe=new Lr().fromArray(ie);function se(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ce={};ce[e.TEXTURE_2D]=se(e.TEXTURE_2D,e.TEXTURE_2D,1),ce[e.TEXTURE_CUBE_MAP]=se(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[e.TEXTURE_2D_ARRAY]=se(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ce[e.TEXTURE_3D]=se(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),le(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),le(e.CULL_FACE),ge(0);function le(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ue(e.BLEND),g=!1);else if(g===!1&&(le(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:B(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:B(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:B(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:B(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):le(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?le(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(le(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function be(t){t!==k&&(N&&e.lineWidth(t),k=t)}function xe(t,n,r){t?(le(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?le(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+M-1),te!==t&&(e.activeTexture(t),te=t)}function F(t,n,r){r===void 0&&(r=te===null?e.TEXTURE0+M-1:te);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(te!==r&&(e.activeTexture(r),te=r),e.bindTexture(t,n||ce[t]),i.type=t,i.texture=n)}function we(){let t=ne[te];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function I(){try{e.texSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function L(){try{e.compressedTexSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function R(){try{e.compressedTexSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function je(){try{e.texImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Me(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){ae.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ae.copy(t))}function Fe(t){oe.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),oe.copy(t))}function Ie(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Le(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},te=null,ne={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new G(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ae.set(0,0,e.canvas.width,e.canvas.height),oe.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:le,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:F,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Ae,texImage3D:je,pixelStorei:Ne,getParameter:Me,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:I,texSubImage3D:De,compressedTexSubImage2D:L,compressedTexSubImage3D:R,scissor:Pe,viewport:Fe,reset:Re}}function Ou(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new V,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):$n(`canvas`)}function v(e,t,n){let r=1,i=Oe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Gn:Er.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),P(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function P(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let ee=0;function te(){ee=0}function ne(){return ee}function re(e){ee=e}function ie(){let e=ee;return e>=i.maxTextures&&z(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ee+=1,e}function ae(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function oe(t,i){let a=r.get(t);if(t.isVideoTexture&&L(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{_e(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function ce(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function le(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ue={[bt]:e.REPEAT,[xt]:e.CLAMP_TO_EDGE,[St]:e.MIRRORED_REPEAT},de={[Ct]:e.NEAREST,[wt]:e.NEAREST_MIPMAP_NEAREST,[Tt]:e.NEAREST_MIPMAP_LINEAR,[Et]:e.LINEAR,[Dt]:e.LINEAR_MIPMAP_NEAREST,[Ot]:e.LINEAR_MIPMAP_LINEAR},fe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function pe(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ue[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ue[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ue[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,de[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,de[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,fe[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function me(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ae(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function he(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ge(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=he(n.start,r.width,4),c=he(t.start,r.width,4);n.start<=i+1&&a===c&&he(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function _e(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=me(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Er.getPrimaries(Er.workingColorSpace),r=o.colorSpace===``?null:Er.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=R(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);pe(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===Kt,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ge(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=As(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=As(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Oe(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Oe(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ve(t,o,s){if(o.image.length!==6)return;let c=me(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Er.getPrimaries(Er.workingColorSpace),r=o.colorSpace===``?null:Er.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=R(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);pe(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===Kt,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Oe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ye(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,I(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;De(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,I(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,I(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);De(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,I(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,I(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function xe(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?le(i.depthTexture,0):oe(i.depthTexture,0);let u=c.__webglTexture,d=I(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Se(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)xe(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?xe(i.__webglFramebuffer[0],t,0):xe(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),be(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),be(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,i){let a=r.get(t);n!==void 0&&ye(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Se(t)}function F(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&De(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=I(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),be(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),pe(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ye(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),pe(c,a),ye(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),pe(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ye(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&Se(t)}function we(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Te=[];function Ee(t){if(t.samples>0){if(De(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Te.length=0,Te.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Te.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function I(e){return Math.min(i.maxSamples,e.samples)}function De(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function L(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function R(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Er.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):B(`WebGLTextures: Unsupported texture color space:`,n)),t}function Oe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=ie,this.resetTextureUnits=te,this.getTextureUnits=ne,this.setTextureUnits=re,this.setTexture2D=oe,this.setTexture2DArray=se,this.setTexture3D=ce,this.setTextureCube=le,this.rebindTextures=Ce,this.setupRenderTarget=F,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=De,this.dispose=j}function ku(e,t){function n(n,r=``){let i,a=Er.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Au=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ju=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Mu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new uo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Do({vertexShader:Au,fragmentShader:ju,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new K(new _o(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Nu=class extends sr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Mu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new V,C=null,w=null,T=new us;T.viewport=new Lr;let E=new us;E.viewport=new Lr;let D=[T,E],O=new _s,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new _i,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new _i,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new _i,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,re.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Kt:Gt,a=_.stencil?zt:Pt);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new zr(d.textureWidth,d.textureHeight,{format:Wt,type:kt,depthTexture:new co(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new zr(f.framebufferWidth,f.framebufferHeight,{format:Wt,type:kt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),re.setContext(r),re.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function P(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;P(O,i);for(let e=0;e<a.length;e++)P(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ee(e,O,i)};function ee(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ur*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let te=null;function ne(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new us,o.layers.enable(n),o.viewport=new Lr,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new uo,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}te&&te(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let re=new Ms;re.setAnimationLoop(ne),this.setAnimationLoop=function(e){te=e},this.dispose=function(){}}},Pu=new Hr,Fu=new U;Fu.set(-1,0,0,0,1,0,0,0,1);function Iu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Co(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Pu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Fu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Lu(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):z(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var Ru=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),zu=null;function Bu(){return zu===null&&(zu=new Wa(Ru,16,16,Yt,It),zu.name=`DFG_LUT`,zu.minFilter=Et,zu.magFilter=Et,zu.wrapS=xt,zu.wrapT=xt,zu.generateMipmaps=!1,zu.needsUpdate=!0),zu}var Vu=class{constructor(e={}){let{canvas:t=er(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=kt}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([Zt,Xt,Jt]),g=new Set([kt,Pt,Mt,zt,Lt,Rt]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Un;let j=0,M=0,N=null,P=-1,ee=null,te=new Lr,ne=new Lr,re=null,ie=new G(0),ae=0,oe=t.width,se=t.height,ce=1,le=null,ue=null,de=new Lr(0,0,oe,se),fe=new Lr(0,0,oe,se),pe=!1,me=new ro,he=new ao,ge=!1,_e=!1,ve=new Hr,ye=new H,be=new Lr,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Se=!1;function Ce(){return N===null?ce:1}let F=n;function we(e,n){return t.getContext(e,n)}let Te,Ee,I,De,L,R,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,qe,!1),t.addEventListener(`webglcontextrestored`,Je,!1),t.addEventListener(`webglcontextcreationerror`,Ye,!1),F===null){let t=`webgl2`;if(F=we(t,e),F===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ge()}catch(e){throw t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),B(`WebGLRenderer: `+e.message),e}function Ge(){Te=new sc(F),Te.init(),He=new ku(F,Te),Ee=new Vs(F,Te,e,He),I=new Du(F,Te),Ee.reversedDepthBuffer&&d&&I.buffers.depth.setReversed(!0),O=F.createFramebuffer(),k=F.createFramebuffer(),A=F.createFramebuffer(),De=new uc(F),L=new su,R=new Ou(F,Te,I,L,Ee,He,De),Oe=new oc(T),ke=new Ns(F),Ue=new zs(F,ke),Ae=new cc(F,ke,De,Ue),je=new fc(F,Ae,ke,Ue,De),ze=new dc(F,Ee,R),Ie=new Hs(L),Me=new ou(T,Oe,Te,Ee,Ue,Ie),Ne=new Iu(T,L),Pe=new du,Fe=new vu(Te),Re=new Rs(T,Oe,I,je,p,s),Le=new Eu(T,je,Ee),We=new Lu(F,De,Ee,I),Be=new Bs(F,Te,De),Ve=new lc(F,Te,De),De.programs=Me.programs,T.capabilities=Ee,T.extensions=Te,T.properties=L,T.renderLists=Pe,T.shadowMap=Le,T.state=I,T.info=De}m!==1009&&(w=new mc(m,t.width,t.height,o,r,i));let Ke=new Nu(T,F);this.xr=Ke,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ce},this.setPixelRatio=function(e){e!==void 0&&(ce=e,this.setSize(oe,se,!1))},this.getSize=function(e){return e.set(oe,se)},this.setSize=function(e,n,r=!0){Ke.isPresenting?z(`WebGLRenderer: Can't change size while VR device is presenting.`):(oe=e,se=n,t.width=Math.floor(e*ce),t.height=Math.floor(n*ce),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(oe*ce,se*ce).floor()},this.setDrawingBufferSize=function(e,n,r){oe=e,se=n,ce=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)B(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(te)},this.getViewport=function(e){return e.copy(de)},this.setViewport=function(e,t,n,r){e.isVector4?de.set(e.x,e.y,e.z,e.w):de.set(e,t,n,r),I.viewport(te.copy(de).multiplyScalar(Ce()).round())},this.getScissor=function(e){return e.copy(fe)},this.setScissor=function(e,t,n,r){e.isVector4?fe.set(e.x,e.y,e.z,e.w):fe.set(e,t,n,r),I.scissor(ne.copy(fe).multiplyScalar(Ce()).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(e){I.setScissorTest(pe=e)},this.setOpaqueSort=function(e){le=e},this.setTransparentSort=function(e){ue=e},this.getClearColor=function(e){return e.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Re.getClearColor(),r=Re.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,F.clearBufferuiv(F.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,F.clearBufferiv(F.COLOR,0,v))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),Re.dispose(),Pe.dispose(),Fe.dispose(),R.dispose(),L.dispose(),Oe.dispose(),je.dispose(),Ae.dispose(),Ue.dispose(),We.dispose(),Me.dispose(),Ke.dispose(),Ke.removeEventListener(`sessionstart`,nt),Ke.removeEventListener(`sessionend`,rt),it.stop()};function qe(e){e.preventDefault(),nr(`WebGLRenderer: Context Lost.`),E=!0}function Je(){nr(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Le.enabled,n=Le.autoUpdate,r=Le.needsUpdate,i=Le.type;Ge(),De.autoReset=e,Le.enabled=t,Le.autoUpdate=n,Le.needsUpdate=r,Le.type=i}function Ye(e){B(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Xe(e){let t=e.target;t.removeEventListener(`dispose`,Xe),Ze(t)}function Ze(e){Qe(e),L.remove(e)}function Qe(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){Me.releaseProgram(e)}),e.isShaderMaterial&&Me.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=xe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ht(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ae.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ue.setup(i,r,s,n,c);let h,g=Be;if(c!==null&&(h=ke.get(c),g=Ve,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ke.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function $e(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ge===!0&&Ie.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,dt(e,t,r),e.side=0,e.needsUpdate=!0,dt(e,t,r),e.side=2):dt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Fe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),_e=this.localClippingEnabled,ge=Ie.init(this.clippingPlanes,_e),ge===!0&&Ie.setGlobalState(this.clippingPlanes,t),D!==null&&Le.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];$e(o,n,t,e),r.add(o)}else $e(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let et=null;function tt(e){et&&et(e)}function nt(){it.stop()}function rt(){it.start()}let it=new Ms;it.setAnimationLoop(tt),typeof self<`u`&&it.setContext(self),this.setAnimationLoop=function(e){et=e,Ke.setAnimationLoop(e),e===null?it.stop():it.start()},Ke.addEventListener(`sessionstart`,nt),Ke.addEventListener(`sessionend`,rt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){B(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ke.enabled===!0&&Ke.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ke.enabled===!0&&Ke.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ke.cameraAutoUpdate===!0&&Ke.updateCamera(t),t=Ke.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Fe.get(e,C.length),x.init(t),x.state.textureUnits=R.getTextureUnits(),C.push(x),ve.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?he.setFromArrayCamera(t):me.setFromProjectionMatrix(ve,Xn,t.reversedDepth),_e=this.localClippingEnabled,ge=Ie.init(this.clippingPlanes,_e),b=Pe.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Ke.enabled===!0&&Ke.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&at(e,t,-1/0,T.sortObjects)}at(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(le,ue),Se=Ke.enabled===!1||Ke.isPresenting===!1||Ke.hasDepthSensing()===!1,Se&&Re.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),ge===!0&&Ie.beginShadows();let i=x.state.shadowsArray;if(Le.render(i,e,t),ge===!0&&Ie.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];st(n,r,e,a)}Se&&Re.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ot(b,e,n,n.viewport)}}else r.length>0&&st(n,r,e,t),Se&&Re.render(e),ot(b,e,t)}N!==null&&M===0&&(R.updateMultisampleRenderTarget(N),R.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ue.resetDefaultState(),P=-1,ee=null,C.pop(),C.length>0?(x=C[C.length-1],R.setTextureUnits(x.state.textureUnits),ge===!0&&Ie.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function at(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?he:me;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&be.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ve);let i=je.update(e),a=e.material;a.visible&&b.push(e,i,a,n,be.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?he:me;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=je.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),be.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),be.copy(e.boundingSphere.center)),be.applyMatrix4(e.matrixWorld).applyMatrix4(ve)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,be.z,s,t)}}else a.visible&&b.push(e,i,a,n,be.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)at(i[e],t,n,r)}function ot(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ge===!0&&Ie.setGlobalState(T.clippingPlanes,n),r&&I.viewport(te.copy(r)),i.length>0&&ct(i,t,n),a.length>0&&ct(a,t,n),o.length>0&&ct(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function st(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new zr(1,1,{generateMipmaps:!0,type:e?It:kt,minFilter:Ot,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Er.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||te;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ie),ae=T.getClearAlpha(),ae<1&&T.setClearColor(16777215,.5),T.clear(),Se&&Re.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ge===!0&&Ie.setGlobalState(T.clippingPlanes,r),ct(e,n,r),R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,lt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ie,ae),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&lt(o,t,n,s,l,c)}}function lt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ut(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function dt(e,t,n){t.isScene!==!0&&(t=xe);let r=L.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Me.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Me.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Oe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Xe),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return mt(e,s),d}else s.uniforms=Me.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Me.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ie.uniform),mt(e,s),r.needsLights=_t(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=ut(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function ft(e,t,n,r,i){let a=L.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=dt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function pt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Cl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function mt(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ht(e,t,n,r,i){t.isScene!==!0&&(t=xe),R.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Er.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Oe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),b=x.state.lights;if(ge===!0&&(_e===!0||e!==ee)){let t=e===ee&&r.id===P;Ie.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ie.numPlanes||v.numIntersection!==Ie.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===ut(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?ft(r,t,i,s,h):dt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(I.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==P&&(P=r.id,O=!0),E||ee!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(F,`projectionMatrix`,e.projectionMatrix),A.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(F,ye.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&A.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),ee!==e&&(ee=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(F,`sunShadowMap`,b.state.sunShadowMap,R),b.state.directionalShadowMap.length>0&&A.setValue(F,`directionalShadowMap`,b.state.directionalShadowMap,R),b.state.spotShadowMap.length>0&&A.setValue(F,`spotShadowMap`,b.state.spotShadowMap,R),b.state.pointShadowMap.length>0&&A.setValue(F,`pointShadowMap`,b.state.pointShadowMap,R)),i.isSkinnedMesh){A.setOptional(F,i,`bindMatrix`),A.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(F,`boneTexture`,e.boneTexture,R))}i.isBatchedMesh&&(A.setOptional(F,i,`batchingTexture`),A.setValue(F,`batchingTexture`,i._matricesTexture,R),A.setOptional(F,i,`batchingIdTexture`),A.setValue(F,`batchingIdTexture`,i._indirectTexture,R),A.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(F,`batchingColorTexture`,i._colorsTexture,R));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&ze.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=Bu()),O){if(A.setValue(F,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&gt(j,k),a&&r.fog===!0&&Ne.refreshFogUniforms(j,a),Ne.refreshMaterialUniforms(j,r,ce,se,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Cl.upload(F,pt(v),j,R)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Cl.upload(F,pt(v),j,R),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(F,`center`,i.center),A.setValue(F,`modelViewMatrix`,i.modelViewMatrix),A.setValue(F,`normalMatrix`,i.normalMatrix),A.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];We.update(n,w),We.bind(n,w)}}return w}function gt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function _t(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),te.copy(e.viewport),ne.copy(e.scissor),re=e.scissorTest,I.viewport(te),I.scissor(ne),I.setScissorTest(re),P=-1;return}if(o.__webglFramebuffer===void 0)R.setupRenderTarget(e);else if(o.__hasExternalTextures)R.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);R.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&R.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,te.copy(e.viewport),ne.copy(e.scissor),re=e.scissorTest}else te.copy(de).multiplyScalar(ce).floor(),ne.copy(fe).multiplyScalar(ce).floor(),re=pe;if(n!==0&&(r=O),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(te),I.scissor(ne),I.setScissorTest(re),i){let r=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}P=-1};function vt(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=vt(o);if(u.__formatReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,He.convert(c),He.convert(l),a)}finally{let e=N===null?null:L.get(N).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=vt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,He.convert(l),He.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=N===null?null:L.get(N).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await ar(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;R.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=He.convert(t.format),_=He.convert(t.type),v;t.isData3DTexture?(R.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(R.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(R.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,k),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&R.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?R.setTextureCube(e,0):e.isData3DTexture?R.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?R.setTexture2DArray(e,0):R.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,I.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Er._getDrawingBufferColorSpace(e),t.unpackColorSpace=Er._getUnpackColorSpace()}};function Hu(e){let t=e>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function Uu(e,t){let n=document.createElement(`canvas`);n.width=e,n.height=t;let r=n.getContext(`2d`);if(!r)throw Error(`não foi possível criar o contexto 2d de textura`);return r}var Wu=1;function Gu(e){Wu=Math.max(1,e)}function Ku(e){let t=new so(e.canvas);return t.colorSpace=Un,t.magFilter=Et,t.minFilter=Ot,t.generateMipmaps=!0,t.anisotropy=Wu,t}function qu(){let e=Uu(64,64),t=Hu(101);e.fillStyle=`#3b3b41`,e.fillRect(0,0,64,64);for(let n=0;n<26;n++)e.fillStyle=t()>.5?`#36363c`:`#404048`,e.fillRect(t()*64,t()*64,2+t()*6,2+t()*5);e.strokeStyle=`#2c2c31`,e.lineWidth=1;for(let n=0;n<3;n++){e.beginPath();let n=t()*64,r=t()*64;e.moveTo(n,r);for(let i=0;i<4;i++)n+=(t()-.5)*18,r+=(t()-.5)*18,e.lineTo(n,r);e.stroke()}return e.fillStyle=`#4d4450`,e.beginPath(),e.arc(14,46,2.2,0,Math.PI*2),e.fill(),Ku(e)}function Ju(){let e=Uu(8,64),t=Hu(7);e.fillStyle=`#e7c53b`;for(let n=4;n<60;n+=16)e.fillRect(2+(t()-.5)*4,n+(t()-.5)*3,3+t()*2,9+t()*3);return Ku(e)}function Yu(){let e=Uu(32,16),t=Hu(33);e.fillStyle=`#d9b23c`,e.fillRect(0,0,32,16),e.fillStyle=`#1c1a20`;for(let n=-8;n<32;n+=12){let r=4+t()*4;e.beginPath(),e.moveTo(n,16),e.lineTo(n+r,0),e.lineTo(n+r+5,0),e.lineTo(n+5,16),e.closePath(),e.fill()}return Ku(e)}function Xu(){let e=Uu(64,64),t=Hu(55);e.fillStyle=`#8a5a3b`,e.fillRect(0,0,64,64),e.lineWidth=1;for(let n=0;n<90;n++){e.strokeStyle=t()>.35?`#6e4630`:`#9d6c49`;let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.lineTo(n+(t()-.5)*6,r+2+t()*5),e.stroke()}return Ku(e)}function Zu(){let e=Uu(64,64),t=Hu(77);e.fillStyle=`#ff5a1f`,e.fillRect(0,0,64,64),e.fillStyle=`#f2ede2`;for(let n of[{y:18,h:9},{y:36,h:7}])for(let r=0;r<64;r+=4)e.fillRect(r,n.y+(t()-.5)*4,4,n.h);e.fillStyle=`rgba(40, 36, 34, 0.5)`;for(let n=0;n<10;n++)e.fillRect(t()*64,52+t()*10,3+t()*5,2+t()*3);return Ku(e)}function Qu(){let e=Uu(64,48),t=Hu(2211);e.fillStyle=`#f3ead1`,e.fillRect(0,0,64,48);for(let n=2;n<62;n+=7)e.fillStyle=n/7%2==0?`#cf3f36`:`#3a5ba8`,e.fillRect(n+(t()-.5)*2,1+(t()-.5)*2,4,3),e.fillRect(n+(t()-.5)*2,44+(t()-.5)*2,4,3);e.strokeStyle=`#c9b98f`,e.lineWidth=2,e.beginPath(),e.moveTo(3,6),e.lineTo(33+(t()-.5)*6,26+(t()-.5)*4),e.lineTo(61,6),e.stroke(),e.save(),e.translate(50,12),e.rotate(.12),e.fillStyle=`#d9842e`,e.fillRect(-6,-6,12,12),e.strokeStyle=`#fff3b0`,e.lineWidth=1,e.strokeRect(-4.5,-4.5,9,9),e.restore(),e.strokeStyle=`#4a4238`,e.lineWidth=1;for(let n=0;n<3;n++){let r=28+n*5+(t()-.5)*2;e.beginPath(),e.moveTo(8,r),e.lineTo(28+t()*18,r+(t()-.5)*2),e.stroke()}return Ku(e)}function $u(){let e=Uu(64,64),t=Hu(1337);e.fillStyle=`#3f6d9e`,e.fillRect(0,0,64,64);for(let n=0;n<22;n++)e.fillStyle=t()>.5?`#3a6592`:`#4677ab`,e.fillRect(t()*64,t()*64,3+t()*7,3+t()*6);e.strokeStyle=`#2c4e73`,e.lineWidth=2,e.strokeRect(10,24,18,16),e.beginPath(),e.moveTo(10,29),e.lineTo(28,31),e.stroke(),e.fillStyle=`#e8e4da`;for(let n=8;n<60;n+=12)e.beginPath(),e.arc(42+(t()-.5)*5,n+(t()-.5)*3,2,0,Math.PI*2),e.fill();return Ku(e)}function ed(){let e=Uu(64,64),t=Hu(4242);e.fillStyle=`#a8392c`,e.fillRect(0,0,64,64);for(let n=0;n<14;n++)e.fillStyle=t()>.5?`#9c3328`:`#b24234`,e.fillRect(t()*64,t()*64,3+t()*6,3+t()*5);e.fillStyle=`#e8e0cc`,e.beginPath(),e.moveTo(15,4),e.lineTo(50,6),e.lineTo(53,62),e.lineTo(11,60),e.closePath(),e.fill();for(let n=0;n<9;n++)e.fillStyle=t()>.5?`rgba(122, 90, 44, 0.55)`:`rgba(150, 52, 38, 0.5)`,e.beginPath(),e.arc(16+t()*34,10+t()*34,2+t()*4,0,Math.PI*2),e.fill();e.strokeStyle=`#5a4632`,e.lineWidth=2,e.beginPath(),e.moveTo(22,40),e.lineTo(42,16),e.stroke(),e.fillStyle=`#8a4a2e`;for(let t of[.3,.55,.8])e.beginPath(),e.arc(22+20*t,40-24*t,3,0,Math.PI*2),e.fill();return e.strokeStyle=`#b8ae92`,e.lineWidth=2,e.strokeRect(20,47,15,11),e.beginPath(),e.moveTo(20,50),e.lineTo(35,49),e.stroke(),Ku(e)}function td(){let e=Uu(32,32),t=Hu(606);e.fillStyle=`#9b958e`,e.fillRect(0,0,32,32);for(let n=0;n<18;n++)e.fillStyle=t()>.5?`#aba49b`:`#847e77`,e.beginPath(),e.arc(t()*32,t()*32,2+t()*5,0,Math.PI*2),e.fill();e.strokeStyle=`#b8b2a8`,e.lineWidth=1;for(let n=0;n<4;n++){let n=4+t()*24,r=8+t()*18;e.beginPath(),e.moveTo(n,r+5),e.quadraticCurveTo(n+3,r+2,n,r),e.stroke()}return Ku(e)}function nd(){let e=Uu(64,64),t=Hu(1913);e.fillStyle=`#8d8a84`,e.fillRect(0,0,64,64);for(let n=0;n<16;n++)e.fillStyle=t()>.5?`#817e78`:`#99958e`,e.fillRect(t()*64,t()*64,3+t()*7,3+t()*6);e.lineWidth=1;for(let n=0;n<70;n++){e.strokeStyle=t()>.4?`#6f6c66`:`#a6a29a`;let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.lineTo(n+(t()-.5)*6,r+2+t()*5),e.stroke()}return Ku(e)}function rd(){let e=Uu(64,64),t=Hu(515);e.fillStyle=`#e8b63a`,e.fillRect(0,0,64,64);for(let n=0;n<12;n++)e.fillStyle=t()>.5?`#ddab31`:`#f0c04a`,e.fillRect(t()*64,t()*64,4+t()*8,3+t()*6);e.fillStyle=`#1c1a20`;for(let n=-16;n<72;n+=14){let r=6+t()*5;e.beginPath(),e.moveTo(n,44),e.lineTo(n+r,20),e.lineTo(n+r+6,20),e.lineTo(n+6,44),e.closePath(),e.fill()}e.strokeStyle=`#8a6f24`,e.lineWidth=1;for(let n=0;n<5;n++){let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.lineTo(n+(t()-.5)*14,r+(t()-.5)*10),e.stroke()}e.fillStyle=`#6e6861`;for(let[n,r]of[[8,8],[54,56]])e.beginPath(),e.arc(n+(t()-.5)*3,r+(t()-.5)*3,2.4,0,Math.PI*2),e.fill();return Ku(e)}function id(){let e=Uu(64,64),t=Hu(737);e.fillStyle=`#9da2a8`,e.fillRect(0,0,64,64),e.lineWidth=1;for(let n=0;n<46;n++){e.strokeStyle=t()>.45?`#83888f`:`#b3b8bd`;let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.quadraticCurveTo(n+3,r+3+t()*3,n+6+t()*3,r+2),e.stroke()}for(let n=0;n<7;n++)e.fillStyle=t()>.5?`rgba(74, 134, 94, 0.55)`:`rgba(116, 82, 136, 0.5)`,e.beginPath(),e.arc(18+t()*16,12+t()*14,2+t()*4,0,Math.PI*2),e.fill();return Ku(e)}function ad(){let e=Uu(64,64),t=Hu(1119);e.fillStyle=`#8a6a44`,e.fillRect(0,0,64,64);for(let n=0;n<24;n++)e.fillStyle=t()>.5?`#7e5f3c`:`#96754d`,e.fillRect(t()*64,t()*64,3+t()*7,2+t()*6);e.strokeStyle=`#6f5334`,e.lineWidth=1;for(let n=0;n<14;n++){let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.lineTo(n+6+t()*8,r+(t()-.5)*4),e.stroke()}return e.fillStyle=`rgba(90, 128, 62, 0.7)`,e.beginPath(),e.arc(46,18,3,0,Math.PI*2),e.fill(),e.fillStyle=`rgba(214, 177, 62, 0.7)`,e.fillRect(12,50,7,3),Ku(e)}var od=[`#cf3f36`,`#3a5ba8`,`#d9a62e`,`#4e8a52`],sd=od.length;function cd(e){let t=Uu(64,48),n=Hu(2026+e*31);t.fillStyle=`#efe8d8`,t.fillRect(0,0,64,48),t.fillStyle=od[e%od.length];for(let e=0;e<64;e+=16){let r=(n()-.5)*5;t.beginPath(),t.moveTo(e,0),t.lineTo(e+8,0),t.lineTo(e+8+r,48),t.lineTo(e+r,48),t.closePath(),t.fill()}t.fillStyle=`rgba(70, 58, 40, 0.3)`;for(let e=0;e<8;e++)t.fillRect(n()*64,40+n()*8,4+n()*7,2+n()*3);return Ku(t)}function ld(){let e=Uu(32,16),t=Hu(808);e.fillStyle=`#b08954`,e.fillRect(0,0,32,16),e.strokeStyle=`#6e5231`,e.lineWidth=1;for(let n of[5,11])e.beginPath(),e.moveTo(0,n+(t()-.5)*2),e.lineTo(32,n+(t()-.5)*2),e.stroke();return e.fillStyle=`#9a7646`,e.fillRect(1,0,3,16),e.fillRect(28,0,3,16),e.fillStyle=`#5c431f`,e.beginPath(),e.arc(14+t()*6,6+t()*5,1.4,0,Math.PI*2),e.fill(),Ku(e)}function ud(){let e=Uu(64,64),t=Hu(1717);e.fillStyle=`#ece6d6`,e.fillRect(0,0,64,64),e.lineWidth=1;for(let n=0;n<60;n++){e.strokeStyle=t()>.4?`#d3ccb8`:`#f8f4e8`;let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.quadraticCurveTo(n+2,r+3,n+5+t()*3,r+2),e.stroke()}e.fillStyle=`rgba(122, 94, 58, 0.45)`;for(let n=0;n<6;n++)e.fillRect(t()*64,44+t()*18,2+t()*4,2+t()*3);return Ku(e)}function dd(){let e=Uu(64,64),t=Hu(4545);e.fillStyle=`#d9a62e`,e.fillRect(0,0,64,64);for(let n=0;n<12;n++)e.fillStyle=t()>.5?`#c9981f`:`#e5b545`,e.fillRect(t()*64,t()*64,4+t()*8,3+t()*6);e.strokeStyle=`#8a6a18`,e.lineWidth=2;for(let n=-64;n<128;n+=16){let r=(t()-.5)*5;e.beginPath(),e.moveTo(n+r,0),e.lineTo(n+64+r,64),e.stroke(),e.beginPath(),e.moveTo(n+64+r,0),e.lineTo(n+r,64),e.stroke()}e.fillStyle=`#7a5a10`;for(let n=8;n<64;n+=16)for(let r=8;r<64;r+=16)e.beginPath(),e.arc(r+(t()-.5)*6,n+(t()-.5)*6,1.6,0,Math.PI*2),e.fill();return Ku(e)}function fd(){let e=Uu(64,64),t=Hu(9393);e.fillStyle=`#4e9a44`,e.fillRect(0,0,64,64),e.lineWidth=1;for(let n=0;n<46;n++){e.strokeStyle=t()>.45?`#3d7f35`:`#66b25a`;let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.quadraticCurveTo(n+3,r+3+t()*3,n+6+t()*3,r+2),e.stroke()}for(let n=0;n<6;n++)e.fillStyle=t()>.5?`rgba(214, 196, 74, 0.5)`:`rgba(170, 190, 70, 0.5)`,e.beginPath(),e.arc(20+t()*20,34+t()*20,2+t()*4,0,Math.PI*2),e.fill();return Ku(e)}function pd(){let e=Uu(64,64),t=Hu(3131);e.fillStyle=`#9aa0a6`,e.fillRect(0,0,64,64);for(let n=0;n<10;n++)e.fillStyle=t()>.5?`rgba(140, 94, 52, 0.5)`:`rgba(110, 116, 122, 0.6)`,e.fillRect(t()*64,t()*64,3+t()*7,3+t()*6);e.strokeStyle=`#5f646a`,e.lineWidth=2;for(let n=4;n<64;n+=12){let r=(t()-.5)*4;e.beginPath(),e.moveTo(n+r,0),e.lineTo(n-r,64),e.stroke(),e.beginPath(),e.moveTo(0,n+r),e.lineTo(64,n-r),e.stroke()}return Ku(e)}var md=[`#4f7ca8`,`#d9b23c`,`#c97b8e`,`#6a9a6d`],hd=md.length;function gd(e){let t=Uu(48,64),n=Hu(900+e*17);t.fillStyle=md[e%md.length],t.fillRect(0,0,48,64),t.fillStyle=`rgba(20, 18, 24, 0.35)`,t.beginPath(),t.moveTo(0,0),t.lineTo(48,0),t.lineTo(48,5+n()*3),t.lineTo(0,3+n()*3),t.closePath(),t.fill();for(let e=0;e<4;e++)for(let r=0;r<3;r++)t.fillStyle=n()>.72?`#ffd96b`:`#22242c`,t.fillRect(6+r*14+(n()-.5)*4,11+e*12+(n()-.5)*3,7+(n()-.5)*2,6+(n()-.5)*2);return t.fillStyle=`#2b2430`,t.fillRect(20+(n()-.5)*6,56,9,8),Ku(t)}function _d(){let e=Uu(64,64),t=Hu(2111);e.fillStyle=`#5a7a3e`,e.fillRect(0,0,64,64);for(let n=0;n<26;n++)e.fillStyle=t()>.5?`#4e6c36`:`#6a8a48`,e.fillRect(t()*64,t()*64,3+t()*7,2+t()*6);for(let n=0;n<9;n++)e.fillStyle=t()>.5?`#8a6a44`:`#7e5f3c`,e.fillRect(t()*64,t()*64,4+t()*8,3+t()*5);e.strokeStyle=`#3f5c2c`,e.lineWidth=1;for(let n=0;n<16;n++){let n=t()*64,r=t()*64;e.beginPath(),e.moveTo(n,r),e.lineTo(n+(t()-.5)*3,r-3-t()*3),e.stroke()}return Ku(e)}function vd(){let e=Uu(64,64),t=Hu(1565);e.fillStyle=`#e8e2d2`,e.fillRect(0,0,64,64),e.strokeStyle=`#2a2824`;for(let n of[10,42]){e.lineWidth=9+t()*3,e.beginPath();for(let t=0;t<=64;t+=4){let r=n+Math.sin(t/64*Math.PI*2)*11;t===0?e.moveTo(t,r):e.lineTo(t,r)}e.stroke()}e.fillStyle=`rgba(255, 252, 240, 0.25)`;for(let n=0;n<70;n++)e.fillRect(t()*64,t()*64,1.5,1.5);return Ku(e)}function yd(){let e=Uu(64,64),t=Hu(1904);e.fillStyle=`#d9c38c`,e.fillRect(0,0,64,64);for(let n=0;n<30;n++)e.fillStyle=t()>.5?`#cdb77f`:`#e4d09c`,e.fillRect(t()*64,t()*64,2+t()*6,2+t()*4);for(let n=0;n<24;n++)e.fillStyle=t()>.7?`#f0e8d4`:`#b89f6a`,e.fillRect(t()*64,t()*64,1.5,1.5);return Ku(e)}function bd(){let e=Uu(64,32),t=Hu(2170);e.fillStyle=`#e8e0cc`,e.fillRect(0,0,64,32);let n=[`#d9a62e`,`#3a5ba8`];for(let r=0;r<4;r++){let i=r*16+4,a=(t()-.5)*4;e.fillStyle=n[r%2],e.beginPath(),e.moveTo(i,0),e.lineTo(i+7,0),e.lineTo(i+7+a,32),e.lineTo(i+a,32),e.closePath(),e.fill()}e.strokeStyle=`rgba(60, 50, 40, 0.5)`,e.lineWidth=1;for(let n=0;n<=64;n+=16)e.beginPath(),e.moveTo(n+(t()-.5)*2,0),e.lineTo(n+(t()-.5)*3,32),e.stroke();e.fillStyle=`rgba(120, 100, 70, 0.3)`;for(let n=0;n<10;n++)e.fillRect(t()*64,t()*32,3+t()*4,2+t()*3);return Ku(e)}var xd=[`#c05c4a`,`#4e8a52`,`#3a5ba8`,`#d9a62e`,`#b05a8a`,`#50a8a0`],Sd=xd.length;function Cd(e){let t=Uu(32,32),n=Hu(1808+e*47);t.fillStyle=xd[e%xd.length],t.fillRect(0,0,32,32);for(let e=0;e<5;e++)t.fillStyle=n()>.5?`rgba(146, 94, 66, 0.55)`:`rgba(150, 150, 140, 0.45)`,t.fillRect(n()*32,n()*32,4+n()*7,3+n()*5);let r=8+n()*12,i=8+n()*10;return t.fillStyle=`#f0ead8`,t.fillRect(r-1.5,i-1.5,11,10),t.fillStyle=`#241f28`,t.fillRect(r+(n()-.5)*2,i,8,7),Ku(t)}var wd=new V(240,135),Td=!0;function Ed(e){Td=e,e||wd.set(1e6,1e6)}function Dd(e,t){Td&&wd.set(Math.max(2,e/2),Math.max(2,t/2))}function Q(e){return e.onBeforeCompile=e=>{e.uniforms.uSnapGrid={value:wd},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform vec2 uSnapGrid;`).replace(`#include <project_vertex>`,`#include <project_vertex>
if (gl_Position.w > 0.0) {
  gl_Position.xy = floor(gl_Position.xy / gl_Position.w * uSnapGrid + 0.5) / uSnapGrid * gl_Position.w;
}`)},e}function Od(){let e=Q(new Y({color:7031338})),t=[Q(new Y({color:4156718})),Q(new Y({color:5077557}))],n=Q(new Y({color:4094515})),r=Q(new Y({color:5913634})),i=Q(new Y({color:8223346})),a=Q(new Y({color:9071172})),o=new po(.2,.3,2.2,5),s=new J(1,6,5),c=new po(.11,.16,1.5,5),l=new q(2,.07,.45);l.translate(1,0,0);let u=new J(.16,5,4),d=new J(1,5,4),f=new q(.14,1.1,.14);return{arvore(n){let r=new W,i=new K(o,e);i.position.y=1,r.add(i);for(let e=0;e<2;e++){let i=new K(s,t[e%t.length]),a=1.2+n()*.8;i.scale.set(a,a*(.8+n()*.3),a),i.position.set((n()-.5)*1.1,2.4+e*.8+n()*.5,(n()-.5)*1.1),r.add(i)}return r.rotation.z=(n()-.5)*.12,r.rotation.y=n()*Math.PI*2,r},coqueiro(t){let i=new W,a=.1+t()*.14,o=0,s=0;for(let t=0;t<3;t++){let n=a*(t+.5),r=new K(c,e);r.rotation.z=-n,r.position.set(o+Math.sin(n)*.7,s+Math.cos(n)*.7,0),i.add(r),o+=Math.sin(n)*1.4,s+=Math.cos(n)*1.4}for(let e=0;e<5;e++){let r=new K(l,n);r.position.set(o,s+.15,0),r.rotation.y=e/5*Math.PI*2+t()*.6,r.rotation.z=-.3-t()*.3,i.add(r)}let d=new K(u,r);return d.position.set(o+.18,s-.1,.1),i.add(d),i.rotation.y=t()*Math.PI*2,i},pedra(e){let t=new K(d,i);return t.scale.set(.6+e()*1,.5+e()*.5,.6+e()*1),t.position.y=t.scale.y*.55,t.rotation.y=e()*Math.PI,t},cerca(e){let t=new W,n=Math.max(2,Math.round(e/2.2)+1);for(let r=0;r<n;r++){let i=new K(f,a);i.position.set(r/(n-1)*e-e/2,.55,0),i.rotation.z=r*7919%10*.01-.05,t.add(i)}for(let n of[.5,.88]){let r=new K(new q(e,.09,.05,8,1,1),a);r.position.y=n,t.add(r)}return t}}}var kd=()=>0;function Ad(e){let t=e<0?0:e>1?1:e;return t*t*(3-2*t)}function jd(e,t,n,r,i,a){let o=e-n,s=t-r;return i*Math.exp(-(o*o+s*s)/(a*a))}var Md=(e,t)=>{let n=jd(e,t,-62,-76,17,26)+jd(e,t,70,-40,6,18)+jd(e,t,30,-85,7,17)+jd(e,t,-90,-90,6,16)+jd(e,t,95,-85,5.5,15)+jd(e,t,-80,50,5,16)+jd(e,t,90,30,4.5,14)+jd(e,t,-95,-25,4.5,13)+jd(e,t,0,-65,4,13)+jd(e,t,-55,10,3.6,12)+jd(e,t,55,-60,3.5,11)+jd(e,t,-20,-40,3.5,12)+jd(e,t,60,60,3.2,12)+jd(e,t,-60,75,3,12)+jd(e,t,45,5,3,11)+jd(e,t,8,52,2.8,11)+jd(e,t,85,80,2.6,10)+jd(e,t,-35,55,2.5,10)+jd(e,t,-15,25,2.4,10)+jd(e,t,18,-28,2.2,9);return n+=.35*Math.sin(e*.09)*Math.sin(t*.11),n*=1-Ad((t-86)/16),n-=2.1*Ad((t-110)/12),n};function Nd(e){switch(e){case`rio`:return Md;default:return kd}}function Pd(e){let t=new W,n=e,r=n*2,i=qu();i.wrapS=bt,i.wrapT=bt,i.repeat.set(n/2,n/2);let a=new K(new _o(r,r,24,24),Q(new Y({map:i})));return a.rotation.x=-Math.PI/2,t.add(a),t.add(Rd(r)),zd(t,n,r),Bd(t,n),Xd(t,n),t}function Fd(e){let t=new W,n=e,r=n*2,i=ad();i.wrapS=bt,i.wrapT=bt,i.repeat.set(n/2,n/2);let a=new K(new _o(r,r,24,24),Q(new Y({map:i})));return a.rotation.x=-Math.PI/2,t.add(a),Id(t,n,r),Ld(t,n),Zd(t,n),t}function Id(e,t,n){let r=ld();r.wrapS=bt,r.repeat.set(n/2,1);let i=Q(new Y({map:r})),a=new q(n+1,.9,.6,24,1,1),o=new q(.6,.9,n+1,1,1,24);for(let n of[-1,1]){let r=new K(a,i);r.position.set(0,.45,n*(t+.3));let s=new K(o,i);s.position.set(n*(t+.3),.45,0),e.add(r,s)}}function Ld(e,t){let n=Hu(2027),r=Q(new Y({color:9071172})),i=Q(new Y({map:ld()})),a=[];for(let e=0;e<sd;e++)a.push(Q(new Y({map:cd(e)})));for(let o=0;o<4;o++)for(let s=0;s<8;s++){let c=new W,l=4.5+n()*2.5,u=2.6+n()*1.2,d=1+n()*.25,f=2.6+n()*.8,p=new K(new q(l,d,u),i);p.position.y=d/2,c.add(p);for(let e of[-1,1])for(let t of[-1,1]){let i=new K(new q(.16,f,.16),r);i.position.set(e*(l/2-.2),f/2,t*(u/2-.15)),i.rotation.z=(n()-.5)*.08,c.add(i)}let m=a[Math.floor(n()*sd)%sd],h=.42+n()*.12;for(let e of[-1,1]){let t=new K(new q(l+.7,.08,u/2+.55),m);t.position.set(0,f+.28,e*(u/4+.12)),t.rotation.x=-e*h,c.add(t)}let g=-t+5+s*((t*2-10)/7)+(n()-.5)*3,_=t+2+u/2+n()*2.5;c.rotation.y=(o>=2?Math.PI/2:0)+(n()-.5)*.2,c.rotation.z=(n()-.5)*.04,o===0?c.position.set(g,0,-_):o===1?c.position.set(g,0,_):o===2?c.position.set(-_,0,g):c.position.set(_,0,g),e.add(c)}}function Rd(e){let t=new W,n=Ju();n.wrapT=bt,n.repeat.set(1,e/8);let r=Q(new Aa({map:n,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),i=new _o(.45,e,1,24);for(let e of[!1,!0]){let n=new K(i,r);n.rotation.x=-Math.PI/2,e&&(n.rotation.z=Math.PI/2),n.position.y=.05,t.add(n)}return t}function zd(e,t,n){let r=Yu();r.wrapS=bt,r.repeat.set(n/4,1);let i=Q(new Y({map:r})),a=new q(n+1,1,.5,24,1,1),o=new q(.5,1,n+1,1,1,24);for(let n of[-1,1]){let r=new K(a,i);r.position.set(0,.5,n*(t+.25));let s=new K(o,i);s.position.set(n*(t+.25),.5,0),e.add(r,s)}}function Bd(e,t){let n=Hu(2026),r=Q(new Y({color:3813936})),i=[];for(let e=0;e<hd;e++)i.push(Q(new Y({map:gd(e)})));for(let a=0;a<4;a++)for(let o=0;o<7;o++){let s=6+n()*5,c=6+n()*12,l=5+n()*4,u=-t+6+o*((t*2-12)/6)+(n()-.5)*4,d=t+2.5+l/2+n()*3,f=i[Math.floor(n()*hd)%hd],p=new K(new q(s,c,l),[f,f,r,r,f,f]);p.rotation.y=(a>=2?Math.PI/2:0)+(n()-.5)*.14,p.rotation.z=(n()-.5)*.05,a===0?p.position.set(u,c/2-.2,-d):a===1?p.position.set(u,c/2-.2,d):a===2?p.position.set(-d,c/2-.2,u):p.position.set(d,c/2-.2,u),e.add(p)}}function Vd(e,t,n=0){let r=e.attributes.position;for(let e=0;e<r.count;e++)r.setY(e,t(r.getX(e),r.getZ(e))+n);r.needsUpdate=!0,e.computeVertexNormals()}function Hd(e,t){let n=new W,r=e,i=r*2,a=_d();a.wrapS=bt,a.wrapT=bt,a.repeat.set((r+30)/2,(r+30)/2);let o=new _o(i+60,i+60,128,128);o.rotateX(-Math.PI/2),Vd(o,t);let s=new K(o,Q(new Y({map:a})));return n.add(s),Wd(n,r,t),Gd(n,r,t),Kd(n,r,i,t),qd(n,t),Jd(n,r),Yd(n,r,t),Qd(n,r,t),n}function Ud(e,t){let n=e.attributes.position;for(let e=0;e<n.count;e++)n.setY(e,n.getY(e)+t(n.getX(e),n.getZ(e)));n.needsUpdate=!0}function Wd(e,t,n){let r=vd();r.wrapS=bt,r.repeat.set(t*2/8,1);let i=Q(new Y({map:r,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),a=new _o(t*2,6,48,2);a.rotateX(-Math.PI/2),a.translate(0,0,t-3),Vd(a,n,.06),e.add(new K(a,i))}function Gd(e,t,n){let r=Hu(1962),i=yd();i.wrapS=bt,i.wrapT=bt,i.repeat.set((t+30)/2,5);let a=new _o(t*2+60,20,48,6);a.rotateX(-Math.PI/2),a.translate(0,0,t+10),Vd(a,n,.05);let o=Q(new Y({map:i,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));e.add(new K(a,o));let s=new _o(t*2+160,90,24,4);s.rotateX(-Math.PI/2);let c=new K(s,Q(new Aa({color:2051694})));c.position.set(0,-1.95,t+12+45),e.add(c);let l=Q(new Y({color:9071172}));for(let i=0;i<13;i++){let a=-t+8+i*((t*2-16)/12)+(r()-.5)*5,o=t+3.5+r()*5,s=n(a,o),c=new W,u=new K(new po(.08,.08,2.4,5),l);u.position.y=1.2;let d=cd(Math.floor(r()*sd)),f=new K(new mo(1.6,.8,7),Q(new Y({map:d})));f.position.y=2.4,c.add(u,f),c.position.set(a,s,o),c.rotation.z=(r()-.5)*.3,e.add(c)}}function Kd(e,t,n,r){let i=Q(new Y({color:13617332}));for(let a of[-1,1]){let o=new q(n+1,.7,.45,96,1,1);o.translate(0,.35,a*(t+.22)),Ud(o,r);let s=new q(.45,.7,n+1,1,1,96);s.translate(a*(t+.22),.35,0),Ud(s,r),e.add(new K(o,i),new K(s,i))}}function qd(e,t){let n=Q(new Y({color:15262938})),r=new W,i=new K(new q(2.4,2.2,2.4),n);i.position.y=1.1;let a=new K(new po(.9,1.6,6.5,6),n);a.position.y=5.45;let o=new K(new q(8.5,.9,1),n);o.position.y=7.6,o.rotation.z=.04;let s=new K(new J(.75,6,5),n);s.position.y=8.9,r.add(i,a,o,s),r.position.set(-62,t(-62,-76)-.3,-76),r.rotation.y=Math.atan2(62,76),e.add(r)}function Jd(e,t){let n=Q(new Y({color:7234134})),r=new K(new J(9,8,7),n);r.scale.set(1,1.6,.9),r.position.set(t+10,5.5,-30);let i=new K(new J(12,8,7),n);i.scale.set(1,1.9,.9),i.position.set(t+26,9,-14),e.add(r,i);let a=new H(t+10,19.2,-30),o=new H(t+26,30,-14),s=new H().subVectors(o,a),c=new K(new po(.1,.1,s.length(),4),Q(new Y({color:2762788})));c.position.copy(a).addScaledVector(s,.5),c.quaternion.setFromUnitVectors(new H(0,1,0),s.clone().normalize());let l=new K(new q(1.3,1.1,1.6),Q(new Y({color:14275780})));l.position.copy(a).addScaledVector(s,.45),l.position.y-=.9,e.add(c,l)}function Yd(e,t,n){let r=Hu(2127),i=Q(new Y({color:10130314})),a=[];for(let e=0;e<Sd;e++)a.push(Q(new Y({map:Cd(e)})));for(let o=0;o<28;o++){let o=-(t+(3+r()*16)),s=-44+r()*88,c=1.8+r()*1.2,l=1.8+r()*1.4,u=1.8+r()*1.2,d=n(o,s)-.35,f=new W,p=a[Math.floor(r()*Sd)%Sd],m=new K(new q(c,l,u),p);m.position.y=l/2;let h=new K(new q(c+.3,.14,u+.3),i);h.position.y=l+.07,f.add(m,h),f.position.set(o,d,s),f.rotation.y=(r()-.5)*.5,f.rotation.z=(r()-.5)*.06,e.add(f)}}function Xd(e,t){let n=Hu(1930),r=Q(new Aa({color:2499626,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1})),i=new fo(.5,8);for(let a=0;a<8;a++){let a=new K(i,r);a.rotation.x=-Math.PI/2,a.position.set((n()-.5)*(t*2-16),.04,(n()-.5)*(t*2-16)),e.add(a)}let a=Q(new Y({color:4868690})),o=Q(new Aa({color:16767370})),s=new Aa({color:16763243,transparent:!0,opacity:.2,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),c=new po(.09,.12,4.4,5),l=new q(1.2,.12,.12),u=new q(.5,.2,.3),d=new fo(2.6,10);for(let t=0;t<10;t++){let r=t<5,i=-40+t%5*20,f=t%2==0?1:-1,p=r?i:f*4,m=r?f*4:i,h=new W,g=new K(c,a);g.position.y=2.2;let _=new K(l,a);_.position.set(-.55,4.3,0);let v=new K(u,o);v.position.set(-1.05,4.2,0),h.add(g,_,v),h.rotation.y=r?f>0?Math.PI/2:-Math.PI/2:f>0?Math.PI:0,h.rotation.z=(n()-.5)*.05,h.position.set(p,0,m),e.add(h);let y=new K(d,s);y.rotation.x=-Math.PI/2,y.position.set(r?p:p-f*1.05,.03,r?m-f*1.05:m),e.add(y)}let f=Q(new Y({color:11556906})),p=Q(new Y({color:9079440})),m=new q(2.6,1,1.3),h=new J(.4,5,4);for(let r=0;r<4;r++){let i=r%2==0?1:-1,a=r<2?i*(t+1.6):-30+r*20,o=r<2?-20+r*30:i*(t+1.6),s=new W,c=new K(m,f);c.position.y=.55,s.add(c);for(let e=0;e<2;e++){let e=new K(h,p);e.position.set((n()-.5)*1.6,1.1,(n()-.5)*.6),s.add(e)}s.rotation.y=(r<2?0:Math.PI/2)+(n()-.5)*.3,s.position.set(a,0,o),e.add(s)}let g=Q(new Y({color:13215850})),_=Q(new Y({color:9079440})),v=new mo(1.8,1.3,7);for(let r=0;r<5;r++){let i=new K(v,r%2==0?g:_),a=Math.floor(n()*4),o=(n()-.5)*(t*2-20),s=t+2+n()*3;a===0?i.position.set(o,.6,-s):a===1?i.position.set(o,.6,s):a===2?i.position.set(-s,.6,o):i.position.set(s,.6,o),i.rotation.y=n()*Math.PI,e.add(i)}let y=Q(new Y({color:14262811})),b=Q(new Y({color:3814960})),x=new K(new q(1.4,28,1.4),y);x.position.set(-(t+16),14,-18);let S=new K(new q(20,1,1),y);S.position.set(-(t+16)+7,27.8,-18),S.rotation.y=.2;let C=new K(new q(3,1.6,1.6),b);C.position.set(-(t+16)-4.5,27.6,-17.2);let w=new K(new po(.05,.05,11,4),b);w.position.set(-(t+16)+15.6,22,-16.2);let T=new K(new q(.5,.6,.5),b);T.position.set(-(t+16)+15.6,16.2,-16.2),e.add(x,S,C,w,T);let E=Q(new Y({color:9407106})),D=new q(10,.5,8),O=new q(.5,12.5,.5);for(let n=0;n<3;n++){let r=new K(D,E);r.position.set(-(t+10),4+n*4,0),r.rotation.y=.08,e.add(r)}for(let n of[-1,1])for(let r of[-1,1]){let i=new K(O,E);i.position.set(-(t+10)+n*4.4,6.25,r*3.4),e.add(i)}let k=Q(new Y({color:8028294})),A=Q(new Y({color:9071172})),j=new q(.12,6.5,.12),M=new q(4.6,.1,.1),N=new q(4.6,.1,.7);for(let[r,i,a]of[[10,-(t+2.4),0],[-(t+2.4),14,Math.PI/2]]){let t=new W;for(let e of[-2.2,2.2])for(let n of[-.4,.4]){let r=new K(j,k);r.position.set(e,3.25,n),t.add(r)}for(let e of[2.2,4.4]){for(let n of[-.4,.4]){let r=new K(M,k);r.position.set(0,e+.35,n),t.add(r)}let r=new K(N,A);r.position.set(0,e,0),r.rotation.z=(n()-.5)*.04,t.add(r)}t.rotation.y=a+(n()-.5)*.08,t.position.set(r,0,i),e.add(t)}let P=Q(new Y({map:Yu()})),ee=new q(.1,1,.1),te=new q(2.2,.9,.1);for(let r=0;r<4;r++){let i=new W,o=new K(te,P);o.position.y=1.2,i.add(o);for(let e of[-.9,.9]){let t=new K(ee,a);t.position.set(e,.5,0),i.add(t)}let s=r%4,c=(s%2==0?-1:1)*(t-6),l=(s<2?-1:1)*(t+1.8);i.position.set(c,0,l),i.rotation.y=(n()-.5)*.6,i.rotation.z=(n()-.5)*.08,e.add(i)}}function Zd(e,t){let n=Hu(1964),r=Od();for(let i=0;i<14;i++){let a=r.arvore(n),o=i%4,s=(n()-.5)*(t*2-12),c=t+6+n()*9;o===0?a.position.set(s,0,-c):o===1?a.position.set(s,0,c):o===2?a.position.set(-c,0,s):a.position.set(c,0,s),a.scale.setScalar(1.1+n()*.7),e.add(a)}let i=Q(new Y({color:9071172})),a=new po(.08,.11,7.4,5),o=t-2;for(let t of[-1,1])for(let r of[-1,1]){let s=new K(a,i);s.position.set(t*o,3.7,r*o),s.rotation.z=(n()-.5)*.06,e.add(s)}let s=new q(.55,.45,.05),c=[14241615,4160217,15254074,5089354,14251050].map(e=>Q(new Y({color:e})));for(let t of[1,-1]){let r=-o,i=-o*t,a=o,l=o*t,u=Math.atan2(l-i,a-r);for(let t=1;t<32;t++){let o=t/32,d=new K(s,c[t%c.length]);d.position.set(r+(a-r)*o,7.1-2.2*(4*o*(1-o)),i+(l-i)*o),d.rotation.y=-u,d.rotation.z=(n()-.5)*.3,e.add(d)}}let l=Q(new Y({map:ld()})),u=new q(1.1,.5,.8),d=new J(.18,6,5),f=[15238698,10142266,3111482,14266410].map(e=>Q(new Y({color:e})));for(let r=0;r<10;r++){let i=r%4,a=(n()-.5)*(t*2-16),o=t+1.8+n()*2.5,s=new W,c=new K(u,l);c.position.y=.25,s.add(c);for(let e=0;e<3;e++){let t=new K(d,f[(r+e)%f.length]);t.position.set((e-1)*.3,.6,(n()-.5)*.3),s.add(t)}i===0?s.position.set(a,0,-o):i===1?s.position.set(a,0,o):i===2?s.position.set(-o,0,a):s.position.set(o,0,a),s.rotation.y=n()*Math.PI,e.add(s)}let p=new W,m=new K(new q(4,1.7,1.8),Q(new Y({color:14213860})));m.position.y=1.15;let h=new K(new q(4.02,.7,1.82),Q(new Y({color:4160217})));h.position.y=.75;let g=new K(new q(3.4,.5,1.86),Q(new Y({color:2764856})));g.position.y=1.65,p.add(m,h,g);let _=Q(new Y({color:1841696})),v=new po(.35,.35,.25,8);for(let e of[-1.3,1.3])for(let t of[-.95,.95]){let n=new K(v,_);n.rotation.x=Math.PI/2,n.position.set(e,.35,t),p.add(n)}p.position.set(14,0,t+6.5),p.rotation.y=.5,e.add(p);let y=Q(new Y({color:15262420})),b=Q(new Y({color:10506808})),x=new W,S=new K(new q(6,3.5,8),y);S.position.y=1.75;let C=new K(new mo(4.6,2.4,4),b);C.position.y=4.7,C.rotation.y=Math.PI/4,C.scale.z=1.3;let w=new K(new q(2,6.5,2),y);w.position.set(0,3.25,4.6);let T=new K(new mo(1.6,1.4,4),b);T.position.set(0,7.2,4.6),T.rotation.y=Math.PI/4;let E=new K(new q(.1,1,.1),y);E.position.set(0,8.3,4.6);let D=new K(new q(.5,.1,.1),y);D.position.set(0,8.4,4.6),x.add(S,C,w,T,E,D),x.position.set(t+12,0,-8),x.rotation.y=-Math.PI/2+.1,e.add(x);for(let n of[-1,1]){let i=r.cerca(42);i.rotation.y=Math.PI/2,i.position.set(-(t+4),0,n*24),e.add(i)}let O=new mo(.35,.75,5),k=Q(new Y({color:5081658}));for(let r=0;r<5;r++)for(let i=0;i<9;i++){let a=new K(O,k);a.position.set(-(t+9+r*3.2)+(n()-.5)*.6,.35,-18+i*4.5+(n()-.5)*1.2),a.rotation.y=n()*Math.PI,e.add(a)}let A=new W,j=new K(new po(.07,.09,2.2,5),i);j.position.y=1.1;let M=new K(new q(1.8,.1,.1),i);M.position.y=1.65;let N=new K(new q(.7,.8,.4),Q(new Y({color:11550776})));N.position.y=1.4;let P=Q(new Y({color:14271098})),ee=new K(new J(.28,6,5),P);ee.position.y=2.1;let te=new K(new mo(.45,.35,6),P);te.position.y=2.42,A.add(j,M,N,ee,te),A.position.set(-(t+14),0,-26),A.rotation.y=.4,A.rotation.z=.06,e.add(A);let ne=new W,re=new K(new q(1.6,1.2,1.2),i);re.position.y=.6;let ie=new K(new q(1.9,.1,1.5),b);ie.position.y=1.28,ie.rotation.z=.12;let ae=new K(new q(.4,.5,.05),Q(new Y({color:2761760})));ae.position.set(0,.35,.62),ne.add(re,ie,ae),ne.position.set(-(t+8),0,-31),ne.rotation.y=-.3,e.add(ne);let oe=new W,se=new K(new q(2.2,1,1.3),Q(new Y({color:11550776})));se.position.y=.95;let ce=new K(new po(.08,.08,.6,5),_);ce.position.set(.8,1.7,0),oe.add(se,ce);let le=new po(.62,.62,.3,8);for(let e of[-.8,.8]){let t=new K(le,_);t.rotation.x=Math.PI/2,t.position.set(-.7,.62,e);let n=new K(v,_);n.rotation.x=Math.PI/2,n.position.set(.85,.35,e),oe.add(t,n)}oe.position.set(-(t+18),0,8),oe.rotation.y=2.1,e.add(oe)}function Qd(e,t,n){let r=Hu(2016),i=Od();for(let a=0;a<10;a++){let o=i.coqueiro(r),s=-t+12+a*((t*2-24)/9)+(r()-.5)*6,c=t-5.5+(r()-.5)*2;o.position.set(s,n(s,c),c),o.scale.setScalar(1+r()*.35),e.add(o)}for(let a=0;a<4;a++){let a=i.coqueiro(r),o=-t+20+r()*(t*2-40),s=t+4+r()*5;a.position.set(o,n(o,s),s),e.add(a)}let a=(e,i,a,o)=>{let s=0;for(let c=0;c<e*30&&s<e;c++){let e=(r()-.5)*(t*2-16),c=(r()-.5)*(t*2-16),l=n(e,c);l<i||l>a||Math.hypot(e,c)<32||(o(e,c,l),s++)}};a(36,2.5,12,(t,n,a)=>{let o=i.arvore(r);o.position.set(t,a-.15,n),o.scale.setScalar(.9+r()*1),e.add(o)}),a(12,1.5,14,(t,n,a)=>{let o=i.pedra(r);o.position.x=t,o.position.y+=a-.3,o.position.z=n,e.add(o)});let o=new q(3.2,.8,1.4),s=[4160217,14251050,5089354,14210248],c=new po(.06,.06,2.6,5),l=new q(.06,1.6,1.1),u=Q(new Y({color:15262938})),d=Q(new Y({color:5913634}));for(let n=0;n<4;n++){let i=new W,a=new K(o,Q(new Y({color:s[n]})));if(a.position.y=.25,i.add(a),n<2){let e=new K(c,d);e.position.y=1.7;let t=new K(l,u);t.position.set(.35,1.9,0),i.add(e,t)}i.position.set(-80+n*52+(r()-.5)*16,-1.7,t+24+r()*18),i.rotation.y=r()*Math.PI*2,i.rotation.z=(r()-.5)*.08,e.add(i)}let f=Q(new Y({color:12757338})),p=Q(new Y({color:14210248}));for(let i of[-34,42]){let a=new W,o=new K(new po(1.5,1.5,1.1,8),p);o.position.y=.55;let s=new K(new mo(2.4,1.3,8),f);s.position.y=2.7;let c=new K(new po(.1,.1,1.6,5),d);c.position.y=1.6,a.add(o,s,c);let l=t+4.5;a.position.set(i,n(i,l),l),a.rotation.z=(r()-.5)*.06,e.add(a)}let m=Q(new Y({color:15262938})),h=new W,g=new q(.1,1.7,.1);for(let e of[-1.6,1.6]){let t=new K(g,m);t.position.set(e,.85,0),h.add(t)}let _=new K(new q(3.3,.1,.1),m);_.position.y=1.7,h.add(_);let v=t+7;h.position.set(-58,n(-58,v),v),h.rotation.y=.15,e.add(h);let y=Q(new Y({color:13617332})),b=new q(3.2,.5,.3);for(let t=0;t<8;t++){let r=t/8*Math.PI*2,i=-62+Math.cos(r)*6.5,a=-76+Math.sin(r)*6.5,o=new K(b,y);o.position.set(i,n(i,a)+.2,a),o.rotation.y=-r+Math.PI/2,e.add(o)}}function $d(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new va;c.morphTargetsRelative=s;let l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0,p=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let t in d.morphAttributes){if(!i.has(t))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;if(d.morphAttributes[t].length!==e[0].morphAttributes[t].length)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have the same number of morph targets for the "`+t+`" morph attribute.`),null;o[t]===void 0&&(o[t]=[]),o[t].push(d.morphAttributes[t]),p++}if(p!==i.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of morph attributes.`),null;if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=ef(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=ef(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function ef(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new ra(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var tf=.05,nf=1e-12,rf=8,af=2.2;function of(e,t){let n=e.enemies.maxAlive,r=Q(new Y({color:16052454})),i=Q(new Y({color:1315860})),a=e.enemyTypes,o=[],s=[],c=[],l=[],u=[],d=new G(1,1,1);for(let e of a){let t=sf(e,r,i),a=new $a(t.geometry,t.material,n);a.frustumCulled=!1,a.instanceMatrix.setUsage(Yn);for(let e=0;e<n;e++)a.setColorAt(e,d);a.instanceColor.setUsage(Yn);let f=a.instanceMatrix.array;for(let e=0;e<n;e++){let t=e*16;f[t]=1,f[t+5]=1,f[t+10]=1,f[t+15]=1}o.push(a),s.push(f),c.push(a.instanceColor.array),l.push(e.behavior.kind!==`chase`),u.push(t.bounceScale)}let f=new Int32Array(a.length);return{meshes:o,update(e,n){let r=e.enemies,i=e.time,d=e.player,p=d.prevX+(d.x-d.prevX)*n,m=d.prevZ+(d.z-d.prevZ)*n;f.fill(0);for(let o=0;o<r.count;o++){let d=r.typeIndex[o],h=a[d],g=s[d],_=f[d],v=_*16;f[d]++;let y=c[d],b=e.tickCount-r.hitTick[o],x=_*3;if(r.hitTick[o]>=0&&b<rf){let e=r.hitCrit[o]===1;y[x]=e?3.2:2.6,y[x+1]=e?2.1:2.6,y[x+2]=e?.9:2.6}else y[x]=1,y[x+1]=1,y[x+2]=1;let S=r.state[o],C=r.stateTime[o],w=1;S===P.Spawning?w=Math.max(tf,Math.min(1,C/h.spawnStateDuration)):S===P.Dying&&(w=Math.max(tf,1-C/h.dyingStateDuration));let T=r.prevX[o]+(r.posX[o]-r.prevX[o])*n,E=r.prevZ[o]+(r.posZ[o]-r.prevZ[o])*n,D=0,O=1;if(l[d])D=r.dirX[o],O=r.dirZ[o];else{let e=p-T,t=m-E,n=e*e+t*t;if(n>nf){let r=1/Math.sqrt(n);D=e*r,O=t*r}}let k=Math.sin(i*9+o*1.7),A=w*(1-.08*k);g[v]=O*A,g[v+2]=-D*A,g[v+5]=w*(1+.14*k),g[v+8]=D*A,g[v+10]=O*A,g[v+12]=T,g[v+13]=t(T,E)+Math.max(0,k)*.18*w*u[d],g[v+14]=E}for(let e=0;e<o.length;e++){let t=o[e];t.count=f[e],f[e]>0&&(t.instanceMatrix.needsUpdate=!0,t.instanceColor.needsUpdate=!0)}}}}function sf(e,t,n){switch(e.id){case`cone`:return uf(e.radius);case`rato`:return df(e.radius,t,n);case`britadeira`:return ff(e.radius,t,n);case`pombo`:return _f(e.radius,n);case`galinha`:return pf(e.radius,t,n);case`carrinho`:return mf(e.radius,t,n);case`abacaxi`:return hf(e.radius,t,n);case`maritaca`:return gf(e.radius,n);case`sagui`:return vf(e.radius,t,n);case`bola`:return yf(e.radius,t,n);case`coco`:return bf(e.radius,t,n);case`urubu`:return xf(e.radius,n);default:throw Error(`tipo de inimigo sem modelo de render: ${e.id}`)}}function cf(e,t=!1){let n=$d(e,t);if(n===null)throw Error(`falha ao mesclar geometria de inimigo`);for(let t of e)t.dispose();return n}function lf(e,t){return{geometry:cf(e.map(e=>cf(e.parts)),!0),material:e.map(e=>e.material),bounceScale:t}}function uf(e){let t=e*af,n=new mo(e,t,8);return n.translate(0,t/2,0),{geometry:n,material:Q(new Y({map:Zu()})),bounceScale:1}}function df(e,t,n){let r=Q(new Y({map:nd()})),i=new J(e,8,6);i.scale(1,.55,1.4),i.translate(0,e*.55,0);let a=new mo(e*.3,e*.6,6);a.rotateX(Math.PI/2),a.translate(0,e*.6,e*1.5);let o=new J(e*.5,6,5);o.scale(1,1,.35),o.translate(-e*.55,e*1.15,e*.4);let s=new J(e*.62,6,5);s.scale(1,1,.35),s.translate(e*.55,e*1.3,e*.35);let c=new po(e*.09,e*.14,e*2.4,5);c.rotateX(-Math.PI/2+.3),c.translate(0,e*.7,-e*2.1);let l=new J(e*.26,6,5);l.translate(-e*.38,e*.8,e*1.05);let u=new J(e*.19,6,5);u.translate(e*.4,e*.85,e*1);let d=new J(e*.1,5,4);d.translate(-e*.4,e*.82,e*1.27);let f=new J(e*.08,5,4);return f.translate(e*.42,e*.87,e*1.17),lf([{material:r,parts:[i,a,o,s,c]},{material:t,parts:[l,u]},{material:n,parts:[d,f]}],1)}function ff(e,t,n){let r=Q(new Y({map:rd()})),i=Q(new Y({color:9343641})),a=new po(e*.24,e*.1,e*.9,6);a.translate(0,e*.45,0);let o=new q(e*1.25,e*1.9,e*.95);o.translate(0,e*1.85,0);let s=new q(e*.9,e*.2,e*.25);s.translate(-e*.95,e*2.5,0);let c=new q(e*.9,e*.2,e*.25);c.translate(e*.95,e*2.38,0);let l=new J(e*.3,8,6);l.translate(-e*.3,e*2.35,e*.48);let u=new J(e*.22,8,6);u.translate(e*.33,e*2.45,e*.5);let d=new J(e*.12,5,4);d.translate(-e*.32,e*2.37,e*.73);let f=new J(e*.1,5,4);return f.translate(e*.35,e*2.47,e*.68),lf([{material:r,parts:[o,s,c]},{material:i,parts:[a]},{material:t,parts:[l,u]},{material:n,parts:[d,f]}],2.2)}function pf(e,t,n){let r=Q(new Y({map:ud()})),i=Q(new Y({color:12662058})),a=Q(new Y({color:14722606})),o=new J(e,8,6);o.scale(.95,1.05,1.2),o.translate(0,e*1,-e*.1);let s=new J(e*.48,6,5);s.translate(0,e*1.95,e*.75);let c=new J(e*.17,5,4);c.translate(-e*.05,e*2.42,e*.62);let l=new J(e*.22,5,4);l.translate(e*.03,e*2.5,e*.82);let u=new J(e*.14,5,4);u.translate(-e*.02,e*2.38,e*1);let d=new mo(e*.14,e*.42,5);d.rotateX(Math.PI/2),d.translate(0,e*1.9,e*1.3);let f=new J(e*.45,6,5);f.scale(.7,1.1,.5),f.rotateX(.6),f.translate(0,e*1.55,-e*1.05);let p=new J(e*.2,6,5);p.translate(-e*.3,e*2.05,e*.95);let m=new J(e*.26,6,5);m.translate(e*.3,e*2,e*.9);let h=new J(e*.08,5,4);h.translate(-e*.32,e*2.07,e*1.12);let g=new J(e*.11,5,4);return g.translate(e*.33,e*2.02,e*1.12),lf([{material:r,parts:[o,s,f]},{material:i,parts:[c,l,u]},{material:a,parts:[d]},{material:t,parts:[p,m]},{material:n,parts:[h,g]}],1.6)}function mf(e,t,n){let r=Q(new Y({map:pd()})),i=Q(new Y({color:7238778})),a=Q(new Y({color:2369067})),o=new q(e*1.6,e*1.3,e*2.1);o.rotateX(-.08),o.translate(0,e*1.45,0);let s=new q(e*.14,e*.14,e*.9);s.rotateX(.5),s.translate(-e*.55,e*2.25,-e*1.25);let c=new q(e*.14,e*.14,e*.9);c.rotateX(.42),c.translate(e*.55,e*2.12,-e*1.25);let l=new po(e*.28,e*.28,e*.2,8);l.rotateZ(Math.PI/2),l.rotateY(.18),l.translate(0,e*.28,e*.8);let u=new po(e*.38,e*.38,e*.22,8);u.rotateZ(Math.PI/2),u.translate(0,e*.38,-e*.75);let d=new J(e*.3,8,6);d.translate(-e*.4,e*1.95,e*1.05);let f=new J(e*.22,8,6);f.translate(e*.42,e*2.02,e*1.08);let p=new J(e*.12,5,4);p.translate(-e*.42,e*1.97,e*1.3);let m=new J(e*.09,5,4);return m.translate(e*.44,e*2.04,e*1.26),lf([{material:r,parts:[o]},{material:i,parts:[s,c]},{material:a,parts:[l,u]},{material:t,parts:[d,f]},{material:n,parts:[p,m]}],.3)}function hf(e,t,n){let r=Q(new Y({map:dd()})),i=Q(new Y({color:4160826})),a=new J(e,8,7);a.scale(1,1.45,1),a.translate(0,e*1.45,0);let o=[];for(let t of[{x:0,z:0,lean:0,h:1.1},{x:.28,z:.1,lean:.45,h:.85},{x:-.3,z:.05,lean:-.5,h:.9},{x:.05,z:.3,lean:.35,h:.75},{x:-.08,z:-.28,lean:-.3,h:.95}]){let n=new mo(e*.16,e*t.h,4);n.rotateZ(t.lean),n.translate(e*t.x,e*2.9+e*t.h/2,e*t.z),o.push(n)}let s=new J(e*.26,8,6);s.translate(-e*.3,e*1.9,e*.82);let c=new J(e*.2,8,6);c.translate(e*.32,e*1.98,e*.85);let l=new J(e*.08,5,4);l.translate(-e*.32,e*1.88,e*1.04);let u=new J(e*.07,5,4);return u.translate(e*.34,e*1.96,e*1.02),lf([{material:r,parts:[a]},{material:i,parts:o},{material:t,parts:[s,c]},{material:n,parts:[l,u]}],1)}function gf(e,t){let n=Q(new Y({map:fd()})),r=Q(new Y({color:14252841})),i=e*2.2,a=new J(e*.8,8,6);a.scale(.9,.8,1.3),a.translate(0,i,0);let o=new J(e*.42,6,5);o.translate(0,i+e*.55,e*.8);let s=new mo(e*.13,e*.4,5);s.rotateX(Math.PI/2),s.translate(0,i+e*.52,e*1.25);let c=new mo(e*.09,e*.22,5);c.rotateX(Math.PI),c.translate(0,i+e*.38,e*1.36);let l=new q(e*1.7,e*.09,e*.75);l.rotateZ(-.22),l.translate(-e*1.15,i+e*.25,-e*.1);let u=new q(e*1.7,e*.09,e*.75);u.rotateZ(.22),u.translate(e*1.15,i+e*.25,-e*.1);let d=new q(e*.4,e*.07,e*1.4);d.rotateX(-.18),d.translate(0,i+e*.08,-e*1.75);let f=new J(e*.17,6,5);f.translate(-e*.3,i+e*.62,e*.92);let p=new J(e*.22,6,5);p.translate(e*.3,i+e*.6,e*.88);let m=new J(e*.07,5,4);m.translate(-e*.33,i+e*.63,e*1.05);let h=new J(e*.09,5,4);return h.translate(e*.34,i+e*.61,e*1.03),lf([{material:n,parts:[a,o,l,u,d]},{material:r,parts:[s,c,f,p]},{material:t,parts:[m,h]}],1)}function _f(e,t){let n=Q(new Y({map:id()})),r=Q(new Y({color:14252841})),i=e*2.2,a=new J(e*.85,8,6);a.scale(.95,.8,1.35),a.translate(0,i,0);let o=new J(e*.42,6,5);o.translate(0,i+e*.55,e*.85);let s=new mo(e*.1,e*.35,5);s.rotateX(Math.PI/2),s.translate(0,i+e*.5,e*1.3);let c=new q(e*1.7,e*.09,e*.75);c.rotateZ(-.22),c.translate(-e*1.15,i+e*.25,-e*.1);let l=new q(e*1.7,e*.09,e*.75);l.rotateZ(.22),l.translate(e*1.15,i+e*.25,-e*.1);let u=new q(e*.55,e*.08,e*.7);u.rotateX(-.25),u.translate(0,i+e*.1,-e*1.3);let d=new J(e*.16,6,5);d.translate(-e*.3,i+e*.62,e*.95);let f=new J(e*.21,6,5);f.translate(e*.3,i+e*.6,e*.9);let p=new J(e*.07,5,4);p.translate(-e*.33,i+e*.63,e*1.07);let m=new J(e*.09,5,4);return m.translate(e*.34,i+e*.61,e*1.05),lf([{material:n,parts:[a,o,c,l,u]},{material:r,parts:[s,d,f]},{material:t,parts:[p,m]}],1)}function vf(e,t,n){let r=Q(new Y({color:9073752})),i=Q(new Y({color:6048826})),a=new J(e,8,6);a.scale(.9,.8,1.2),a.translate(0,e*.8,0);let o=new J(e*.62,7,6);o.translate(0,e*1.7,e*.6);let s=new J(e*.34,5,4);s.scale(1,1,.5),s.translate(-e*.62,e*1.85,e*.5);let c=new J(e*.42,5,4);c.scale(1,1,.5),c.translate(e*.62,e*1.95,e*.45);let l=new po(e*.1,e*.16,e*2.6,5);l.rotateX(-.5),l.translate(0,e*1.6,-e*1.5);let u=new J(e*.24,6,5);u.translate(-e*.26,e*1.8,e*1.05);let d=new J(e*.18,6,5);d.translate(e*.3,e*1.85,e*1.02);let f=new J(e*.1,5,4);f.translate(-e*.28,e*1.82,e*1.25);let p=new J(e*.08,5,4);return p.translate(e*.32,e*1.87,e*1.18),lf([{material:r,parts:[a,o]},{material:t,parts:[s,c,u,d]},{material:i,parts:[l]},{material:n,parts:[f,p]}],1.7)}function yf(e,t,n){let r=Q(new Y({map:bd()})),i=new J(e,9,7);i.translate(0,e,0);let a=new J(e*.34,7,6);a.translate(-e*.34,e*1.3,e*.75);let o=new J(e*.26,7,6);o.translate(e*.38,e*1.22,e*.78);let s=new J(e*.14,5,4);s.translate(-e*.36,e*1.3,e*1.02);let c=new J(e*.1,5,4);return c.translate(e*.41,e*1.24,e*1),lf([{material:r,parts:[i]},{material:t,parts:[a,o]},{material:n,parts:[s,c]}],2)}function bf(e,t,n){let r=Q(new Y({color:5143098})),i=Q(new Y({color:15788760})),a=Q(new Y({color:12729134})),o=new J(e,9,7);o.scale(1,1.3,1),o.translate(0,e*1.3,0);let s=new po(e*.52,e*.52,e*.12,8);s.rotateX(.18),s.rotateZ(-.12),s.translate(e*.08,e*2.52,-e*.05);let c=new po(e*.07,e*.07,e*1.1,5);c.rotateZ(.35),c.rotateX(-.15),c.translate(e*.4,e*2.95,-e*.1);let l=new J(e*.24,8,6);l.translate(-e*.3,e*1.75,e*.85);let u=new J(e*.19,8,6);u.translate(e*.32,e*1.82,e*.87);let d=new J(e*.07,5,4);d.translate(-e*.32,e*1.73,e*1.05);let f=new J(e*.06,5,4);return f.translate(e*.34,e*1.8,e*1.03),lf([{material:r,parts:[o]},{material:i,parts:[s]},{material:a,parts:[c]},{material:t,parts:[l,u]},{material:n,parts:[d,f]}],1)}function xf(e,t){let n=Q(new Y({color:2368042})),r=Q(new Y({color:7234134})),i=Q(new Y({color:15262938})),a=Q(new Y({color:14263854})),o=e*2.2,s=new J(e*.9,8,6);s.scale(.95,.8,1.35),s.translate(0,o,0);let c=new J(e*.38,6,5);c.scale(1.1,.7,1),c.translate(0,o+e*.42,e*.62);let l=new J(e*.32,6,5);l.translate(0,o+e*.62,e*.95);let u=new mo(e*.1,e*.34,5);u.rotateX(Math.PI/2),u.translate(0,o+e*.6,e*1.3);let d=new mo(e*.07,e*.18,5);d.rotateX(Math.PI),d.translate(0,o+e*.5,e*1.4);let f=new q(e*2,e*.09,e*.85);f.rotateZ(-.18),f.translate(-e*1.3,o+e*.25,-e*.1);let p=new q(e*2,e*.09,e*.85);p.rotateZ(.18),p.translate(e*1.3,o+e*.25,-e*.1);let m=new q(e*.5,e*.08,e*.8);m.rotateX(-.22),m.translate(0,o+e*.08,-e*1.35);let h=new J(e*.13,6,5);h.translate(-e*.22,o+e*.68,e*1.02);let g=new J(e*.17,6,5);g.translate(e*.22,o+e*.66,e*.98);let _=new J(e*.06,5,4);_.translate(-e*.24,o+e*.69,e*1.12);let v=new J(e*.08,5,4);return v.translate(e*.24,o+e*.67,e*1.1),lf([{material:n,parts:[s,f,p,m]},{material:i,parts:[c]},{material:r,parts:[l,u,d]},{material:a,parts:[h,g]},{material:t,parts:[_,v]}],1)}function Sf(e,t){let n=new J(.18,8,6);n.translate(0,.25,0);let r=new $a(n,new Aa({color:4906624}),e.xp.maxOrbs);r.frustumCulled=!1,r.instanceMatrix.setUsage(Yn);let i=r.instanceMatrix.array;for(let t=0;t<e.xp.maxOrbs;t++){let e=t*16;i[e]=1,i[e+5]=1,i[e+10]=1,i[e+15]=1}return{mesh:r,update(e,n){let a=e.orbs;for(let e=0;e<a.count;e++){let r=e*16,o=a.prevX[e]+(a.posX[e]-a.prevX[e])*n,s=a.prevZ[e]+(a.posZ[e]-a.prevZ[e])*n;i[r+12]=o,i[r+13]=t(o,s),i[r+14]=s}r.count=a.count,r.instanceMatrix.needsUpdate=!0}}}var Cf=.9,wf=14,Tf=.9;function Ef(e){let t=new _o(.7,.5);t.rotateX(-Math.PI/2);let n=new $a(t,new Aa({map:Qu(),side:2}),32);n.frustumCulled=!1,n.instanceMatrix.setUsage(Yn);let r=n.instanceMatrix.array;for(let e=0;e<32;e++){let t=e*16;r[t]=1,r[t+5]=1,r[t+10]=1,r[t+15]=1}let i=0;return{mesh:n,update(t,a,o){i+=o;let s=t.cards;for(let t=0;t<s.count;t++){let n=t*16,o=Math.atan2(s.dirX[t],s.dirZ[t])+i*wf+t*Tf,c=Math.cos(o),l=Math.sin(o);r[n]=c,r[n+2]=-l,r[n+8]=l,r[n+10]=c;let u=s.prevX[t]+(s.posX[t]-s.prevX[t])*a,d=s.prevZ[t]+(s.posZ[t]-s.prevZ[t])*a;r[n+12]=u,r[n+13]=e(u,d)+Cf,r[n+14]=d}n.count=s.count,n.instanceMatrix.needsUpdate=!0}}}var Df=`player-body`,Of=.15,kf=11,Af=16,jf=.3;function Mf(e,t){switch(e.id){case`capivara`:return Lf(t);case`carteiro`:return Rf(t);case`churrasqueiro`:if(e.ability.cooldown<=jf)throw Error(`cooldown da fumaça (${e.ability.cooldown}s) precisa ser > ${jf}s (janela do pulso visual)`);return zf(t);default:throw Error(`personagem sem vista de render: ${e.id}`)}}function Nf(e){return e.stats.abilityCooldown-e.player.abilityCooldown}function Pf(e,t,n,r){let i=e.player;n.position.x=i.prevX+(i.x-i.prevX)*t,n.position.z=i.prevZ+(i.z-i.prevZ)*t,n.position.y=r(n.position.x,n.position.z)+i.prevJumpOffset+(i.jumpOffset-i.prevJumpOffset)*t}function Ff(e,t){t.visible=e.player.state===`dead`||e.player.invulnTimer<=0||Math.sin(e.time*40)>-.2}function If(e){let t=e.player;return Math.hypot(t.x-t.prevX,t.z-t.prevZ)>1e-4}function Lf(e){let t=new W,n=Q(new Y({map:Xu()})),r=Q(new Y({color:4862498})),i=Q(new Y({color:16052454})),a=Q(new Y({color:1315860})),o=new K(new q(.7,.5,1),n);o.name=Df,o.position.y=.52;let s=new W;s.position.set(0,.8,.6);let c=new K(new q(.62,.52,.56),n),l=new K(new q(.34,.26,.22),r);l.position.set(0,-.08,.36);let u=new q(.09,.14,.04),d=new K(u,i);d.position.set(-.055,-.24,.45);let f=new K(u,i);f.position.set(.055,-.24,.45);let p=new K(new J(.11,8,6),i);p.position.set(-.24,.1,.22);let m=new K(new J(.15,8,6),i);m.position.set(.26,.13,.2);let h=new J(.05,6,4),g=new K(h,a);g.position.set(-.26,.12,.31);let _=new K(h,a);_.position.set(.29,.14,.33);let v=new q(.13,.13,.1),y=new K(v,r);y.position.set(-.21,.31,.05);let b=new K(v,r);b.position.set(.21,.31,.05),s.add(c,l,d,f,p,m,g,_,y,b);let x=new q(.16,.34,.16);x.translate(0,-.17,0);let S=(e,t)=>{let r=new K(x,n);return r.position.set(e,.36,t),r},C=S(-.24,.35),w=S(.24,.35),T=S(-.24,-.35),E=S(.24,-.35),D=new W;D.add(o,s,C,w,T,E),t.add(D);let O=Math.PI/2.8,k=new K(new vo(.55,1,10,1,-O/2,O),new Aa({color:16769126,transparent:!0,side:2,depthWrite:!1}));k.rotation.x=-Math.PI/2,k.position.y=.06,k.visible=!1,t.add(k);let A=k.material;return{group:t,update(n,r){let i=n.player;if(Pf(n,r,t,e),D.rotation.y=Math.atan2(i.facingX,i.facingZ),i.state===`dead`)D.rotation.z=Math.PI/2,D.position.y=.1;else if(If(n)){let e=Math.sin(n.time*kf),t=Math.sign(e);D.position.y=Math.abs(e)*.1,D.rotation.z=t*.07,C.rotation.x=t*.8,E.rotation.x=t*.8,w.rotation.x=-t*.8,T.rotation.x=-t*.8}else D.position.y=0,D.rotation.z=0,C.rotation.x=0,w.rotation.x=0,T.rotation.x=0,E.rotation.x=0;Ff(n,D);let a=Nf(n);if(i.state===`alive`&&a>=0&&a<=Of){let e=a/Of,t=n.stats.abilityRange*Math.max(e,.2),r=1/0,o=i.facingX,c=i.facingZ,l=n.enemies;for(let e=0;e<l.count;e++){if(l.state[e]!==P.Chasing)continue;let t=l.posX[e]-i.x,n=l.posZ[e]-i.z,a=t*t+n*n;a<r&&(r=a,o=t,c=n)}k.rotation.z=-Math.atan2(c,o),k.visible=!0,k.scale.setScalar(t),A.opacity=1-e,s.scale.setScalar(1+.45*(1-e))}else k.visible=!1,s.scale.setScalar(1)}}}function Rf(e){let t=new W,n=Q(new Y({map:$u()})),r=Q(new Y({color:14722156})),i=Q(new Y({color:2903667})),a=Q(new Y({color:8015402})),o=Q(new Y({color:9790522})),s=Q(new Y({color:3359066})),c=Q(new Y({color:16052454})),l=Q(new Y({color:1315860})),u=new K(new q(.55,.65,.34),n);u.name=Df,u.position.y=.85;let d=new W;d.position.set(0,1.45,0);let f=new K(new q(.5,.45,.45),r),p=new K(new q(.12,.14,.12),r);p.position.set(.03,-.05,.26);let m=new K(new J(.1,8,6),c);m.position.set(-.14,.07,.21);let h=new K(new J(.14,8,6),c);h.position.set(.16,.1,.19);let g=new J(.045,6,4),_=new K(g,l);_.position.set(-.15,.08,.29);let v=new K(g,l);v.position.set(.18,.11,.31);let y=new K(new q(.54,.18,.5),i);y.position.set(0,.28,-.02),y.rotation.z=.12;let b=new K(new q(.44,.05,.3),i);b.position.set(0,.2,.32),b.rotation.z=.12,d.add(f,p,m,h,_,v,y,b);let x=new W;x.position.set(-.42,.72,0);let S=new K(new q(.24,.42,.5),a),C=new K(new q(.27,.16,.53),o);C.position.y=.16,x.add(S,C);let w=new K(new q(.08,.95,.06),o);w.position.set(-.14,1,.19),w.rotation.z=.55;let T=new q(.14,.5,.14);T.translate(0,-.25,0);let E=new K(T,n);E.position.set(-.36,1.12,0);let D=new K(T,n);D.position.set(.36,1.12,0);let O=new q(.17,.52,.17);O.translate(0,-.26,0);let k=new K(O,s);k.position.set(-.15,.52,0);let A=new K(O,s);A.position.set(.15,.52,0);let j=new W;return j.add(u,d,x,w,E,D,k,A),t.add(j),{group:t,update(n,r){let i=n.player;if(Pf(n,r,t,e),j.rotation.y=Math.atan2(i.facingX,i.facingZ),i.state===`dead`)j.rotation.z=Math.PI/2,j.position.y=.28;else if(If(n)){let e=Math.sin(n.time*kf),t=Math.sign(e);j.position.y=Math.abs(e)*.08,j.rotation.z=t*.05,k.rotation.x=t*.7,A.rotation.x=-t*.7,E.rotation.x=-t*.6,D.rotation.x=t*.6}else j.position.y=0,j.rotation.z=0,k.rotation.x=0,A.rotation.x=0,E.rotation.x=0,D.rotation.x=0;Ff(n,j);let a=Nf(n);if(i.state===`alive`&&a>=0&&a<=Of){let e=a/Of;D.rotation.x=-2.2*(1-e),x.scale.setScalar(1+.35*(1-e))}else x.scale.setScalar(1)}}}function zf(e){let t=new W,n=Q(new Y({map:ed()})),r=Q(new Y({color:13208152})),i=Q(new Y({color:15525592})),a=Q(new Y({color:4864560})),o=Q(new Y({color:16052454})),s=Q(new Y({color:1315860})),c=Q(new Y({color:7029795})),l=Q(new Y({color:12106946})),u=new K(new q(.62,.65,.4),n);u.name=Df,u.position.y=.85;let d=new K(new J(.3,8,6),n);d.position.set(0,.74,.15);let f=new W;f.position.set(0,1.45,0);let p=new K(new q(.52,.46,.46),r),m=new K(new q(.13,.13,.13),r);m.position.set(-.02,-.04,.27);let h=new K(new q(.3,.08,.06),s);h.position.set(0,-.14,.25),h.rotation.z=-.09;let g=new K(new J(.13,8,6),o);g.position.set(-.15,.09,.21);let _=new K(new J(.09,8,6),o);_.position.set(.15,.06,.22);let v=new J(.045,6,4),y=new K(v,s);y.position.set(-.16,.1,.3);let b=new K(v,s);b.position.set(.16,.07,.29);let x=new K(new q(.5,.1,.48),i);x.position.set(.02,.27,0),x.rotation.z=-.14;let S=new K(new q(.58,.3,.54),i);S.position.set(.07,.46,0),S.rotation.z=-.18,f.add(p,m,h,g,_,y,b,x,S);let C=new q(.15,.5,.15);C.translate(0,-.25,0);let w=new K(C,n);w.position.set(-.4,1.12,0);let T=new K(C,n);T.position.set(.4,1.12,0);let E=new K(new q(.05,.3,.05),c);E.position.set(0,-.6,.06);let D=new K(new q(.18,.22,.03),l);D.position.set(0,-.84,.06),T.add(E,D);let O=new q(.18,.52,.18);O.translate(0,-.26,0);let k=new K(O,a);k.position.set(-.16,.52,0);let A=new K(O,a);A.position.set(.16,.52,0);let j=new W;j.add(u,d,f,w,T,k,A),t.add(j);let M=new $a(new go(.26,0),new Y({map:td(),transparent:!0,opacity:.55,depthWrite:!1}),Af);M.frustumCulled=!1,M.instanceMatrix.setUsage(Yn);let N=M.instanceMatrix.array;for(let e=0;e<Af;e++)N[e*16+15]=1;let P=Hu(808),ee=new Float32Array(Af),te=new Float32Array(Af),ne=new Float32Array(Af),re=new Float32Array(Af),ie=new Float32Array(Af);for(let e=0;e<Af;e++)ee[e]=e/Af*Math.PI*2,te[e]=.25+P()*.7,ne[e]=.25+P()*.9,re[e]=.7+P()*.8,ie[e]=(.4+P()*.5)*(e%2==0?1:-1);let ae=new K(new vo(.93,1,40),new Aa({color:14209732,transparent:!0,opacity:.3,side:2,depthWrite:!1}));ae.rotation.x=-Math.PI/2,ae.position.y=.05;let oe=new K(new vo(.8,1,40),new Aa({color:16117725,transparent:!0,side:2,depthWrite:!1}));oe.rotation.x=-Math.PI/2,oe.position.y=.07,oe.visible=!1,t.add(M,ae,oe);let se=ae.material,ce=oe.material,le=0;return{group:t,update(n,r,i){le+=i;let a=n.player;if(Pf(n,r,t,e),j.rotation.y=Math.atan2(a.facingX,a.facingZ),a.state===`dead`)j.rotation.z=Math.PI/2,j.position.y=.3;else if(If(n)){let e=Math.sin(n.time*kf),t=Math.sign(e);j.position.y=Math.abs(e)*.07,j.rotation.z=t*.06,k.rotation.x=t*.7,A.rotation.x=-t*.7,w.rotation.x=-t*.5,T.rotation.x=t*.5}else j.position.y=0,j.rotation.z=0,k.rotation.x=0,A.rotation.x=0,w.rotation.x=0,T.rotation.x=0;Ff(n,j);let o=Nf(n),s=a.state===`alive`,c=s&&o>=0&&o<=jf,l=c?1-o/jf:0;f.scale.setScalar(1+.4*l);let u=n.stats.abilityRange;if(ae.visible=s,ae.scale.setScalar(u),se.opacity=.3+.45*l,oe.visible=c,c){let e=1-l;oe.scale.setScalar(u*(.3+.7*e)),ce.opacity=.75*(1-e)}let d=u-.55;for(let e=0;e<Af;e++){let t=e*16,n=ee[e]+le*ie[e],r=te[e]*d,i=re[e]*(1+.1*Math.sin(le*3+e))*(1+.45*l);N[t]=i,N[t+5]=i,N[t+10]=i,N[t+12]=Math.cos(n)*r,N[t+13]=ne[e]+Math.sin(le*2+e*1.7)*.08,N[t+14]=Math.sin(n)*r}M.instanceMatrix.needsUpdate=!0}}}var Bf=40,Vf=700,Hf=20,Uf=`damage-numbers-style`;function Wf(e){if(document.getElementById(Uf)===null){let e=document.createElement(`style`);e.id=Uf,e.textContent=Gf,document.head.append(e)}let t=document.createElement(`div`);t.className=`dmg-layer`;let n=document.createElement(`div`);n.className=`dmg-vignette`,t.append(n),document.body.append(t);let r=0,i=0,a=new H;function o(e,n,i,o,s,c){if(r>=Bf||(a.set(n,i,o).project(e),a.z>1||Math.abs(a.x)>1.05||Math.abs(a.y)>1.05))return;let l=document.createElement(`span`);l.className=`dmg-label ${c}`,l.textContent=s,l.style.left=`${(a.x+1)/2*100}%`,l.style.top=`${(1-a.y)/2*100}%`,t.append(l),r++,window.setTimeout(()=>{l.remove(),r--},Vf)}return{update(t,r,a){t.tickCount<i&&(i=0);let s=t.tickCount-t.player.lastHitTick,c=t.player.lastHitTick>=0&&s<Hf?1-s/Hf:0;if(n.style.opacity=c===0?`0`:String(.5*c),a){let n=t.enemies;for(let a=0;a<n.count;a++){let s=n.hitTick[a];if(s<i||s>=t.tickCount)continue;let c=n.posX[a],l=n.posZ[a],u=n.hitCrit[a]===1;o(r,c,e(c,l)+1.3,l,String(Math.max(1,Math.round(n.hitDamage[a]))),u?`dmg-crit`:`dmg-enemy`)}let a=t.player.lastHitTick;a>=i&&a<t.tickCount&&o(r,t.player.x,e(t.player.x,t.player.z)+1.7,t.player.z,`-${Math.max(1,Math.round(t.player.lastHitDamage))}`,`dmg-player`)}i=t.tickCount},dispose(){t.remove()}}}var Gf=`
.dmg-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 4; /* acima do canvas, abaixo dos overlays de UI (que usam 10+) */
}
.dmg-vignette {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 90ms linear;
  box-shadow: inset 0 0 120px 40px rgba(205, 30, 20, 0.85);
}
.dmg-label {
  position: absolute;
  transform: translate(-50%, -100%);
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-weight: bold;
  font-size: 17px;
  color: #ffe066;
  -webkit-text-stroke: 3px rgba(20, 10, 4, 0.9);
  paint-order: stroke fill;
  animation: dmg-float ${Vf}ms ease-out forwards;
  white-space: nowrap;
}
.dmg-crit {
  font-size: 24px;
  color: #ff9f2a;
}
.dmg-player {
  font-size: 22px;
  color: #ff4a3a;
}
@keyframes dmg-float {
  0% { translate: 0 0; opacity: 1; scale: 1.25; }
  20% { scale: 1; }
  100% { translate: 0 -46px; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dmg-label { animation-duration: 1ms; }
}
`,Kf=`orelhao-view-style`;function qf(e,t){if(document.getElementById(Kf)===null){let e=document.createElement(`style`);e.id=Kf,e.textContent=Jf,document.head.append(e)}let n=new W,r=document.createElement(`div`);r.className=`orelhao-layer`,document.body.append(r);let i=Q(new Y({color:15238698,side:2})),a=Q(new Y({color:9083530,side:2})),o=Q(new Y({color:4868690})),s=Q(new Y({color:2499626})),c=new J(.62,8,6,0,Math.PI),l=new po(.07,.09,1.3,5),u=new q(.16,.34,.12),d=[];for(let t=0;t<e;t++){let e=new W,t=new K(l,o);t.position.y=.65;let a=new K(c,i);a.position.y=1.55,a.rotation.y=Math.PI/2;let f=new K(u,s);f.position.set(0,1.45,-.18),e.add(t,a,f),e.visible=!1,n.add(e);let p=document.createElement(`span`);p.className=`orelhao-label`,p.hidden=!0,r.append(p),d.push({root:e,shell:a,label:p,text:``})}let f=new H;return{group:n,update(e,n){for(let r=0;r<d.length;r++){let o=d[r],s=e.orelhoes[r];if(s===void 0){o.root.visible=!1,o.label.hidden=!0;continue}o.root.visible=!0;let c=t(s.x,s.z);o.root.position.set(s.x,c,s.z),o.shell.material=s.answered?a:i;let l=!s.answered&&e.kills>=s.requirement;o.root.rotation.z=l?Math.sin(e.time*22)*.07:0,f.set(s.x,c+2.3,s.z).project(n);let u=f.z<1&&Math.abs(f.x)<=1.02&&Math.abs(f.y)<=1.02;if(o.label.hidden=!u,!u)continue;o.label.style.left=`${(f.x+1)/2*100}%`,o.label.style.top=`${(1-f.y)/2*100}%`;let p=s.answered?`✅ atendido`:`📞 ${Math.min(e.kills,s.requirement)}/${s.requirement} abates`;p!==o.text&&(o.text=p,o.label.textContent=p),o.label.classList.toggle(`ready`,l),o.label.classList.toggle(`answered`,s.answered)}},dispose(){r.remove()}}}var Jf=`
.orelhao-layer {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 4; /* como a camada de dano: acima do canvas, abaixo dos overlays */
}
.orelhao-label {
  position: absolute;
  transform: translate(-50%, -100%);
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  color: #ffb0a6;
  -webkit-text-stroke: 3px rgba(20, 10, 4, 0.9);
  paint-order: stroke fill;
}
.orelhao-label.ready {
  color: #8aff7a;
  animation: orelhao-ring 0.5s steps(2) infinite;
}
.orelhao-label.answered { color: #cfc8b4; }
.orelhao-label[hidden] { display: none; }
@keyframes orelhao-ring {
  50% { transform: translate(-50%, -100%) scale(1.15) rotate(-2deg); }
}
@media (prefers-reduced-motion: reduce) {
  .orelhao-label.ready { animation: none; }
}
`,Yf=6,Xf=.8,Zf=.5;function Qf(e,t){let n=0,r=0,i=0,a=!1;return{update(o,s,c,l,u,d){a||=(n=o,r=s,i=c,!0);let f=1-Math.exp(-6*d);n+=(o-n)*f,r+=(s-r)*f,i+=(c-i)*f;let p=Math.cos(u)*Yf,m=n-Math.sin(l)*p,h=i-Math.cos(l)*p,g=r+Xf+Math.sin(u)*Yf,_=t(m,h)+Zf;g<_&&(g=_),e.position.set(m,g,h),e.lookAt(n,r+Xf,i)}}}function $f(e){switch(e){case`rio`:return{top:3108816,horizon:12376294,sun:16774080,sunDirection:[.5,.75,.3],sunRadius:14,cloud:16118504};case`feira`:return{top:4884168,horizon:13886182,sun:16773304,sunDirection:[-.45,.6,.45],sunRadius:12,cloud:15920866};case`cidade`:return{top:2893392,horizon:13202762,sun:16757611,sunDirection:[-.7,.22,-.4],sunRadius:16,cloud:10513016};default:return{top:1315354,horizon:3814472,sun:15262938,sunDirection:[.4,.6,-.5],sunRadius:8,cloud:4867160}}}var ep=150;function tp(e,t){let n=document.createElement(`canvas`);n.width=4,n.height=128;let r=n.getContext(`2d`);if(!r)throw Error(`não foi possível criar o contexto 2d do céu`);let i=r.createLinearGradient(0,0,0,128);i.addColorStop(0,`#${e.toString(16).padStart(6,`0`)}`),i.addColorStop(.52,`#${t.toString(16).padStart(6,`0`)}`),i.addColorStop(1,`#${t.toString(16).padStart(6,`0`)}`),r.fillStyle=i,r.fillRect(0,0,4,128);let a=new so(n);return a.colorSpace=Un,a.magFilter=Et,a.minFilter=Et,a.generateMipmaps=!1,a}function np(e){let t=new W,n=new K(new J(ep,16,12),new Aa({map:tp(e.top,e.horizon),side:1,fog:!1,depthWrite:!1}));n.renderOrder=-3,t.add(n);let r=new H(...e.sunDirection).normalize(),i=new K(new fo(e.sunRadius,10),new Aa({color:e.sun,fog:!1,depthWrite:!1}));i.position.copy(r).multiplyScalar(ep*.94),i.lookAt(0,0,0),i.renderOrder=-2,t.add(i);let a=new Aa({color:e.cloud,fog:!1,depthWrite:!1}),o=Hu(1808);for(let e=0;e<7;e++){let e=new W,n=2+Math.floor(o()*2);for(let t=0;t<n;t++){let t=new K(new q(10+o()*12,1.6+o()*1.4,5+o()*5),a);t.position.set((o()-.5)*14,(o()-.5)*2,(o()-.5)*6),t.renderOrder=-1,e.add(t)}let r=o()*Math.PI*2,i=.25+o()*.45,s=Math.cos(i)*ep*.85;e.position.set(Math.cos(r)*s,Math.sin(i)*ep*.85,Math.sin(r)*s),e.rotation.y=o()*Math.PI,e.rotation.z=(o()-.5)*.12,t.add(e)}return t}function rp(e,t){let n=new Vu({canvas:e,antialias:!0,powerPreference:`high-performance`});n.setPixelRatio(1),n.toneMapping=4,n.shadowMap.enabled=!1,Gu(n.capabilities.getMaxAnisotropy());let r=new wi,i=new G(1315354);r.background=i;let a=new Ci(1315354,60,170);r.fog=a;let o=new us(90,window.innerWidth/window.innerHeight,.5,400),s=new Qo(13621503,4207657,1.1),c=new ps(16773848,1.6);c.position.set(12,20,6),r.add(s,c);let l=null,u=()=>{let e=t.renderHeight>0?t.renderHeight:Math.min(window.innerHeight,1080),r=Math.max(90,Math.round(e)),i=Math.max(160,Math.round(window.innerWidth/window.innerHeight*r));n.setSize(i,r,!1),Dd(i,r),o.aspect=i/r,o.updateProjectionMatrix()};u(),window.addEventListener(`resize`,u);function d(e,t){if(l!==null)throw Error(`beginMatch com cena de partida já montada — faltou endMatch`);let n=e.characters.find(e=>e.id===t.characterId);if(n===void 0)throw Error(`personagem desconhecido no render: ${t.characterId}`);let s=t.mapId===void 0?e.maps.find(e=>e.playable):e.maps.find(e=>e.id===t.mapId);if(s===void 0||!s.playable)throw Error(`mapa inválido no render: ${t.mapId??`(nenhum jogável)`}`);let c=new W,u=Nd(s.id),d=ip(s.id,s.arena.halfSize,u),f=of(e,u),p=Sf(e,u),m=n.ability.kind===`cartas`?Ef(u):null,h=Mf(n,u),g=Qf(o,u),_=$f(s.id),v=np(_);i.setHex(_.horizon),a.color.setHex(_.horizon),c.add(d,v,p.mesh,h.group);for(let e of f.meshes)c.add(e);m!==null&&c.add(m.mesh),r.add(c);let y=qf(e.orelhoes.killRequirements.length,u);c.add(y.group),l={root:c,enemies:f,orbs:p,cards:m,player:h,ground:u,sky:v,damage:Wf(u),orelhoes:y,followCamera:g}}function f(){if(l===null)throw Error(`endMatch sem cena de partida montada`);r.remove(l.root),ap(l.root),l.damage.dispose(),l.orelhoes.dispose(),l=null,console.log(`[render] endMatch — renderer.info.memory: geometries=${n.info.memory.geometries} textures=${n.info.memory.textures}`)}return{beginMatch:d,endMatch:f,draw(e,i,a){if(l===null)throw Error(`draw sem cena de partida — beginMatch não foi chamado`);l.player.update(e,i,a),l.enemies.update(e,i),l.orbs.update(e,i),l.cards?.update(e,i,a),l.followCamera.update(l.player.group.position.x,l.ground(l.player.group.position.x,l.player.group.position.z),l.player.group.position.z,t.cameraLook.yaw,t.cameraLook.pitch,a),l.sky.position.set(o.position.x,0,o.position.z),l.damage.update(e,o,t.showDamageNumbers()),l.orelhoes.update(e,o),n.render(r,o)},dispose(){l!==null&&f(),window.removeEventListener(`resize`,u),n.dispose()}}}function ip(e,t,n){switch(e){case`cidade`:return Pd(t);case`feira`:return Fd(t);case`rio`:return Hd(t,n);default:throw Error(`mapa sem cenário: ${e}`)}}function ap(e){e.traverse(e=>{let t=e;if(!t.isMesh)return;t.geometry.dispose();let n=Array.isArray(t.material)?t.material:[t.material];for(let e of n)e.map?.dispose(),e.dispose();t.isInstancedMesh&&t.dispose()})}function op(){let e=null,t=0,n=-1/0;return{reset(){e=null,t=0,n=-1/0},collect(r,i){if(!(r!==e||r.tickCount<t)&&r.tickCount===t)return[];e=r,t=r.tickCount;let a=[];for(let e of r.events)e.type===`enemyHit`&&a.push({count:e.count,critCount:e.critCount});if(a.length===0)return[];a.sort((e,t)=>{let n=Math.sign(t.critCount)-Math.sign(e.critCount);return n===0?t.count-e.count:n});let o=[];for(let e of a)i-n<.1||(n=i,o.push(e));return o}}}var sp=.3,cp=180,lp=.03,up=.4,dp=.2,fp=.003,pp=.013,mp=.09,hp=.7,gp=.004,_p=.03,vp=3,yp=.7,bp=1.25,xp=.75,Sp=1.3,Cp=.1;function wp(){let e=op(),t=new Set,n=null,r=null,i=null,a=1,o=!1,s=0;function c(){if(!o)try{if(n===null){let e=window.AudioContext??window.webkitAudioContext;if(e===void 0)return;n=new e,r=n.createGain(),r.gain.value=sp*a,r.connect(n.destination),i=Tp(n)}n.state===`suspended`&&n.resume().catch(()=>{})}catch{n=null,r=null,i=null}}function l(e){for(let t of e.sources)try{t.onended=null,t.stop()}catch{}for(let t of e.nodes)t.disconnect()}function u(){let e=cp+Math.random()*60;return s>0&&Math.abs(e-s)/s<lp&&(e=cp+Math.random()*60),s=e,e}function d(e,n,r,i){let a=1,o=1;i.critCount>0?(a=xp,o=Sp):i.count>=vp&&(a=yp,o=bp);let s=u()*a,c=up*o*(1+(Math.random()*2-1)*dp),l=e.currentTime,d=e.createOscillator();d.type=`triangle`,d.frequency.value=s;let f=e.createGain();f.gain.setValueAtTime(0,l),f.gain.linearRampToValueAtTime(c,l+fp),f.gain.setTargetAtTime(0,l+fp,pp),d.connect(f),f.connect(n);let p=e.createBufferSource();p.buffer=r;let m=e.createGain();m.gain.setValueAtTime(c*hp,l),m.gain.setTargetAtTime(0,l,gp),p.connect(m),m.connect(n);let h={sources:[d,p],nodes:[d,f,p,m]};t.add(h),d.onended=()=>{t.delete(h);for(let e of h.nodes)e.disconnect()},d.start(l),d.stop(l+mp),p.start(l),p.stop(l+_p)}return{unlock:c,beginMatch(){e.reset()},endMatch(){for(let e of t)l(e);t.clear(),e.reset()},update(a){let o=e.collect(a,performance.now()/1e3);if(o.length!==0&&n!==null&&r!==null&&i!==null&&n.state===`running`)for(let e of o){if(t.size>=8)break;try{d(n,r,i,e)}catch{}}},setMasterVolume(e){a=Math.min(1,Math.max(0,e)),r!==null&&(r.gain.value=sp*a)},dispose(){if(!o){o=!0;for(let e of t)l(e);if(t.clear(),r?.disconnect(),r=null,i=null,n!==null){try{n.close().catch(()=>{})}catch{}n=null}}}}}function Tp(e){let t=Math.max(1,Math.floor(e.sampleRate*Cp)),n=e.createBuffer(1,t,e.sampleRate),r=n.getChannelData(0);for(let e=0;e<r.length;e+=1)r[e]=Math.random()*2-1;return n}function $(e,t,n){let r=document.createElement(e);return r.className=t,n!==null&&(r.textContent=n),r}function Ep(e,t){if(document.getElementById(e)!==null)return;let n=document.createElement(`style`);n.id=e,n.textContent=t,document.head.append(n)}function Dp(){Ep(`screen-theme-style`,jp)}function Op(e){let t=document.activeElement;t instanceof HTMLElement&&e.contains(t)&&t.blur()}function kp(e){return e.ctrlKey||e.altKey||e.metaKey}function Ap(e){return e.repeat?((e.code===`Enter`||e.code===`NumpadEnter`)&&e.preventDefault(),!0):!1}var jp=`
#screens {
  --ui-text: #e8e4da;
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-paper-locked: #cfcabc;
  --ui-ink-locked: #4a443a;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-panel: #2a2433;
  --ui-panel-hover: #3a3145;
  --ui-shadow: #2a1016;
  --ui-staple: #b9b9b9;
  --ui-gap: 16px;
  --ui-radius: 8px;

  position: fixed;
  inset: 0;
  z-index: 5;
  color: var(--ui-text);
  text-align: center;
  /* Mural opaco (poste com papéis grampeados): em menu nada do canvas aparece. */
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 9px),
    repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 2px, transparent 2px 110px),
    linear-gradient(180deg, #241e2e 0%, #14121a 100%);
}
#screens[hidden] { display: none; }

#screens .screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ui-gap);
  padding: calc(var(--ui-gap) * 1.5);
  overflow-y: auto;
  overflow-x: hidden;
}
#screens .screen[hidden] { display: none; }

.screen-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.screen-hint { margin: 0; font-size: 16px; }
/* Linha de aviso (ex.: mapa bloqueado): papel amarelo, sempre reserva altura. */
.screen-status {
  margin: 0;
  min-height: 1.6em;
  font-size: 15px;
}
.screen-status:not(:empty) {
  padding: 3px 14px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border-radius: 4px;
  transform: rotate(-1deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

.screen-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ui-gap);
  max-width: 1100px;
}

/* Card estilo panfleto grampeado num poste (GDD). */
.screen-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(180px, 26vw, 260px);
  min-height: 170px;
  padding: 18px 14px 14px;
  font: inherit;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px; /* papel de rua, não botão bonito */
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
}
.screen-card::before { /* grampo no topo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.card-paper-1 { background: var(--ui-paper-1); }
.card-paper-2 { background: var(--ui-paper-2); }
.screen-cards .screen-card:nth-child(odd) { transform: rotate(-2.5deg); }
.screen-cards .screen-card:nth-child(even) { transform: rotate(1.8deg) translateY(8px); }
.screen-cards .screen-card:not(.locked):hover,
.screen-cards .screen-card:not(.locked):focus-visible { transform: scale(1.05); }
/* Amarelo sobre o mural escuro: o contorno fica fora do papel. */
.screen-card:focus-visible { outline: 4px dashed var(--ui-accent); outline-offset: 4px; }

.card-name { font-size: 20px; font-weight: bold; line-height: 1.15; }
.card-line { font-size: 15px; line-height: 1.25; }
.card-play {
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.35);
  font-size: 14px;
  line-height: 1.3;
}
.card-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.4);
  font-size: 13px;
}

/* Card selecionado: adesivo torto + moldura — forma e posição, não só cor. */
.screen-card.selected {
  border-color: var(--ui-promo);
  box-shadow: 0 0 0 3px var(--ui-promo), 6px 8px 0 rgba(0, 0, 0, 0.45);
}
.card-chosen {
  position: absolute;
  top: -12px;
  right: -12px;
  padding: 4px 10px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 13px;
  font-weight: bold;
  border-radius: 999px;
  transform: rotate(10deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

/* Card bloqueado: papel desbotado, borda tracejada, carimbo torto EM BREVE. */
.screen-card.locked {
  background: var(--ui-paper-locked);
  color: var(--ui-ink-locked);
  border-style: dashed;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.35);
  cursor: not-allowed;
}
.card-stamp {
  position: absolute;
  top: 10px;
  right: -8px;
  padding: 3px 10px;
  border: 3px solid var(--ui-promo);
  border-radius: 4px;
  background: rgba(255, 251, 230, 0.92);
  color: var(--ui-promo);
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 2px;
  transform: rotate(8deg);
}
.screen-card.denied { animation: card-denied 0.3s steps(4); }
@keyframes card-denied {
  25% { transform: translateX(-6px) rotate(-2deg); }
  75% { transform: translateX(6px) rotate(2deg); }
}

/* Botões de painel (Voltar): mesmo desenho do reroll do panfleto. */
.screen-primary,
.screen-back {
  font: inherit;
  border-radius: var(--ui-radius);
  border: 2px solid var(--ui-accent);
  background: var(--ui-panel);
  color: var(--ui-accent);
  cursor: pointer;
}
.screen-primary:hover,
.screen-back:hover { background: var(--ui-panel-hover); }
.screen-primary:focus-visible,
.screen-back:focus-visible { outline: 3px dashed var(--ui-accent); outline-offset: 3px; }

.screen-primary {
  font-size: 20px;
  padding: 14px 40px;
  border-width: 3px;
  transform: rotate(1.5deg);
  box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.45);
}
.primary-label { display: block; }
.primary-sub { display: block; font-size: 13px; opacity: 0.85; }

.screen-back {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 15px;
  padding: 8px 16px;
  transform: rotate(-1.5deg);
}

/* Cartaz da tela de início: um panfleto grande grampeado. */
.start-poster {
  position: relative;
  padding: 26px 52px 34px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-2deg);
}
.start-poster::before { /* grampo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 30px;
  height: 9px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.start-title {
  margin: 0;
  font-size: clamp(44px, 10vw, 88px);
  line-height: 1.05;
  color: var(--ui-promo);
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

/* Coluna de botões da tela de início: panfletos empilhados, levemente tortos. */
.menu-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.menu-btn {
  width: clamp(220px, 32vw, 300px);
  min-height: 0;
  padding: 12px 18px 10px;
  gap: 4px;
}
.menu-btn .card-key { margin-top: 0; }
.menu-column .menu-btn:nth-child(odd) { transform: rotate(-1.6deg); }
.menu-column .menu-btn:nth-child(even) { transform: rotate(1.2deg); }
.menu-column .menu-btn:not(.locked):hover,
.menu-column .menu-btn:not(.locked):focus-visible { transform: scale(1.06); }
/* JOGAR: o único funcional — maior por forma e posição, não só por cor. */
.menu-play .card-name { font-size: 28px; color: var(--ui-promo); letter-spacing: 1px; }
/* Botão compacto: o carimbo sobe para o canto e não cobre o rótulo. */
.menu-btn .card-stamp { top: -10px; right: -14px; font-size: 12px; }

/* Caixinha do dev (botão de copiar o Pix copia e cola — sem QR desde
   2026-11-23): panfleto menor no canto inferior direito, fora do caminho
   visual título → JOGAR. Fixa: não rola junto e não cria scroll horizontal. */
.dev-box {
  position: fixed;
  right: 14px;
  bottom: 14px;
  width: 182px;
  padding: 12px 12px 8px;
  background: var(--ui-paper-2);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(2deg);
  font-size: 13px;
  line-height: 1.25;
}
.dev-box::before { /* grampo, como nos demais panfletos */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 22px;
  height: 7px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(3deg);
}
.dev-invite { margin: 0 0 8px; font-weight: bold; }
/* Botão de copiar: adesivo de promoção (vermelho), torto como tudo aqui. */
.dev-copy {
  font: inherit;
  font-size: 12.5px;
  font-weight: bold;
  padding: 7px 10px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.4);
  transform: rotate(-1.5deg);
  cursor: pointer;
}
.dev-copy:hover { transform: rotate(-1.5deg) scale(1.05); }
.dev-copy:focus-visible { outline: 3px dashed var(--ui-ink); outline-offset: 3px; }
/* Fallback sem clipboard: o código aparece num campo para copiar na mão. */
.dev-payload {
  width: 100%;
  margin-top: 6px;
  padding: 3px 4px;
  font-size: 10px;
  font-family: monospace;
  color: var(--ui-ink);
  background: #fffbe6;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
}
.dev-caption { margin: 8px 0 0; font-size: 11.5px; min-height: 1.2em; }

@media (prefers-reduced-motion: reduce) {
  #screens * { animation: none !important; transition: none !important; }
}

/* Janela estreita ou baixa (ex.: 800×500): conteúdo encolhe e ancora no topo. */
@media (max-width: 640px), (max-height: 560px) {
  #screens .screen { justify-content: flex-start; padding-top: 22px; }
  .screen-title { font-size: 24px; }
  .start-title { font-size: 42px; }
  .screen-card { width: clamp(150px, 42vw, 210px); min-height: 150px; }
  .screen-back { top: 10px; left: 10px; }
  /* Menu de início compacto: cartaz, coluna e botões encolhem para os 4
     botões + aviso caberem sem rolagem; a caixinha do dev encolhe (QR menor)
     para não cobrir os botões — decisão do GDD: reduzir o QR, não movê-lo. */
  .start-poster { padding: 12px 32px 16px; }
  .menu-column { gap: 8px; }
  .menu-btn { width: clamp(190px, 46vw, 250px); min-height: 0; padding: 6px 14px 4px; }
  .menu-btn .card-name { font-size: 16px; }
  .menu-btn .card-key { font-size: 11px; padding-top: 3px; }
  .menu-play .card-name { font-size: 21px; }
  .dev-box { right: 8px; bottom: 8px; width: 148px; font-size: 11px; }
  .dev-copy { font-size: 11px; padding: 5px 8px; }
  .dev-caption { font-size: 10px; }
}
`,Mp=200,Np=.25,Pp={mordida:{icon:`🦷`,label:`Mordida`},cartas:{icon:`🃏`,label:`Cartas`},fumaca:{icon:`💨`,label:`Fumaça`}};function Fp(e){Ep(`hud-style`,Rp),e.textContent=``;let t=$(`span`,`hud-char`,``),n=$(`span`,`hud-map`,``),r=$(`div`,`hud-name-row`,null);r.append(t,n);let i=$(`div`,`hud-bar-fill`,null),a=$(`span`,`hud-bar-text`,``),o=$(`div`,`hud-bar hud-hp`,null);o.append(i,a);let s=$(`div`,`hud-bar-fill`,null),c=$(`span`,`hud-bar-text`,``),l=$(`div`,`hud-bar hud-xp`,null);l.append(s,c);let u=$(`div`,`hud-badge hud-paper`,null);u.append(r,o,l);let d=$(`div`,`hud-timer hud-paper`,`0:00`),f=$(`div`,`hud-alive`,``),p=$(`div`,`hud-bananas`,`🍌 0`),m=$(`div`,`hud-bananas`,`🃏 0`);m.hidden=!0;let h=$(`div`,`hud-clock hud-paper`,null);h.append(f,p,m);let g=$(`div`,`hud-skill-icon`,``),_=$(`div`,`hud-skill-cd`,null),v=$(`div`,`hud-skill-label`,``),y=$(`div`,`hud-skill hud-paper`,null);y.append(g,_,v);let b=$(`div`,`hud-passives`,null),x=$(`div`,`hud-kit`,null);x.append(y,b);let S=$(`div`,`hud-perf`,``);e.append(u,d,h,x,S);let C=0,w=null,T=[];function E(e){w=e,T=Array(e.data.upgrades.length).fill(null),b.textContent=``,t.textContent=e.data.characters[e.characterIndex]?.name??`?`,n.textContent=e.data.maps.find(t=>t.id===e.mapId)?.name??e.mapId;let r=Pp[e.ability.kind];g.textContent=r.icon,v.textContent=r.label}function D(e){for(let t=0;t<e.data.upgrades.length;t++){let n=e.upgradeStacks[t]??0;if(n<=0)continue;let r=e.data.upgrades[t];if(r.effect===void 0)continue;let i=T[t];if(i==null){let e=$(`span`,`hud-passive-icon`,r.icon),n=$(`span`,`hud-passive-count`,``);n.hidden=!0;let a=$(`div`,`hud-passive`,null);a.title=`${r.name} — ${r.effectLine}`,a.setAttribute(`aria-label`,a.title),a.append(e,n),b.append(a),i={root:a,count:n,stacks:0},T[t]=i}i.stacks!==n&&(i.stacks=n,i.count.textContent=`×${n}`,i.count.hidden=n<2)}}return{update(e,t){e!==w&&E(e);let n=Ip(e.player.hp/e.stats.maxHp);i.style.transform=`scaleX(${n})`,s.style.transform=`scaleX(${Ip(e.player.xp/e.player.xpToNext)})`,_.style.transform=`scaleY(${Ip(e.player.abilityCooldown/e.stats.abilityCooldown)})`;let r=performance.now();if(r-C<Mp)return;C=r,a.textContent=`${Math.ceil(e.player.hp)}/${Math.round(e.stats.maxHp)}`,o.classList.toggle(`low`,n<Np),c.textContent=`Nv ${e.player.level} · ${Math.floor(e.player.xp)}/${Math.ceil(e.player.xpToNext)} XP`,d.textContent=Lp(e.time),f.textContent=`${e.enemies.count} na sua cola`,p.textContent=`🍌 ${e.bananasEarned}`;let l=0;for(let t of e.cardsEarned)l+=t;m.hidden=l===0,l>0&&(m.textContent=`🃏 ${l}`),D(e),S.textContent=`FPS ${t.fps.toFixed(0)} · sim ${t.simMs.toFixed(2)} ms · render ${t.renderMs.toFixed(2)} ms`}}}function Ip(e){return e<0?0:e>1?1:e}function Lp(e){let t=Math.floor(e),n=Math.floor(t/60),r=t%60;return`${n}:${String(r).padStart(2,`0`)}`}var Rp=`
#hud {
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-staple: #b9b9b9;
  --hud-hp: #4f9440;
  --hud-margin: 12px;
}

/* Papel grampeado, mesma linguagem dos cards das telas (posição fica em cada peça). */
#hud .hud-paper {
  padding: 8px 12px;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 3px 4px 0 rgba(0, 0, 0, 0.45);
}
#hud .hud-paper::before { /* grampo no topo */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 22px;
  height: 7px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}

/* --- Crachá do personagem (vida + XP) --- */
#hud .hud-badge {
  position: absolute;
  top: var(--hud-margin);
  left: var(--hud-margin);
  width: 220px;
  transform: rotate(-1.5deg);
}
.hud-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
  text-align: left;
}
.hud-char { font-size: 17px; font-weight: bold; line-height: 1.1; }
.hud-map { font-size: 12px; opacity: 0.75; }

.hud-bar {
  position: relative;
  height: 18px;
  margin-top: 4px;
  background: rgba(0, 0, 0, 0.22);
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}
.hud-bar-fill {
  position: absolute;
  inset: 0;
  background: var(--hud-hp);
  transform-origin: left center;
  transform: scaleX(1);
}
.hud-bar-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: bold;
  color: var(--ui-promo-ink);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}
.hud-hp.low .hud-bar-fill {
  background: var(--ui-promo);
  animation: hud-hp-pulse 0.8s steps(2) infinite;
}
@keyframes hud-hp-pulse {
  50% { filter: brightness(1.45); }
}
.hud-xp { height: 12px; }
.hud-xp .hud-bar-fill { background: var(--ui-accent); }
.hud-xp .hud-bar-text { font-size: 10px; }

/* --- Relógio da run: topo-centro, GRANDE (destaque de 2026-11-24) --- */
#hud .hud-timer {
  position: absolute;
  top: var(--hud-margin);
  left: 50%;
  transform: translateX(-50%) rotate(-0.8deg);
  padding: 6px 22px;
  background: var(--ui-paper-2);
  font-size: 38px;
  font-weight: bold;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

/* --- Contadores (vivos, bananas, figurinhas) --- */
#hud .hud-clock {
  position: absolute;
  top: var(--hud-margin);
  right: var(--hud-margin);
  min-width: 92px;
  transform: rotate(1.5deg);
  background: var(--ui-paper-2);
  text-align: center;
}
.hud-alive { font-size: 11.5px; opacity: 0.8; white-space: nowrap; }
/* Bananas da run (viram cofre no fim): separadas do tempo por traço de papel. */
.hud-bananas {
  margin-top: 3px;
  padding-top: 2px;
  border-top: 2px dashed rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: bold;
}

/* --- Kit: carta da habilidade + adesivos das passivas --- */
.hud-kit {
  position: absolute;
  left: var(--hud-margin);
  bottom: var(--hud-margin);
  display: flex;
  align-items: flex-end;
  gap: 12px;
}
#hud .hud-skill {
  position: relative;
  width: 64px;
  padding: 8px 6px 5px;
  transform: rotate(-2deg);
  background: var(--ui-paper-1);
  text-align: center;
}
.hud-skill-icon { font-size: 32px; line-height: 1.15; }
.hud-skill-label {
  font-size: 11px;
  font-weight: bold;
  border-top: 2px dashed rgba(0, 0, 0, 0.35);
  margin-top: 3px;
  padding-top: 2px;
}
/* Véu da recarga: drena de cima para baixo até liberar o golpe. */
.hud-skill-cd {
  position: absolute;
  inset: 0;
  background: rgba(16, 10, 20, 0.5);
  transform-origin: center bottom;
  transform: scaleY(0);
}

.hud-passives {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 7px;
  max-width: min(46vw, 420px);
}
/* Adesivo redondo de passiva, tortinho alternado como os papéis do mural. */
.hud-passive {
  position: relative;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: var(--ui-promo-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 999px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.45);
  animation: hud-passive-in 0.25s cubic-bezier(0.22, 1.4, 0.36, 1) both;
}
.hud-passives .hud-passive:nth-child(odd) { transform: rotate(-6deg); }
.hud-passives .hud-passive:nth-child(even) { transform: rotate(5deg); }
.hud-passive-icon { font-size: 18px; line-height: 1; }
.hud-passive-count {
  position: absolute;
  top: -7px;
  right: -8px;
  padding: 1px 5px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 10px;
  font-weight: bold;
  border-radius: 999px;
  box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
}
.hud-passive-count[hidden] { display: none; }
@keyframes hud-passive-in {
  from { scale: 0; }
  to { scale: 1; }
}

/* --- Instrumentação (FPS, ms): discreta, mono, fora do caminho do olho. --- */
.hud-perf {
  position: absolute;
  right: var(--hud-margin);
  bottom: var(--hud-margin);
  font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace;
  font-size: 11px;
  text-align: right;
  color: rgba(232, 228, 218, 0.6);
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  #hud * { animation: none !important; }
}

/* Janela estreita ou baixa: tudo encolhe e cola mais na borda. */
@media (max-width: 640px), (max-height: 560px) {
  #hud { --hud-margin: 8px; }
  #hud .hud-badge { width: 176px; padding: 6px 10px; }
  #hud .hud-char { font-size: 14px; }
  #hud .hud-timer { font-size: 26px; padding: 4px 14px; }
  #hud .hud-skill { width: 52px; }
  #hud .hud-skill-icon { font-size: 24px; }
  #hud .hud-passive { width: 30px; height: 30px; }
  #hud .hud-passive-icon { font-size: 15px; }
  #hud .hud-perf { display: none; }
}
`;function zp(e,t){let n=document.querySelector(`#death-overlay`),r=document.querySelector(`#death-stats`),i=document.querySelector(`#restart-btn`),a=document.querySelector(`#menu-btn`);if(!n||!r||!i||!a)throw Error(`elementos do overlay de morte não encontrados no index.html`);let o=!1;return i.addEventListener(`click`,()=>{e()}),t===void 0?a.hidden=!0:a.addEventListener(`click`,()=>{t()}),{get visible(){return o},show(e,t){o=!0,Ep(`death-stats-style`,Bp);let a=0;for(let t of e.cardsEarned)a+=t;let s=0;for(let t of e.orelhoes)t.answered&&s++;let c=[[`⏱️ Tempo sobrevivido`,Lp(e.time)],[`⭐ Nível alcançado`,String(e.player.level)],[`💀 Abates`,String(e.kills)],[`🍌 Bananas pro cofre`,`+${e.bananasEarned}`]];a>0&&c.push([`🃏 Figurinhas pro álbum`,`+${a}`]),e.orelhoes.length>0&&c.push([`📞 Orelhões atendidos`,`${s}/${e.orelhoes.length}`]),r.textContent=``;let l=document.createElement(`table`);l.className=`death-table`;let u=document.createElement(`tbody`);for(let[e,t]of c){let n=document.createElement(`tr`),r=document.createElement(`th`);r.scope=`row`,r.textContent=e;let i=document.createElement(`td`);i.textContent=t,n.append(r,i),u.append(n)}l.append(u),r.append(l);let d=t?.newAchievements??[];if(d.length>0){let e=$(`ul`,`death-achievements`,null);for(let t of d){let n=document.createElement(`li`);n.textContent=`🏆 ${t.icon} ${t.name} (+${t.reward} 🍌)`,e.append(n)}r.append(e)}n.hidden=!1,i.focus({preventScroll:!0})},hide(){o=!1,n.hidden=!0}}}var Bp=`
.death-table {
  margin: 0 auto;
  border-collapse: collapse;
  text-align: left;
}
.death-table th,
.death-table td {
  padding: 5px 10px;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.18);
  font-size: 16px;
}
.death-table tr:last-child th,
.death-table tr:last-child td { border-bottom: none; }
.death-table th { font-weight: normal; opacity: 0.9; }
.death-table td {
  font-weight: bold;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.death-achievements {
  margin: 14px auto 0;
  padding: 10px 14px 0;
  list-style: none;
  border-top: 2px dashed rgba(255, 255, 255, 0.25);
  font-size: 15px;
  text-align: center;
}
.death-achievements li { margin-top: 4px; }
`,Vp=[`PROMOÇÃO!!!`,`SÓ HOJE!!!`,`IMPERDÍVEL!!!`],Hp=250;function Up(e){Gp();let t=document.createElement(`div`);t.id=`upgrade-overlay`,t.setAttribute(`role`,`dialog`),t.setAttribute(`aria-modal`,`true`),t.setAttribute(`aria-label`,`Escolha de melhoria`),t.hidden=!0;let n=Wp(`h1`,`upgrade-title`,`SUBIU DE NÍVEL!`),r=Wp(`p`,`upgrade-hint`,``),i=Wp(`p`,`upgrade-queue`,``);i.hidden=!0;let a=Wp(`div`,`upgrade-arm`,null);a.setAttribute(`aria-hidden`,`true`);let o=Wp(`div`,`upgrade-flyers`,null),s=document.createElement(`button`);s.type=`button`,s.id=`upgrade-reroll`,s.append(Wp(`span`,`reroll-label`,`Pedir outro panfleto`),Wp(`span`,`reroll-sub`,`troca os 3 — só uma vez`)),t.append(a,n,r,i,o,s),document.body.append(t);let c=!1,l=null,u=0;function d(t){performance.now()<u||l===null||t>=l.length||e.choose(t)}s.addEventListener(`click`,()=>{performance.now()<u||e.reroll()});function f(e){let t=e.upgradeChoice;if(t===null)return;l=t.options,u=performance.now()+Hp;let n=t.options.length;r.textContent=n===1?`Clique no panfleto para pegar.`:`Clique num panfleto para pegar.`;let a=e.pendingLevelUps-1;a>0?(i.textContent=a===1?`E tem fila: falta mais 1 panfleto depois deste.`:`E tem fila: faltam mais ${a} panfletos depois deste.`,i.hidden=!1):i.hidden=!0;let c=Wp(`div`,`upgrade-flyers`,null);for(let r=0;r<n;r++)c.append(p(e,t.options[r],r));o.replaceWith(c),o=c,s.hidden=!(t.rerollAvailable&&n>=3)}function p(e,t,n){let r=e.data.upgrades[t];if(r===void 0)throw Error(`upgradeChoice aponta para melhoria inexistente: ${t}`);let i=e.upgradeStacks[t]??0,a=document.createElement(`button`);return a.type=`button`,a.className=`flyer flyer-paper-${n%3}`,a.addEventListener(`click`,()=>d(n)),a.append(Wp(`span`,`flyer-banner`,Vp[n%Vp.length]),Wp(`span`,`flyer-icon`,r.icon),Wp(`span`,`flyer-name`,r.name),Wp(`span`,`flyer-effect`,r.effectLine),Wp(`span`,`flyer-stacks`,Number.isFinite(r.maxStacks)?`já colou ${i}/${r.maxStacks}`:`pode pegar sempre que aparecer`),Wp(`span`,`flyer-key`,`clique para pegar`)),Number.isFinite(r.maxStacks)&&i+1===r.maxStacks&&a.append(Wp(`span`,`flyer-last`,`ÚLTIMA!`)),a}function m(){c=!1,l=null,t.hidden=!0,document.activeElement instanceof HTMLElement&&t.contains(document.activeElement)&&document.activeElement.blur()}return{get visible(){return c},sync(e){let n=e.upgradeChoice;n===null?c&&m():(c||(c=!0,t.hidden=!1),l!==n.options&&f(e))}}}function Wp(e,t,n){let r=document.createElement(e);return r.className=t,n!==null&&(r.textContent=n),r}function Gp(){if(document.getElementById(`upgrade-overlay-style`)!==null)return;let e=document.createElement(`style`);e.id=`upgrade-overlay-style`,e.textContent=Kp,document.head.append(e)}var Kp=`
#upgrade-overlay {
  --ui-dim: rgba(10, 8, 14, 0.78);
  --ui-text: #e8e4da;
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-panel: #2a2433;
  --ui-panel-hover: #3a3145;
  --ui-shadow: #2a1016;
  --ui-skin: #e0a46c;
  --ui-sleeve: #3f6d3a;
  --ui-gap: 16px;
  --ui-radius: 8px;

  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ui-gap);
  padding: calc(var(--ui-gap) * 1.5);
  overflow: auto;
  background: var(--ui-dim);
  color: var(--ui-text);
  text-align: center;
}
#upgrade-overlay[hidden] { display: none; }

.upgrade-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.upgrade-hint { margin: 0; font-size: 17px; }
.upgrade-queue {
  margin: 0;
  padding: 4px 14px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border-radius: 4px;
  transform: rotate(1.5deg);
  font-size: 15px;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

.upgrade-flyers {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ui-gap);
  max-width: 920px;
  animation: upgrade-flyers-in 0.35s cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
@keyframes upgrade-flyers-in {
  from { transform: translateY(60px); opacity: 0; }
  to { transform: none; opacity: 1; }
}

.flyer {
  --flyer-tilt: 0deg;
  --flyer-shift: 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: clamp(170px, 24vw, 230px);
  min-height: 230px;
  padding: 14px 12px 16px;
  font: inherit;
  color: var(--ui-ink);
  background: var(--ui-paper-0);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px; /* papel de rua, não botão bonito */
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transform: rotate(var(--flyer-tilt)) translateY(var(--flyer-shift));
  transition: transform 0.12s ease-out;
  will-change: transform;
}
.flyer-paper-1 { background: var(--ui-paper-1); }
.flyer-paper-2 { background: var(--ui-paper-2); }
.upgrade-flyers .flyer:nth-child(1) { --flyer-tilt: -3.5deg; }
.upgrade-flyers .flyer:nth-child(2) { --flyer-tilt: 1.8deg; --flyer-shift: 10px; }
.upgrade-flyers .flyer:nth-child(3) { --flyer-tilt: 4deg; }
.upgrade-flyers .flyer:hover,
.upgrade-flyers .flyer:focus-visible {
  transform: rotate(var(--flyer-tilt)) translateY(var(--flyer-shift)) scale(1.06);
}
/* Amarelo sobre o fundo escurecido: o contorno fica fora do papel. */
.flyer:focus-visible { outline: 4px dashed var(--ui-accent); outline-offset: 4px; }

.flyer-banner {
  align-self: stretch;
  padding: 3px 0;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
  transform: rotate(-2deg);
}
.flyer-icon { font-size: 30px; line-height: 1.1; }
.flyer-name { font-size: 19px; font-weight: bold; line-height: 1.15; }
.flyer-effect { font-size: 15px; line-height: 1.25; }
.flyer-stacks { font-size: 13px; opacity: 0.85; }
.flyer-key {
  margin-top: auto;
  align-self: stretch;
  padding-top: 6px;
  border-top: 2px dashed rgba(0, 0, 0, 0.4);
  font-size: 14px;
}
.flyer-last {
  position: absolute;
  top: -10px;
  right: -12px;
  padding: 4px 8px;
  background: var(--ui-promo);
  color: var(--ui-promo-ink);
  font-size: 12px;
  font-weight: bold;
  border-radius: 999px;
  transform: rotate(12deg);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

#upgrade-reroll {
  position: relative;
  z-index: 1;
  font: inherit;
  font-size: 17px;
  padding: 12px 28px;
  border-radius: var(--ui-radius);
  border: 2px solid var(--ui-accent);
  background: var(--ui-panel);
  color: var(--ui-accent);
  cursor: pointer;
  transform: rotate(-1.5deg);
}
#upgrade-reroll:hover { background: var(--ui-panel-hover); }
#upgrade-reroll:focus-visible { outline: 3px dashed var(--ui-accent); outline-offset: 3px; }
#upgrade-reroll[hidden] { display: none; }
.reroll-label { display: block; }
.reroll-sub { display: block; font-size: 12px; opacity: 0.8; }

/* A mão entra pela lateral esquerda estendendo os panfletos (GDD). */
.upgrade-arm {
  position: absolute;
  left: 0;
  top: 52%;
  z-index: 0;
  width: 40vw;
  height: 88px;
  background: var(--ui-sleeve);
  border-radius: 0 18px 18px 0;
  transform: translateY(-50%) rotate(-3deg);
  transform-origin: left center;
  animation: upgrade-arm-in 0.45s cubic-bezier(0.22, 1.1, 0.36, 1) both;
}
.upgrade-arm::before { /* palma */
  content: '';
  position: absolute;
  right: -48px;
  top: 50%;
  width: 84px;
  height: 72px;
  background: var(--ui-skin);
  border-radius: 14px 30px 30px 14px;
  transform: translateY(-50%);
}
.upgrade-arm::after { /* dedos segurando os papéis */
  content: '';
  position: absolute;
  right: -66px;
  top: 50%;
  width: 30px;
  height: 18px;
  background: var(--ui-skin);
  border-radius: 9px;
  transform: translateY(-50%);
  box-shadow: 4px -24px 0 0 var(--ui-skin), 2px 24px 0 0 var(--ui-skin);
}
@keyframes upgrade-arm-in {
  from { transform: translateY(-50%) rotate(-3deg) translateX(-110%); }
  to { transform: translateY(-50%) rotate(-3deg) translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  #upgrade-overlay .upgrade-arm,
  #upgrade-overlay .upgrade-flyers {
    animation: none;
  }
  #upgrade-overlay .flyer { transition: none; }
}

/* Janela estreita ou baixa: panfletos quebram linha e a mão sai de cena. */
@media (max-width: 640px), (max-height: 560px) {
  #upgrade-overlay { justify-content: flex-start; padding-top: 24px; }
  .upgrade-title { font-size: 26px; }
  .flyer { width: clamp(150px, 44vw, 210px); min-height: 200px; }
  .upgrade-arm { display: none; }
}
`,qp=`bronk.settings.v1`,Jp=`pt-BR`,Yp=.1;function Xp(e){let t=e??Zp(),n=[],r=1,i=1,a=!0;c();function o(e,t,n){return Math.min(n,Math.max(t,e))}function s(e,t,n){return typeof e!=`number`||!Number.isFinite(e)?null:o(e,t,n)}function c(){if(t===null)return;let e=null;try{e=t.getItem(qp)}catch{return}if(e===null)return;let n;try{n=JSON.parse(e)}catch{return}if(typeof n!=`object`||!n)return;let o=n,c=s(o.volume,0,1);c!==null&&(r=c);let l=s(o.mouseSensitivity,Yp,3);l!==null&&(i=l),typeof o.showDamageNumbers==`boolean`&&(a=o.showDamageNumbers)}function l(){if(t!==null)try{t.setItem(qp,JSON.stringify({volume:r,mouseSensitivity:i,showDamageNumbers:a}))}catch{}}function u(){l();for(let e of n)e()}return{get volume(){return r},get mouseSensitivity(){return i},get showDamageNumbers(){return a},get language(){return Jp},setVolume(e){Number.isFinite(e)&&(r=o(e,0,1),u())},setMouseSensitivity(e){Number.isFinite(e)&&(i=o(e,Yp,3),u())},setShowDamageNumbers(e){a=e===!0,u()},subscribe(e){n.push(e)}}}function Zp(){try{return window.localStorage}catch{return null}}var Qp=5,$p=10;function em(e,t){Ep(`settings-sheet-style`,tm);function n(e){let t=$(`div`,`settings-row`,null),n=document.createElement(`label`);n.className=`settings-label`,n.htmlFor=e.id,n.textContent=e.label;let r=document.createElement(`input`);r.type=`range`,r.id=e.id,r.className=`settings-range`,r.min=String(e.minPct),r.max=String(e.maxPct),r.step=String(e.stepPct);let i=$(`span`,`settings-value`,``);return i.setAttribute(`aria-hidden`,`true`),r.addEventListener(`input`,()=>e.onInput(r.valueAsNumber)),t.append(n,r,i),{row:t,input:r,value:i}}let r=n({id:`${t}-volume`,label:`Volume`,minPct:0,maxPct:100,stepPct:Qp,onInput(t){e.setVolume(t/100),i()}});function i(){let t=Math.round(e.volume*100);r.input.valueAsNumber!==t&&(r.input.value=String(t)),r.value.textContent=`${t}%`}let a=n({id:`${t}-sensitivity`,label:`Sensibilidade do mouse`,minPct:Math.round(Yp*100),maxPct:300,stepPct:$p,onInput(t){e.setMouseSensitivity(t/100),o()}});function o(){let t=Math.round(e.mouseSensitivity*100);a.input.valueAsNumber!==t&&(a.input.value=String(t)),a.value.textContent=`${t}%`}let s=$(`div`,`settings-row`,null),c=document.createElement(`label`);c.className=`settings-label`,c.htmlFor=`${t}-damage-numbers`,c.textContent=`Números de dano`;let l=document.createElement(`input`);l.type=`checkbox`,l.id=`${t}-damage-numbers`,l.className=`settings-checkbox`,l.addEventListener(`change`,()=>{e.setShowDamageNumbers(l.checked),d()});let u=$(`span`,`settings-value`,``);u.setAttribute(`aria-hidden`,`true`),s.append(c,l,u,$(`span`,`settings-note`,`Mostra o dano causado (e sofrido) flutuando na run.`));function d(){l.checked=e.showDamageNumbers,u.textContent=e.showDamageNumbers?`ligado`:`desligado`}let f=$(`div`,`settings-row`,null),p=document.createElement(`label`);p.className=`settings-label`,p.htmlFor=`${t}-language`,p.textContent=`Idioma`;let m=document.createElement(`select`);m.id=`${t}-language`,m.className=`settings-select`;let h=document.createElement(`option`);h.value=e.language,h.textContent=`Português (Brasil)`,m.append(h),m.disabled=!0,f.append(p,m,$(`span`,`settings-value`,``),$(`span`,`settings-note`,`Único idioma disponível na v1.`));let g=$(`div`,`settings-sheet`,null);return g.append(r.row,a.row,s,f),{root:g,sync(){i(),o(),d()}}}var tm=`
/* Formulário de rua: um panfleto só, com as linhas de ajuste. */
.settings-sheet {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: min(560px, 94vw);
  padding: 28px 30px 30px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  text-align: left;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 6px 8px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-1deg);
}
.settings-sheet::before { /* grampo, como nos demais panfletos */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}

.settings-row {
  display: grid;
  grid-template-columns: 180px 1fr 56px;
  align-items: center;
  gap: 4px 12px;
}
.settings-label { font-size: 17px; font-weight: bold; line-height: 1.2; }
.settings-range {
  width: 100%;
  height: 24px;
  accent-color: var(--ui-promo);
  cursor: pointer;
}
.settings-range:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
.settings-value {
  font-weight: bold;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.settings-checkbox {
  width: 24px;
  height: 24px;
  justify-self: start;
  accent-color: var(--ui-promo);
  cursor: pointer;
}
.settings-checkbox:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
.settings-select {
  font: inherit;
  padding: 6px 10px;
  color: var(--ui-ink);
  background: rgba(255, 251, 230, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 4px;
}
/* Desabilitado mas legível: é informação ("o jogo está em pt-BR"), não ação. */
.settings-select:disabled { color: var(--ui-ink); opacity: 1; cursor: not-allowed; }
.settings-note { grid-column: 2 / -1; font-size: 12.5px; opacity: 0.8; }

@media (max-width: 640px), (max-height: 560px) {
  .settings-sheet { gap: 16px; padding: 20px 18px 22px; }
  .settings-row { grid-template-columns: 112px 1fr 48px; }
  .settings-label { font-size: 14px; }
}
`;function nm(e,t){Dp(),Ep(`pause-overlay-style`,om);let n=document.createElement(`div`);n.id=`pause-overlay`,n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-modal`,`true`),n.setAttribute(`aria-label`,`Pausa`),n.hidden=!0;let r=$(`h1`,`pause-title`,`PAUSA`),i=$(`p`,`pause-meta`,``),a=$(`div`,`pause-build`,null),o=$(`div`,`menu-column pause-actions`,null),s=rm(`Continuar`,`Esc também continua`,()=>{performance.now()<g||e.resume()});s.id=`pause-resume`,s.classList.add(`menu-play`);let c=rm(`Configurações`,`volume e sensibilidade`,()=>{performance.now()<g||_()});c.id=`pause-settings-btn`;let l=rm(`Finalizar run`,`fecha a conta e mostra o resumo`,()=>{performance.now()<g||e.endRun()});l.id=`pause-end-run`;let u=rm(`Sair pro menu principal`,`as bananas vão pro cofre`,()=>{performance.now()<g||e.exitToMenu()});u.id=`pause-exit-menu`;let d=em(t,`pause-settings`),f=rm(`Voltar`,`Esc também volta`,()=>{v()});f.id=`pause-settings-back`;let p=$(`div`,`pause-settings`,null);p.append(d.root,f),p.hidden=!0,o.append(s,c,l,u),n.append(r,i,a,o,p),document.body.append(n);let m=!1,h=!1,g=0;function _(){h=!0,d.sync(),r.textContent=`CONFIGURAÇÕES`,a.hidden=!0,o.hidden=!0,p.hidden=!1,f.focus({preventScroll:!0})}function v(e=!0){h=!1,r.textContent=`PAUSA`,a.hidden=!1,o.hidden=!1,p.hidden=!0,e&&s.focus({preventScroll:!0})}function y(e){let t=e.data.characters[e.characterIndex]?.name??`?`;i.textContent=`${t} · ${Lp(e.time)} de run · nível ${e.player.level} · 🍌 ${e.bananasEarned} na mochila`;let n=$(`div`,`pause-build`,null),r=Pp[e.ability.kind],o=$(`div`,`pause-skill`,null);o.append($(`span`,`pause-skill-icon`,r.icon),$(`span`,`pause-skill-name`,r.label),$(`span`,`pause-skill-stats`,`dano ${am(e.stats.abilityDamage)} · recarga ${am(e.stats.abilityCooldown)} s · alcance ${am(e.stats.abilityRange)} u`)),n.append(im(`Habilidade`,o));let s=$(`div`,`pause-passives`,null),c=0;for(let t=0;t<e.data.upgrades.length;t++){let n=e.upgradeStacks[t]??0,r=e.data.upgrades[t];if(n<=0||r.effect===void 0)continue;c++;let i=$(`div`,`pause-passive`,null),a=Number.isFinite(r.maxStacks)?`×${n}/${r.maxStacks}`:`×${n}`;i.append($(`span`,`pause-passive-head`,`${r.icon} ${r.name} ${a}`),$(`span`,`pause-passive-line`,r.effectLine)),s.append(i)}c===0&&s.append($(`p`,`pause-empty`,`Nenhuma passiva ainda — sobe de nível que os panfletos chegam.`)),n.append(im(`Passivas da run (${c})`,s));let l=[];for(let t=0;t<e.data.talents.length;t++){let n=e.talentRanks[t]??0;if(n<=0)continue;let r=e.data.talents[t],i=$(`span`,`pause-talent`,`${r.icon} ${r.name} ×${n}`);i.title=r.effectLine,l.push(i)}if(l.length>0){let e=$(`div`,`pause-talents`,null);e.append(...l),n.append(im(`Talentos da loja (valem sempre)`,e))}a.replaceWith(n),a=n}return{get visible(){return m},show(e){m||(m=!0,g=performance.now()+250,h&&v(!1),y(e),n.hidden=!1,s.focus({preventScroll:!0}))},hide(){m&&(m=!1,h&&v(!1),n.hidden=!0,document.activeElement instanceof HTMLElement&&n.contains(document.activeElement)&&document.activeElement.blur())},closeSettings(){return!m||!h?!1:(v(),!0)}}}function rm(e,t,n){let r=document.createElement(`button`);return r.type=`button`,r.className=`screen-card menu-btn`,r.append($(`span`,`card-name`,e),$(`span`,`card-key`,t)),r.addEventListener(`click`,n),r}function im(e,t){let n=$(`div`,`pause-section`,null);return n.append($(`p`,`pause-section-label`,e),t),n}function am(e){return(Math.round(e*10)/10).toString().replace(`.`,`,`)}var om=`
#pause-overlay {
  /* Conjunto COMPLETO das variáveis que as classes reutilizadas do
     screenTheme consomem (.screen-card, .locked, .card-stamp, .denied):
     elas são definidas em #screens, que não é ancestral deste overlay. */
  --ui-dim: rgba(10, 8, 14, 0.82);
  --ui-text: #e8e4da;
  --ui-ink: #26180b;
  --ui-paper-0: #fff3b0;
  --ui-paper-1: #ffd6ec;
  --ui-paper-2: #d2f4ff;
  --ui-paper-locked: #cfcabc;
  --ui-ink-locked: #4a443a;
  --ui-promo: #e8231a;
  --ui-promo-ink: #fffbe6;
  --ui-accent: #ffe066;
  --ui-shadow: #2a1016;
  --ui-staple: #b9b9b9;
  --ui-gap: 16px;

  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ui-gap);
  padding: calc(var(--ui-gap) * 1.5);
  overflow: auto;
  background: var(--ui-dim);
  color: var(--ui-text);
  text-align: center;
}
#pause-overlay[hidden] { display: none; }

.pause-title {
  margin: 0;
  font-size: clamp(26px, 5vw, 44px);
  color: var(--ui-accent);
  transform: rotate(-2deg);
  text-shadow: 3px 3px 0 var(--ui-shadow);
}
.pause-meta { margin: 0; font-size: 16px; }

/* Mural do build: papel grande com as seções (habilidade/passivas/talentos). */
.pause-build {
  position: relative;
  width: min(640px, 92vw);
  padding: 14px 18px 16px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-0.8deg);
  text-align: left;
}
.pause-build::before { /* grampo, como nos demais papéis */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: #b9b9b9;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.pause-section + .pause-section {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 2px dashed rgba(0, 0, 0, 0.3);
}
.pause-section-label {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}

.pause-skill { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.pause-skill-icon { font-size: 26px; line-height: 1; }
.pause-skill-name { font-size: 18px; font-weight: bold; }
.pause-skill-stats { font-size: 14px; opacity: 0.85; }

.pause-passives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 6px 14px;
}
.pause-passive { display: flex; flex-direction: column; }
.pause-passive-head { font-size: 14px; font-weight: bold; line-height: 1.2; }
.pause-passive-line { font-size: 12px; opacity: 0.8; line-height: 1.2; }
.pause-empty { margin: 0; font-size: 14px; opacity: 0.8; }

.pause-talents { display: flex; flex-wrap: wrap; gap: 6px; }
.pause-talent {
  padding: 2px 10px;
  background: var(--ui-paper-2);
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 999px;
  font-size: 13px;
  font-weight: bold;
}
.pause-talents .pause-talent:nth-child(odd) { transform: rotate(-1.5deg); }
.pause-talents .pause-talent:nth-child(even) { transform: rotate(1.2deg); }

/* Sub-painel de configurações: panfleto compartilhado + Voltar, no lugar do
   mural/ações (hidden precisa vencer o display:flex da classe). */
.pause-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ui-gap);
}
.pause-settings[hidden] { display: none; }
.pause-build[hidden] { display: none; }
#pause-overlay .pause-actions[hidden] { display: none; }

/* Coluna de ações mais compacta que a do menu principal. */
.pause-actions { gap: 10px; }
.pause-actions .menu-btn { min-height: 0; padding: 8px 16px 6px; }
.pause-actions .menu-btn .card-name { font-size: 17px; }
#pause-resume .card-name { font-size: 22px; }

/* Janela baixa: mural e botões encolhem para caber sem rolagem na maioria. */
@media (max-width: 640px), (max-height: 640px) {
  #pause-overlay { justify-content: flex-start; padding-top: 20px; }
  .pause-title { font-size: 24px; }
  .pause-build { padding: 10px 12px; }
  .pause-actions { gap: 6px; }
  .pause-actions .menu-btn { padding: 5px 12px 4px; }
  .pause-actions .menu-btn .card-name { font-size: 14px; }
  #pause-resume .card-name { font-size: 17px; }
}

@media (prefers-reduced-motion: reduce) {
  #pause-overlay * { animation: none !important; transition: none !important; }
}
`,sm=`https://forms.gle/rSCMH7aAy899CQ7r7`,cm=`https://forms.gle/rSCMH7aAy899CQ7r7`,lm=`00020126580014BR.GOV.BCB.PIX01366c9908c2-db64-4a76-808d-49d10befec155204000053039865802BR5920Luiz Gustavo Eburneo6009SAO PAULO62140510HNABXVtoD063046E43`,um=[{label:`JOGAR`,action:`play`},{label:`LOJA DE TALENTOS`,action:`shop`},{label:`CONFIGURAÇÕES`,action:`settings`},{label:`CONQUISTAS`,action:`achievements`},{label:`ÁLBUM`,action:`album`}],dm=`Gostou do caos? Paga um café pro dev.`,fm=`Pix, e o troco é seu.`,pm=`💸 Copiar Pix copia e cola`,mm=`Copiado! Cola no app do banco. ☕`,hm=`Copia daqui (Ctrl+C):`;async function gm(e,t,n){try{await navigator.clipboard.writeText(e),t.textContent=mm;return}catch{}t.textContent=hm;let r=n.querySelector(`.dev-payload`);r===null&&(r=document.createElement(`input`),r.className=`dev-payload`,r.readOnly=!0,r.value=e,r.setAttribute(`aria-label`,`Código Pix copia e cola`),n.append(r)),r.focus({preventScroll:!0}),r.select()}function _m(e,t){Dp();let n=document.createElement(`section`);n.className=`screen start-screen`,n.setAttribute(`aria-label`,`Tela de início`),n.hidden=!0;let r=$(`div`,`start-poster`,null);r.append($(`h1`,`start-title`,`BRonk`));let i=$(`p`,`screen-hint`,`Clique num botão do mural.`),a=!1,o=0;function s(){performance.now()<o||t.onStart()}function c(e){return()=>{performance.now()<o||e()}}let l={shop:{id:`shop-btn`,open:t.onShop},settings:{id:`settings-btn`,open:t.onSettings},achievements:{id:`achievements-btn`,open:t.onAchievements},album:{id:`album-btn`,open:t.onAlbum}},u=$(`div`,`menu-column`,null),d=[];for(let{label:e,action:t}of um){let n=document.createElement(`button`);if(n.type=`button`,t===`play`)n.id=`start-btn`,n.className=`screen-card menu-btn menu-play`,n.append($(`span`,`card-name`,e),$(`span`,`card-key`,`clique para jogar`)),n.addEventListener(`click`,s);else{let{id:r,open:i}=l[t];n.id=r,n.className=`screen-card menu-btn`,n.append($(`span`,`card-name`,e),$(`span`,`card-key`,`clique para abrir`)),n.addEventListener(`click`,c(i))}d.push(n),u.append(n)}n.append(r,i,u);{let e=lm,t=$(`aside`,`dev-box`,null);t.setAttribute(`aria-label`,`Caixinha do dev — Pix`);let r=document.createElement(`button`);r.type=`button`,r.id=`dev-pix-copy`,r.className=`dev-copy`,r.textContent=pm;let i=$(`p`,`dev-caption`,fm);i.setAttribute(`role`,`status`),i.setAttribute(`aria-live`,`polite`),r.addEventListener(`click`,()=>{gm(e,i,t)}),t.append($(`p`,`dev-invite`,dm),r,i),n.append(t)}Ep(`start-contact-style`,vm);let f=$(`aside`,`contact-box`,null);f.setAttribute(`aria-label`,`Contato com o desenvolvedor`);let p=document.createElement(`a`);p.id=`report-bug-link`,p.className=`contact-link`,p.href=sm,p.target=`_blank`,p.rel=`noopener noreferrer`,p.textContent=`🐞 Reportar bug`;let m=document.createElement(`a`);return m.id=`feedback-link`,m.className=`contact-link`,m.href=cm,m.target=`_blank`,m.rel=`noopener noreferrer`,m.textContent=`💬 Feedback`,f.append(p,m),n.append(f),e.append(n),window.addEventListener(`keydown`,e=>{a&&!kp(e)&&Ap(e)}),{show(){a=!0,o=performance.now()+250,n.hidden=!1,d[0].focus({preventScroll:!0})},hide(){a=!1,n.hidden=!0,Op(n)}}}var vm=`
.contact-box {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.contact-link {
  display: inline-block;
  padding: 6px 12px;
  background: var(--ui-paper-2);
  color: var(--ui-ink);
  font-size: 13px;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(-1.5deg);
}
.contact-link + .contact-link {
  background: var(--ui-paper-1);
  transform: rotate(1deg);
}
.contact-link:hover { filter: brightness(1.06); }
.contact-link:focus-visible { outline: 3px dashed var(--ui-promo); outline-offset: 3px; }
@media (max-width: 640px), (max-height: 560px) {
  .contact-box { left: 8px; bottom: 8px; gap: 6px; }
  .contact-link { font-size: 11.5px; padding: 5px 9px; }
}
`;function ym(e,t){e.width=24,e.height=24;let n=e.getContext(`2d`);if(n===null)return;let r=(e,t,r,i,a)=>{n.fillStyle=a,n.fillRect(e,t,r,i)};switch(t){case`capivara`:bm(r);return;case`carteiro`:xm(r);return;case`churrasqueiro`:Sm(r);return;default:Cm(r)}}function bm(e){e(0,0,24,24,`#79b7d8`),e(0,18,24,6,`#55803c`),e(5,3,3,3,`#4a3222`),e(16,4,3,3,`#4a3222`),e(4,5,16,13,`#4a3222`),e(8,12,8,6,`#6b4a2e`),e(6,7,4,4,`#f4f0e6`),e(8,8,2,2,`#141414`),e(14,8,3,3,`#f4f0e6`),e(15,9,1,1,`#141414`),e(10,13,1,1,`#141414`),e(13,13,1,1,`#141414`),e(10,16,2,3,`#f4f0e6`),e(12,17,2,3,`#f4f0e6`)}function xm(e){e(0,0,24,24,`#8aa7b8`),e(0,19,24,5,`#6e6a63`),e(5,7,14,12,`#e0a46c`),e(4,3,17,4,`#2c4e73`),e(3,6,10,2,`#24405e`),e(7,10,3,3,`#f4f0e6`),e(8,11,1,1,`#141414`),e(13,9,4,4,`#f4f0e6`),e(15,11,2,2,`#141414`),e(9,16,5,1,`#141414`),e(14,15,2,1,`#141414`),e(15,18,7,5,`#f4f0e6`),e(15,18,7,1,`#e8231a`),e(16,20,5,1,`#b9b9b9`)}function Sm(e){e(0,0,24,24,`#9a9a9a`),e(1,2,5,3,`#b5b5b5`),e(17,4,6,3,`#b5b5b5`),e(2,15,4,3,`#b5b5b5`),e(7,1,11,4,`#ece6d8`),e(5,4,13,3,`#ece6d8`),e(6,8,12,10,`#c98a58`),e(4,12,2,4,`#c98a58`),e(18,12,2,4,`#c98a58`),e(8,11,3,1,`#141414`),e(14,11,3,1,`#141414`),e(7,15,5,2,`#2a1c12`),e(12,14,5,2,`#2a1c12`),e(6,18,12,6,`#f4f0e6`),e(7,19,2,2,`#c23b2e`),e(11,21,2,2,`#c23b2e`),e(15,19,2,2,`#c23b2e`)}function Cm(e){e(0,0,24,24,`#cfcabc`),e(5,5,14,14,`#9a9282`),e(8,9,3,3,`#f4f0e6`),e(14,9,3,3,`#f4f0e6`),e(9,10,1,1,`#141414`),e(15,10,1,1,`#141414`),e(9,15,7,1,`#141414`)}var wm=` — `;function Tm(e,t){Dp(),Ep(`character-screen-style`,Em);let n=g.characters,r=document.createElement(`section`);r.className=`screen character-screen`,r.setAttribute(`aria-label`,`Seleção de personagem`),r.hidden=!0;let i=document.createElement(`button`);i.type=`button`,i.className=`screen-back`,i.textContent=`← Voltar (Esc)`,i.addEventListener(`click`,()=>t.onBack());let a=$(`h1`,`screen-title`,`Escolha o personagem`),o=$(`p`,`screen-hint`,`Clique num retrato para ver a ficha, e confirme nela para seguir.`),s=$(`aside`,`char-panel`,null);s.setAttribute(`aria-label`,`Ficha do personagem`),s.setAttribute(`aria-live`,`polite`);let c=$(`p`,`char-panel-empty`,`Escolha um personagem para ver a ficha.`),l=$(`div`,`char-panel-body`,null);l.hidden=!0;let u=document.createElement(`canvas`);u.className=`char-panel-portrait`,u.setAttribute(`aria-hidden`,`true`);let d=$(`h2`,`char-panel-name`,``),f=$(`p`,`char-panel-ability`,``),p=$(`p`,`char-panel-desc`,``),m=document.createElement(`button`);m.type=`button`,m.id=`character-confirm-btn`,m.className=`screen-primary char-confirm`,m.append($(`span`,`primary-label`,`CONFIRMAR`),$(`span`,`primary-sub`,`clique para escolher o mapa`)),l.append(u,d,f,p,m),s.append(c,l);let h=$(`div`,`screen-cards char-cards`,null),_=[],v=[],y=!1,b=null,x=0;n.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.className=`screen-card char-card card-paper-${t%3}`,n.setAttribute(`aria-pressed`,`false`),n.setAttribute(`aria-label`,`${e.name} — ver ficha`);let r=$(`span`,`card-chosen`,`ESTE!`);r.hidden=!0;let i=document.createElement(`canvas`);i.className=`char-portrait`,i.setAttribute(`aria-hidden`,`true`),ym(i,e.id),n.append(i,$(`span`,`card-key`,`clique para ver a ficha`),r),n.addEventListener(`click`,()=>{performance.now()<x||(C(t),m.focus({preventScroll:!0}))}),_.push(n),v.push(r),h.append(n)});let S=$(`div`,`char-layout`,null);S.append(h,s),r.append(i,a,o,S),e.append(r);function C(e){b=e,_.forEach((t,n)=>{t.classList.toggle(`selected`,n===e),t.setAttribute(`aria-pressed`,n===e?`true`:`false`),v[n].hidden=n!==e});let t=n[e];ym(u,t.id),d.textContent=t.name;let r=t.tagline.indexOf(wm);r>=0?(f.textContent=t.tagline.slice(0,r),p.textContent=t.tagline.slice(r+3)):(f.textContent=t.tagline,p.textContent=``),c.hidden=!0,l.hidden=!1}function w(){if(performance.now()<x||b===null)return;let e=n[b];e!==void 0&&t.onConfirm(e.id)}return m.addEventListener(`click`,w),window.addEventListener(`keydown`,e=>{y&&!kp(e)&&Ap(e)}),{show(e){if(y=!0,x=performance.now()+250,e!==void 0){let t=n.findIndex(t=>t.id===e);t>=0&&(b=t)}b!==null&&C(b),r.hidden=!1,_[b??0]?.focus({preventScroll:!0})},hide(){y=!1,r.hidden=!0,Op(r)}}}var Em=`
/* Retratos à esquerda, ficha à direita; em janela estreita a ficha desce. */
.char-layout {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: calc(var(--ui-gap) * 1.75);
}
.char-cards { max-width: 620px; }

/* Card compacto: só o retrato e o atalho — o texto mora na ficha. */
#screens .char-card {
  width: clamp(120px, 15vw, 168px);
  min-height: 0;
  padding: 16px 12px 10px;
}
.char-portrait {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  image-rendering: pixelated;
  border: 2px solid rgba(0, 0, 0, 0.35);
  background: #fffbe6;
}

/* Ficha lateral: panfleto rosa, caligrafia da casa. */
.char-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: clamp(240px, 30vw, 310px);
  min-height: 330px;
  padding: 22px 18px 20px;
  background: var(--ui-paper-1);
  color: var(--ui-ink);
  text-align: center;
  border: 2px solid rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.45);
  transform: rotate(1.2deg);
}
.char-panel::before { /* grampo, como nos demais panfletos */
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 26px;
  height: 8px;
  background: var(--ui-staple);
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  transform: translateX(-50%) rotate(-2deg);
}
.char-panel-empty { margin: auto 0; font-size: 15px; opacity: 0.8; max-width: 220px; }
.char-panel-empty[hidden] { display: none; }
.char-panel-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
  align-self: stretch;
}
.char-panel-body[hidden] { display: none; }
.char-panel-portrait {
  width: 128px;
  height: 128px;
  image-rendering: pixelated;
  border: 2px solid rgba(0, 0, 0, 0.35);
  transform: rotate(-2deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.35);
}
.char-panel-name { margin: 0; font-size: 26px; line-height: 1.1; }
.char-panel-ability { margin: 0; font-size: 15px; font-weight: bold; }
.char-panel-desc {
  margin: 0;
  padding-top: 8px;
  border-top: 2px dashed rgba(0, 0, 0, 0.35);
  align-self: stretch;
  font-size: 14px;
  line-height: 1.3;
}
.char-confirm { margin-top: auto; }

@media (max-width: 640px), (max-height: 560px) {
  .char-layout { gap: var(--ui-gap); }
  #screens .char-card { width: clamp(96px, 26vw, 130px); padding: 10px 8px 6px; }
  .char-panel { width: min(420px, 92vw); min-height: 0; }
  .char-panel-portrait { width: 84px; height: 84px; }
  .char-panel-name { font-size: 20px; }
}
`;function Dm(e,t){Dp();let n=g.maps,r=n.findIndex(e=>e.playable);if(r<0)throw Error(`seleção de mapa sem mapa jogável — gameData.maps inválido`);let i=document.createElement(`section`);i.className=`screen map-screen`,i.setAttribute(`aria-label`,`Seleção de mapa`),i.hidden=!0;let a=document.createElement(`button`);a.type=`button`,a.className=`screen-back`,a.textContent=`← Voltar (Esc)`,a.addEventListener(`click`,()=>t.onBack());let o=$(`h1`,`screen-title`,`Escolha o mapa`),s=$(`p`,`screen-hint`,`Clique num mapa liberado para jogar. Esc volta.`),c=$(`p`,`screen-status`,``);c.setAttribute(`role`,`status`),c.setAttribute(`aria-live`,`polite`);let l=$(`div`,`screen-cards`,null),u=!1,d=r,f=0;function p(e,t){c.textContent=`"${t}" ainda não abriu — escolha um dos mapas liberados.`,e.classList.remove(`denied`),e.offsetWidth,e.classList.add(`denied`)}let m=[],h=[];n.forEach((e,n)=>{let r=document.createElement(`button`);if(r.type=`button`,e.playable){r.className=`screen-card card-paper-${n%3}`,r.setAttribute(`aria-pressed`,`false`);let i=$(`span`,`card-chosen`,`ESTE!`);i.hidden=!0,r.append($(`span`,`card-name`,e.name)),e.tagline!==void 0&&r.append($(`span`,`card-line`,e.tagline)),r.append($(`span`,`card-key`,`clique para jogar aqui`),i),r.addEventListener(`click`,()=>{performance.now()<f||(_(n),t.onConfirm(e.id))}),h.push(i)}else r.className=`screen-card locked`,r.setAttribute(`aria-disabled`,`true`),r.append($(`span`,`card-stamp`,`EM BREVE`),$(`span`,`card-name`,e.name),$(`span`,`card-key`,`ainda fechado`)),r.addEventListener(`click`,()=>p(r,e.name)),h.push(null);m.push(r),l.append(r)}),i.append(a,o,s,l,c),e.append(i);function _(e){d=e,m.forEach((t,r)=>{n[r].playable&&(t.classList.toggle(`selected`,r===e),t.setAttribute(`aria-pressed`,r===e?`true`:`false`),h[r].hidden=r!==e)})}return window.addEventListener(`keydown`,e=>{u&&!kp(e)&&Ap(e)}),{show(){u=!0,f=performance.now()+250,c.textContent=``,_(d),i.hidden=!1,m[d]?.focus({preventScroll:!0})},hide(){u=!1,i.hidden=!0,Op(i)}}}function Om(e,t,n){Dp(),Ep(`shop-screen-style`,Am);let r=g.talents,i=document.createElement(`section`);i.className=`screen shop-screen`,i.setAttribute(`aria-label`,`Loja de talentos`),i.hidden=!0;let a=document.createElement(`button`);a.type=`button`,a.className=`screen-back`,a.textContent=`← Voltar (Esc)`,a.addEventListener(`click`,()=>n());let o=$(`h1`,`screen-title`,`Loja de Talentos`),s=$(`p`,`screen-hint`,`Bônus permanentes, pagos em banana. Clique num cartaz para comprar.`),c=$(`p`,`shop-wallet`,``),l=$(`p`,`screen-status`,``);l.setAttribute(`role`,`status`),l.setAttribute(`aria-live`,`polite`);let u=$(`div`,`screen-cards shop-cards`,null),d=[],f=!1,p=0;r.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.className=`screen-card shop-card card-paper-${t%3}`,n.addEventListener(`click`,()=>{performance.now()<p||y(t)}),d.push(n),u.append(n)}),i.append(a,o,s,c,l,u),e.append(i);function m(){c.textContent=`🍌 ${t.bananas} ${t.bananas===1?`banana`:`bananas`} no cofre`}function h(e){let n=r[e],i=d[e],a=t.rankOf(n.id),o=t.nextCost(n.id),s=o===null;i.textContent=``,i.classList.toggle(`maxed`,s),i.setAttribute(`aria-disabled`,s?`true`:`false`),i.append($(`span`,`shop-icon`,n.icon),$(`span`,`card-name`,n.name),$(`span`,`card-line`,n.effectLine),$(`span`,`shop-rank`,`nível ${a}/${n.maxRank} ${km(a,n.maxRank)}`)),s?i.append($(`span`,`card-stamp`,`ESGOTADO`),$(`span`,`card-key`,`tudo comprado`)):i.append($(`span`,`card-key`,`${o} 🍌 · clique para comprar`))}function _(){m();for(let e=0;e<r.length;e++)h(e)}function v(e,t){l.textContent=t,e.classList.remove(`denied`),e.offsetWidth,e.classList.add(`denied`)}function y(e){let n=r[e],i=d[e],a=t.nextCost(n.id);a===null?v(i,`"${n.name}" já está no talo — esgotou.`):t.buy(n.id)?(m(),h(e),l.textContent=`Comprou "${n.name}" nível ${t.rankOf(n.id)}! Vale em toda run.`):v(i,`Faltam ${a-t.bananas} bananas para "${n.name}". Vai lá abater uns cones.`)}return window.addEventListener(`keydown`,e=>{f&&!kp(e)&&Ap(e)}),{show(){f=!0,p=performance.now()+250,l.textContent=``,_(),i.hidden=!1,a.focus({preventScroll:!0})},hide(){f=!1,i.hidden=!0,Op(i)}}}function km(e,t){return`●`.repeat(e)+`○`.repeat(t-e)}var Am=`
.shop-wallet {
  margin: 0;
  padding: 5px 18px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  font-size: 17px;
  font-weight: bold;
  border-radius: 4px;
  transform: rotate(1deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

/* Mais cartazes que personagens: cards menores para a feira caber na tela. */
.shop-cards { max-width: 1200px; }
#screens .shop-card {
  width: clamp(160px, 20vw, 215px);
  min-height: 185px;
  padding-top: 14px;
}
.shop-icon { font-size: 30px; line-height: 1.1; }
.shop-rank { font-size: 13px; opacity: 0.85; letter-spacing: 1px; }

/* Esgotado: continua legível (não é "EM BREVE"), mas sem cara de botão. */
#screens .shop-card.maxed {
  cursor: not-allowed;
  background: var(--ui-paper-locked);
  color: var(--ui-ink-locked);
}

@media (max-width: 640px), (max-height: 560px) {
  #screens .shop-card { width: clamp(140px, 40vw, 190px); min-height: 160px; }
  .shop-wallet { font-size: 14px; }
}
`;function jm(e,t,n){Dp(),Ep(`achievements-screen-style`,Mm);let r=g.achievements,i=document.createElement(`section`);i.className=`screen achievements-screen`,i.setAttribute(`aria-label`,`Conquistas`),i.hidden=!0;let a=document.createElement(`button`);a.type=`button`,a.className=`screen-back`,a.textContent=`← Voltar (Esc)`,a.addEventListener(`click`,()=>n());let o=$(`h1`,`screen-title`,`Conquistas`),s=$(`p`,`ach-counter`,``),c=$(`div`,`screen-cards ach-cards`,null);c.setAttribute(`role`,`list`),i.append(a,o,s,c),e.append(i);function l(){let e=0;c.textContent=``,r.forEach((n,r)=>{let i=t.isUnlocked(n.id);i&&e++;let a=$(`div`,i?`screen-card ach-card card-paper-${r%3}`:`screen-card ach-card locked`,null);a.setAttribute(`role`,`listitem`),a.append($(`span`,`ach-icon`,n.icon),$(`span`,`card-name`,n.name),$(`span`,`card-line`,n.description)),i?a.append($(`span`,`card-chosen`,`FEITO!`),$(`span`,`card-key`,`prêmio recebido: ${n.reward} 🍌`)):a.append($(`span`,`card-key`,`prêmio: ${n.reward} 🍌`)),c.append(a)}),s.textContent=`${e} de ${r.length} desbloqueadas`}return{show(){l(),i.hidden=!1,a.focus({preventScroll:!0})},hide(){i.hidden=!0,Op(i)}}}var Mm=`
.ach-counter {
  margin: 0;
  padding: 5px 18px;
  background: var(--ui-paper-0);
  color: var(--ui-ink);
  font-size: 17px;
  font-weight: bold;
  border-radius: 4px;
  transform: rotate(-1deg);
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.45);
}

/* Mural maior que a janela + justify-content center cortaria o topo (título e
   1ª fileira ficam fora da área rolável). Ancora no topo com respiro; onde o
   navegador suporta, "safe center" centra apenas quando o conteúdo cabe. */
#screens .achievements-screen { justify-content: flex-start; padding-top: 56px; }
@supports (justify-content: safe center) {
  #screens .achievements-screen { justify-content: safe center; }
}

/* Muitos cartazes: cards menores, mural largo, a tela rola (overflow do tema). */
.ach-cards { max-width: 1280px; padding-top: 8px; }
#screens .ach-card {
  width: clamp(160px, 19vw, 210px);
  min-height: 165px;
  padding-top: 14px;
  cursor: default;
}
/* Trancado aqui não é "EM BREVE": é meta a cumprir — sem cursor de proibido.
   Aspecto de desabilitado: papel e tinta acinzentados, emoji sem cor. */
#screens .ach-card.locked {
  cursor: default;
  filter: grayscale(0.9);
  opacity: 0.75;
  color: #6b655a;
}
#screens .ach-card.locked .ach-icon { opacity: 0.55; }
.ach-icon { font-size: 30px; line-height: 1.1; }

@media (max-width: 640px), (max-height: 560px) {
  #screens .ach-card { width: clamp(140px, 40vw, 180px); min-height: 150px; }
  .ach-counter { font-size: 14px; }
}
`;function Nm(e){return`${Math.round(e*100)}%`}function Pm(e,t,n){Dp(),Ep(`album-screen-style`,Fm);let r=g.enemyTypes,i=g.album,a=document.createElement(`section`);a.className=`screen album-screen`,a.setAttribute(`aria-label`,`Álbum de figurinhas`),a.hidden=!0;let o=document.createElement(`button`);o.type=`button`,o.className=`screen-back`,o.textContent=`← Voltar (Esc)`,o.addEventListener(`click`,()=>n());let s=$(`h1`,`screen-title`,`Álbum de Figurinhas`),c=$(`p`,`album-hint`,`Todo abate tem uma chance pequena de dropar a figurinha do bicho. Junte cópias: cada degrau aumenta o seu dano contra ele.`),l=$(`p`,`album-counter`,``),f=$(`div`,`album-cards`,null);f.setAttribute(`role`,`list`);let p=$(`div`,`album-cards`,null);p.setAttribute(`role`,`list`);function m(e,t){let n=$(`div`,`album-watermark`,null);return n.setAttribute(`aria-hidden`,`true`),e.forEach((e,t)=>n.append($(`span`,`wm-icon wm-${t}`,e))),t&&n.append($(`span`,`wm-logo`,`BRONK!`)),n}let h=r.map(e=>e.icon),_=h.slice(3,6).length>0?h.slice(3,6):h.slice(0,3),v=$(`div`,`album-page album-page-left`,null);v.append(m(h.slice(0,3),!1),$(`p`,`album-page-title`,`COLEÇÃO BICHOS DA RUA`),l,f,$(`span`,`album-page-num`,`12`));let y=$(`div`,`album-page album-page-right`,null);y.append(m(_,!0),c,p,$(`span`,`album-page-num`,`13`));let b=$(`div`,`album-book`,null);b.append(v,y),a.append(o,s,b),e.append(a);function x(){let e=0,n=0;f.textContent=``,p.textContent=``;let a=Math.ceil(r.length/2);r.forEach((r,o)=>{let s=t.copiesOf(r.id);e+=s,s>0&&n++;let c=s>0,l=$(`div`,c?`album-slot filled`:`album-slot empty`,null);l.setAttribute(`role`,`listitem`);let m=$(`div`,c?`album-sticker p${o%3}`:`album-sticker`,null);m.append($(`span`,`album-icon`,c?r.icon:`???`)),l.append($(`span`,`album-num`,`Nº ${String(o+1).padStart(2,`0`)}`),m,$(`span`,`album-name`,r.name),$(`span`,`album-copies`,c?`×${s} no álbum`:`ainda não dropou`));let h=u(i,s);h>0&&l.append($(`span`,`album-bonus`,`+${Nm(h)} de dano contra ele`));let g=d(i,s);g===null?l.append($(`span`,`card-chosen`,`COMPLETO!`),$(`span`,`album-next`,`bônus no talo`)):l.append($(`span`,`album-next`,`faltam ${g.copies-s} pra +${Nm(g.damageBonus)}`)),(o<a?f:p).append(l)}),l.textContent=`🃏 ${e} figurinha${e===1?``:`s`} · ${n} de ${r.length} bichos colecionados`}return{show(){x(),a.hidden=!1,o.focus({preventScroll:!0})},hide(){a.hidden=!0,Op(a)}}}var Fm=`
/* ====== Álbum de figurinhas ABERTO, banca de jornal Brasil anos 2000 ======
   Um livro aberto sobre o poste: capa vermelha aparecendo pelas bordas, duas
   páginas creme lado a lado com vinco costurado no meio, pilha de folhas nas
   bordas externas, moldura verde impressa, slots numerados tracejados
   ("COLE AQUI") e figurinhas coladas tortas com borda branca e brilho. */

/* Livro maior que a janela + center cortaria o topo (mesmo fix das
   conquistas): ancora no topo; com suporte, centra só quando cabe. */
#screens .album-screen { justify-content: flex-start; padding-top: 52px; }
@supports (justify-content: safe center) {
  #screens .album-screen { justify-content: safe center; }
}

/* O livro aberto: álbum de banca de papel fininho — sem capa dura; em volta
   só a beiradinha das outras folhas e a sombra do caderno sobre o poste. */
.album-book {
  position: relative;
  display: flex;
  width: min(1280px, 95vw);
  padding: 5px 6px 9px;
  background: linear-gradient(180deg, #ded8c6 0%, #c9c2ad 100%);
  border-radius: 4px;
  box-shadow: 9px 12px 18px rgba(0, 0, 0, 0.55);
}
/* Vinco central: a sombra do miolo grampeado entre as duas páginas. */
.album-book::before {
  content: '';
  position: absolute;
  z-index: 2;
  top: 5px;
  bottom: 9px;
  left: 50%;
  width: 46px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent 0%, rgba(70, 80, 90, 0.35) 50%, transparent 100%);
  pointer-events: none;
}

/* Páginas: papel branco-azulado de gráfica; TODA a tinta da página é azul de
   impressão — só as figurinhas coladas têm cor de verdade. */
.album-page {
  position: relative;
  overflow: hidden;
  flex: 1 1 0;
  min-width: 0;
  padding: 22px 20px 40px;
  text-align: center;
  color: #1f7ab0;
}
.album-page-left {
  border-radius: 3px 0 0 3px;
  background: linear-gradient(90deg, #fcfeff 0%, #f4f9fc 78%, #e2edf3 96%, #cfdde6 100%);
}
.album-page-right {
  border-radius: 0 3px 3px 0;
  background: linear-gradient(90deg, #cfdde6 0%, #e2edf3 4%, #f4f9fc 22%, #fcfeff 100%);
}

/* Arte-d'água: bichos gigantes desbotados em azul + logo torto, sob os slots
   (a arte de fundo ciano dos álbuns impressos). */
.album-watermark {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.album-page > :not(.album-watermark) { position: relative; z-index: 1; }
.wm-icon {
  position: absolute;
  font-size: clamp(120px, 16vw, 230px);
  line-height: 1;
  filter: grayscale(1) sepia(1) hue-rotate(165deg) saturate(3.2) brightness(1.18);
  opacity: 0.16;
}
.wm-0 { top: 4%; left: -4%; transform: rotate(-14deg); }
.wm-1 { top: 34%; right: -6%; transform: rotate(10deg); }
.wm-2 { bottom: -6%; left: 24%; transform: rotate(-6deg); }
.wm-logo {
  position: absolute;
  top: 38%;
  left: 6%;
  font-size: clamp(54px, 7vw, 110px);
  font-weight: bold;
  font-style: italic;
  letter-spacing: 2px;
  color: rgba(46, 143, 196, 0.18);
  -webkit-text-stroke: 2px rgba(31, 122, 176, 0.3);
  transform: rotate(-12deg);
  white-space: nowrap;
}

/* Número de página, no canto externo, em azul de impressão. */
.album-page-num {
  position: absolute;
  bottom: 12px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  color: #2e8fc4;
}
.album-page-left .album-page-num { left: 20px; }
.album-page-right .album-page-num { right: 20px; }

/* Cabeçalho: texto impresso em itálico azul, torto como saiu da gráfica. */
.album-page-title {
  display: inline-block;
  margin: 0 0 4px;
  font-size: clamp(16px, 1.9vw, 23px);
  font-weight: bold;
  font-style: italic;
  letter-spacing: 3px;
  color: #1f7ab0;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
  transform: rotate(-2deg);
}

/* Progresso impresso na página, no mesmo azul. */
.album-counter {
  margin: 0 auto 14px;
  max-width: 480px;
  padding-bottom: 3px;
  font-size: 14px;
  font-weight: bold;
  font-style: italic;
  color: #2e8fc4;
  border-bottom: 2px dotted #86c7e6;
}

/* Grade de slots impressa em cada página. */
.album-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(146px, 1fr));
  gap: 18px 14px;
  width: 100%;
}

/* Slot: retângulo de moldura ciano impresso na página — como no álbum da
   banca —, com o número grande em azul dentro; cada um torto pra um lado. */
#screens .album-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 196px;
  padding: 6px 8px 8px;
  background: rgba(255, 255, 255, 0.22);
  border: 2px solid #86c7e6;
  border-radius: 2px;
}
.album-cards .album-slot:nth-child(odd) { transform: rotate(-1.3deg); }
.album-cards .album-slot:nth-child(even) { transform: rotate(1deg); }
.album-num {
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #2e8fc4;
}

/* A figurinha: borda branca grossa, fundo colorido e brilho de plástico. */
.album-sticker {
  position: relative;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  overflow: hidden;
  border: 5px solid #ffffff;
  border-radius: 6px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 2px 3px 0 rgba(0, 0, 0, 0.25);
}
.album-sticker.p0 { background: linear-gradient(160deg, #ffe066 0%, #ffb03a 100%); }
.album-sticker.p1 { background: linear-gradient(160deg, #ffd6ec 0%, #ff8ac2 100%); }
.album-sticker.p2 { background: linear-gradient(160deg, #d2f4ff 0%, #7cc6ff 100%); }
/* Brilho diagonal de figurinha plastificada. */
.album-slot.filled .album-sticker::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0) 34%);
}
/* Colada por criança: cada uma torta pra um lado. */
.album-cards .album-slot:nth-child(odd) .album-sticker { transform: rotate(-3deg); }
.album-cards .album-slot:nth-child(even) .album-sticker { transform: rotate(2.4deg); }

/* Slot vazio: só a moldura impressa, com a arte-d'água aparecendo atrás e o
   mistério "???" em azul clarinho — como os quadros vazios do álbum. */
.album-slot.empty .album-sticker {
  transform: none;
  border: 0;
  box-shadow: none;
  background: transparent;
}
.album-slot.empty { color: #74aed0; }
.album-slot.empty .album-icon { color: #9cc9e4; font-weight: bold; }

.album-icon { font-size: 34px; line-height: 1.1; letter-spacing: 2px; }
.album-name { font-size: 14.5px; font-weight: bold; line-height: 1.1; }
.album-copies { font-size: 12px; font-weight: bold; font-style: italic; }
.album-slot.empty .album-copies { font-weight: normal; }
.album-bonus { font-size: 12px; font-weight: bold; }
/* Linha "faltam K": legenda impressa no rodapé do slot. */
.album-next {
  margin-top: auto;
  align-self: stretch;
  padding-top: 4px;
  font-size: 11px;
  font-style: italic;
  border-top: 1px dotted #86c7e6;
}

/* Texto promocional impresso em itálico azul, torto — o "Complete do nº X ao
   Y com a figurinha chave e ganhe um Bicho de Pelúcia" do álbum. */
.album-hint {
  margin: 4px auto 14px;
  max-width: 540px;
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  color: #1f7ab0;
  transform: rotate(-1deg);
}

/* Janela estreita: o livro "fecha" numa coluna — página esquerda em cima da
   direita, vinco escondido, emenda das folhas no encontro das duas. */
@media (max-width: 900px) {
  .album-book { flex-direction: column; }
  .album-book::before { display: none; }
  .album-page-left {
    border-radius: 3px 3px 0 0;
    background: linear-gradient(180deg, #fcfeff 0%, #f4f9fc 85%, #dfeaf1 100%);
  }
  .album-page-right {
    border-radius: 0 0 3px 3px;
    background: linear-gradient(180deg, #dfeaf1 0%, #f4f9fc 12%, #fcfeff 100%);
  }
}

@media (max-width: 640px), (max-height: 560px) {
  .album-book { padding: 4px 4px 7px; }
  .album-page { padding: 16px 12px 32px; }
  .album-cards { grid-template-columns: repeat(auto-fill, minmax(128px, 1fr)); gap: 16px 10px; }
  #screens .album-slot { min-height: 170px; }
  .album-sticker { width: 72px; height: 72px; }
  .album-icon { font-size: 28px; }
  .album-counter { font-size: 13px; }
  .album-page-title { letter-spacing: 2px; }
}
`;function Im(e,t,n){Dp();let r=document.createElement(`section`);r.className=`screen settings-screen`,r.setAttribute(`aria-label`,`Configurações`),r.hidden=!0;let i=document.createElement(`button`);i.type=`button`,i.className=`screen-back`,i.textContent=`← Voltar (Esc)`,i.addEventListener(`click`,()=>n());let a=$(`h1`,`screen-title`,`Configurações`),o=$(`p`,`screen-hint`,`Os ajustes valem na hora e ficam salvos neste navegador.`),s=em(t,`settings`);return r.append(i,a,o,s.root),e.append(r),{show(){s.sync(),r.hidden=!1,i.focus({preventScroll:!0})},hide(){r.hidden=!0,Op(r)}}}function Lm(e,t,n){Dp();let r=document.createElement(`div`);r.id=`screens`,r.hidden=!0,document.body.append(r);let i=!1,a=null,o=null,s=_m(r,{onStart:()=>m(`character`),onShop:()=>m(`shop`),onSettings:()=>m(`settings`),onAchievements:()=>m(`achievements`),onAlbum:()=>m(`album`)}),c=Om(r,t,()=>m(`start`)),l=Im(r,n,()=>m(`start`)),u=jm(r,t,()=>m(`start`)),d=Pm(r,t,()=>m(`start`)),f=Tm(r,{onConfirm(e){o=e,m(`map`)},onBack(){m(`start`)}}),p={start:s,shop:c,settings:l,achievements:u,album:d,character:f,map:Dm(r,{onConfirm(t){if(o===null)throw Error(`mapa confirmado sem personagem selecionado — fluxo de telas fora de ordem`);e({characterId:o,mapId:t})},onBack(){m(`character`)}})};function m(e){a!==null&&p[a].hide(),a=e,e===`character`?f.show(o??void 0):p[e].show()}return window.addEventListener(`keydown`,e=>{i&&!e.repeat&&e.code===`Escape`&&(a===`character`||a===`shop`||a===`settings`||a===`achievements`||a===`album`?(e.preventDefault(),m(`start`)):a===`map`&&(e.preventDefault(),m(`character`)))}),{get visible(){return i},show(e=`start`){i=!0,r.hidden=!1,m(e)},hide(){i=!1,r.hidden=!0,a!==null&&p[a].hide(),a=null}}}var Rm=`bronk.meta.v1`;function zm(e,t){let n=t??Bm(),r=0,i=Array(e.talents.length).fill(0),a=Array(e.enemyTypes.length).fill(0),o=new Set,s={runs:0,kills:0,killsByType:Array(e.enemyTypes.length).fill(0),bananas:0,bestTimeSec:0,characters:new Set,maps:new Set};d();function c(t){let n=e.talents.findIndex(e=>e.id===t);if(n<0)throw Error(`talento desconhecido: ${t}`);return n}function l(t){let n=e.enemyTypes.findIndex(e=>e.id===t);if(n<0)throw Error(`tipo de inimigo desconhecido: ${t}`);return n}function u(e){return typeof e!=`number`||!Number.isFinite(e)?null:Math.max(0,Math.floor(e))}function d(){if(n===null)return;let t=null;try{t=n.getItem(Rm)}catch{return}if(t===null)return;let c;try{c=JSON.parse(t)}catch{return}if(typeof c!=`object`||!c)return;let l=c,d=u(l.bananas);d!==null&&(r=d);let f=l.talentRanks;if(typeof f==`object`&&f)for(let[t,n]of Object.entries(f)){let r=e.talents.findIndex(e=>e.id===t);if(r<0)continue;let a=u(n);a!==null&&(i[r]=Math.min(e.talents[r].maxRank,a))}let p=l.album;if(typeof p==`object`&&p)for(let[t,n]of Object.entries(p)){let r=e.enemyTypes.findIndex(e=>e.id===t);if(r<0)continue;let i=u(n);i!==null&&(a[r]=i)}let m=l.achievements;if(Array.isArray(m))for(let t of m)typeof t==`string`&&e.achievements.some(e=>e.id===t)&&o.add(t);let h=l.lifetime;if(typeof h==`object`&&h){let t=h;s.runs=u(t.runs)??0,s.kills=u(t.kills)??0,s.bananas=u(t.bananas)??0,s.bestTimeSec=u(t.bestTimeSec)??0;let n=t.killsByType;if(typeof n==`object`&&n)for(let[t,r]of Object.entries(n)){let n=e.enemyTypes.findIndex(e=>e.id===t);if(n<0)continue;let i=u(r);i!==null&&(s.killsByType[n]=i)}let r=t.characters;if(Array.isArray(r))for(let t of r)typeof t==`string`&&e.characters.some(e=>e.id===t)&&s.characters.add(t);let i=t.maps;if(Array.isArray(i))for(let t of i)typeof t==`string`&&e.maps.some(e=>e.id===t)&&s.maps.add(t)}}function f(){if(n===null)return;let t={};for(let n=0;n<e.talents.length;n++)i[n]>0&&(t[e.talents[n].id]=i[n]);let c={},l={};for(let t=0;t<e.enemyTypes.length;t++){let n=e.enemyTypes[t].id;a[t]>0&&(c[n]=a[t]),s.killsByType[t]>0&&(l[n]=s.killsByType[t])}try{n.setItem(Rm,JSON.stringify({bananas:r,talentRanks:t,album:c,achievements:[...o],lifetime:{runs:s.runs,kills:s.kills,killsByType:l,bananas:s.bananas,bestTimeSec:s.bestTimeSec,characters:[...s.characters],maps:[...s.maps]}}))}catch{}}function m(t){let n=0,r=0;for(let t=0;t<e.talents.length;t++)n+=i[t],i[t]>=e.talents[t].maxRank&&r++;let o=e.album.tiers[e.album.tiers.length-1],c=0,l=0,u=0;for(let e of a)c+=e,e>=1&&l++,e>=o.copies&&u++;let d={};for(let t=0;t<e.enemyTypes.length;t++)d[e.enemyTypes[t].id]=s.killsByType[t];return{runsPlayed:s.runs,lifetimeKills:s.kills,lifetimeKillsByType:d,lifetimeBananas:s.bananas,talentRanksBought:n,talentsMaxed:r,charactersPlayed:s.characters.size,mapsPlayed:s.maps.size,albumCards:c,albumTypesCollected:l,albumSetsMaxed:u,lastRun:t}}function h(t){let n=p(e,m(t),o),i=0;for(let e of n)o.add(e.id),i+=e.reward;return r+=i,{newAchievements:n,rewardBananas:i}}return{get bananas(){return r},rankOf(e){return i[c(e)]},talentRanksArray(){return i.slice()},credit(e){!Number.isFinite(e)||e<=0||(r+=Math.floor(e),f())},nextCost(t){let n=c(t),r=e.talents[n],a=i[n];return a>=r.maxRank?null:r.costPerRank[a]},canBuy(e){let t=this.nextCost(e);return t!==null&&t<=r},buy(t){let n=c(t),a=e.talents[n],o=i[n];if(o>=a.maxRank)return!1;let s=a.costPerRank[o];return s>r?!1:(r-=s,i[n]=o+1,h(null),f(),!0)},copiesOf(e){return a[l(e)]},albumCopiesArray(){return a.slice()},isUnlocked(t){if(!e.achievements.some(e=>e.id===t))throw Error(`conquista desconhecida: ${t}`);return o.has(t)},get unlockedCount(){return o.size},lifetimeKillsOf(e){return s.killsByType[l(e)]},recordRun(t){if(t.killsByType.length!==e.enemyTypes.length)throw Error(`killsByType com tamanho ${t.killsByType.length}; esperado ${e.enemyTypes.length}`);if(t.cardsEarned.length!==e.enemyTypes.length)throw Error(`cardsEarned com tamanho ${t.cardsEarned.length}; esperado ${e.enemyTypes.length}`);let n=Math.max(0,Math.floor(t.bananasEarned));r+=n,s.bananas+=n,s.runs+=1,s.bestTimeSec=Math.max(s.bestTimeSec,Math.floor(t.timeSec)),s.characters.add(t.characterId),s.maps.add(t.mapId);let i=0;for(let n=0;n<e.enemyTypes.length;n++){let e=Math.max(0,Math.floor(t.killsByType[n]));i+=e,s.kills+=e,s.killsByType[n]=s.killsByType[n]+e,a[n]=a[n]+Math.max(0,Math.floor(t.cardsEarned[n]))}let o=h({kills:i,timeSec:t.timeSec,level:t.level,died:t.died});return f(),o}}}function Bm(){try{return window.localStorage}catch{return null}}var Vm=new URLSearchParams(window.location.search),Hm=wh(g,Vm);v(Hm);var Um=Sh(Vm);for(let e of Um)_e(Hm,e);var Wm=Ch(Vm,`seed`),Gm=Ch(Vm,`tempo`),Km=document.querySelector(`#game`),qm=document.querySelector(`#hud`);if(!Km||!qm)throw Error(`index.html sem #game ou #hud`);var Jm=Km,Ym=qm;Ed(Vm.get(`snap`)===`1`);var Xm=L(Jm),Zm=we(window),Qm=rp(Jm,{renderHeight:Ch(Vm,`res`)??0,cameraLook:Xm,showDamageNumbers:()=>ih.showDamageNumbers}),$m=Oe(),eh=Fp(Ym),th=zm(Hm),nh=Ch(Vm,`bananas`);nh!==void 0&&th.credit(Math.floor(nh));var rh=wp(),ih=Xp(),ah=()=>{rh.setMasterVolume(ih.volume),Xm.setSensitivity(ih.mouseSensitivity)};ih.subscribe(ah),ah();var oh=`menu`,sh=null,ch=null,lh=null,uh=Lm(e=>{rh.unlock(),hh(e)},th,ih),dh=zp(()=>{sh=bh(vh()),dh.hide()},()=>{gh()}),fh=Up({choose(e){let t=sh?.upgradeChoice;sh!==null&&t!=null&&(e>=t.options.length||(be(sh,e),fh.sync(sh),sh.upgradeChoice===null&&Xm.lock()))},reroll(){sh!==null&&sh.upgradeChoice!==null&&sh.upgradeChoice.rerollAvailable&&(xe(sh),fh.sync(sh))}}),ph=nm({resume(){ph.hide(),Xm.lock()},endRun(){ph.hide(),sh!==null&&pe(sh)},exitToMenu(){ph.hide(),sh!==null&&sh.status===`running`&&th.recordRun(yh(sh)),gh(`start`)}},ih);window.addEventListener(`keydown`,e=>{e.repeat||e.ctrlKey||e.altKey||e.metaKey||e.code!==`Escape`&&e.code!==`KeyP`||oh!==`match`||sh===null||sh.status!==`running`||sh.upgradeChoice!==null||dh.visible||(e.preventDefault(),ph.visible?ph.closeSettings()||ph.hide():(Xm.unlock(),ph.show(sh)))});var mh=Vm.get(`personagem`);if(mh!==null){let e=()=>{window.removeEventListener(`pointerdown`,e),window.removeEventListener(`keydown`,e),rh.unlock()};window.addEventListener(`pointerdown`,e),window.addEventListener(`keydown`,e),hh({characterId:mh,mapId:Vm.get(`mapa`)??void 0})}else Ym.hidden=!0,uh.show();function hh(e){if(oh!==`menu`)throw Error(`startMatch em estado ${oh}`);uh.hide(),Qm.beginMatch(Hm,e),rh.beginMatch(),ch=e,sh=bh(e),Ym.hidden=!1,lh=yt({getWorld:()=>_h(),sampleInput:()=>F(Zm.sample(),Xm.yaw),draw:(e,t,n)=>Qm.draw(e,t,n),perf:$m,isPaused:()=>ph.visible,afterFrame:e=>{if(eh.update(e,$m),rh.update(e),e.upgradeChoice!==null&&!fh.visible&&Xm.unlock(),fh.sync(e),e.status===`gameOver`&&!dh.visible){Xm.unlock();let t=th.recordRun(yh(e));dh.show(e,{newAchievements:t.newAchievements})}}}),oh=`match`}function gh(e=`character`){if(oh!==`match`)throw Error(`returnToMenu em estado ${oh}`);lh?.stop(),lh=null,dh.hide(),ph.hide(),Qm.endMatch(),rh.endMatch(),sh=null,ch=null,Ym.hidden=!0,oh=`menu`,uh.show(e)}function _h(){if(sh===null)throw Error(`world ausente com o loop rodando`);return sh}function vh(){if(ch===null)throw Error(`seleção ausente com a partida ativa`);return ch}function yh(e){return{characterId:e.data.characters[e.characterIndex].id,mapId:e.mapId,timeSec:e.time,level:e.player.level,died:e.player.state===`dead`,bananasEarned:e.bananasEarned,killsByType:e.killsByType,cardsEarned:e.cardsEarned}}function bh(e){let t=Math.floor(Wm??xh()),n=ge(Hm,N(t),{...e,talentRanks:th.talentRanksArray(),albumCopies:th.albumCopiesArray(),dropSeed:(t^24301)>>>0});return Gm!==void 0&&(n.time=Gm),ye(n,Um),n}function xh(){return(Date.now()^Math.random()*4294967295)>>>0}function Sh(e){let t=e.get(`melhorias`);return t===null?[]:t.split(`,`).map(e=>e.trim()).filter(e=>e.length>0)}function Ch(e,t){let n=e.get(t);if(n===null)return;let r=Number(n);return Number.isFinite(r)&&r>0?r:void 0}function wh(e,t){let n=structuredClone(e),r=Ch(t,`inimigos`);r!==void 0&&(n.enemies.maxAlive=Math.floor(r));let i=Ch(t,`spawn`);return i!==void 0&&(n.spawn.baseRatePerSec=i),n}