# Final Report - Programming Project

#### By: Lennert Jansen (10488952)
#### Date of submission: June 27th, 2018

### Introduction and description of the ATP Match Data Visualizations
Three interactive and linked visualizations constitute the application in question; a collapsible tree diagram or dendrogram, a bar chart and a pie chart or donut chart.
The main goal of this project is to visually represent tennis player's statistics using the aforementioned chart-types. The dendrogram is an interactive visualization that serves as a player's profile containing both personal information (i.e. height, nationality and handedness), and three match based statistics. The bar chart in the lower right corner of the screen depict the selected player's performance at the four ATP Grand Slam tournaments (The Australian Open, Roland Garros (The French Open), The Championships Wimbledon and The US Open). Finally, the donut chart, situated in the lower left corner of the screen illustrates the match winning rates of various nationalities at a selected Grand Slam tournament.

<img src="doc/screenshot.png" width="750px"/>

### Technical design
On a high level, the user can navigate across the page which consists of three visualizations: a dendrogram, a bar chart and a donut chart. Found atop of said visualizations, is a search bar (with autocompletion capabilities) where the user can search for a tennis player of interest, or simply enter "random" is he/she does not know any tennis players by heart. This input then renders the newly updated dendrogram, which now consists of three nodes: one with the player's name from which two links extend towards the nodes "Personal Stats" and "Match Stats". These clickable nodes in turn expand into three end-nodes each. The top three end-nodes contain the selected player's personal information, as stated in the Introduction. Whereas the bottom three end-nodes depict the relevant player's statistics calculated from the match data. These are: the average match winning rate as a percentage, the average number of aces the player makes per game and finally the average number of double faults made by said player per game. As for the Match Stats end-nodes, the interactivity continues, as when clicked on, the bar chart below is updated.

The bar chart depicts how the selected player performs at the four Grand Slam tournaments. Depending on the selected match statistic, the y-axis and bars are updated. Aside from updating the bar chart by clicking on the end-nodes, the user can also select one of the three match statistics by using the clearly indicated dropdown menu above the bar chart. The respective bars update the donut chart to the right of the current visualization when clicked on. That is, a bar representing a specific Grand Slam tournament passes this information to the function which creates the donut chart and updates this accordingly.

Finally, the donut chart depicts the average match winning rate of all players of certain nationalities. The nationalities illustrated in the current chart will always include that of the selected player, as well as the country hosting the selected Grand Slam tournament. Furthermore, the user can select the number of additional nationalities added to the chart using the dropdown menu above the donut. These nationalities come from a list of the top performing nations at the selected tournament. The maximum number of additional nations is fixed at six, as interpretability of pie-chart-like visualizations decrease as the number of slices becomes too large.

Under the hood, my application is built using two html files, on one of which all three visualizations are implemented, one JavaScript file, one CSS style sheet, a Python file that converts CSV to JSON, and another JavaScript file used for data manipulation. The latter two, however, are only ran once and are no longer needed during the actual running of the application.

### Challenges of development

### Design choices and topics & ideas for future projects

### Conclusion
