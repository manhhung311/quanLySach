function Clouder(params){var self=this;var w,h,lastX,lastY;var rho=0,theta=0;var timer=null;var closest=null;var containerTop;var containerLeft;var timing=[1];var timingMax=8;var container;var callback;var fontSize,fontShift;var colorMax,colorMin,colorBgr;var xScale=0.9,yScale=0.9;var interval=50;var stepAngle=0.08722;var idleMotion=0.2;var nonSense=0.025;var opaque=0.4;var objs=[];function init(){if(params.tags){setupElems(params.tags);}else{setupSpans();}
process(function(o){o.x=1;o.y=0;o.z=0;spin(o,(Math.random()*2-1)*Math.PI);step(o,(Math.random()*2-1)*Math.PI);spin(o,(Math.random()*2-1)*Math.PI);});w=container.clientWidth;h=container.clientHeight;if(colorBgr){container.style.backgroundColor=colorBgr;}
draw();timer=setInterval(onTimer,interval);containerTop=container.offsetTop;containerLeft=container.offsetLeft;container.onmousemove=onMouseMove;container.onmouseleave=onMouseLeave;container.onclick=onClick;}
function onMouseMove(e){if(!e){e=window.event;}
setPos(e.clientX,e.clientY);setClosest(findClosest(e.clientX-containerLeft,e.clientY-containerTop));}
function onMouseLeave(e){if(!e){e=window.event;}
rho=idleMotion;setClosest(null);}
function setupElems(elems){if(elems){for(var e in elems){var c={};c.text=elems[e].text;c.id=elems[e].id;c.weight=elems[e].weight;objs.push(c);}}}
function setupSpans(){for(var i=0;i<container.children.length;i++){var span=container.children[i];span.style.position="absolute";span.style.cursor="pointer";var c={};c.span=span;c.width=0;c.height=0;objs.push(c);}}
function adjustElems(){for(var i in objs){var dx=0,dy=0,dz=0;var o=objs[i];for(var j in objs){if(i==j){continue;}
var diffX=o.x-objs[j].x;var diffY=o.y-objs[j].y;var diffZ=o.z-objs[j].z;var r=Math.sqrt(diffX*diffX+diffY*diffY+diffZ*diffZ);dx+=0.05/(r*r)*diffX/r;dy+=0.05/(r*r)*diffY/r;dz+=0.05/(r*r)*diffZ/r;}
o.x+=dx;o.y+=dy;o.z+=dz;var dist=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z);o.x/=dist;o.y/=dist;o.z/=dist;}}
function sign(a){return a>0?1:(a<0?-1:0);}
function setPos(x,y){x=(lastX=x-container.offsetLeft)*2/w-1;x=(Math.abs(x)<nonSense?0:(x-nonSense*sign(x))/(1-nonSense))/xScale;y=(lastY=y-container.offsetTop)*2/h-1;y=(Math.abs(y)<nonSense?0:(y-nonSense*sign(y))/(1-nonSense))/yScale;theta=Math.atan2(y,x);rho=Math.sqrt(x*x+y*y);}
function draw(){var filters=(typeof(document.body.filters)=="object");process(function(o){if(!o.span){o.span=document.createElement("span");o.width=0;o.height=0;o.span.innerHTML=o.text;o.span.style.fontWeight="bold";o.span.style.position="absolute";o.span.style.cursor="pointer";var c=1;for(var i in colorMax){c=c*256+Math.floor((colorMax[i]-colorMin[i])*o.weight+colorMin[i]);}
o.span.style.color="#"+c.toString(16).substr(1);container.appendChild(o.span);o.span.descriptor=o;}
var size=fontSize+o.z*fontShift;o.factor=size/fontSize;if(o.width==0){o.width=asPixels(o.span.clientWidth/o.factor);o.height=asPixels(o.span.clientHeight/o.factor);}
o.span.style.fontSize=asPixels(Math.round(size));o.screenX=w*(o.x*xScale+1)/2;o.span.style.left=asPixels(o.screenX-parseInt(o.width)*o.factor/2);o.screenY=h*(o.y*yScale+1)/2;o.span.style.top=asPixels(o.screenY-parseInt(o.height)*o.factor/2);o.span.style.zIndex=o.z>=0?10:5;var opa=(Math.sin(o.z*Math.PI/2)/2+0.5)*(1-opaque)+opaque;if(!filters){o.span.style.opacity=opa;}else{var f=o.span.filters["DXImageTransform.Microsoft.Alpha"];if(f){f.opacity=opa*100;}else{o.span.style.filter+="progid:DXImageTransform.Microsoft.Alpha(opacity="+(opa*100)+")";}}});}
function findClosest(ex,ey){var bestDist=w+h;var best=null;for(var i in objs){var o=objs[i];var dx=ex-o.screenX;var dy=ey-o.screenY;var dist=Math.sqrt(dx*dx+dy*dy)/o.factor;if(dist<bestDist){bestDist=dist;best=o;}}
return best;}
function setClosest(obj){if(closest==obj){return;}
if(closest!=null){closest.span.style.border="";}
closest=obj;if(closest!=null){closest.span.style.border="1px solid black";}}
function onTimer(){var t0=new Date().getTime();var move=function(o){spin(o,-theta);step(o,rho*stepAngle);spin(o,theta);};process(move);adjustElems();draw();setClosest(findClosest(lastX,lastY));timing.push(new Date().getTime()-t0);if(timing.length>timingMax){timing.splice(0,timing.length-timingMax);}}
function spin(o,angle){var x=o.x;var y=o.y;o.x=x*Math.cos(angle)-y*Math.sin(angle);o.y=x*Math.sin(angle)+y*Math.cos(angle);}
function step(o,angle){var x=o.x;var z=o.z;o.x=x*Math.cos(angle)-z*Math.sin(angle);o.z=x*Math.sin(angle)+z*Math.cos(angle);}
function onClick(event){if(closest==null||closest.id==null){return;}
callback(closest.id);}
function process(func){for(var i in objs){func(objs[i]);}}
function parseColor(text){var hex=parseInt(text.substr(1),16);return[Math.floor(hex/65536),Math.floor((hex/256)%256),Math.floor(hex%256)];}
function parametrize(p){if(!p.container){alert("Clouder could not be created without container!");throw "Clouder without container";}
container=p.container;if(!p.tags&&container.children.length<0){alert("Clouder could not be crated without tags or spans in container!");throw "Clouder without tags";}
callback=p.callback?p.callback:function(id){alert(id);};fontSize=p.fontSize?p.fontSize:14;fontShift=typeof(p.fontShift)!="undefined"?p.fontShift:fontSize/2;colorMax=p.colorMax?parseColor(p.colorMax):parseColor("#000000");colorMin=p.colorMin?parseColor(p.colorMin):parseColor("#C0C0C0");colorBgr=p.colorBgr?p.colorBgr:null;interval=typeof(p.interval)!="undefined"?p.interval:interval;stepAngle=typeof(p.stepAngle)!="undefined"?p.stepAngle:stepAngle;idleMotion=typeof(p.idleMotion)!="undefined"?p.idleMotion:idleMotion;opaque=typeof(p.opaque)!="undefined"?p.opaque:opaque;nonSense=typeof(p.nonSense)!="undefined"?p.nonSense:nonSense;if(typeof(p.scale)!="undefined"){xScale=yScale=p.scale;}
xScale=typeof(p.xScale)!="undefined"?p.xScale:xScale;yScale=typeof(p.yScale)!="undefined"?p.yScale:yScale;}
self.getRenderingTime=function(){var sum=0;for(var i in timing){sum+=timing[i];}
return sum/timing.length;};self.kill=function(){clearInterval(timer);process(function(o){o.span.parentNode.removeChild(o.span);});};parametrize(params);init();}
function asPixels(number){return number+'px';}