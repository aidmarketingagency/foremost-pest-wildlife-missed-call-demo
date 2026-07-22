/* AID teaser bubble + auto-open schedule (v3, 2026-07-22):
   teaser at 10s next to the closed launcher, auto-open never before 20s.
   Pages with the data-aid-widget-boost snippet keep that snippet's own 20s
   opener; this block only auto-opens on pages without it. Clicking the
   teaser or the launcher opens the chat immediately. */
(function () {
  var WID = '54722168';
  var BUBBLE_ID = 'ultra-fast-widget-bubble-' + WID;
  var OPEN_KEY = 'aidWidgetAutoOpened';
  var LEGACY_KEY = 'aidDemoWidgetAutoOpened';
  var TEASER_KEY = 'aidTeaserShown';
  var TEASER_AT = 10; /* seconds, the old auto-open moment */
  var OPEN_AT = 20;   /* seconds, minimum auto-open delay */
  var hasBoost = !!document.querySelector('script[data-aid-widget-boost]');
  function bubble() { return document.getElementById(BUBBLE_ID); }
  function isOpen() {
    var c = document.getElementById('ultra-fast-widget-container-' + WID);
    return !!(c && getComputedStyle(c).display !== 'none');
  }
  function alreadyOpened() {
    try { return !!(sessionStorage.getItem(OPEN_KEY) || sessionStorage.getItem(LEGACY_KEY)); } catch (e) { return false; }
  }
  var teaser = null;
  var userTouched = false;
  document.addEventListener('click', function (e) {
    if (e.isTrusted && e.target && e.target.closest && e.target.closest('#' + BUBBLE_ID)) {
      userTouched = true;
      hideTeaser();
    }
  }, true);
  function hideTeaser() {
    if (!teaser) return;
    var t = teaser;
    teaser = null;
    t.style.opacity = '0';
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 450);
  }
  function openChat() {
    hideTeaser();
    var b = bubble();
    if (b && !isOpen()) b.click();
  }
  function showTeaser() {
    if (teaser || userTouched || isOpen() || alreadyOpened()) return;
    try {
      if (sessionStorage.getItem(TEASER_KEY)) return;
      sessionStorage.setItem(TEASER_KEY, '1');
    } catch (e) {}
    var d = document.createElement('div');
    d.setAttribute('data-aid-teaser', '');
    d.setAttribute('role', 'button');
    d.setAttribute('tabindex', '0');
    d.style.cssText = 'position:fixed;right:20px;bottom:98px;z-index:999998;max-width:250px;background:#141419;color:#F4F4F5;padding:13px 32px 13px 16px;border-radius:16px;border:1px solid rgba(201,168,76,.45);box-shadow:0 12px 28px rgba(0,0,0,.5);font:500 14px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;opacity:0;transform:translateY(10px);transition:opacity .5s ease,transform .5s ease;';
    var txt = document.createElement('p');
    txt.style.cssText = 'margin:0;';
    txt.textContent = 'Free demo, your Agent talks and speaks! 🎙️';
    var x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Dismiss');
    x.textContent = '×';
    x.style.cssText = 'position:absolute;top:2px;right:6px;background:transparent;border:none;color:rgba(244,244,245,.55);font-size:18px;line-height:1;cursor:pointer;padding:2px 4px;';
    x.addEventListener('click', function (e) { e.stopPropagation(); hideTeaser(); });
    var arrow = document.createElement('span');
    arrow.style.cssText = 'position:absolute;bottom:-7px;right:26px;width:12px;height:12px;background:#141419;border-right:1px solid rgba(201,168,76,.45);border-bottom:1px solid rgba(201,168,76,.45);transform:rotate(45deg);';
    d.appendChild(txt);
    d.appendChild(x);
    d.appendChild(arrow);
    d.addEventListener('click', function (e) { if (e.target === x) return; e.stopPropagation(); openChat(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(); } });
    document.body.appendChild(d);
    teaser = d;
    requestAnimationFrame(function () { d.style.opacity = '1'; d.style.transform = 'translateY(0)'; });
  }
  var ticks = 0;
  var timer = setInterval(function () {
    ticks += 1;
    if (isOpen()) {
      hideTeaser();
      if (hasBoost || ticks >= OPEN_AT) clearInterval(timer);
      return;
    }
    var b = bubble();
    if (b && ticks >= TEASER_AT) showTeaser();
    if (!hasBoost && b && ticks >= OPEN_AT) {
      clearInterval(timer);
      hideTeaser();
      var guard = alreadyOpened();
      try { sessionStorage.setItem(LEGACY_KEY, '1'); } catch (e) {}
      if (!guard && !userTouched && !isOpen()) b.click();
    }
    if (ticks > 60) clearInterval(timer);
  }, 1000);
})();

(function(){
  /* ===== prefers-reduced-motion check ===== */
  var PRM = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ===== SMS Sequencer ===== */
  var bubbles = ['b0','b1','b2','b3'];
  var typings = ['typing1','typing2','typing3']; // shown before b1, b2, b3
  var timers = [];
  var isPlaying = false;

  function resetThread(){
    timers.forEach(function(t){clearTimeout(t)});
    timers=[];
    isPlaying=false;
    bubbles.forEach(function(id){
      var el=document.getElementById(id);
      if(el){el.classList.remove('shown')}
    });
    typings.forEach(function(id){
      var el=document.getElementById(id);
      if(el){el.classList.remove('active')}
    });
  }

  function playThread(){
    if(isPlaying) return;
    if(PRM && PRM.matches){
      // static fallback: show all immediately
      bubbles.forEach(function(id){
        var el=document.getElementById(id);
        if(el){el.classList.add('shown')}
      });
      return;
    }
    isPlaying=true;
    // b0 immediately
    timers.push(setTimeout(function(){
      var el=document.getElementById('b0');
      if(el){el.classList.add('shown')}
    },300));
    // typing1 → b1
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing1');
      if(t){t.classList.add('active')}
    },1000));
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing1');
      if(t){t.classList.remove('active')}
      var el=document.getElementById('b1');
      if(el){el.classList.add('shown')}
    },2400));
    // typing2 → b2
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing2');
      if(t){t.classList.add('active')}
    },3400));
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing2');
      if(t){t.classList.remove('active')}
      var el=document.getElementById('b2');
      if(el){el.classList.add('shown')}
    },4600));
    // typing3 → b3
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing3');
      if(t){t.classList.add('active')}
    },5600));
    timers.push(setTimeout(function(){
      var t=document.getElementById('typing3');
      if(t){t.classList.remove('active')}
      var el=document.getElementById('b3');
      if(el){el.classList.add('shown')}
      isPlaying=false;
    },7200));
  }

  document.getElementById('replayBtn').addEventListener('click',function(){
    resetThread();
    setTimeout(playThread,200);
  });

  // IntersectionObserver re-arm
  var demoIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        resetThread();
        setTimeout(playThread,400);
      } else {
        resetThread();
      }
    });
  },{threshold:0.25});
  var panel = document.getElementById('demoPanel');
  if(panel){demoIO.observe(panel)}

  // prefers-reduced-motion change listener
  if(PRM && PRM.addEventListener){
    PRM.addEventListener('change',function(){
      if(PRM.matches){
        resetThread();
        bubbles.forEach(function(id){
          var el=document.getElementById(id);
          if(el){el.classList.add('shown')}
        });
      }
    });
  }

  /* ===== Stat Counter ===== */
  var TARGET = 8000;
  var DURATION = 1800;
  var countRun = 0;
  var statEl = document.getElementById('statCount');

  function runCount(){
    if(PRM && PRM.matches){
      if(statEl) statEl.textContent = TARGET.toLocaleString();
      return;
    }
    countRun++;
    var run = countRun;
    var start = null;
    function step(ts){
      if(run !== countRun) return;
      if(!start) start=ts;
      var p = Math.min((ts-start)/DURATION,1);
      var ease = 1 - Math.pow(1 - p, 3);
      if(statEl) statEl.textContent = Math.round(ease * TARGET).toLocaleString();
      if(p < 1){ requestAnimationFrame(step); }
      else { if(statEl) statEl.textContent = TARGET.toLocaleString(); }
    }
    requestAnimationFrame(step);
  }

  var statSection = document.querySelector('.stat-section');
  var statIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        countRun++;
        if(statEl) statEl.textContent='0';
        setTimeout(runCount,200);
      }
    });
  },{threshold:0.3});
  if(statSection){statIO.observe(statSection)}

  document.getElementById('statReplayBtn').addEventListener('click',function(){
    if(statEl) statEl.textContent='0';
    setTimeout(runCount,100);
  });

  if(PRM && PRM.addEventListener){
    PRM.addEventListener('change',function(){
      if(PRM.matches && statEl){ statEl.textContent = TARGET.toLocaleString(); }
    });
  }

  /* ===== Scroll reveal ===== */
  if(!PRM.matches){
    var revealEls = document.querySelectorAll('.reveal');
    var revIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in-view')}
      });
    },{threshold:0.1});
    revealEls.forEach(function(el){revIO.observe(el)});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('in-view');
    });
  }

  /* ===== Sticky mobile CTA: hide when real CTA panel visible ===== */
  var stickyCTA = document.getElementById('stickyMobileCta');
  var ctaPanel = document.getElementById('ctaPanel');
  if(stickyCTA && ctaPanel){
    var ctaIO = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          stickyCTA.style.display='none';
        } else {
          stickyCTA.style.display='block';
        }
      });
    },{threshold:0.1});
    ctaIO.observe(ctaPanel);
  }
})();
// ── 7/16 sequencer contract override (patched 2026-07-21) ──
// play at ~15% visible; re-arm ONLY after full viewport exit; replay hard-resets.
;(function(){
  // Locate the SMS thread element (try common IDs in priority order)
  var threadIds = ['thread','thread-mobile','thread-desktop','sms-thread','sms-thread-desktop','demo-thread'];
  var threadEl = null;
  for (var _i = 0; _i < threadIds.length; _i++){
    threadEl = document.getElementById(threadIds[_i]);
    if (threadEl) break;
  }
  if (!threadEl) return; // no thread found — bail

  // Locate replay buttons (use the FIRST one if multiple)
  var replayBtns = Array.prototype.slice.call(document.querySelectorAll('[id*="replay"],[data-replay]'));

  function hardReset(){
    // Simulate a replay button click to let the existing implementation reset+play.
    // If no replay button exists, try firing a custom event the sequencer may listen for.
    if (replayBtns.length > 0){ replayBtns[0].click(); }
  }

  var _armed = true;
  function _autoplay(){
    if (!_armed) return;
    _armed = false;
    hardReset();
  }

  // playIO: fires when >= 15% of the thread is visible
  var playIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting && e.intersectionRatio >= 0.15){ _autoplay(); }
    });
  }, { threshold: 0.18 });
  playIO.observe(threadEl);

  // rearmIO: fires when thread fully exits the viewport (threshold:0 + !isIntersecting)
  var rearmIO = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting){ _armed = true; }
    });
  }, { threshold: 0 });
  rearmIO.observe(threadEl);

  // Check already-visible case at init time
  var _rect = threadEl.getBoundingClientRect();
  var _vh = window.innerHeight || document.documentElement.clientHeight;
  var _vis = Math.min(_rect.bottom, _vh) - Math.max(_rect.top, 0);
  if (_rect.height > 0 && _vis / _rect.height >= 0.15){ _autoplay(); }
})();
