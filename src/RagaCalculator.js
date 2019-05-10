import carnatic_ragas from './data/ragas.json';
import hindustani_ragas from './data/hindustani_ragas.json';

carnatic_ragas.sort((a,b) => a.name.localeCompare(b.name))
hindustani_ragas.sort((a,b) => a.name.localeCompare(b.name))

const SWARAS = ["Sa", "Ri1", "Ri2", "Ga1", "Ga2",
                  "Ma1", "Ma2", "Pa", "Dha1", "Dha2",
                  "Ni1", "Ni2"]

const SHRUTIS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const GENRES = ["Carnatic", "Hindustani"];

class RagaCalculator {
  constructor(state = {}) {
    this.state = {...state};
  }

  _rotateRight = (items) => [items[items.length - 1]].concat(items.slice(0, items.length-1))
  _rotateLeft = (items) => items.slice(1, items.length).concat([items[0]])

  _findRaga = (key, value) => {
    const ragas = this.fetchRagas();
    return ragas.find(item => item[key] === value)
  }

  _translateToSwaras = (raga_code, swara_code) => {
    let raga_swaras = [];
    raga_code.split('').forEach((item, index) => {
      if (item === "1") {
        raga_swaras.push(SWARAS[index])
      }
    });

    if (swara_code) {
      while(raga_swaras[0] !== swara_code) {
        raga_swaras = this._rotateLeft(raga_swaras);
      }
    }

    return raga_swaras.join(" ")
  }

  calculate = () => {
    const transposes = this._computeTransposes();
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

  _computeTransposes = () => {
    const raga_code = this.state.raga.raga_code
    const shruti = this.state.shruti;
    if (raga_code === undefined || shruti === undefined) {
      return []
    }

    let swara_iterator = SWARAS.slice();
    let shruti_iterator = SHRUTIS.slice();
    let raga_iterator = raga_code.split("")
    while (shruti_iterator[0] !== shruti) {
      shruti_iterator = this._rotateLeft(shruti_iterator)
    }

    let codes = []

    let condition = true
    let current_raga_code = raga_code

    while (condition) {
      codes.push({
          shruti: shruti_iterator[0],
          raga_code: current_raga_code,
          swara_code: swara_iterator[0]
       });

      shruti_iterator = this._rotateLeft(shruti_iterator)
      raga_iterator = this._rotateLeft(raga_iterator)
      swara_iterator = this._rotateRight(swara_iterator)

      current_raga_code = raga_iterator.join("")
      condition = (current_raga_code !== raga_code)
    }

    codes.forEach((code) => {
      if (code["raga_code"] === raga_code) {
        code["raga"] = this.state.raga.name;
      } else {
        let rg = this._findRaga("raga_code", code["raga_code"])
        if (rg) {
          code["raga"] = rg["name"]
        } else {
          code["raga"] = "Unknown"
          code["unknown"] = true
        }

        code["swaras"] = this._translateToSwaras(code["raga_code"], code["swara_code"])
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