(function () {
  var techData = [
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#68A063' },
    { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: '#ffffff' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
    { name: 'CodeIgniter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codeigniter/codeigniter-plain.svg', color: '#EE4623' },
    { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', color: '#777BB4' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', color: '#06B6D4' },
    { name: 'Bootstrap CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', color: '#7952B3' },
    { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg', color: '#21759B' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', color: '#E44D26' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: '#264DE4' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#F05032' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#f0f0f0' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', color: '#007ACC' },
    { name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg', color: '#FF6C37' },
    { name: 'Netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg', color: '#00C7B7' }
  ];

  var container = document.getElementById('techSphere');
  if (!container) return;

  container.innerHTML = '';
  container.className = 'tech-sphere-container';

  var N = techData.length;
  var RADIUS = 260; // Larger radius to spread icons across the full globe
  var items = [];

  // Fibonacci sphere distribution for even spacing
  for (var i = 0; i < N; i++) {
    var tech = techData[i];
    var phi = Math.acos(1 - 2 * (i + 0.5) / N);
    var theta = Math.PI * (1 + Math.sqrt(5)) * i;

    var el = document.createElement('div');
    el.className = 'sphere-icon';
    el.style.setProperty('--icon-color', tech.color);

    var img = document.createElement('img');
    img.src = tech.icon;
    img.alt = tech.name;
    img.loading = 'lazy';
    img.draggable = false;
    el.appendChild(img);

    var label = document.createElement('span');
    label.className = 'sphere-label';
    label.textContent = tech.name;
    el.appendChild(label);

    container.appendChild(el);

    // Store the initial spherical coordinates
    items.push({
      el: el,
      // Convert to Cartesian once and store
      x0: Math.sin(phi) * Math.cos(theta),
      y0: Math.cos(phi),
      z0: Math.sin(phi) * Math.sin(theta)
    });
  }

  // Rotation state
  var rotY = 0;          // Y-axis rotation (main spin like earth)
  var rotX = -0.35;      // X-axis tilt (slight tilt like earth's axial tilt)
  var autoSpeedY = 0.004; // Continuous rotation speed
  var isDragging = false;
  var lastMouseX = 0, lastMouseY = 0;
  var momentumY = 0, momentumX = 0;
  var hoveredItem = null;

  function getCenter() {
    var rect = container.getBoundingClientRect();
    return { cx: rect.width / 2, cy: rect.height / 2 };
  }

  // Rotate a point around Y then X axis
  function rotatePoint(x, y, z, ry, rx) {
    // Rotate around Y axis (earth-like spin)
    var cosY = Math.cos(ry), sinY = Math.sin(ry);
    var x1 = x * cosY - z * sinY;
    var z1 = x * sinY + z * cosY;

    // Rotate around X axis (tilt)
    var cosX = Math.cos(rx), sinX = Math.sin(rx);
    var y1 = y * cosX - z1 * sinX;
    var z2 = y * sinX + z1 * cosX;

    return { x: x1, y: y1, z: z2 };
  }

  function render() {
    var center = getCenter();

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var pos = rotatePoint(
        item.x0 * RADIUS,
        item.y0 * RADIUS,
        item.z0 * RADIUS,
        rotY, rotX
      );

      // Depth factor: 0 = far back, 1 = closest to viewer
      var depthNorm = (pos.z + RADIUS) / (2 * RADIUS);
      var scale = 0.45 + depthNorm * 0.65;
      var opacity = 0.2 + depthNorm * 0.8;

      var tx = center.cx + pos.x;
      var ty = center.cy + pos.y;

      item.el.style.transform =
        'translate(-50%, -50%) translate3d(' + tx + 'px,' + ty + 'px, 0) scale(' + scale + ')';
      item.el.style.opacity = opacity;
      item.el.style.zIndex = Math.round(depthNorm * 100);

      // Back-half icons get slightly muted border
      if (depthNorm < 0.35) {
        item.el.style.borderColor = 'rgba(15, 98, 254, 0.08)';
      } else {
        item.el.style.borderColor = 'rgba(15, 98, 254, 0.25)';
      }
    }
  }

  function animate() {
    if (!isDragging) {
      rotY += autoSpeedY + momentumY;
      rotX += momentumX;
      // Dampen momentum
      momentumY *= 0.96;
      momentumX *= 0.96;
      // Clamp vertical tilt so it doesn't flip
      rotX = Math.max(-1.2, Math.min(1.2, rotX));
    }
    render();
    requestAnimationFrame(animate);
  }

  // ---- Mouse interaction ----
  container.addEventListener('mousedown', function (e) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    momentumY = 0;
    momentumX = 0;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - lastMouseX;
    var dy = e.clientY - lastMouseY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    momentumY = dx * 0.002;
    momentumX = dy * 0.0008;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  document.addEventListener('mouseup', function () {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = 'grab';
    }
  });

  // ---- Touch interaction ----
  container.addEventListener('touchstart', function (e) {
    isDragging = true;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
    momentumY = 0;
    momentumX = 0;
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - lastMouseX;
    var dy = e.touches[0].clientY - lastMouseY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    rotX = Math.max(-1.2, Math.min(1.2, rotX));
    momentumY = dx * 0.002;
    momentumX = dy * 0.0008;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function () {
    isDragging = false;
  });

  // ---- Scroll to spin faster ----
  container.addEventListener('wheel', function (e) {
    e.preventDefault();
    momentumY += e.deltaY * 0.0004;
  }, { passive: false });

  // ---- Responsive radius ----
  function updateRadius() {
    var w = container.offsetWidth;
    if (!w || w < 100) w = 550; // fallback
    // Radius should be ~47% of container width for proper spread
    RADIUS = Math.floor(w * 0.47);
  }

  window.addEventListener('resize', function() {
    updateRadius();
    render(); // Re-render after resize
  });
  
  // Initial setup - wait for layout
  setTimeout(function() {
    updateRadius();
    render();
  }, 50);

  // Start the 360° globe animation
  animate();
})();
