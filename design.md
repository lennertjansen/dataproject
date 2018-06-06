# Design document - Programming project, spring 2018

### Data, source and filerting

The data is retrieved from Kaggle (https://www.kaggle.com/sijovm/atpdata), and consists of one CSV-file containing match data of every ATP Tournament match from 1968 to 2017 (roughly 7 MB). Match data describes a total of 49 different variables, ranging from tournament name, winner name, winner height, winner handedness, winner rank (prior to match), court surface, match duration, final score, aces made by winner, double faults made by winner, etc. All the variables regarding winner statistics also exist for the loser of the match in question.

Due to the enormous size of a file containing data on EVERY ATP match between 1968 and 2017, I will drop all matches before 1995, resulting in a (still enormous) amount of 70258 matches. To further diminish the size of the data set, I focus solely on Grand Slam matches, of which four are held every year (Australian Open, Roland Garros (French Open), Wimbledon and US Open). Hence, my research question: What makes a Grand Slam winner?

I also plan on dropping a number of variables. For my research, I am interested in (but not limited to) the following variables: tournament name, winner/loser name, winner/loser height, winner/loser handedness, winner/loser rank (prior to match), court surface, match duration, final score, aces made by winner/loser, double faults made by winner/loser. 

To achieve this filtration of data, I will use Python to parse the desired CSV-elements into a JSON-format and further analyse and manipulate the data using JavaScript.

### Technical components of my visualisations

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

### APIs or D3 plugins

I expect to require the following plugins:

d3-tip

bootstrap
