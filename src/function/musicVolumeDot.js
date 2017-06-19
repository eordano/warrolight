import {ColorUtils} from "../utils/ColorUtils";
import {SoundBasedFunction} from "./SoundBasedFunction";

export class Func extends SoundBasedFunction{
  constructor(config, leds) {
    super(config, leds);
  }

  start(config, draw, done){
    this.lastVolume = new Array(this.numberOfLeds+1).join('0').split('').map(() => "#000000");
    this.time = 0;
    this.maxVolume = 0;

    super.start(config, draw, done)
  }

  // Override parent method
  drawFrame(draw, done){
    this.time += this.config.speed;

    let vol = this.averageVolume*this.config.multiplier;

    // Como las luces tenues son MUY fuertes igual, a partir de cierto valor "las bajamos"
    if(vol < this.config.cutThreshold){
      vol = 0;
    }

    let newVal = ColorUtils.HSVtoHex(0, 0, Math.min(vol*vol*5, 1));

    for(let i=0;i<this.numberOfLeds;i++) {
      if(i % Math.round((this.numberOfLeds / this.config.numberOfOnLeds)) === 0){
        this.lastVolume[i] = newVal;
      } else {
        this.lastVolume[i] = ColorUtils.rgbToHex(0,0,0);
      }
    }

    draw(this.lastVolume);
    done();
  }

  static presets(){
    return {
      fastDobleDesdeCentro: {speed: 5, doble: true, haciaAfuera: true},
    }
  }

  // Override and extend config Schema
  static configSchema(){
    let res = super.configSchema();
    res.multiplier = {type: Number, min: 0, max: 2, step: 0.01, default: 3};
    res.numberOfOnLeds = {type: Number, min: 1, max: 100, step: 1, default: 40};
    res.cutThreshold = {type: Number, min: 0, max: 1, step: 0.01, default: 0.1};
    return res;
  }
}