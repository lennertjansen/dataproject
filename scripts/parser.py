import csv
import json
import pandas

# open the CSV in reading mode
csvfile = open('/Users/lennertjansen/Documents/Github_projects/dataproject/data/atp_1995_2016_copy.csv', 'r')

# open the JSON file in writing mode
jsonfile = open('/Users/lennertjansen/Documents/Github_projects/dataproject/data/atp_gs_1995_2016.json', 'w')

# Change each fieldname to the appropriate field name. I know, so difficult.
# reader = csv.DictReader( f, fieldnames = ( "fieldname0","fieldname1","fieldname2","fieldname3" ))

fieldnames = ("tourney_id",	"tourney_name",	"surface", "draw_size", "tourney_level", "tourney_date",
            "winner_id", "winner_seed", "winner_entry", "winner_name",	"winner_hand", "winner_ht",	"winner_ioc",
            "winner_age", "winner_rank", "winner_rank_points", "loser_id", "loser_seed", "loser_entry", "loser_name",
            "loser_hand", "loser_ht", "loser_ioc", "loser_age" , "loser_rank",
            "loser_rank_points", "score", "best_of", "round" , "minutes", "w_ace",	"w_df",
            "w_svpt", "w_1stIn", "w_1stWon", "w_2ndWon", "w_SvGms", "w_bpSaved",
            "w_bpFaced", "l_ace", "l_df", "l_svpt",	"l_1stIn",	"l_1stWon",
            "l_2ndWon",	"l_SvGms", "l_bpSaved",	"l_bpFaced")

# Initiate reader
reader = csv.DictReader(csvfile, fieldnames)

# Create empty list
data_list = [];

# Go over rows in csvfile
for row in reader:

    print(row["tourney_level"])

    if row["tourney_level"] == "G":
        # Append to data list
        data_list.append(row);



# Initiate dictionary
data_dict = {'data': data_list[0:]}

# Dump to json file in json format
json.dump(data_dict, jsonfile)


#
# # Parse the CSV into JSON
# out = json.dumps( [ row for row in reader ] )
#
# print "JSON parsed!"
#
# # Save the JSON
# f = open( '/path/to/parsed.json', 'w')
#
# f.write(out)
# print "JSON saved!"
