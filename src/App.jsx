import { useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import Form from "./components/ContactForm.jsx";
import ContactForm from "./components/ContactForm.jsx";

const App = () => {
  gsap.registerPlugin(useGSAP, CustomEase);
  const container = useRef();

  //Three.js code for animation
  useGSAP(() => {
    (function () {
      var width,
        height,
        largeHeader,
        canvas,
        ctx,
        points,
        target,
        animateHeader = true;

      // Main
      initHeader();
      initAnimation();
      addListeners();

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById("large-header");
        largeHeader.style.height = height + "px";

        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
          for (var y = 0; y < height; y = y + height / 20) {
            var px = x + (Math.random() * width) / 20;
            var py = y + (Math.random() * height) / 20;
            var p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
            var p2 = points[j];
            if (!(p1 == p2)) {
              var placed = false;
              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
          var c = new Circle(points[i], 2 + Math.random() * 2, "rgba(255,255,255,0.3)");
          points[i].circle = c;
        }
      }

      // Event handling
      function addListeners() {
        if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", mouseMove);
        }
        window.addEventListener("scroll", scrollCheck);
        window.addEventListener("resize", resize);
      }

      let posy;
      function mouseMove(e) {
        var posx = (posy = 0);
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;
      }

      // animation
      function initAnimation() {
        animate();
        for (var i in points) {
          shiftPoint(points[i]);
        }
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in points) {
            // detect points in range
            if (Math.abs(getDistance(target, points[i])) < 4000) {
              points[i].active = 0.3;
              points[i].circle.active = 0.6;
            } else if (Math.abs(getDistance(target, points[i])) < 20000) {
              points[i].active = 0.1;
              points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < 40000) {
              points[i].active = 0.02;
              points[i].circle.active = 0.1;
            } else {
              points[i].active = 0;
              points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        gsap.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: "Circ.easeInOut",
          onComplete: function () {
            shiftPoint(p);
          },
        });
      }

      // Canvas manipulation
      function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = "rgba(213,238,254," + p.active + ")";
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function () {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = "rgba(213,238,254," + _this.active + ")";
          ctx.fill();
        };
      }

      // Util
      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }
    })();
  });

  return (
    <>
      <div id="bg"></div>
      <div id="large-header">
        <canvas id="demo-canvas"></canvas>
      </div>
      <section id="content" className="h-screen flex flex-col items-center justify-center mix-blend-normal relative z-10">
        <h1 className="font-bold font-titillium text-8xl">Rui Lopes</h1>
        <h2 className="text-[2.6rem] font-extralight font-titillium mt-4 leading-snug">Creative Developer & Wordpress Pro</h2>
        <div id="form" className="flex flex-col gap-5 mt-24 z-99">
          <p className="font-ubuntu text-[1.1rem] font-light mb-4 leading-snug">For any work-related matters, feel free to drop me a message.</p>
        </div>
        <ContactForm />
      </section>

    </>
  );
};

export default App;
