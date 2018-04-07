import os
import json
from collections import deque
from itertools import permutations
from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort, send_from_directory, jsonify

app = Flask(__name__)
app.config.from_pyfile('flaskapp.cfg')

GENRES = ["carnatic", "hindustani"]
RAGAS = {}
SHRUTHIS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
SWARAS = ["Sa", "Ri1", "Ri2", "Ga1", "Ga2",
          "Ma1", "Ma2", "Pa", "Dha1", "Dha2",
          "Ni1", "Ni2"]

@app.before_first_request
def setupRagas():
  global RAGAS
  with open('data/ragas.json') as json_data:
    RAGAS["carnatic"] = json.load(json_data)
  with open('data/hindustani_ragas.json') as json_data:
    RAGAS["hindustani"] = json.load(json_data)
  return RAGAS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:resource>')
def serveStaticResource(resource):
    return send_from_directory('static/', resource)

@app.route('/shrutis',methods=['GET'])
def showShrutis():
  return jsonify(SHRUTHIS)

@app.route('/genres',methods=['GET'])
def showGenres():
  return jsonify(RAGAS.keys())

@app.route('/ragas',methods=['GET'])
def showRagas():
  genre = request.args.get('genre', 'carnatic')
  return jsonify(sorted([raga["name"] for raga in RAGAS[genre]], key=lambda s: s.lower()))

@app.route('/transposes',methods=['GET'])
def showTransposes():
  shruthi = request.args.get('shruthi', '')
  raga = request.args.get('raga', '')
  genre = request.args.get('genre', 'carnatic')
  return jsonify(_formatted_transposes(shruthi, raga, genre))

def _formatted_transposes(shruthi, raga, genre = "carnatic"):
  transposes = _find_transposes(shruthi, raga, genre)
  unknown_ragas = [item for item in transposes if item.has_key("unknown")]
  known_ragas = [item for item in transposes if not item.has_key("unknown")]

  return dict(transposes = transposes,
              known_ragas =  known_ragas,
              unknown_ragas = unknown_ragas,
              main_shruthi = shruthi,
              main_raga = raga,
              genre = genre)

def _find_transposes(shruthi, raga, genre = "carnatic"):
  #find raga code
  raga_code = __find_raga("name", raga, genre)["raga_code"]
  swara_iterator = deque(SWARAS)
  shruti_iterator = deque(SHRUTHIS)
  while shruthi != shruti_iterator[0]:
    shruti_iterator.rotate(1)

  codes = [dict(shruthi = shruti_iterator[0],
                raga_code = raga_code,
                swara_code = swara_iterator[0]
                )]

  raga_iterator = deque(raga_code)

  condition = True
  while condition:
      shruti_iterator.rotate(-1)
      raga_iterator.rotate(-1)
      swara_iterator.rotate(1)
      new_raga_code = "".join(raga_iterator)
      # loop body here
      condition = new_raga_code != raga_code
      if condition:
        codes.append(dict(shruthi = shruti_iterator[0],
                          raga_code = new_raga_code,
                          swara_code = swara_iterator[0]
                          ))

  for code in codes:
    if code["raga_code"] == raga_code:
      code["raga"] = raga
    else:
      rg = __find_raga("raga_code", code["raga_code"], genre)
      if rg:
        code["raga"] = rg["name"]
      else:
        code["raga"] = "Unknown"
        code["unknown"] = True
      code["swaras"] = __translate_to_swaras(code["raga_code"], code["swara_code"])

  return codes

def __translate_to_swaras(raga_code, swara_code):
  raga_swaras = []
  for index, value in enumerate(raga_code):
    if value == "1":
      raga_swaras.append(SWARAS[index])

  if swara_code:
    raga_swaras = deque(raga_swaras)
    while(raga_swaras[0] != swara_code):
      raga_swaras.rotate(-1)
  return " ".join(raga_swaras)

def __find_raga(key, value, genre = "carnatic"):
  for raga in RAGAS[genre]:
    if raga[key] == value:
      return raga

@app.route("/test")
def test():
    return "<strong>It's Alive!</strong>"

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=8080)
