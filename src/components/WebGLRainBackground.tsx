import { useEffect, useRef } from 'react';

const vsSource = `#version 300 es
in vec4 aPosition;
out vec2 vUv;
void main() {
    vUv = aPosition.xy * 0.5 + 0.5;
    gl_Position = aPosition;
}`;

const fsSource = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec3 iResolution; 
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;

uniform bool u_hasHeart;
uniform float u_rainAmount; 
uniform float u_fog;        
uniform float u_refraction; 

#define S(a, b, t) smoothstep(a, b, t)
#define HAS_HEART
#define USE_POST_PROCESSING

vec3 N13(float p) {
   vec3 p3 = fract(vec3(p) * vec3(.1031,.11369,.13787));
   p3 += dot(p3, p3.yzx + 19.19);
   return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

vec4 N14(float t) {
    return fract(sin(t*vec4(123., 1024., 1456., 264.))*vec4(6547., 345., 8799., 1564.));
}

float N(float t) {
    return fract(sin(t*12345.564)*7658.76);
}

float Saw(float b, float t) {
	return S(0., b, t)*S(1., b, t);
}

vec2 DropLayer2(vec2 uv, float t) {
    vec2 UV = uv;
    uv.y += t*0.75;
    vec2 a = vec2(6., 1.);
    vec2 grid = a*2.;
    vec2 id = floor(uv*grid);
    
    float colShift = N(id.x); 
    uv.y += colShift;
    
    id = floor(uv*grid);
    vec3 n = N13(id.x*35.2+id.y*2376.1);
    vec2 st = fract(uv*grid)-vec2(.5, 0.0);
    
    float x = n.x-.5;
    
    float y = UV.y*20.;
    float wiggle = sin(y+sin(y));
    x += wiggle*(.5-abs(x))*(n.z-.5);
    x *= .7;
    float ti = fract(t+n.z);
    y = (Saw(.85, ti)-.5)*.9+.5;
    vec2 p = vec2(x, y);
    
    float d = length((st-p)*a.yx);
    float mainDrop = S(.4, .0, d);
    float r = sqrt(S(1., y, st.y));
    float cd = abs(st.x-x);
    float trail = S(.23*r, .15*r*r, cd);
    float trailFront = S(-.02, .02, st.y-y);
    trail *= trailFront*r*r;
    
    y = UV.y;
    float trail2 = S(.2*r, .0, cd);
    float droplets = max(0., (sin(y*(1.-y)*120.)-st.y))*trail2*trailFront*n.z;
    y = fract(y*10.)+(st.y-.5);
    float dd = length(st-vec2(x, y));
    droplets = S(.3, 0., dd);
    float m = mainDrop+droplets*r*trailFront;
    
    return vec2(m, trail);
}

float StaticDrops(vec2 uv, float t) {
	uv *= 40.;
    vec2 id = floor(uv);
    uv = fract(uv)-.5;
    vec3 n = N13(id.x*107.45+id.y*3543.654);
    vec2 p = (n.xy-.5)*.7;
    float d = length(uv-p);
    
    float fade = Saw(.025, fract(t+n.z));
    float c = S(.3, 0., d)*fract(n.z*10.)*fade;
    return c;
}

vec2 Drops(vec2 uv, float t, float l0, float l1, float l2) {
    float s = StaticDrops(uv, t)*l0; 
    vec2 m1 = DropLayer2(uv, t)*l1;
    vec2 m2 = DropLayer2(uv*1.85, t)*l2;
    
    float c = s+m1.x+m2.x;
    c = S(.3, 1., c);
    
    return vec2(c, max(m1.y*l0, m2.y*l1));
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord.xy-.5*iResolution.xy) / iResolution.y;
    vec2 UV = fragCoord.xy/iResolution.xy;
    vec3 M = iMouse.xyz/iResolution.xyz;
    float T = iTime;
    
    #ifdef HAS_HEART
    T = mod(iTime, 102.);
    #endif
    
    float t = T*.2;
    
    float rainAmount = u_rainAmount < 0. ? sin(T*.05)*.3+.7 : u_rainAmount;
    
    float maxBlur = mix(3., 6., rainAmount);
    float minBlur = 2.;
    
    float story = 0.;
    float heart = 0.;
    float zoom = 0.;
    
    #ifdef HAS_HEART
    if (u_hasHeart) {
        story = S(0., 70., T);
        t = min(1., T/70.);                                                
        t = 1.-t;
        t = (1.-t*t)*70.;
        
        zoom = mix(.3, 1.2, story);                
        uv *=zoom;
        minBlur = 4.+S(.5, 1., story)*3.;                
        maxBlur = 6.+S(.5, 1., story)*1.5;
        
        vec2 hv = uv-vec2(.0, -.1);                                
        hv.x *= .5;
        float s = S(110., 70., T);                                
        hv.y-=sqrt(abs(hv.x))*.5*s;
        heart = length(hv);
        heart = S(.4*s, .2*s, heart)*s;
        rainAmount = u_rainAmount < 0. ? heart : heart * (u_rainAmount * 2.0);
        
        maxBlur-=heart;                                                        
        uv *= 1.5;                                                                
        t *= .25;
    } else {
        zoom = -cos(T*.2);
        uv *= .7+zoom*.3;
    }
    #else
    zoom = -cos(T*.2);
    uv *= .7+zoom*.3;
    #endif
    
    if (u_fog >= 0.0) {
        maxBlur = u_fog;
        if(u_hasHeart && u_hasHeart) maxBlur -= heart;
        minBlur = u_fog * 0.4;
    }

    UV = (UV-.5)*(.9+zoom*.1)+.5;
    
    float staticDrops = S(-.5, 1., rainAmount)*2.;
    float layer1 = S(.25, .75, rainAmount);
    float layer2 = S(.0, .5, rainAmount);
    
    vec2 c = Drops(uv, t, staticDrops, layer1, layer2);
   #ifdef CHEAP_NORMALS
            vec2 n = vec2(dFdx(c.x), dFdy(c.x));
    #else
            vec2 e = vec2(.001, 0.);
            float cx = Drops(uv+e, t, staticDrops, layer1, layer2).x;
            float cy = Drops(uv+e.yx, t, staticDrops, layer1, layer2).x;
            vec2 n = vec2(cx-c.x, cy-c.x);                
    #endif
    
    #ifdef HAS_HEART
    n *= 1.-S(60., 85., T);
    c.y *= 1.-S(80., 100., T)*.8;
    #endif
    
    float focus = mix(maxBlur-c.y, minBlur, S(.1, .2, c.x));
    vec3 col = textureLod(iChannel0, UV+n, focus).rgb;
    
    #ifdef USE_POST_PROCESSING
    t = (T+3.)*.5;                                                                                
    float colFade = sin(t*.2)*.5+.5+story;
    col *= mix(vec3(1.), vec3(.8, .9, 1.3), colFade);        
    float fade = S(0., 10., T);                                                        
    col *= 1.-dot(UV-=.5, UV);                                                        
                                                                                            
    #ifdef HAS_HEART
            col = mix(pow(col, vec3(1.2)), col, heart);
            fade *= S(102., 97., T);
    #endif
    
    col *= fade;                                                                                
    #endif
    
    fragColor = vec4(col, 1.);
}
`;

export function WebGLRainBackground({ background }: { background?: { type: string, url: string, sound?: boolean, heart?: boolean, rain?: number, fog?: number, refract?: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const bgRef = useRef(background);

  useEffect(() => {
    bgRef.current = background;
  }, [background]);

  useEffect(() => {
      if (!background) return;
      
      // Handle sound
      if (background.sound) {
          const audio = document.getElementById('rain-audio') as HTMLAudioElement;
          if (audio) {
              audio.play().catch(() => console.log('Audio playback prevented'));
          } else {
              const newAudio = new Audio('https://actions.google.com/sounds/v1/weather/rain_continuous_and_light.ogg');
              newAudio.id = 'rain-audio';
              newAudio.loop = true;
              newAudio.volume = 0.5;
              newAudio.play().catch(() => console.log('Audio playback prevented'));
              document.body.appendChild(newAudio);
          }
      } else {
          const audio = document.getElementById('rain-audio') as HTMLAudioElement;
          if (audio) audio.pause();
      }
      if (background.type === 'video') {
          const video = document.createElement('video');
          video.crossOrigin = "anonymous";
          video.src = background.url;
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.play().then(() => {
              mediaRef.current = video;
          }).catch(console.error);
      } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = background.url;
          img.onload = () => {
              mediaRef.current = img;
          };
      }
  }, [background]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        if(!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader Error: ", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if(!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if(!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking failed: ', gl.getProgramInfoLog(program));
        return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,   1.0, -1.0,  -1.0,  1.0,
        -1.0,  1.0,   1.0, -1.0,   1.0,  1.0
    ]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locResolution = gl.getUniformLocation(program, 'iResolution');
    const locTime = gl.getUniformLocation(program, 'iTime');
    const locMouse = gl.getUniformLocation(program, 'iMouse');
    const locChannel0 = gl.getUniformLocation(program, 'iChannel0');
    const locHasHeart = gl.getUniformLocation(program, 'u_hasHeart');
    const locRainAmount = gl.getUniformLocation(program, 'u_rainAmount');
    const locFog = gl.getUniformLocation(program, 'u_fog');
    const locRefract = gl.getUniformLocation(program, 'u_refraction');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    function createDefaultTexture() {
        const c = document.createElement('canvas');
        c.width = 1024; c.height = 1024;
        const ctx = c.getContext('2d');
        if(!ctx) return c;

        const grd = ctx.createLinearGradient(0, 0, 1024, 1024);
        grd.addColorStop(0, '#1a0b2e'); 
        grd.addColorStop(0.5, '#7a284e'); 
        grd.addColorStop(1, '#ff6a00'); 
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.filter = 'blur(70px)';
        ctx.globalCompositeOperation = 'screen';
        for(let i=0; i<8; i++) {
            ctx.beginPath();
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const r = Math.random() * 200 + 150;
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${Math.random() * 60 + 300}, 80%, 60%, 0.55)`;
            ctx.fill();
        }

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'overlay';
        const imgData = ctx.getImageData(0,0,1024,1024);
        const data = imgData.data;
        for(let i=0; i<data.length; i+=4) {
            const noise = (Math.random() - 0.5) * 35;
            data[i] += noise;
            data[i+1] += noise;
            data[i+2] += noise;
        }
        ctx.putImageData(imgData, 0, 0);
        return c;
    }

    function updateTextureToGL(source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    let animationFrameId: number;
    let startTime = performance.now();
    let mouse = { x: 0, y: 0, z: 0, w: 0 };

    function resize() {
        if(!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    window.addEventListener('resize', resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
        if(mouse.z > 0) {
            mouse.x = e.clientX * (window.devicePixelRatio || 1);
            mouse.y = canvas.height - (e.clientY * (window.devicePixelRatio || 1));
        }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
        mouse.z = 1; 
        mouse.x = e.clientX * (window.devicePixelRatio || 1); 
        mouse.y = canvas.height - (e.clientY * (window.devicePixelRatio || 1)); 
    };
    
    const handleMouseUp = () => {
        mouse.z = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let lastMediaSrc = "";

    function render(time: number) {
        if (!program || !gl) return;

        const currentMedia = mediaRef.current;
        if (currentMedia) {
            if (currentMedia instanceof HTMLVideoElement && currentMedia.readyState >= 2) {
                updateTextureToGL(currentMedia);
            } else if (currentMedia instanceof HTMLImageElement) {
                if (currentMedia.src !== lastMediaSrc) {
                    updateTextureToGL(currentMedia);
                    lastMediaSrc = currentMedia.src;
                }
            }
        }

        gl.useProgram(program);

        const t = (time - startTime) * 0.001;
        gl.uniform1f(locTime, t);
        gl.uniform3f(locResolution, canvas.width, canvas.height, 1.0);
        gl.uniform4f(locMouse, mouse.x, mouse.y, mouse.z, mouse.w);
        
        const currentBg = bgRef.current;
        gl.uniform1i(locHasHeart, currentBg?.heart !== false ? 1 : 0); 
        gl.uniform1f(locRainAmount, currentBg?.rain ?? -0.05);
        gl.uniform1f(locFog, currentBg?.fog ?? -0.5);
        gl.uniform1f(locRefract, currentBg?.refract ?? 1.0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(locChannel0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        cancelAnimationFrame(animationFrameId);
        gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover opacity-80"
      />
    </div>
  );
}
