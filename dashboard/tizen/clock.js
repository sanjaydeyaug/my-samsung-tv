(function () {
  'use strict';

  window.StillClock = { create: function (options) {
    var $ = options.element;
    var text = options.text;
    var lastClockKey = null;
    var timer = null;

    function tick(hour24) {
      var now = new Date();
      var key = Math.floor(now.getTime() / 60000) + ':' + !!hour24;
      if (key === lastClockKey) return;
      lastClockKey = key;
      var h = now.getHours();
      var m = String(now.getMinutes()).padStart(2, '0');
      var time = (hour24 ? String(h).padStart(2, '0') : (h % 12 || 12)) + ':' + m;
      var period = h < 12 ? 'AM' : 'PM';
      $('clock').textContent = time;
      text($('clock'), 'span', 'period', hour24 ? '' : period);
      $('mini-clock').textContent = time + (hour24 ? '' : ' ' + period);
      $('ambient-clock').textContent = time;
      $('date').textContent = now.toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric'
      }).toUpperCase();
      $('ambient-date').textContent = $('date').textContent;
      var offset = (now.getMinutes() % 5 - 2) * 5;
      $('ambient-clock').style.transform = 'translate(' + offset + 'px,' + (-offset) + 'px)';
    }

    function stop() {
      clearTimeout(timer);
      timer = null;
    }

    function start() {
      stop();
      if (document.hidden) return;
      tick(options.hour24());
      timer = setTimeout(start, 60000 - Date.now() % 60000 + 20);
    }

    return { tick: tick, start: start, stop: stop };
  }};
})();
