// @ts-nocheck
// Rig tokoh 2D tanpa wajah (gaya 'tokoh'): kepala polos + mulut, badan potongan, gradasi tanpa garis luar.
// Alat bantu umum: tokoh tiap film dibuat dari preset (preset.ts) atau opsi figure() sendiri sesuai kebutuhan film.
// Ukuran dan sendi: docs/scenes/2D-TOKOH.md §1. Semua fungsi mengembalikan string SVG; bungkus dengan art(() => ...).

// ---------- warna & gradasi ----------
export const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
export const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
export const mix=(c,t,k)=>{const a=hex(c),b=hex(t);return toHex(a.map((v,i)=>v+(b[i]-v)*k))};
export const lt=(c,k)=>mix(c,'#fff6e6',k), dk=(c,k)=>mix(c,'#1a1210',k);
let USED=new Map();
/** collect gradient defs used while building art */
export function art(fn){const prev=USED;USED=new Map();const body=fn();const d=[...USED.values()].join('');USED=prev;for(const [k,v] of USED)USED.set(k,v);return `<defs>${d}</defs>`+body}
const gid=(p,c)=>p+c.slice(1);
export function G(c){ // gradasi badan: terang kiri atas, gelap kanan bawah
  const id=gid('tkg',c);if(!USED.has(id))USED.set(id,`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="${lt(c,.22)}"/><stop offset=".42" stop-color="${c}"/><stop offset="1" stop-color="${dk(c,.32)}"/></linearGradient>`);
  return `url(#${id})`}

export function RG(c){ // gradasi bulat untuk kepala
  const id=gid('tkr',c);if(!USED.has(id))USED.set(id,`<radialGradient id="${id}" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="${lt(c,.25)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${dk(c,.35)}"/></radialGradient>`);
  return `url(#${id})`}
export const SKIN='#c4936c';
// ---------- bagian ----------
export function limb(len,w,fill,inner=''){return `<rect x="${-w/2}" y="${-w*.3}" width="${w}" height="${len+w*.3}" rx="${w/2}" fill="${G(fill)}"/>${inner}`}
// lengan: pivot bahu, a1 sudut lengan atas, a2 tekuk siku; sleeve: 'short'|'long'; color baju
export function arm(o){const {x,y,a1,a2,sleeve,cloth,skin=SKIN,hold=''}=o;
  const L1=98,L2=88,w1=34,w2=29;
  const lower=`<g transform="translate(0 ${L1}) rotate(${a2})">${limb(L2,w2,sleeve==='long'?cloth:skin)}${sleeve==='long'?`<rect x="${-w2/2-1}" y="${L2-10}" width="${w2+2}" height="7" rx="3" fill="${dk(cloth,.18)}"/>`:''}<g transform="translate(0 ${L2+6})"><circle r="17" fill="${RG(skin)}"/>${hold}</g></g>`;
  const upper=limb(L1,w1,sleeve==='none'?skin:(sleeve==='short'?skin:cloth));
  const cuff=sleeve==='short'?`<path d="M${-w1/2-4} -14 L${w1/2+4} -14 L${w1/2+5} 52 Q0 58 ${-w1/2-5} 52Z" fill="${G(cloth)}"/>`:'';
  return `<g transform="translate(${x} ${y}) rotate(${a1})">${lower}${upper}${cuff}</g>`}
// kepala: tipe rambut/penutup
export function head(o){const {hx=0,hy=0,tilt=0,hair='raka',view='front',mouth='flat',skin=SKIN,hairc='#221a17',extra=''}=o;
  if(view==='side'){const capped=['peci','pet','blangkon'].includes(hair),hij=hair==='hijab'||hair==='kerudung';
    const sk=`<ellipse cx="4" cy="82" rx="60" ry="76" fill="${RG(skin)}"/>`,ear=`<ellipse cx="-6" cy="94" rx="11" ry="17" fill="${dk(skin,.12)}"/>`;
    const longH=['bob','kuncir','selendang','sanggul'].includes(hair);
    let hr=`<path d="M-58 ${longH?132:112} C-70 20 -36 -10 8 -10 C46 -10 66 14 64 52 L50 46 Q30 30 6 40 Q-12 50 -16 ${longH?132:104} Z" fill="${RG(hairc)}"/>`;
    if(hair==='cepak')hr=`<path d="M-56 96 C-66 10 -30 -10 8 -10 C44 -10 64 12 62 40 Q30 22 0 34 Q-20 46 -22 92Z" fill="${RG(hairc)}"/>`;
    if(hair==='ikal')hr+=[...Array(8)].map((_,i)=>`<circle cx="${-50+i*14}" cy="${18-Math.sin(i/7*Math.PI)*16}" r="16" fill="${RG(hairc)}"/>`).join('');
    if(hair==='kuncir')hr+=`<ellipse cx="-66" cy="70" rx="15" ry="42" fill="${RG(hairc)}" transform="rotate(18 -66 30)"/>`;
    if(hair==='sanggul')hr+=`<circle cx="-56" cy="40" r="26" fill="${RG(hairc)}"/>`;
    if(capped)hr=`<path d="M-56 100 C-62 60 -40 40 -10 44 L-20 96Z" fill="${hairc}"/>`+(hair==='peci'?`<path d="M-58 48 L-54 -2 Q4 -12 58 0 L60 48 Q0 38 -58 48Z" fill="${RG('#1c1b20')}"/>`:hair==='pet'?`<path d="M-60 48 L-56 8 Q4 -4 56 8 L60 48Z" fill="${G('#a99a74')}"/><path d="M40 46 Q84 46 96 58 L44 58Z" fill="#181410"/>`:`<path d="M-62 54 Q-64 -6 2 -10 Q64 -6 60 54 Q0 42 -62 54Z" fill="${G(o.capc||'#5a3a22')}"/><ellipse cx="-58" cy="28" rx="22" ry="20" fill="${G(o.capc||'#5a3a22')}"/>`);
    if(hair==='selendang')hr+=`<path d="M-74 140 C-80 40 -40 -6 10 -6 C40 -6 58 10 60 30 L36 30 Q-10 20 -30 60 C-40 110 -50 170 -60 222 L-96 220 C-90 190 -80 170 -74 140Z" fill="${G(o.hijabc||'#e9e0cf')}" opacity=".92"/>`;
    let core=ear+sk;
    if(hij){const hc=o.hijabc||'#c48b8b';core=`<path d="M-70 84 C-74 -4 -36 -16 6 -16 C46 -16 72 4 70 70 C74 140 80 180 84 ${hair==='hijab'?236:206} L-100 ${hair==='hijab'?236:206} C-94 178 -72 140 -70 84Z" fill="${G(hc)}"/><ellipse cx="34" cy="92" rx="30" ry="52" fill="${RG(skin)}"/>`;hr='';}
    const my=hij?118:128,mc='#7d3f33';
    const M={flat:`<path d="M-6 0 Q0 2 6 0" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,open:`<ellipse cx="0" cy="1" rx="3.5" ry="4.5" fill="#5a2a22"/>`,down:`<path d="M-6 3 Q0 -3 6 3" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,smile:`<path d="M-6 -1 Q0 6 6 -1" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,tight:`<path d="M-5 0 L5 0" stroke="${mc}" stroke-width="3" stroke-linecap="round"/>`}[mouth]||'';
    return `<g transform="translate(${hx} ${hy}) rotate(${tilt} 0 140)">${core}${hr}${extra}<g transform="translate(${hij?56:58} ${my})">${M}</g></g>`}
  const mx=view==='q'?20:0;let back='',top='',face='';
  const earL=`<ellipse cx="-61" cy="92" rx="11" ry="17" fill="${dk(skin,.12)}"/>`,earR=`<ellipse cx="61" cy="92" rx="11" ry="17" fill="${dk(skin,.12)}"/>`;
  let ears=view==='front'?earL+earR:view==='q'?earL:earL+earR;
  const skull=`<ellipse cx="0" cy="80" rx="62" ry="76" fill="${RG(skin)}"/>`;
  if(hair==='raka'){top=view==='back'?`<path d="M-64 104 C-72 10 -40 -8 0 -8 C40 -8 72 10 64 104 Q0 128 -64 104Z" fill="${RG(hairc)}"/>`:
    `<path d="M-65 98 C-72 18 -40 -9 0 -9 C40 -9 72 18 65 98 L60 74 L54 50 L46 60 L38 44 L28 57 L18 42 L8 56 L-2 41 L-12 56 L-22 42 L-32 57 L-42 45 L-50 58 L-58 74Z" fill="${RG(hairc)}" transform="translate(${view==='q'?6:0} 0)"/>`}
  if(hair==='kakak'){top=`<path d="M-64 88 C-70 10 -38 -6 0 -6 C38 -6 70 10 64 88 L58 60 Q30 30 -10 38 Q-40 42 -58 62Z" fill="${RG(hairc)}"/>`}
  if(hair==='cepak'){top=`<path d="M-63 74 C-66 2 -36 -10 0 -10 C36 -10 66 2 63 74 Q44 30 0 28 Q-44 30 -63 74Z" fill="${RG(hairc)}"/>`}
  if(hair==='belah'){top=`<path d="M-65 92 C-72 8 -38 -11 0 -11 C40 -11 72 8 65 92 L60 56 Q36 28 -16 36 L-24 24 Q-48 38 -59 64Z" fill="${RG(hairc)}"/><path d="M-24 24 Q-10 2 18 -6" stroke="${lt(hairc,.25)}" stroke-width="2" fill="none"/>`}
  if(hair==='ikal'){const c=[];for(let i=0;i<=12;i++){const a=Math.PI*(1.05+i*0.075);c.push(`<circle cx="${(Math.cos(a)*60).toFixed(1)}" cy="${(80+Math.sin(a)*74).toFixed(1)}" r="${17+(i%3)*3}"/>`)}
    top=`<g fill="${RG(hairc)}">${c.join('')}<path d="M-60 72 C-64 6 -34 -4 0 -4 C34 -4 64 6 60 72 Q30 40 0 44 Q-30 40 -60 72Z"/></g>`}
  if(hair==='kuncir'){back=`<ellipse cx="58" cy="70" rx="15" ry="44" fill="${RG(hairc)}" transform="rotate(-14 58 30)"/>`;top=`<path d="M-65 92 C-72 12 -40 -10 0 -10 C40 -10 72 12 65 92 L60 60 Q34 22 -8 26 Q-40 26 -60 62Z" fill="${RG(hairc)}"/><circle cx="54" cy="30" r="6" fill="#c0392b"/>`}
  if(hair==='bob'){top=`<path d="M-72 128 C-80 0 -42 -14 0 -14 C42 -14 80 0 72 128 L58 132 L57 64 Q20 30 -20 40 Q-46 46 -57 64 L-58 132Z" fill="${RG(hairc)}"/>`}
  if(hair==='blangkon'){back=`<ellipse cx="0" cy="28" rx="34" ry="22" fill="${G(o.capc||'#5a3a22')}"/>`;top=`<path d="M-63 94 L-62 50 L-46 50 L-50 82Z M63 94 L62 50 L46 50 L50 82Z" fill="${hairc}"/><path d="M-62 54 Q-66 -6 0 -10 Q66 -6 62 54 Q0 42 -62 54Z" fill="${G(o.capc||'#5a3a22')}"/><g opacity=".5" fill="none" stroke="#e3c48a" stroke-width="2">${[0,1,2,3].map(i=>`<path d="M${-46+i*28} 30 q8 -10 16 0 q8 10 16 0"/>`).join('')}</g><path d="M-62 54 Q0 42 62 54" stroke="#2a1a10" stroke-width="3" fill="none"/>`}
  if(hair==='selendang'){const vc=o.hijabc||'#e9e0cf';top=`<path d="M-65 96 C-72 14 -40 -10 0 -10 C40 -10 72 14 65 96 L58 64 Q30 18 2 22 Q-30 18 -58 64Z" fill="${RG(hairc)}"/><path d="M-74 140 C-80 40 -50 -4 0 -4 C50 -4 80 40 74 140 C82 180 92 200 96 220 L70 222 C66 170 62 120 58 70 Q30 26 0 26 Q-30 26 -58 70 C-62 120 -66 170 -70 222 L-96 220 C-92 200 -82 180 -74 140Z" fill="${G(vc)}" opacity=".92"/>`}
  if(hair==='peci'){top=`<path d="M-63 94 L-62 50 L-46 50 L-50 82Z M63 94 L62 50 L46 50 L50 82Z" fill="${hairc}"/><path d="M-60 46 L-57 -2 Q0 -14 57 -2 L60 46 Q0 36 -60 46Z" fill="${RG('#1c1b20')}"/><path d="M-57 6 Q0 -6 57 6" stroke="#3a3942" stroke-width="2" fill="none"/>`}
  if(hair==='pet'){top=`<path d="M-63 94 L-62 50 L-46 50 L-50 82Z M63 94 L62 50 L46 50 L50 82Z" fill="${hairc}"/><path d="M-62 48 L-58 8 Q0 -4 58 8 L62 48Z" fill="${G('#a99a74')}"/><ellipse cx="0" cy="4" rx="74" ry="16" fill="${G('#b8a981')}"/><rect x="-62" y="36" width="124" height="12" fill="#3a2e22"/><path d="M-60 48 Q0 66 60 48 L56 54 Q0 76 -56 54Z" fill="#181410"/>`}
  if(hair==='sanggul'){back=`<circle cx="0" cy="-6" r="26" fill="${RG(hairc)}"/>`;top=`<path d="M-65 96 C-72 14 -40 -10 0 -10 C40 -10 72 14 65 96 L58 64 Q30 18 2 22 Q-30 18 -58 64Z" fill="${RG(hairc)}"/>`}
  if(view==='back'&&['raka','kakak','cepak','belah','ikal','kuncir','bob','sanggul'].includes(hair)){const ln=hair==='bob'?136:hair==='cepak'?96:108;
    top=`<path d="M-64 ${ln-4} C-72 10 -40 -8 0 -8 C40 -8 72 10 64 ${ln-4} Q0 ${ln+20} -64 ${ln-4}Z" fill="${RG(hairc)}"/>`+(hair==='ikal'?[...Array(9)].map((_,i)=>`<circle cx="${-56+i*14}" cy="${8+Math.abs(i-4)*7}" r="16" fill="${RG(hairc)}"/>`).join(''):'')+(hair==='kuncir'?`<ellipse cx="0" cy="96" rx="15" ry="44" fill="${RG(hairc)}"/><circle cx="0" cy="56" r="7" fill="#c0392b"/>`:'');
    if(hair==='kuncir'||hair==='sanggul')back='';
    if(hair==='sanggul')top+=`<circle cx="0" cy="60" r="26" fill="${RG(hairc)}"/>`;}
  let hijab='';
  if(hair==='hijab'||hair==='kerudung'){const hc=o.hijabc||'#c48b8b';
    hijab=`<path d="M-72 84 C-76 -4 -40 -16 0 -16 C40 -16 76 -4 72 84 C74 140 96 178 102 ${hair==='hijab'?236:206} L-102 ${hair==='hijab'?236:206} C-96 178 -74 140 -72 84Z" fill="${G(hc)}"/><path d="M-30 196 Q0 214 30 196" stroke="${dk(hc,.25)}" stroke-width="2" fill="none"/>`;
    face=view==='back'?'':`<ellipse cx="${mx*.6}" cy="90" rx="46" ry="56" fill="${RG(skin)}"/>`;ears='';}
  // mulut
  const my=hair==='hijab'||hair==='kerudung'?118:128,mc='#7d3f33';
  const M={flat:`<path d="M-9 0 Q0 2 9 0" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    open:`<ellipse cx="0" cy="1" rx="5" ry="4.5" fill="#5a2a22"/>`,
    down:`<path d="M-10 3 Q0 -4 10 3" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    smile:`<path d="M-10 -1 Q0 7 10 -1" stroke="${mc}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    tight:`<path d="M-7 0 L7 0" stroke="${mc}" stroke-width="3" stroke-linecap="round"/>`}[mouth]||'';
  const mouthG=view==='back'?'':`<g transform="translate(${mx} ${my})">${M}<ellipse cx="0" cy="6" rx="5" ry="1.6" fill="#e3b394" opacity=".7"/></g>`;
  const headCore=hijab?hijab+face:ears+skull;
  return `<g transform="translate(${hx} ${hy}) rotate(${tilt} 0 140)">${back}${headCore}${top}${extra}${mouthG}</g>`}
// ---------- rig ----------
// Satuan tokoh: tinggi 520 = 1,6 m, telapak di y=520, x=0 garis tengah. Tampak samping menghadap +x.
// Rantai sendi:  leher(0,150) - bahu(±66,192) - siku - pergelangan   |   pinggul(±28,326) - lutut - pergelangan kaki - telapak
// Sudut: rotate SVG, 0 = menggantung lurus ke bawah, positif = berputar ke -x. Sendi kedua (siku/lutut) relatif terhadap tulang pertama.
//   samping, paha ke depan = a1 -90; betis tegak dari paha datar = a2 +90.
export const RIG={shoulderX:66,shoulderY:192,hipX:28,hipY:326,thigh:96,shin:82,sole:17,waistY:318,sitHipY:421};
/** pose kaki siap pakai: [[a1,a2,f1,f2] kiri, [..] kanan]; f = faktor pendek (paha mengarah ke/menjauhi kamera) */
export const LEGPOSE={
  stand:{front:[[0,0,1,1],[0,0,1,1]],back:[[0,0,1,1],[0,0,1,1]],side:[[0,0,1,1],[0,0,1,1]],q:[[0,0,1,1],[0,0,1,1]]},
  sit:{front:[[4,0,.14,.84],[-4,0,.14,.84]],back:[[4,0,.14,.84],[-4,0,.14,.84]],side:[[-90,90,1,1],[-86,84,1,1]],q:[[-30,26,.6,.9],[-26,22,.6,.9]]},
};
/** pose jalan tampak samping, t = fase 0..1 */
export const walkLegs=t=>{const s=Math.sin(t*Math.PI*2),c=Math.cos(t*Math.PI*2);
  return [[-22*s,Math.max(0,22*c+8),1,1],[22*s,Math.max(0,-22*c+8),1,1]]};
// kaki: pivot pinggul; paha lalu betis; sepatu selalu datar
export function leg(o){const {x,y,a1=0,a2=0,f1=1,f2=1,fill,shin,shoes='#1d1b1a',side=false,w1=50,w2=42}=o;
  const L1=RIG.thigh*f1,L2=RIG.shin*f2;
  const shoe=side?`<path d="M-20 -6 L22 -4 Q40 0 38 10 L-20 10Z" fill="${G(shoes)}"/>`:`<ellipse cx="0" cy="4" rx="26" ry="11" fill="${G(shoes)}"/>`;
  const lower=`<g transform="translate(0 ${L1.toFixed(1)}) rotate(${a2})">${limb(L2,w2,shin||fill)}<g transform="translate(0 ${L2.toFixed(1)}) rotate(${-(a1+a2)})">${shoe}</g></g>`;
  const knee=f1<.5?`<ellipse cx="0" cy="${L1.toFixed(1)}" rx="${w1/2+2}" ry="${(w1/2)*.8}" fill="${G(fill)}"/>`:'';
  return `<g transform="translate(${x} ${y}) rotate(${a1})">${lower}${limb(L1,w1,fill)}${knee}</g>`}
/** pinggul/pantat, dalam bingkai badan berdiri (pinggang y 318). sit menambah bentuk pantat di dudukan */
export function pelvis(o){const {view,ww,fill,sit}=o,W=ww,y0=RIG.waistY,yb=RIG.hipY+26;
  if(view==='side')return sit?`<ellipse cx="-8" cy="${RIG.hipY+2}" rx="48" ry="30" fill="${G(fill)}"/>`:`<ellipse cx="-4" cy="${RIG.hipY+4}" rx="40" ry="28" fill="${G(fill)}"/>`;
  if(!sit)return `<path d="M${-W} ${y0} L${W} ${y0} L${W*1.02} 352 Q0 366 ${-W*1.02} 352Z" fill="${G(fill)}"/>`;
  if(view==='back')return `<path d="M${-W} ${y0} L${W} ${y0} L${W*1.1} ${yb-16} Q${W*1.06} ${yb} ${W*.5} ${yb} Q${W*.08} ${yb} 0 ${yb-9} Q${-W*.08} ${yb} ${-W*.5} ${yb} Q${-W*1.06} ${yb} ${-W*1.1} ${yb-16}Z" fill="${G(fill)}"/><path d="M0 ${y0+14} L0 ${yb-9}" stroke="${dk(fill,.25)}" stroke-width="2"/>`;
  return `<path d="M${-W} ${y0} L${W} ${y0} L${W*1.12} ${yb} Q0 ${yb+10} ${-W*1.12} ${yb}Z" fill="${G(fill)}"/>`}
// badan
// o.pose: 'stand' | 'sit';  o.armsUnder: lengan digambar di balik badan;  o.legA: sudut kaki khusus (format LEGPOSE);  o.part: 'all' | 'legs' | 'body'
//   part dipakai bila ada benda di antara kaki dan badan (kursi): gambar 'legs', lalu kursi, lalu 'body'.
export function figure(o){
  const {view='front',cloth='#eef0f2',pants='#7c8794',shoes='#1d1b1a',sleeve='short',arms=[[8,-4],[-8,4]],
    drop=0,holdL='',holdR='',top='shirt',legs='pants',overlay='',boots=false,skin=SKIN,pose='stand',part='all'}=o;
  const side=view==='side',sit=pose==='sit';
  const k=(view==='q'?.76:side?.62:1)*(o.wide||1), sy=192+drop, ox=view==='q'?-6:0, cx=view==='q'?12:0;
  const D=sit?RIG.sitHipY-RIG.hipY:0;
  const skirted=legs==='skirt'||legs==='kain';
  let L='',P='',s='';
  // ---- kaki (bingkai lantai) ----
  L+=`<ellipse cx="0" cy="512" rx="${90*k}" ry="14" fill="#000" opacity=".28"/>`;
  const la=o.legA||LEGPOSE[pose][view]||LEGPOSE.stand.front;
  const lw=skirted?58:50,lfill=pants,shinC=skirted&&!sit?pants:null;
  const hx=side?0:RIG.hipX*k;
  const mk=(i,sx)=>leg({x:sx,y:RIG.hipY+D,a1:la[i][0],a2:la[i][1],f1:la[i][2],f2:la[i][3],fill:lfill,shin:shinC,shoes:boots?'#3a2a1e':shoes,side,w1:lw*(side?1:k),w2:(skirted?52:42)*(side?1:k)});
  if(side)L+=`<g opacity=".82">${mk(1,4)}</g>`+mk(0,-4);
  else L+=mk(0,-hx)+mk(1,hx);
  // ---- badan (bingkai berdiri, digeser D saat duduk) ----
  const armR=arm({x:side?4:66*k+ox,y:sy,a1:arms[1][0],a2:arms[1][1],sleeve,cloth:side?dk(cloth,.08):cloth,skin:side?dk(skin,.08):skin,hold:holdR});
  const armL=arm({x:side?-2:-66*k+ox,y:sy,a1:arms[0][0],a2:arms[0][1],sleeve,cloth,skin,hold:holdL});
  // armsUnder: kedua lengan di balik badan (tampak belakang, tangan ke meja di depan)
  const under=!!o.armsUnder;
  if(view==='q'||side||under)P+=armR;
  if(under)P+=armL;
  if(skirted&&!sit&&!side){const kc=pants;
    P+=`<path d="M${-60*k} 318 L${60*k} 318 L${80*k} 500 L${-80*k} 500Z" fill="${G(kc)}"/>`;
    if(legs==='skirt')P+=[...Array(7)].map((_,i)=>`<path d="M${(-48+i*16)*k} 330 L${(-66+i*22)*k} 500" stroke="${dk(kc,.22)}" stroke-width="2"/>`).join('');
    if(legs==='kain')P+=`<g opacity=".55">${[...Array(18)].map((_,i)=>`<path d="M${(-62+(i%6)*24)*k} ${340+Math.floor(i/6)*52} q6 -10 12 0 q6 10 12 0" stroke="${lt(kc,.35)}" stroke-width="2.5" fill="none"/>`).join('')}</g><path d="M${20*k} 318 L${36*k} 500" stroke="${dk(kc,.3)}" stroke-width="3"/>`;}
  else P+=pelvis({view,ww:58*k,fill:pants,sit});
  s+=`<rect x="${side?-13:-17}" y="${134+drop}" width="${side?28:34}" height="${46}" fill="${dk(skin,.1)}"/><ellipse cx="0" cy="${150+drop}" rx="30" ry="11" fill="#000" opacity=".22"/>`;
  const tw=74*k,ww=58*k;
  if(side)s+=`<path d="M-38 ${sy-6} C-34 ${sy-24} 26 ${sy-26} 40 ${sy-4} C46 ${sy+40} 40 ${sy+90} 34 334 L-38 334 C-42 ${sy+80} -42 ${sy+30} -38 ${sy-6}Z" fill="${G(cloth)}"/>`;
  else s+=`<path d="M${-tw+ox} ${sy} C${-tw*.7+ox} ${sy-22} ${tw*.7+ox} ${sy-22} ${tw+ox} ${sy} L${ww} 334 L${-ww} 334Z" fill="${G(cloth)}"/>`;
  const fr=view!=='back'&&!side;
  if(top==='shirt'&&fr)s+=`<g transform="translate(${cx} 0)"><path d="M-16 ${sy-20} L0 ${sy+8} L16 ${sy-20} L22 ${sy-10} L0 ${sy+22} L-22 ${sy-10}Z" fill="${lt(cloth,.4)}" stroke="${dk(cloth,.18)}" stroke-width="1.5"/><line x1="0" y1="${sy+22}" x2="0" y2="322" stroke="${dk(cloth,.15)}" stroke-width="1.5"/>${[0,1,2,3].map(i=>`<circle cx="3" cy="${sy+36+i*28}" r="2.2" fill="${dk(cloth,.25)}"/>`).join('')}<rect x="${-46*k}" y="${sy+30}" width="26" height="24" rx="2" fill="none" stroke="${dk(cloth,.15)}" stroke-width="1.5"/></g>`;
  if(o.badge&&fr)s+=`<rect x="${-42*k}" y="${sy+34}" width="16" height="9" fill="#5e4632"/><rect x="${28*k}" y="${sy+26}" width="20" height="5" fill="#d23b33"/><rect x="${28*k}" y="${sy+31}" width="20" height="5" fill="#f4f1ea"/><rect x="${24*k}" y="${sy+44}" width="26" height="7" rx="1" fill="#2d2b2a"/>`;
  if(top==='kaos'&&fr)s+=`<path d="M-20 ${sy-18} Q0 ${sy} 20 ${sy-18}" stroke="${dk(cloth,.25)}" stroke-width="4" fill="none"/>`;
  if(top==='jas'&&fr)s+=`<path d="M-18 ${sy-20} L0 ${sy+10} L18 ${sy-20}" fill="${o.inner||lt(cloth,.3)}"/>${o.tie?`<path d="M-5 ${sy-8} L5 ${sy-8} L7 ${sy+50} L0 ${sy+60} L-7 ${sy+50}Z" fill="${o.tie}"/>`:''}<path d="M-18 ${sy-20} L-34 ${sy+30} L-6 ${sy+64}" stroke="${dk(cloth,.2)}" stroke-width="2" fill="none"/><path d="M18 ${sy-20} L34 ${sy+30} L6 ${sy+64}" stroke="${dk(cloth,.2)}" stroke-width="2" fill="none"/>${[0,1,2].map(i=>`<circle cx="0" cy="${sy+76+i*26}" r="3" fill="${dk(cloth,.3)}"/>`).join('')}<rect x="${-50*k}" y="${sy+100}" width="30" height="5" fill="${dk(cloth,.2)}"/><rect x="${20*k}" y="${sy+100}" width="30" height="5" fill="${dk(cloth,.2)}"/>`;
  if(top==='tunik'&&fr)s+=`<line x1="0" y1="${sy-18}" x2="0" y2="330" stroke="${dk(cloth,.2)}" stroke-width="2"/>${[0,1,2,3,4].map(i=>`<circle cx="0" cy="${sy+4+i*26}" r="3" fill="#6b5a32"/>`).join('')}<rect x="-48" y="${sy+18}" width="30" height="28" rx="2" fill="${dk(cloth,.08)}" stroke="${dk(cloth,.22)}" stroke-width="1.5"/><rect x="18" y="${sy+18}" width="30" height="28" rx="2" fill="${dk(cloth,.08)}" stroke="${dk(cloth,.22)}" stroke-width="1.5"/><rect x="-50" y="${sy+90}" width="32" height="30" rx="2" fill="${dk(cloth,.08)}" stroke="${dk(cloth,.22)}" stroke-width="1.5"/><rect x="18" y="${sy+90}" width="32" height="30" rx="2" fill="${dk(cloth,.08)}" stroke="${dk(cloth,.22)}" stroke-width="1.5"/>`;
  if(top==='batik')s+=`<g opacity=".5">${[...Array(side?8:16)].map((_,i)=>`<circle cx="${(side?-24:-44)+(i%(side?2:4))*29}" cy="${sy+30+Math.floor(i/(side?2:4))*30}" r="6" fill="none" stroke="${lt(cloth,.45)}" stroke-width="2"/>`).join('')}</g>`;
  if(top==='daster')s+=`<g opacity=".55">${[...Array(14)].map((_,i)=>`<circle cx="${-46+(i%4)*30+(Math.floor(i/4)%2)*14}" cy="${sy+30+Math.floor(i/4)*32}" r="5" fill="${lt(cloth,.5)}"/>`).join('')}</g>`;
  if(top==='kebaya'&&fr)s+=`<path d="M-14 ${sy-20} L0 ${sy+90} L14 ${sy-20}" fill="${lt(cloth,.25)}"/>${[0,1,2].map(i=>`<circle cx="0" cy="${sy+40+i*22}" r="4" fill="#d6b25a"/>`).join('')}`;
  if(o.belt)s+=side?`<rect x="-40" y="318" width="76" height="14" fill="${o.belt}"/>`:`<rect x="${-ww-2}" y="318" width="${2*ww+4}" height="14" fill="${o.belt}"/><rect x="-10" y="317" width="20" height="16" rx="2" fill="#b59a52"/>`;
  s+=overlay;
  s+=head({...(o.head||{}),view:(o.head&&o.head.view)||view});
  if(view!=='q'&&!side&&!under)s+=armR;
  if(!under)s+=armL;
  if(o.after)s+=o.after;
  const W=x=>D?`<g transform="translate(0 ${D})">${x}</g>`:x;
  if(part==='legs')return L;
  if(part==='body')return W(P+s);
  // duduk tampak depan / tiga perempat: lutut lebih dekat ke kamera, jadi pangkuan, lalu kaki, lalu badan atas
  if(sit&&(view==='front'||view==='q'))return W(P)+L+W(s);
  return L+W(P+s)}

// ---------- benda ----------
export const phone=`<rect x="-12" y="-26" width="24" height="40" rx="4" fill="#1e2124"/><rect x="-9" y="-22" width="18" height="30" rx="2" fill="#7fb0c9"/>`;
export const book=(c='#b33a2c')=>`<rect x="-34" y="-38" width="68" height="50" rx="3" fill="${G(c)}"/><rect x="-34" y="8" width="68" height="5" fill="#efe6d2"/>`;
export const paperC=`<path d="M-16 -18 L14 -22 L20 6 L-12 14 L-20 -2Z" fill="#f2ede2" stroke="#b9b0a0" stroke-width="1.5"/>`;
export const koran=`<rect x="-34" y="-46" width="58" height="72" fill="#e9e1cc" transform="rotate(-8)"/><g transform="rotate(-8)">${[0,1,2,3,4,5].map(i=>`<line x1="-28" y1="${-30+i*10}" x2="18" y2="${-30+i*10}" stroke="#8b8270" stroke-width="2"/>`).join('')}<rect x="-28" y="-42" width="46" height="8" fill="#5a5243"/></g>`;
export const wallet=`<rect x="-20" y="-14" width="40" height="26" rx="4" fill="${G('#6b3d2a')}"/>`;
export const notebook=`<rect x="-16" y="-24" width="32" height="40" rx="2" fill="${G('#2f2a24')}"/>`;
const pointer='';
export const violin=`<g transform="translate(-26 200) rotate(-80) scale(.78)"><path d="M0 -70 C-28 -70 -30 -40 -16 -30 C-34 -20 -34 20 0 22 C34 20 34 -20 16 -30 C30 -40 28 -70 0 -70Z" fill="${G('#7b3a1c')}"/><rect x="-5" y="-150" width="10" height="84" fill="#2a1a12"/><circle cx="0" cy="-152" r="8" fill="#2a1a12"/>${[-3,-1,1,3].map(d=>`<line x1="${d}" y1="-148" x2="${d}" y2="14" stroke="#eadbb5" stroke-width=".9"/>`).join('')}</g>`;
export const bow=`<line x1="-10" y1="10" x2="-170" y2="-60" stroke="#3a2a1e" stroke-width="4"/><line x1="-10" y1="16" x2="-168" y2="-54" stroke="#e8dcc0" stroke-width="1.5"/>`;
export const glasses=`<g fill="none" stroke="#2a2420" stroke-width="3.2"><circle cx="-22" cy="84" r="15"/><circle cx="22" cy="84" r="15"/><path d="M-7 84 Q0 79 7 84"/><path d="M-37 82 L-56 78"/><path d="M37 82 L56 78"/></g><g fill="#fff" opacity=".25"><circle cx="-26" cy="80" r="5"/><circle cx="18" cy="80" r="5"/></g>`;
// figuran sederhana
export function extra(c,hc,hij){return figure({cloth:'#eef0f2',pants:hij?'#7d8894':'#7d8894',legs:hij?'skirt':'pants',sleeve:hij?'long':'short',belt:'#1f1d1c',arms:[[6,-4],[-6,4]],head:hij?{hair:'hijab',hijabc:'#f1efea',mouth:'smile'}:{hair:'kakak',mouth:'smile'}});return `<ellipse cx="0" cy="512" rx="70" ry="12" fill="#000" opacity=".25"/><path d="M-60 500 L-54 210 Q0 182 54 210 L60 500Z" fill="${G(c)}"/><circle cx="0" cy="120" r="64" fill="${RG(SKIN)}"/><path d="M-64 120 C-66 40 -34 54 0 54 C34 54 66 40 64 120 C70 30 40 54 0 54 C-40 54 -70 30 -64 120Z" fill="${hc}"/><path d="M-64 112 C-68 50 -36 54 0 54 C36 54 68 50 64 112 C66 40 40 52 0 52 C-40 52 -66 40 -64 112Z" fill="${hc}"/><path d="M-62 110 C-60 52 -30 52 0 52 C30 52 60 52 62 110 L58 88 Q0 66 -58 88Z" fill="${RG(hc)}"/><path d="M-9 150 Q0 154 9 150" stroke="#7d3f33" stroke-width="3" fill="none" stroke-linecap="round"/>`}
