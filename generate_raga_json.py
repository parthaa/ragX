import csv
import json

def combine(row, legend):
    union = row["union"].split()
    combi = ["0"] * 12
    print row["name"]
    for note in union:
        combi[legend[note]] = "1"
    row["raga_code"] = "".join(combi)
    return row

def carnatic_combination(row):
    legend = {"S" : 0, "R1" : 1, "R2" : 2, "G1" : 2, "G2" : 3, "R3" : 3,  "G3" : 4, "M1" : 5, "M2" : 6, "P" : 7, "D1" : 8, "D2" : 9, "N1" : 9, "D3" : 10,  "N2" : 10, "N3" : 11}
    return combine(row, legend)

def hindustani_combination(row):
    legend = {"S" : 0, "R1" : 1, "R2" : 2, "G1" : 3, "G2" : 4, "M1" : 5, "M2" : 6, "P" : 7, "D1" : 8, "D2" : 9, "N1" : 10, "N2" : 11}
    return combine(row, legend)

def load_from_csv(csv_file_name, combinator = carnatic_combination):
    rows = []
    with open('csv_file_name') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            rows.append(combinator(dict(name = row[0], union = row[1])))
    return rows

def generate_raga_json(input_csv, out_file_name, combinator = carnatic_combination):
    with open(out_file_name, "w") as jsonfile:
        jsonfile.write(json.dumps(load_from_csv(input_csv, combinator)))
