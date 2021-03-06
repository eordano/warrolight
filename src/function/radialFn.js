import {TimeTickedFunction} from "./TimeTickedFunction";
import {ColorUtils} from "../utils/ColorUtils";

export class Func extends TimeTickedFunction{
  drawFrame(draw, done) {
    const colors = new Array(this.numberOfLeds)
    const elapsed = (this.timeInMs) / 1000;

    this.extraTime = (this.extraTime || 0) + Math.random()*10;

    const centerX = this.config.moveX
      ? Math.sin(this.extraTime / 1000) * 60 - 30
      : this.config.centerX

    for (let i = 0; i < this.numberOfLeds; i++) {
      const dx = this.position.x[i] - 30 - centerX;
      const dy = this.position.y[i] - 34.6  + this.config.centerY;

      const distance = Math.sqrt(dx*dx + dy*dy) * 255 / (300*this.config.escala);

      const v = Math.max(0, Math.sin(distance + elapsed * this.config.velocidad));
      colors[i] = ColorUtils.HSVtoHex((distance/5+ this.extraTime/1000) % 1, 1, Math.pow(v, this.config.power))
    }
    draw(colors)
  }

  // Override and extend config Schema
  static configSchema(){
    let res = super.configSchema();
    res.escala =  {type: Number, min: 0.1, max: 100, step: 0.1, default: 1}
    res.velocidad =  {type: Number, min: -50, max: 50, step: 0.1, default: -5}
    res.centerY =  {type: Number, min: 0, max: 40, step: 0.1, default: 0}
    res.centerX =  {type: Number, min: -30, max: 30, step: 0.1, default: 0}
    res.power =  {type: Number, min: 0, max: 10, step: 0.1, default: 1}
    res.randomEscala =  {type: Boolean, default: false }
    res.randomSpeed =  {type: Boolean, default: false }
    res.moveX =  {type: Boolean, default: true }
    return res;
  }
}
