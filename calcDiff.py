import csv

file = "csv/population.csv"

location = []
diff10_15 = []
diff15_20 = [] 
totalDiff = [] 
y2010 = []
y2015 = []
y2020 = []
state = []

with open(file, "r") as csvFile:
    reader = csv.reader(csvFile)
    for row in reader:
        # print(row[0])
        state.append(row)

for row in state:
    # print(row)
    location.append(row[0])
    y2010.append(row[1])
    y2015.append(row[2])
    y2020.append(row[3])

y2010 = list(map(int, y2010))
y2015 = list(map(int, y2015))
y2020 = list(map(int, y2020))
    
for i in range(len(y2020)):
    y = y2020[i] - y2015[i]
    x = y2015[i] - y2010[i]
    diff10_15.append(x)
    diff15_20.append(y)
    # print(diff10_15[i])
    # print(diff15_20[i])
    z = diff10_15[i] + diff15_20[i]
    totalDiff.append(z) 
    print(totalDiff[i])

# with open("diff.csv", "w") as diffFile:
#     csvwrite = csv.writer(diffFile, delimiter = ",")
#     csvwrite.
    
