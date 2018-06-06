# Design document - Programming project, spring 2018

### Data, source and filerting

The data is retrieved from Kaggle (https://www.kaggle.com/sijovm/atpdata), and consists of one CSV-file containing match data of every ATP Tournament match from 1968 to 2017 (roughly 7 MB). Match data describes a total of 49 different variables, ranging from tournament name, winner name, winner height, winner handedness, winner rank (prior to match), court surface, match duration, final score, aces made by winner, double faults made by winner, etc. All the variables regarding winner statistics also exist for the loser of the match in question.

Due to the enormous size of a file containing data on EVERY ATP match between 1968 and 2017, I will drop all matches before 1995, resulting in a (still enormous) amount of 70258 matches. To further diminish the size of the data set, I focus solely on Grand Slam matches, of which four are held every year (Australian Open, Roland Garros (French Open), Wimbledon and US Open). Hence, my research question: What makes a Grand Slam winner?

I also plan on dropping a number of variables. For my research, I am interested in (but not limited to) the following variables: tournament name, winner/loser name, winner/loser height, winner/loser handedness, winner/loser rank (prior to match), court surface, match duration, final score, aces made by winner/loser, double faults made by winner/loser. 

To achieve this filtration of data, I will use Python to parse the desired CSV-elements into a JSON-format and further analyse and manipulate the data using JavaScript.

### Technical components of my visualisations

#### Player statistics (table with search bar)

#### Grand Slam performance of player (stacked bar charts)

#### Left vs Right

### APIs or D3 plugins

a diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

as well as descriptions of each of the components and what you need to implement these

a list of APIs or D3 plugins that you will be using to provide functionality in your app
