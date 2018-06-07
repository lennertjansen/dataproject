[Pages](https://lennertjansen.github.io/dataproject/)

### Final Project (MPROG)

Name: Lennert Jansen
Student number: 10488952

## Project Proposal – Programming Project, June 2018

# Problem statement

The Association of Tenis Professionals (ATP) oversees a large number of yearly tournaments between an even greater number of tennis players, resulting in a sea of data and statistics regarding matches, rankings, player statistics (e.g. height, handedness, nationality, etc.). This abundance of information makes for difficult interpretation of statistics and detection of patterns.  

Research question: I aim to uncover what characteristics make a succesful Grand Slam player.

# Solution

My proposal for the final project constitutes a number of linked (interactive) visualizations on player- and match-statistics in the ATP. With these visualizations, I aim to clarify patterns and relationships found within the data (e.g. which country produces the most Grand Slam winners? Does left handedness increase one’s probability of winning a match? Etc.)

** I plan to focus on Grand Slam tournaments, exclusively, in order to avoid intolerable computation times.

#### Player statistics (table with search bar)

This will be the first page / visualisation the user sees. The page will consist of a search bar with which the user can navigate through the Grand Slam players. Below the bar the user can find a concise table with an overview of a single player's statistics (average rank, handedness, height, nationality, match winning percentage, Grand Slam titles won, aces per match, double faults per match.

#### Grand Slam performance of player (stacked bar charts)

Next to the player stats table the user sees a stacked barchart with information regarding match performance for every Grand Slam tournament (i.e., percentage of matches won / lost for every tournament). The contents of the bar chart can be changed by clicking on elements in the table. So the bars can also show the average amount of aces or double faults per match per tournament.

#### Left vs Right (linegraphs)

Next to the search bar, I plan on implementing a couple of buttons via which the user can navigate through different visualisations. One of which will be a page on the performances of left and right handed players at Grand Slams. I plan to implement line graphs on winning percentages, aces, double faults etc made on average during matches (e.g.:  https://www.kaggle.com/drgilermo/right-or-left-which-is-better).

#### Height and age (box plots)

For this section I want to implement box plots on the heights and ages of Grand Slam match and tournament winners, per Grand Slam tournament.

#### Nationality (pie chart)

Finally, the user can navigate to a pie chart on the nationalities of Grand Slam tournament and match winners.

# Prerequisites

Link to data source (Kaggle): https://www.kaggle.com/joaoevangelista/wta-matches-and-rankings

External components: D3.js, d3-tip

Similar visualizations:
https://www.kaggle.com/residentmario/exploring-wta-players

https://www.kaggle.com/anuj8june/wta-matches-and-rankings-comprehensive-analysis

https://www.kaggle.com/pcbaradhwaj/wta-data-understanding-and-basic-plots-notebook

https://www.kaggle.com/drgilermo/right-or-left-which-is-better

https://www.kaggle.com/sijovm/exploring-atp-data

https://www.kaggle.com/shubh24/fedal-the-rivalry


Hardest part: I expect the majority of technical difficulty to arise from data preprocessing and manipulation for a couple for reasons. Firstly, I’m planning on making rather simple and straight forward charts (i.e., bar charts, scatter plots, line graphs) as the complexity of the data does not call for more complex visualizations. Secondly, the size of the four csv-files is rather large, and they are very unbalanced. So I suspect it will take me a good amount of time to prepare the data for visualization and analysis.
