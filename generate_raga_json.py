#!/usr/bin/env python
import csv
import json
from optparse import OptionParser
import sys

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
    with open(csv_file_name) as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            rows.append(combinator(dict(name = row[0], union = row[1])))
    return rows

def generate_raga_json(input_csv, out_file_name, combinator = carnatic_combination):
    with open(out_file_name, "w") as jsonfile:
        jsonfile.write(json.dumps(load_from_csv(input_csv, combinator)))

def usage():
    print "Usage:" + sys.argv[0] + " -o outfile.json -i input.csv --genre=carnatic"

if __name__ == "__main__":
    parser = OptionParser()
    parser.add_option("-o", "--output", dest="dest_filename",
                 help="Destination Filename. Stored in json format", metavar="DESTINATION_FILE")
    parser.add_option("-i", "--input", dest="input_filename",
                 help="Input CSV Filename", metavar="INPUT_FILE")
    parser.add_option("-g", "--genre", dest="genre", default="carnatic", choices = ["carnatic", "hindustani"],
                     help="Select the genre of the input csv. Allowed values: 'carnatic', 'hindustani'."\
                          " Default: carnatic")
    (options, args) = parser.parse_args()

    if not (options.dest_filename and options.input_filename):
        usage()
        sys.exit(-1)
    else:
        combi = carnatic_combination
        if options.genre == 'hindustani':
            combi = hindustani_combination
        generate_raga_json(options.input_filename, options.dest_filename, combi)

