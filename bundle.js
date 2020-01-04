!function(t){var e={};function n(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)n.d(r,s,function(e){return t[e]}.bind(null,s));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);const r=t=>null!=t,s=t=>t%2==0,c=(t,e)=>(t=>t.reduce((t,e)=>t.concat(e),[]))(t.map(e)),a=(t,e)=>({x:t.x+e.x,y:t.y+e.y}),o=(t,e)=>({x:t.x-e.x,y:t.y-e.y}),i=t=>0===t.length,u=(t,e,...n)=>console.error(t),h=(t,e)=>t+parseInt(Math.random()*e),_=(...t)=>{if(0!==t.length){const e=t.map(t=>t.x*t.x+t.y*t.y);let n=0,r=e[0];return e.forEach((t,e)=>{t>r&&(r=t,n=e)}),t[n]}u("Arguments are empty",_)},y="UP",l="DOWN",x="RIGHT",T="LEFT",I="TOPIC",p="BRANCH",d="GROUP",E="CONN",g=(t,e,n)=>{return e*=t.y>0?1:-1,{x:(t.x<0?1:-1)*n.x+e/t.y*t.x,y:e}},O=(t,e,n)=>{return{x:e*=t.x>0?1:-1,y:(t.y<0?1:-1)*n.y+e/t.x*t.y}},R=(t,e,n={x:0,y:0})=>{const r=(t=>{switch(t){case l:case y:return g;case x:case T:case"RIGHT_DOWN":case"RIGHT_UP":case"LEFT_UP":case"LEFT_DOWN":return O}})(t),s=H(t);return r({x:Math.cos(s),y:Math.sin(s)},e,n)},f=(t,e,n)=>{const[r,s]=n.y>0?[t,e]:[e,t],c=n.y>0?1:-1,a=Math.max(r.margin[2],s.margin[0]),o=c*(r.size.height-r.getJoint().y+a+s.getJoint().y);return{x:o/n.y*n.x,y:o}},m=(t,e,n)=>{const[r,s]=n.x>0?[t,e]:[e,t],c=n.x>0?1:-1,a=Math.max(r.margin[1],s.margin[3]),o=c*(r.size.width-r.getJoint().x+a+s.getJoint().x);return{x:o,y:o/n.x*n.y}},M=t=>(e,n)=>{const r=[{x:0,y:0}];for(let s=1;s<e.length;s++){const c=t(e[s-1],e[s],n);r.push(a(r[s-1],c))}return r},P=(t,e)=>(n,r)=>{const s={x:0,y:0};if(0===n.length)return[];if(1===n.length)return[s];{const c=[s,a(s,e(n[0],n[1],r))];for(let s=2;s<n.length;s++){const o=n[s-2],i=n[s-1],u=n[s],h=c[s-2],y=c[s-1],l=_(a(h,t(o,u,r)),a(y,e(i,u,r)));c.push(l)}return c}},U=M(m),G=M(f),L=P(m,(t,e,n)=>{const[r,s]=n.x>0?[t,e]:[e,t],c=n.x>0?1:-1,a=Math.max(r.margin[1],s.margin[3]),o=c*(r.getTopic().size.width-r.getJoint().x+a+s.getJoint().x);return{x:o,y:o/n.x*n.y}}),w=P(f,(t,e,n)=>{const[r,s]=n.y>0?[t,e]:[e,t],c=n.y>0?1:-1,a=Math.max(r.margin[2],s.margin[0]),o=c*(r.getTopic().size.height-r.getJoint().y+a+s.getJoint().y);return{x:o/n.y*n.x,y:o}}),H=t=>{switch(t){case l:return.5*Math.PI;case y:return 1.5*Math.PI;case x:return 0;case T:return Math.PI;case"RIGHT_DOWN":return 1/3*Math.PI;case"LEFT_DOWN":return 2/3*Math.PI;case"LEFT_UP":return 4/3*Math.PI;case"RIGHT_UP":return 5/3*Math.PI}},N=t=>{const[e,n]=t.dir.split("-"),s=H(e),c=((t,e=!1)=>{const[n,r]=e?[w,L]:[G,U];switch(t){case l:case y:case"RIGHT_DOWN":case"LEFT_DOWN":case"LEFT_UP":case"RIGHT_UP":return n;case x:case T:return r}})(e,r(n)),[a,o]=J(t.elts,s,c);return t.size=a,t.margin=o,t},F=(t,e)=>{const n=(r,s)=>(t=>null==t)(r)?u("Rel is not ancestor",F,e,t):r===e?s:n(r.parent,a(r.pos,s));return n(t,{x:0,y:0})},S=(t,e,n=0)=>{const r=t.getTopic(),s=F(r,t),c=r.getJoint(),{x:o,y:i}=a(s,c),{width:h,height:_}=t.size;switch(e){case y:return{x:o,y:-n};case l:return{x:o,y:_+n};case T:return{x:-n,y:i};case x:return{x:h+n,y:i};default:u("Unknown dir",S,e)}},D=(t,e,n={x:0,y:0})=>{const{width:r,height:s}=t.size,c=n.x,a=n.y;switch(e){case"LEFT_UP":return{x:c,y:a};case"LEFT_DOWN":return{x:c,y:s+a};case"RIGHT_UP":return{x:r+c,y:a};case"RIGHT_DOWN":return{x:r+c,y:s+a}}const o=t.getTopics().map(e=>({pos:F(e,t),size:e.size})),i=k(o),h=z(i),_=i.x1+h.width/2,I=i.y1+h.height/2;switch(e){case y:return{x:_,y:a};case l:return{x:_,y:s+a};case T:return{x:c,y:I};case x:return{x:r+c,y:I};default:u("Unknown dir",D,e)}},W=(t,e,n=0)=>{const{width:r,height:s}=t.size;switch(e){case y:return{x:r/2,y:-n};case l:return{x:r/2,y:s+n};case T:return{x:-n,y:s/2};case x:return{x:r+n,y:s/2};default:u("Unknown dir",W,e)}},k=t=>{const e={x1:1/0,x2:-1/0,y1:1/0,y2:-1/0};return t.forEach(t=>{const{x1:n,x2:r,y1:s,y2:c}=b(t);e.x1=Math.min(e.x1,n),e.y1=Math.min(e.y1,s),e.x2=Math.max(e.x2,r),e.y2=Math.max(e.y2,c)}),e},b=t=>{const e=t.pos.x,n=t.pos.y;return{x1:e,x2:e+t.size.width,y1:n,y2:n+t.size.height}},z=t=>({width:t.x2-t.x1,height:t.y2-t.y1}),C=(t,e,n)=>{t.forEach((t,r)=>{t.pos=o(n[r],e[r])});const r=k(t),s=(t=>{const e={x1:1/0,x2:-1/0,y1:1/0,y2:-1/0};return t.forEach(t=>{const{x1:n,x2:r,y1:s,y2:c}=b(t),[a,o,i,u]=t.margin;e.x1=Math.min(e.x1,n-u),e.y1=Math.min(e.y1,s-a),e.x2=Math.max(e.x2,r+o),e.y2=Math.max(e.y2,c+i)}),e})(t),c={x:r.x1,y:r.y1};return t.forEach(t=>{t.pos=o(t.pos,c)}),[z(r),((t,e)=>{const n=-(e.x1-t.x1);return[-(e.y1-t.y1),e.x2-t.x2,e.y2-t.y2,n]})(r,s)]},J=(t,e,n)=>{const r=n(t,{x:Math.cos(e),y:Math.sin(e)}),s=t.map(t=>t.getJoint());return C(t,s,r)},v=30,V=10,j=10;class ${constructor(t){this.pos={x:0,y:0},this.size=t.size||{width:0,height:0},this.padding=t.padding||[0,0,0,0],this.margin=t.margin||[0,0,0,0];const[e,n,r,s]=this.padding;this.size.width+=s+n,this.size.height+=e+r,this.elts=t.elts||[],this.elts.forEach(t=>t.parent=this),this.IN=t.IN}getJoint(){u("Undefined method",this.getJoint,this)}}class A extends ${constructor(t){super(t),this.type=I,this.color=t.color}getJoint(){const t=r(this.IN)?this.IN:this.parent.IN;return W(this,t)}getTopic(){return this}}class B extends ${constructor(t){super(t),this.type=d,this.dir=t.dir}getJoint(){const t=this.getTopics(),e=t[0]?t[0].getJoint():null,n=R(this.IN,v,e);return D(this,this.IN,n)}getTopics(){return this.elts.map(t=>t.getTopic())}}class Z extends ${constructor(t){super(t),this.type=p,this.OUTS=t.OUTS}getJoint(){return S(this,this.IN,V)}getTopic(){return this.elts[0]}getOutPoints(){const t=this.getTopic();return this.OUTS.map(e=>W(t,e,j))}createOutConns(){const t=this.getTopic();return this.OUTS.map(e=>{const n={tok:t,pos:W(t,e)},r={tok:t,pos:W(t,e,j)};return new q(n,r)})}}class q{constructor(...t){this.points=t,this.type=E}generate(){const t=this.points.map(t=>a(t.tok.pos,t.pos));return{p1:t[0],p2:t[1],type:this.type}}}const K=t=>{switch(t.type){case I:return t;case d:return t.elts.forEach(K),N(t),t;case p:return t.elts.forEach(K),(t=>{const[e,...n]=t.elts,r={x:0,y:0},s=[r,...t.getOutPoints()],c=[r,...n.map(t=>t.getJoint())],[a,o]=C(t.elts,c,s);t.size=a,t.margin=o})(t),t;default:logErr("Unexpect tok.type",K,t)}},Q=t=>{switch(t.type){case I:break;case d:t.elts.forEach(Q);break;case p:const[e,...n]=t.elts,r=t.getOutPoints().map(t=>({tok:e,pos:t}));n.forEach(Q),n.forEach((t,e)=>X(t,r[e])),e.connOUTS=t.createOutConns()}return t},X=(t,e)=>{switch(t.type){case I:const n={tok:t,pos:t.getJoint()};t.conn=new q(e,n);break;case d:t.elts.forEach(t=>X(t,e));break;case p:const[r,...s]=t.elts;X(r,e)}},Y=(t,e=0)=>{const n=((t,e)=>{return e=Math.min(e,2),new A({size:[{width:100,height:50},{width:60,height:30},{width:40,height:20}][e],margin:[5,5,5,5],color:t.color})})(t,e);return t.tok=n,t.children.forEach(t=>Y(t,e+1)),t},tt=t=>{const e=(t,n)=>(t.pos=a(t.pos,n),t.parent=null,(t=>t.type===I)(t)?[t]:c(t.elts,n=>e(n,t.pos)));return e(t,{x:0,y:0})},et=t=>{const e=t.filter(t=>r(t.conn)).map(t=>t.conn.generate()),n=t.filter(t=>r(t.connOUTS));return[...e,...c(n,t=>t.connOUTS.map(t=>t.generate())),...t]},nt=t=>{const e=t.map(t=>{switch(t.type){case I:return(t=>{const{x:e,y:n}=t.pos,{width:r,height:s}=t.size,c=t.color,a=(new SVG.Rect).attr({width:r,height:s,fill:c});return a.translate(e,n).radius(3),a})(t);case E:return(t=>{const{p1:e,p2:n}=t,r=`M ${e.x} ${e.y} L ${n.x} ${n.y} Z`,s=new SVG.Path;return s.attr({d:r,stroke:"black"}),s})(t);default:return}}).filter(r),n=(new SVG.G).data("name","container");return e.forEach(t=>n.add(t)),n},rt=t=>{switch(t){case"LOGIC_R":case"TIME_H":case"FISH_RIGHT_UP":case"FISH_RIGHT_DOWN":return[x];case"LOGIC_L":case"FISH_LEFT_UP":case"FISH_LEFT_DOWN":return[T];case"ORG":case"TREE_L":case"TREE_R":case"TIME_DOWN":case"TIME_V":return[l];case"ORG_UP":case"TIME_UP":return[y];case"MAP":return[x,T];default:u("Unknown ctx",rt,t)}},st=t=>{switch(t){case"LOGIC_R":case"TIME_H":return T;case"LOGIC_L":return x;case"ORG":case"TIME_V":return y;case"ORG_UP":return l;case"TREE_R":case"TIME_DOWN":case"FISH_RIGHT_DOWN":return"LEFT_UP";case"TIME_UP":case"FISH_RIGHT_UP":return"LEFT_DOWN";case"TREE_L":case"FISH_LEFT_DOWN":return"RIGHT_UP";case"FISH_LEFT_UP":return"RIGHT_DOWN";default:u("Unknown ctx",st,t)}},ct=t=>{switch(t){case"LOGIC_R":case"LOGIC_L":case"TREE_R":case"TREE_L":case"TIME_UP":case"TIME_DOWN":return l;case"ORG":case"ORG_UP":return x;case"TIME_H":return"RIGHT-INTER";case"TIME_V":return"DOWN-INTER";case"FISH_RIGHT_UP":return"RIGHT_UP";case"FISH_RIGHT_DOWN":return"RIGHT_DOWN";case"FISH_LEFT_UP":return"LEFT_UP";case"FISH_LEFT_DOWN":return"LEFT_DOWN";default:u("Unknown ctx",ct,t)}},at=t=>{switch(t){case"LOGIC_R":case"TREE_R":case"TIME_UP":case"TIME_DOWN":case"FISH_RIGHT_UP":case"FISH_RIGHT_DOWN":return T;case"LOGIC_L":case"TREE_L":case"FISH_LEFT_UP":case"FISH_LEFT_DOWN":return x;case"ORG":return y;case"ORG_UP":return l;default:u("Unknown ctx",getInDir,t)}},ot=(t,e="MAP")=>{e=t.struct||e;const n=t.tok;if(i(t.children))return new Z({elts:[n],OUTS:[]});{const r=rt(e);switch(e){case"LOGIC_R":case"LOGIC_L":case"ORG":case"ORG_UP":case"TREE_L":case"TREE_R":case"TIME_H":case"TIME_V":case"TIME_UP":case"TIME_DOWN":case"FISH_RIGHT_UP":case"FISH_RIGHT_DOWN":case"FISH_LEFT_UP":case"FISH_LEFT_DOWN":{const s=it(t.children,e);return new Z({elts:[n,s],OUTS:r})}case"MAP":{const[e,s]=(t=>{const e=Math.ceil(t.length/2);return[t.slice(0,e),t.slice(e)]})(t.children),c=it(e,"LOGIC_R"),a=it(s,"LOGIC_L");return new Z({elts:[n,c,a],OUTS:r})}default:u("Unknown ctx",transTok,e)}}},it=(t,e)=>{const n=st(e),r=ct(e),c=((t,e)=>{switch(e){case"TIME_H":{const e=["TIME_UP","TIME_DOWN"],n=e.map(at);return t.map((t,r)=>{const c=s(r)?e[0]:e[1],a=s(r)?n[0]:n[1],o=ot(t,c);return o.IN=a,o})}case"TIME_V":{const e=["TREE_R","TREE_L"],n=e.map(at);return t.map((t,r)=>{const c=s(r)?e[0]:e[1],a=s(r)?n[0]:n[1],o=ot(t,c);return o.IN=a,o})}case"TIME_UP":case"TIME_DOWN":{const n=at(e);return t.map(t=>{const e=ot(t,"LOGIC_R");return e.IN=n,e})}default:{const n=at(e);return t.map(t=>{const r=ot(t,e);return r.IN=n,r})}}})(t,e);return new B({elts:c,IN:n,dir:r})},ut=()=>{const t=()=>h(100,150);return`rgb(${t()}, ${t()}, ${t()})`},ht=(t=[])=>({children:t,color:ut()}),_t=()=>{const t=(t=>((t,e)=>e.reduce((t,e)=>e(t),t))(t,[Y,ot,K,Q,tt,et,nt]))(yt),e=document.getElementById("test");e.innerHTML="",SVG(e).spof().style({display:"block"}).add(t)};let yt;yt=ht([ht([ht()]),ht([ht(),ht([ht()]),ht([ht(),ht(),ht()]),ht()]),ht([ht(),ht()]),ht()]),yt.struct="MAP",_t(),document.getElementById("sel").addEventListener("change",t=>{const{value:e}=t.target;yt.struct=e,_t()}),document.getElementById("addBtn").addEventListener("click",t=>{(()=>{const t=(e,n)=>{if(i(e.children))return e.children.push(ht());const r=h(0,e.children.length-1);return 0===n?e.children.splice(r,0,ht()):t(e.children[r],n-1)},e=h(1,3);t(yt,e),_t()})()})}]);