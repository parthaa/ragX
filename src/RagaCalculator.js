import carnatic_ragas from './data/ragas.json';
import hindustani_ragas from './data/hindustani_ragas.json';

const SWARAS = ["Sa", "Ri1", "Ri2", "Ga1", "Ga2",
                  "Ma1", "Ma2", "Pa", "Dha1", "Dha2",
                  "Ni1", "Ni2"]

const SHRUTIS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const GENRES = ["Carnatic", "Hindustani"];

class RagaCalculator {
  constructor(state = {}) {
    this.state = {...state};
  }

  rotateRight = (items) => [items[items.length - 1]].concat(items.slice(0, items.length-1))
  rotateLeft = (items) => items.slice(1, items.length).concat([items[0]])

  findRaga = (key, value) => {
    const ragas = this.fetchRagas();
    return ragas.find(item => item[key] === value)
  }

  translateToSwaras = (raga_code, swara_code) => {
    let raga_swaras = [];
    raga_code.split('').forEach((item, index) => {
      if (item === "1") {
        raga_swaras.push(SWARAS[index])
      }
    });

    if (swara_code) {
      while(raga_swaras[0] !== swara_code) {
        raga_swaras = this.rotateLeft(raga_swaras);
      }
    }

    return raga_swaras.join(" ")
  }

  calculate = () => {
    const transposes = this.computeTransposes();
    const unknownRagas = [];
    const knownRagas = [];
    transposes.forEach((item) => {
      if(item.unknown) {
        unknownRagas.push(item);
      } else {
        knownRagas.push(item);
      }
    });

    return {
      knownRagas: knownRagas,
      unknownRagas: unknownRagas
    }
  }

  computeTransposes = () => {
    const raga_code = this.state.raga.raga_code
    const shruti = this.state.shruti;
    if (raga_code === undefined || shruti === undefined) {
      return []
    }

    let swara_iterator = SWARAS.slice();
    let shruti_iterator = SHRUTIS.slice();
    let raga_iterator = raga_code.split("")
    while (shruti_iterator[0] !== shruti) {
      shruti_iterator = this.rotateLeft(shruti_iterator)
    }

    let codes = [{
        shruti: shruti_iterator[0],
        raga_code: raga_code,
        swara_code: swara_iterator[0]
    }]

    let condition = true
    while (condition) {
      shruti_iterator = this.rotateLeft(shruti_iterator)
      raga_iterator = this.rotateLeft(raga_iterator)
      swara_iterator = this.rotateRight(swara_iterator)

      const new_raga_code = raga_iterator.join("")
      condition = (new_raga_code !== raga_code)
      if (condition) {
        codes.push({
          shruti: shruti_iterator[0],
          raga_code: new_raga_code,
          swara_code: swara_iterator[0]
        });
      }
    }

    codes.forEach((code) => {
      if (code["raga_code"] === raga_code) {
        code["raga"] = this.state.raga.name;
      } else {
        let rg = this.findRaga("raga_code", code["raga_code"])
        if (rg) {
          code["raga"] = rg["name"]
        } else {
          code["raga"] = "Unknown"
          code["unknown"] = true
        }

        code["swaras"] = this.translateToSwaras(code["raga_code"], code["swara_code"])
      }

    });
    return codes;
  }


  fetchRagas = () => {
    return (this.state.genre === 'Carnatic') ? carnatic_ragas: hindustani_ragas;
  }
}


export {
  RagaCalculator,
  SWARAS,
  SHRUTIS,
  GENRES
}