        // Collisions between rectangle and circle
    function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
        var testX = cx;
        var testY = cy;

        if (testX < x0)
            testX = x0;
        if (testX > (x0 + w0))
            testX = (x0 + w0);
        if (testY < y0)
            testY = y0;
        if (testY > (y0 + h0))
            testY = (y0 + h0);

        return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
    }
// Collisions between aligned rectangles
function rectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
  
  if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
    return false; // No horizontal axis projection overlap
  if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
    return false; // No vertical axis projection overlap
  return true;    // If previous tests failed, then both axis projections
                  // overlap and the rectangles intersect
}
  

  
    function testCollisionWithWalls(ball) {
        // left
        if (ball.x < ball.radius) {
            ball.x = ball.radius;
            ball.angle = -ball.angle + Math.PI;
        }
        // right
        if (ball.x > w - (ball.radius)) {
            ball.x = w - (ball.radius);
            ball.angle = -ball.angle + Math.PI;
        }
        // up
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.angle = -ball.angle;
        }
        // down
        if (ball.y > h - (ball.radius)) {
            ball.y = h - (ball.radius);
            ball.angle = -ball.angle;
        }
    }

    function MonsterCollisionWithWalls(joueur, h, w) {
        // left
        if (joueur.x < '0') {
            joueur.x = 0;
        }
        // right
        if (joueur.x > w - (joueur.width)) {
            joueur.x = w - (joueur.width);
        }
        // up
        if (joueur.y < '0') {
            joueur.y = 0;
        }
        // down
        if (joueur.y > h - (joueur.height)) {
            joueur.y = h - (joueur.height);
        }
    }

	var calcDistanceToMove = function(delta, speed) {
        //console.log("#delta = " + delta + " speed = " + speed);
        return (speed * delta) /10;
    };
	
