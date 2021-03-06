import csv
import json
import pandas

# open the CSV and JSON file
csvfile = open('/Users/lennertjansen/Documents/Github_projects/dataproject/data/atp_1995_2016_test2.csv', 'r')
jsonfile = open('/Users/lennertjansen/Documents/Github_projects/dataproject/data/atp_gs_1995_2016_test.json', 'w')

# fieldnames = ("tourney_id",	"tourney_name",	"surface", "draw_size", "tourney_level", "tourney_date", "match_num",
#             "winner_id", "winner_seed", "winner_entry", "winner_name",	"winner_hand", "winner_ht",	"winner_ioc",
#             "winner_age", "winner_rank", "winner_rank_points", "loser_id", "loser_seed", "loser_entry", "loser_name",
#             "loser_hand", "loser_ht", "loser_ioc", "loser_age" , "loser_rank",
#             "loser_rank_points", "score", "best_of", "round" , "minutes", "w_ace",	"w_df",
#             "w_svpt", "w_1stIn", "w_1stWon", "w_2ndWon", "w_SvGms", "w_bpSaved",
#             "w_bpFaced", "l_ace", "l_df", "l_svpt",	"l_1stIn",	"l_1stWon",
#             "l_2ndWon",	"l_SvGms", "l_bpSaved",	"l_bpFaced")

fieldnames = ("tourney_name","surface", "winner_name", "winner_hand", "winner_ht",	"winner_ioc",
            "winner_age", "winner_rank", "loser_name",
            "loser_hand", "loser_ht", "loser_ioc", "loser_age" , "loser_rank", "round",
            "w_ace","w_df",
            "l_ace", "l_df")

# specify the fieldnames of the columns of interest
reader = csv.DictReader(csvfile, fieldnames)

# Create empty list
list = [];

# Go over rows in csvfile
for row in reader:

    #print(row["tourney_level"])

    # if row["tourney_level"] == "G":
    #     # Append to data list
    #     list.append(row);
    list.append(row);



json.dump(list, jsonfile)
