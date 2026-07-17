(function () {
  var BUBBLE_ID = 'ultra-fast-widget-bubble-54722168';
  var KEY = 'aidDemoWidgetAutoOpened';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var userTouched = false;
  document.addEventListener('click', function (e) {
    if (e.isTrusted && e.target && e.target.closest && e.target.closest('#' + BUBBLE_ID)) { userTouched = true; }
  }, true);
  var tries = 0;
  var t = setInterval(function () {
    tries += 1;
    var b = document.getElementById(BUBBLE_ID);
    if (b && tries >= 7) {
      clearInterval(t);
      if (!userTouched) { b.click(); }
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    }
    if (tries > 30) { clearInterval(t); }
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