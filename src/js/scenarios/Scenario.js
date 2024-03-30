import Scene from "../canvas/Scene";
import { deg2rad } from "../utils/MathUtils";
import { RotatingArc } from "../canvas/shapes/arcs";

const drawLine = (context, x, y, length, angle, color = '#ffffff') => {
    context.save();
    context.beginPath();
    context.strokeStyle = color;
    context.translate(x, y);
    context.rotate(angle);
    context.moveTo(-length / 2, 0);
    context.lineTo(length / 2, 0);
    context.stroke();
    context.closePath();
    context.restore();
};

export default class Scenario extends Scene {
    // constructor(id, timezoneOffset = 0) {
    //     super(id);

    //     this.mainRadius = 0;
    //     this.deltaRadius = 0;
    //     this.arcs = [];
    //     this.timezoneOffset = timezoneOffset; // Timezone offset in hours

    //     this.params = {
    //         'line-width': 2,
    //         speed: 1,
    //         color: "#ffffff",
    //         'is-update': true
    //     };

    //     this.nArcs = 3;

    //     if (this.debug.active) {
    //         this.debugFolder.add(this.params, 'line-width', 1, 10).onChange(() => this.drawUpdate());
    //         this.debugFolder.add(this.params, 'speed', -2, 2, 0.25);
    //         this.debugFolder.addColor(this.params, 'color');
    //     }

    //     this.resize();
    // }
    constructor(id, timezoneOffset = 0) {
        super(id);

        // Initial setup
        this.mainRadius = 0;
        this.deltaRadius = 0;
        this.arcs = [];
        this.timezoneOffset = timezoneOffset;

        this.params = {
            'line-width': 2,
            speed: 1,
            color: "#ffffff", 
            'is-update': true,
            'timezone-offset': timezoneOffset,
            'hour-hand-color': '#ff0000', 
            'minute-hand-color': '#00ff00', 
            'second-hand-color': '#0000ff' 
        };

        this.nArcs = 3;

        if (this.debug.active) {
            this.debugFolder.add(this.params, 'line-width', 1, 10).onChange(() => this.drawUpdate());
            this.debugFolder.add(this.params, 'speed', -2, 2, 0.25);
            this.debugFolder.addColor(this.params, 'color');
            this.debugFolder.addColor(this.params, 'hour-hand-color').onChange(() => this.drawUpdate());
            this.debugFolder.addColor(this.params, 'minute-hand-color').onChange(() => this.drawUpdate());
            this.debugFolder.addColor(this.params, 'second-hand-color').onChange(() => this.drawUpdate());
            this.debugFolder.add(this.params, 'timezone-offset', -12, 12, 1)
              .onChange(offset => {
                  this.timezoneOffset = offset;
                  this.drawUpdate();
              });
        }


        this.resize();
    }
    resize() {
        super.resize();
        this.mainRadius = Math.min(this.width, this.height) * 0.325;
        this.deltaRadius = this.mainRadius * 0.050;

        this.arcs = [];
        for (let i = 0; i < this.nArcs; i++) {
            const arc = new RotatingArc(
                this.width / 2,
                this.height / 2,
                this.mainRadius + (i - this.nArcs / 2) * this.deltaRadius,
                deg2rad(0),
                deg2rad(360)
            );
            this.arcs.push(arc);
        }

        this.drawUpdate();
    }

    update() {
        if (!super.update()) return;
        this.drawUpdate();
    }
    drawUpdate() {
        this.clear();
        this.context.lineCap = 'square';
        this.context.strokeStyle = this.params.color;
        this.context.lineWidth = this.params['line-width'];

        this.drawGradation();
        this.arcs.forEach(arc => {
            if (this.params["is-update"]) {
                arc.update(this.globalContext.time.delta / 1000, this.params.speed);
            }
            arc.draw(this.context);
        });
        this.drawClockHands();
        this.drawDigitalClock();
  
 
    }



  
    drawGradation() {
        const nGradation = 60;
        for (let i = 0; i < nGradation; i++) {
            const angle = 2 * Math.PI * i / nGradation - Math.PI / 2;
            const x = this.width / 2 + this.mainRadius * Math.cos(angle);
            const y = this.height / 2 + this.mainRadius * Math.sin(angle);
            const length = this.deltaRadius * (i % 5 === 0 ? 2 : 1);
            drawLine(this.context, x, y, length, angle, i % 5 === 0 ? '#ffffff' : '#aaaaaa');
        }
    }

    drawClockFace() {
        const gradient = this.context.createRadialGradient(
            this.width / 2, this.height / 2, this.mainRadius * 0.5,
            this.width / 2, this.height / 2, this.mainRadius
        );
        gradient.addColorStop(0, '#333333');
        gradient.addColorStop(1, '#000000');
        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.arc(this.width / 2, this.height / 2, this.mainRadius, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawClockHands() {
        const timezoneTime = this.getTimeForTimezone();

        const seconds = timezoneTime.getSeconds();
        const minutes = timezoneTime.getMinutes();
        const hours = timezoneTime.getHours() % 12;

        this.drawHand(hours * 30 + minutes / 2, this.mainRadius * 0.5, 6, this.params['hour-hand-color']);
        this.drawHand(minutes * 6, this.mainRadius * 0.7, 4, this.params['minute-hand-color']);
        this.drawHand(seconds * 6, this.mainRadius * 0.9, 2, this.params['second-hand-color']);
    }
    drawNumber(x, y, number) {
        this.context.fillStyle = '#fff';
        this.context.font = '20px Arial';
        this.context.fillText(number, x, y);
    }

    drawDigitalClock() {
        const timezoneTime = this.getTimeForTimezone();

        const hours = timezoneTime.getHours().toString().padStart(2, '0');
        const minutes = timezoneTime.getMinutes().toString().padStart(2, '0');
        const seconds = timezoneTime.getSeconds().toString().padStart(2, '0');

        const digitWidth = 20;
        const colonWidth = 10; 
        const startX = (this.width - (6 * digitWidth + 2 * colonWidth)) / 2;
        const y = this.height * 0.75;

        this.drawNumber(startX, y, hours[0]);
        this.drawNumber(startX + digitWidth, y, hours[1]);
        this.drawColon(startX + 2 * digitWidth, y);
        this.drawNumber(startX + 2 * digitWidth + colonWidth, y, minutes[0]);
        this.drawNumber(startX + 3 * digitWidth + colonWidth, y, minutes[1]);
        this.drawColon(startX + 4 * digitWidth + colonWidth, y);
        this.drawNumber(startX + 4 * digitWidth + 2 * colonWidth, y, seconds[0]);
        this.drawNumber(startX + 5 * digitWidth + 2 * colonWidth, y, seconds[1]);
    }

    getTimeForTimezone() {
        const now = new Date();
        const utcNow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
            now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return new Date(utcNow + this.timezoneOffset * 3600000);
    }
    drawNumber(x, y, number) {
        this.context.fillStyle = '#fff';
        this.context.font = '20px Arial';
        this.context.fillText(number, x, y);
    }
    drawColon(x, y) {
        this.context.fillStyle = '#fff';
        this.context.font = '20px Arial';
        this.context.fillText(':', x, y);
    }

    drawHand(angle, length, width, color) {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.translate(this.width / 2, this.height / 2);
        this.context.rotate(deg2rad(angle - 90));
        this.context.moveTo(0, 0);
        this.context.lineTo(length, 0);
        this.context.stroke();
        this.context.restore();
    }
    updateDigitalClock() {
        const timezoneTime = this.getTimeForTimezone();
        
        const hours = timezoneTime.getHours().toString().padStart(2, '0');
        const minutes = timezoneTime.getMinutes().toString().padStart(2, '0');
        const seconds = timezoneTime.getSeconds().toString().padStart(2, '0');
        const digitalClockElement = document.getElementById(this.digitalClockId);
        digitalClockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
